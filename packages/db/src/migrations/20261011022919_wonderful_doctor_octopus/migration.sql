ALTER TABLE "api_key" RENAME TO "api_endpoint";--> statement-breakpoint
DROP TABLE "api_key_origin";--> statement-breakpoint
ALTER TABLE "api_usage_day" RENAME COLUMN "key_id" TO "endpoint_id";--> statement-breakpoint
ALTER TABLE "api_endpoint" RENAME CONSTRAINT "api_key_pkey" TO "api_endpoint_pkey";--> statement-breakpoint
ALTER TABLE "api_endpoint" RENAME CONSTRAINT "api_key_user_id_user_id_fkey" TO "api_endpoint_user_id_user_id_fkey";--> statement-breakpoint
ALTER TABLE "api_usage_day" RENAME CONSTRAINT "api_usage_day_key_id_api_key_id_fkey" TO "api_usage_day_endpoint_id_api_endpoint_id_fkey";--> statement-breakpoint
ALTER INDEX "api_key_user_idx" RENAME TO "api_endpoint_user_idx";--> statement-breakpoint
DROP INDEX "api_key_secret_hash_idx";--> statement-breakpoint
DROP INDEX "api_key_id_user_idx";--> statement-breakpoint
ALTER TABLE "api_endpoint" DROP COLUMN "name";--> statement-breakpoint
ALTER TABLE "api_endpoint" DROP COLUMN "prefix";--> statement-breakpoint
ALTER TABLE "api_endpoint" DROP COLUMN "secret_hash";--> statement-breakpoint
WITH ranked AS (
	SELECT "id", row_number() OVER (
		PARTITION BY "user_id" ORDER BY "created_at", "id"
	) AS position
	FROM "api_endpoint"
	WHERE "revoked_at" IS NULL
)
UPDATE "api_endpoint" AS endpoint
SET "revoked_at" = now()
FROM ranked
WHERE endpoint."id" = ranked."id" AND ranked.position > 1;--> statement-breakpoint
CREATE UNIQUE INDEX "api_endpoint_active_user_idx" ON "api_endpoint" ("user_id") WHERE "revoked_at" IS NULL;--> statement-breakpoint
INSERT INTO "api_endpoint" ("id", "user_id")
SELECT gen_random_uuid()::text, entitlement."user_id"
FROM "api_entitlement" AS entitlement
WHERE entitlement."status" = 'active'
	AND entitlement."plan" IN ('plus', 'pro')
	AND NOT EXISTS (
		SELECT 1 FROM "api_endpoint" AS endpoint
		WHERE endpoint."user_id" = entitlement."user_id"
			AND endpoint."revoked_at" IS NULL
	);
