CREATE TABLE "account" (
	"id" text PRIMARY KEY,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL UNIQUE,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY,
	"name" text NOT NULL,
	"email" text NOT NULL UNIQUE,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"dodo_customer_id" text UNIQUE,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "api_checkout_intent" (
	"user_id" text PRIMARY KEY,
	"plan" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "api_entitlement" (
	"user_id" text PRIMARY KEY,
	"plan" text NOT NULL,
	"status" text NOT NULL,
	"subscription_id" text UNIQUE,
	"product_id" text,
	"period_start" timestamp with time zone,
	"period_end" timestamp with time zone,
	"last_event_at" timestamp with time zone,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "api_key" (
	"id" text PRIMARY KEY,
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"prefix" text NOT NULL,
	"secret_hash" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"last_used_at" timestamp with time zone,
	"revoked_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "api_key_origin" (
	"key_id" text,
	"user_id" text NOT NULL,
	"origin" text,
	CONSTRAINT "api_key_origin_pkey" PRIMARY KEY("key_id","origin")
);
--> statement-breakpoint
CREATE TABLE "api_origin" (
	"user_id" text,
	"origin" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "api_origin_pkey" PRIMARY KEY("user_id","origin")
);
--> statement-breakpoint
CREATE TABLE "api_rate_minute" (
	"user_id" text,
	"minute" timestamp with time zone,
	"request_count" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "api_rate_minute_pkey" PRIMARY KEY("user_id","minute")
);
--> statement-breakpoint
CREATE TABLE "api_usage_day" (
	"user_id" text NOT NULL,
	"key_id" text,
	"day" text,
	"request_count" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "api_usage_day_pkey" PRIMARY KEY("key_id","day")
);
--> statement-breakpoint
CREATE TABLE "api_usage_period" (
	"user_id" text,
	"period_start" timestamp with time zone,
	"period_end" timestamp with time zone NOT NULL,
	"request_count" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "api_usage_period_pkey" PRIMARY KEY("user_id","period_start")
);
--> statement-breakpoint
CREATE TABLE "dodo_webhook_event" (
	"id" text PRIMARY KEY,
	"subscription_id" text NOT NULL,
	"event_type" text NOT NULL,
	"event_at" timestamp with time zone NOT NULL,
	"processed_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "account_userId_idx" ON "account" ("user_id");--> statement-breakpoint
CREATE INDEX "session_userId_idx" ON "session" ("user_id");--> statement-breakpoint
CREATE INDEX "verification_identifier_idx" ON "verification" ("identifier");--> statement-breakpoint
CREATE UNIQUE INDEX "api_key_secret_hash_idx" ON "api_key" ("secret_hash");--> statement-breakpoint
CREATE INDEX "api_key_user_idx" ON "api_key" ("user_id");--> statement-breakpoint
CREATE INDEX "api_key_origin_account_idx" ON "api_key_origin" ("user_id","origin");--> statement-breakpoint
CREATE INDEX "api_usage_day_account_idx" ON "api_usage_day" ("user_id","day");--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "api_checkout_intent" ADD CONSTRAINT "api_checkout_intent_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "api_entitlement" ADD CONSTRAINT "api_entitlement_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "api_key" ADD CONSTRAINT "api_key_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "api_key_origin" ADD CONSTRAINT "api_key_origin_key_id_api_key_id_fkey" FOREIGN KEY ("key_id") REFERENCES "api_key"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "api_origin" ADD CONSTRAINT "api_origin_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "api_rate_minute" ADD CONSTRAINT "api_rate_minute_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "api_usage_day" ADD CONSTRAINT "api_usage_day_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "api_usage_day" ADD CONSTRAINT "api_usage_day_key_id_api_key_id_fkey" FOREIGN KEY ("key_id") REFERENCES "api_key"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "api_usage_period" ADD CONSTRAINT "api_usage_period_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE;