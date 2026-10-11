import { createAuth, createDodoClient } from "@blobz/auth";
import { createDb } from "@blobz/db";

import { ENV as serverEnv } from "./env.server";
import { handleDodoWebhook } from "./lib/dodo-webhook";

export const db = createDb(serverEnv);
export const dodoClient = createDodoClient(serverEnv);
export const auth = createAuth(serverEnv, db, dodoClient, (payload) =>
	handleDodoWebhook(db, serverEnv, payload)
);
