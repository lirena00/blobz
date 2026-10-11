import {
	consumeEmbeddedAvatarRequest,
	normalizeOrigin,
} from "@/lib/api-platform";
import {
	parseEmbedAvatarQuery,
	renderEmbeddedAvatar,
} from "@/lib/avatar-embed";
import { db } from "@/services";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_REQUEST_URL_LENGTH = 4096;
const NO_STORE_HEADERS = { "Cache-Control": "no-store" } as const;

interface RouteContext {
	params: Promise<{ id: string }>;
}

const getOrigin = (request: Request): string | null => {
	const value = request.headers.get("origin");
	if (!value) {
		return null;
	}
	try {
		return normalizeOrigin(value);
	} catch {
		return null;
	}
};

export async function GET(request: Request, context: RouteContext) {
	const origin = getOrigin(request);
	if (!origin) {
		return Response.json(
			{
				code: "origin_required",
				error: "Use an image with crossorigin from an approved origin.",
			},
			{ headers: NO_STORE_HEADERS, status: 403 }
		);
	}

	const { id } = await context.params;
	if (request.url.length > MAX_REQUEST_URL_LENGTH) {
		return Response.json(
			{ code: "invalid_request", error: "Image URL is too long." },
			{ headers: NO_STORE_HEADERS, status: 414 }
		);
	}
	const options = parseEmbedAvatarQuery(new URL(request.url).searchParams);
	if (!options) {
		return Response.json(
			{ code: "invalid_request", error: "Invalid avatar parameters." },
			{ headers: NO_STORE_HEADERS, status: 422 }
		);
	}

	const consumed = await consumeEmbeddedAvatarRequest(db, id, origin);
	if (!consumed.ok) {
		return Response.json(
			{ code: consumed.code, error: consumed.message },
			{
				headers: {
					...NO_STORE_HEADERS,
					...(consumed.retryAfter
						? { "Retry-After": String(consumed.retryAfter) }
						: {}),
				},
				status: consumed.status,
			}
		);
	}
	const svg = renderEmbeddedAvatar(options);

	return new Response(svg, {
		headers: {
			...NO_STORE_HEADERS,
			"Access-Control-Allow-Origin": origin,
			"Content-Type": "image/svg+xml; charset=utf-8",
			"RateLimit-Limit": String(consumed.limit),
			"RateLimit-Remaining": String(
				Math.max(0, consumed.limit - consumed.count)
			),
			"RateLimit-Reset": String(Math.ceil(consumed.resetAt.getTime() / 1000)),
			Vary: "Origin",
			"X-Content-Type-Options": "nosniff",
		},
		status: 200,
	});
}
