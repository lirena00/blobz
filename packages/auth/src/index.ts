import { drizzleAdapter } from "@better-auth/drizzle-adapter/relations-v2";
import type { Database } from "@blobz/db";
import {
	account,
	authRelations,
	session,
	user,
	verification,
} from "@blobz/db/schema/auth";
import { dodopayments, webhooks } from "@dodopayments/better-auth";
import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import DodoPayments from "dodopayments";

export interface AuthConfig {
	BETTER_AUTH_SECRET: string;
	BETTER_AUTH_URL: string;
	DODO_PAYMENTS_API_KEY?: string;
	DODO_PAYMENTS_ENVIRONMENT?: "test_mode" | "live_mode";
	DODO_PAYMENTS_WEBHOOK_SECRET?: string;
	GOOGLE_CLIENT_ID: string;
	GOOGLE_CLIENT_SECRET: string;
}

const schema = { account, authRelations, session, user, verification };

export function createDodoClient(env: AuthConfig): DodoPayments | null {
	if (!(env.DODO_PAYMENTS_API_KEY && env.DODO_PAYMENTS_WEBHOOK_SECRET)) {
		return null;
	}

	return new DodoPayments({
		bearerToken: env.DODO_PAYMENTS_API_KEY,
		environment: env.DODO_PAYMENTS_ENVIRONMENT ?? "test_mode",
	});
}

export function createAuth(
	env: AuthConfig,
	database: Database,
	dodoClient: DodoPayments | null,
	onDodoWebhook: (payload: unknown) => Promise<void>
) {
	return betterAuth({
		baseURL: env.BETTER_AUTH_URL,
		database: drizzleAdapter(database, {
			provider: "pg",
			schema,
		}),
		plugins: [
			...(dodoClient && env.DODO_PAYMENTS_WEBHOOK_SECRET
				? [
						dodopayments({
							client: dodoClient,
							use: [
								webhooks({
									onPayload: onDodoWebhook,
									webhookKey: env.DODO_PAYMENTS_WEBHOOK_SECRET,
								}),
							],
						}),
					]
				: []),
			nextCookies(),
		],
		secret: env.BETTER_AUTH_SECRET,
		socialProviders: {
			google: {
				clientId: env.GOOGLE_CLIENT_ID,
				clientSecret: env.GOOGLE_CLIENT_SECRET,
			},
		},
		trustedOrigins: [env.BETTER_AUTH_URL],
	});
}

export type Session = ReturnType<typeof createAuth>["$Infer"]["Session"];
