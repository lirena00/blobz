import { createAuth } from "@blobz/auth";
import { createDb } from "@blobz/db";

import { ENV } from "./env.server";

export const db = createDb(ENV);
export const auth = createAuth(ENV, db);
