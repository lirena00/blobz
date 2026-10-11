import { timingSafeEqual } from "node:crypto";

import { sql } from "drizzle-orm";

import { ENV } from "@/env.server";
import { db } from "@/services";

export const runtime = "nodejs";

export async function GET(request: Request) {
	const expected = ENV.CRON_SECRET;
	const authorization = request.headers.get("authorization");
	const supplied = authorization?.startsWith("Bearer ")
		? authorization.slice(7)
		: null;
	if (!(expected && supplied)) {
		return new Response(null, { status: 401 });
	}
	const expectedBytes = Buffer.from(expected);
	const suppliedBytes = Buffer.from(supplied);
	if (
		expectedBytes.length !== suppliedBytes.length ||
		!timingSafeEqual(expectedBytes, suppliedBytes)
	) {
		return new Response(null, { status: 401 });
	}

	await db.execute(
		sql`DELETE FROM api_rate_minute WHERE minute < NOW() - INTERVAL '2 days'`
	);
	await db.execute(
		sql`DELETE FROM api_checkout_intent WHERE expires_at < NOW()`
	);
	await db.execute(
		sql`DELETE FROM dodo_webhook_event WHERE processed_at < NOW() - INTERVAL '180 days'`
	);
	await db.execute(
		sql`DELETE FROM api_usage_day WHERE day < TO_CHAR(NOW() - INTERVAL '1 year', 'YYYY-MM-DD')`
	);
	return Response.json(
		{ ok: true },
		{ headers: { "Cache-Control": "no-store" } }
	);
}
