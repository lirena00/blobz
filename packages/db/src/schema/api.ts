import { sql } from "drizzle-orm";
import {
	boolean,
	index,
	integer,
	pgTable,
	primaryKey,
	text,
	timestamp,
	uniqueIndex,
} from "drizzle-orm/pg-core";

import { user } from "./auth";

export const apiEntitlement = pgTable("api_entitlement", {
	cadence: text("cadence").default("monthly").notNull(),
	cancelAtPeriodEnd: boolean("cancel_at_period_end").default(false).notNull(),
	lastEventAt: timestamp("last_event_at", { withTimezone: true }),
	periodEnd: timestamp("period_end", { withTimezone: true }),
	periodStart: timestamp("period_start", { withTimezone: true }),
	plan: text("plan").notNull(),
	productId: text("product_id"),
	status: text("status").notNull(),
	subscriptionId: text("subscription_id").unique(),
	updatedAt: timestamp("updated_at", { withTimezone: true })
		.defaultNow()
		.notNull(),
	userId: text("user_id")
		.primaryKey()
		.references(() => user.id, { onDelete: "cascade" }),
});

export const apiOrigin = pgTable(
	"api_origin",
	{
		createdAt: timestamp("created_at", { withTimezone: true })
			.defaultNow()
			.notNull(),
		origin: text("origin").notNull(),
		userId: text("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
	},
	(table) => [primaryKey({ columns: [table.userId, table.origin] })]
);

export const apiEndpoint = pgTable(
	"api_endpoint",
	{
		createdAt: timestamp("created_at", { withTimezone: true })
			.defaultNow()
			.notNull(),
		id: text("id").primaryKey(),
		lastUsedAt: timestamp("last_used_at", { withTimezone: true }),
		revokedAt: timestamp("revoked_at", { withTimezone: true }),
		userId: text("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
	},
	(table) => [
		uniqueIndex("api_endpoint_active_user_idx")
			.on(table.userId)
			.where(sql`${table.revokedAt} IS NULL`),
		index("api_endpoint_user_idx").on(table.userId),
	]
);

export const apiUsagePeriod = pgTable(
	"api_usage_period",
	{
		periodEnd: timestamp("period_end", { withTimezone: true }).notNull(),
		periodStart: timestamp("period_start", { withTimezone: true }).notNull(),
		requestCount: integer("request_count").default(0).notNull(),
		userId: text("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
	},
	(table) => [primaryKey({ columns: [table.userId, table.periodStart] })]
);

export const apiUsageDay = pgTable(
	"api_usage_day",
	{
		day: text("day").notNull(),
		endpointId: text("endpoint_id")
			.notNull()
			.references(() => apiEndpoint.id, { onDelete: "cascade" }),
		requestCount: integer("request_count").default(0).notNull(),
		userId: text("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
	},
	(table) => [
		primaryKey({ columns: [table.endpointId, table.day] }),
		index("api_usage_day_account_idx").on(table.userId, table.day),
	]
);

export const apiRateMinute = pgTable(
	"api_rate_minute",
	{
		minute: timestamp("minute", { withTimezone: true }).notNull(),
		requestCount: integer("request_count").default(0).notNull(),
		userId: text("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
	},
	(table) => [primaryKey({ columns: [table.userId, table.minute] })]
);

export const dodoWebhookEvent = pgTable(
	"dodo_webhook_event",
	{
		eventAt: timestamp("event_at", { withTimezone: true }).notNull(),
		eventType: text("event_type").notNull(),
		id: text("id").primaryKey(),
		processedAt: timestamp("processed_at", { withTimezone: true })
			.defaultNow()
			.notNull(),
		subscriptionId: text("subscription_id").notNull(),
	},
	(table) => [
		index("dodo_webhook_subscription_event_idx").on(
			table.subscriptionId,
			table.eventType,
			table.eventAt
		),
	]
);

export const apiCheckoutIntent = pgTable("api_checkout_intent", {
	expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
	plan: text("plan").notNull(),
	userId: text("user_id")
		.primaryKey()
		.references(() => user.id, { onDelete: "cascade" }),
});
