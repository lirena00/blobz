import { ZodError } from "zod";
import { ENV } from "../env.server";
import { auth } from "../services";

import { ApiPlatformError } from "./api-platform";

export class DashboardHttpError extends Error {
	readonly status: number;
	constructor(message: string, status: number) {
		super(message);
		this.status = status;
	}
}

export async function requireDashboardUser(request: Request) {
	const expectedOrigin = new URL(ENV.BETTER_AUTH_URL).origin;
	if (request.headers.get("origin") !== expectedOrigin) {
		throw new DashboardHttpError("Cross-origin dashboard request denied.", 403);
	}
	if (!request.headers.get("content-type")?.startsWith("application/json")) {
		throw new DashboardHttpError("Expected JSON request body.", 415);
	}
	const session = await auth.api.getSession({ headers: request.headers });
	if (!session?.user) {
		throw new DashboardHttpError("Sign in to continue.", 401);
	}
	return session.user;
}

export function dashboardError(error: unknown): Response {
	if (
		error instanceof DashboardHttpError ||
		error instanceof ApiPlatformError
	) {
		return Response.json({ error: error.message }, { status: error.status });
	}
	if (error instanceof ZodError) {
		return Response.json({ error: "Invalid request data." }, { status: 422 });
	}
	if (error instanceof SyntaxError) {
		return Response.json({ error: "Invalid JSON body." }, { status: 400 });
	}
	return Response.json(
		{ error: "Something went wrong. Please try again." },
		{ status: 500 }
	);
}
