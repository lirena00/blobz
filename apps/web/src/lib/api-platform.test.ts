import { describe, expect, it } from "bun:test";

import {
	ApiPlatformError,
	getUsageWindow,
	normalizeOrigin,
	parseDatabaseTimestamp,
	planForProduct,
	productForPlan,
	resolveAvatarRequestOrigin,
} from "./api-platform";
import { requiresInitialPayment } from "./dodo-webhook";

describe("account origin validation", () => {
	it("accepts and canonicalizes exact HTTPS origins", () => {
		expect(normalizeOrigin("HTTPS://EXAMPLE.COM:443/")).toBe(
			"https://example.com"
		);
		expect(normalizeOrigin("https://app.example.com:8443")).toBe(
			"https://app.example.com:8443"
		);
	});

	it("allows HTTP only for local development", () => {
		expect(normalizeOrigin("http://localhost:3000")).toBe(
			"http://localhost:3000"
		);
		expect(normalizeOrigin("http://127.0.0.1:3001")).toBe(
			"http://127.0.0.1:3001"
		);
		expect(() => normalizeOrigin("http://example.com")).toThrow(
			ApiPlatformError
		);
	});

	it("rejects wildcards, opaque and non-origin inputs", () => {
		for (const candidate of [
			"https://*.example.com",
			"https://example.com/path",
			"https://example.com?key=x",
			"https://user:pass@example.com",
			"null",
			"data:text/plain,hello",
			"http://localhost.evil.com",
		]) {
			expect(() => normalizeOrigin(candidate)).toThrow(ApiPlatformError);
		}
	});
});

describe("avatar request origin resolution", () => {
	const platformOrigin = "https://blobz.lirena.in";

	it("allows a same-origin platform request without an Origin header", () => {
		const request = new Request(
			"https://blobz.lirena.in/api/v1/avatars/example?name=Ada"
		);

		expect(resolveAvatarRequestOrigin(request, platformOrigin)).toEqual({
			isPlatformOrigin: true,
			origin: platformOrigin,
		});
	});

	it("recognizes an explicit platform Origin header", () => {
		const request = new Request(
			"https://blobz.lirena.in/api/v1/avatars/example?name=Ada",
			{ headers: { Origin: platformOrigin } }
		);

		expect(resolveAvatarRequestOrigin(request, platformOrigin)).toEqual({
			isPlatformOrigin: true,
			origin: platformOrigin,
		});
	});

	it("keeps other valid origins subject to the account allowlist", () => {
		const request = new Request(
			"https://blobz.lirena.in/api/v1/avatars/example?name=Ada",
			{ headers: { Origin: "https://app.example.com" } }
		);

		expect(resolveAvatarRequestOrigin(request, platformOrigin)).toEqual({
			isPlatformOrigin: false,
			origin: "https://app.example.com",
		});
	});

	it("rejects a missing or invalid Origin from outside the platform", () => {
		const crossOriginRequest = new Request(
			"https://api.example.com/api/v1/avatars/example?name=Ada"
		);
		const invalidOriginRequest = new Request(
			"https://blobz.lirena.in/api/v1/avatars/example?name=Ada",
			{ headers: { Origin: "null" } }
		);

		expect(
			resolveAvatarRequestOrigin(crossOriginRequest, platformOrigin)
		).toBeNull();
		expect(
			resolveAvatarRequestOrigin(invalidOriginRequest, platformOrigin)
		).toBeNull();
	});

	it("supports the configured localhost deployment", () => {
		const localOrigin = "http://localhost:3001";
		const request = new Request(
			"http://localhost:3001/api/v1/avatars/example?name=Ada"
		);

		expect(resolveAvatarRequestOrigin(request, localOrigin)).toEqual({
			isPlatformOrigin: true,
			origin: localOrigin,
		});
	});
});

describe("Dodo plan mapping", () => {
	const products = {
		DODO_PRODUCT_PLUS_MONTHLY: "pdt_plus_month",
		DODO_PRODUCT_PLUS_YEARLY: "pdt_plus_year",
		DODO_PRODUCT_PRO_MONTHLY: "pdt_pro_month",
		DODO_PRODUCT_PRO_YEARLY: "pdt_pro_year",
	};

	it("maps all four configured products exactly", () => {
		expect(productForPlan("plus", "monthly", products)).toBe("pdt_plus_month");
		expect(productForPlan("plus", "yearly", products)).toBe("pdt_plus_year");
		expect(productForPlan("pro", "monthly", products)).toBe("pdt_pro_month");
		expect(productForPlan("pro", "yearly", products)).toBe("pdt_pro_year");
		expect(planForProduct("pdt_plus_month", products)).toEqual({
			cadence: "monthly",
			plan: "plus",
		});
		expect(planForProduct("pdt_plus_year", products)).toEqual({
			cadence: "yearly",
			plan: "plus",
		});
		expect(planForProduct("pdt_pro_month", products)).toEqual({
			cadence: "monthly",
			plan: "pro",
		});
		expect(planForProduct("pdt_pro_year", products)).toEqual({
			cadence: "yearly",
			plan: "pro",
		});
	});

	it("never grants an unknown product a plan", () => {
		expect(planForProduct("pdt_other", products)).toBeNull();
	});

	it("rejects a duplicate product configuration", () => {
		const duplicate = {
			...products,
			DODO_PRODUCT_PRO_YEARLY: "pdt_plus_month",
		};
		expect(productForPlan("plus", "monthly", duplicate)).toBeNull();
		expect(planForProduct("pdt_plus_month", duplicate)).toBeNull();
	});
});

describe("monthly usage windows", () => {
	it("parses string timestamps returned by raw database queries", () => {
		const start = parseDatabaseTimestamp("2026-01-31T10:30:00.000Z");
		const end = parseDatabaseTimestamp("2027-01-31T10:30:00.000Z");
		expect(start).toEqual(new Date("2026-01-31T10:30:00.000Z"));
		expect(end).toEqual(new Date("2027-01-31T10:30:00.000Z"));
		if (!(start && end)) {
			throw new Error("Expected valid database timestamps.");
		}
		expect(
			getUsageWindow(start, end, "yearly", new Date("2026-02-28T10:30:00.000Z"))
		).toEqual({
			end: new Date("2026-03-31T10:30:00.000Z"),
			start: new Date("2026-02-28T10:30:00.000Z"),
		});
		expect(parseDatabaseTimestamp("not a timestamp")).toBeNull();
		expect(parseDatabaseTimestamp(null)).toBeNull();
	});

	it("uses the billing period for monthly products", () => {
		const start = new Date("2026-01-31T10:30:00.000Z");
		const end = new Date("2026-02-28T10:30:00.000Z");
		expect(getUsageWindow(start, end, "monthly", start)).toEqual({
			end,
			start,
		});
		expect(getUsageWindow(start, end, "monthly", end)).toBeNull();
	});

	it("resets annual product usage on clamped monthly anniversaries", () => {
		const start = new Date("2026-01-31T10:30:00.000Z");
		const end = new Date("2027-01-31T10:30:00.000Z");
		expect(
			getUsageWindow(start, end, "yearly", new Date("2026-02-28T10:30:00.000Z"))
		).toEqual({
			end: new Date("2026-03-31T10:30:00.000Z"),
			start: new Date("2026-02-28T10:30:00.000Z"),
		});
		expect(
			getUsageWindow(start, end, "yearly", new Date("2026-12-31T10:30:00.000Z"))
		).toEqual({
			end,
			start: new Date("2026-12-31T10:30:00.000Z"),
		});
	});
});

describe("Dodo first-payment gating", () => {
	it("holds a new active subscription until its first successful charge", () => {
		expect(
			requiresInitialPayment({
				hasSucceededPayment: false,
				isRenewal: false,
				status: "active",
				subscriptionId: "sub_new",
			})
		).toBe(true);
		expect(
			requiresInitialPayment({
				hasSucceededPayment: true,
				isRenewal: false,
				status: "active",
				subscriptionId: "sub_new",
			})
		).toBe(false);
	});

	it("keeps pending updates gated, but not renewals or existing paid plans", () => {
		expect(
			requiresInitialPayment({
				currentStatus: "pending_payment",
				currentSubscriptionId: "sub_current",
				hasSucceededPayment: false,
				isRenewal: false,
				status: "active",
				subscriptionId: "sub_current",
			})
		).toBe(true);
		expect(
			requiresInitialPayment({
				currentStatus: "active",
				currentSubscriptionId: "sub_current",
				hasSucceededPayment: false,
				isRenewal: false,
				status: "active",
				subscriptionId: "sub_current",
			})
		).toBe(false);
		expect(
			requiresInitialPayment({
				hasSucceededPayment: false,
				isRenewal: true,
				status: "active",
				subscriptionId: "sub_new",
			})
		).toBe(false);
	});
});
