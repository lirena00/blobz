import { toNextJsHandler } from "better-auth/next-js";

import { auth } from "../../../../services";

export const { GET, POST } = toNextJsHandler(auth);
