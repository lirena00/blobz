import { z } from "zod";

import { addAccountOrigin, removeAccountOrigin } from "@/lib/api-platform";
import { dashboardError, requireDashboardUser } from "@/lib/dashboard-http";
import { db } from "@/services";

const originBody = z.object({ origin: z.string().min(1).max(255) });

export async function POST(request: Request) {
	try {
		const user = await requireDashboardUser(request);
		const body = originBody.parse(await request.json());
		const origin = await addAccountOrigin(db, user.id, body.origin);
		return Response.json({ origin }, { status: 201 });
	} catch (error) {
		return dashboardError(error);
	}
}

export async function DELETE(request: Request) {
	try {
		const user = await requireDashboardUser(request);
		const body = originBody.parse(await request.json());
		await removeAccountOrigin(db, user.id, body.origin);
		return Response.json({ ok: true });
	} catch (error) {
		return dashboardError(error);
	}
}
