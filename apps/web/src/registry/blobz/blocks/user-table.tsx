import { cn } from "cn";
import type { ComponentProps } from "react";
import {
	BlobAvatar,
	type BlobAvatarProps,
} from "@/registry/blobz/components/avatar";

export interface UserTableRow {
	readonly avatar: Omit<BlobAvatarProps, "alt" | "size">;
	readonly email: string;
	readonly id: string;
	readonly lastSeen: string;
	readonly name: string;
	readonly role: string;
	readonly status: "active" | "invited" | "suspended";
}

export interface UserTableProps
	extends Omit<ComponentProps<"div">, "children"> {
	readonly users: readonly UserTableRow[];
}

export function UserTable({ className, users, ...props }: UserTableProps) {
	return (
		<div
			className={cn(
				"w-full overflow-x-auto rounded-2xl border border-border bg-card shadow-sm",
				className
			)}
			data-slot="user-table"
			{...props}
		>
			<table className="w-full min-w-[540px] border-collapse text-left text-sm">
				<thead className="bg-muted/35 text-muted-foreground">
					<tr>
						<th className="px-5 py-3 font-medium" scope="col">
							User
						</th>
						<th className="px-4 py-3 font-medium" scope="col">
							Role
						</th>
						<th className="px-4 py-3 font-medium" scope="col">
							Status
						</th>
						<th className="px-5 py-3 text-right font-medium" scope="col">
							Last seen
						</th>
					</tr>
				</thead>
				<tbody className="divide-y divide-border">
					{users.map((user) => (
						<tr className="transition-colors hover:bg-muted/30" key={user.id}>
							<td className="px-5 py-3">
								<div className="flex min-w-0 items-center gap-3">
									<BlobAvatar {...user.avatar} alt="" size="default" />
									<span className="min-w-0">
										<span className="block truncate font-medium text-foreground">
											{user.name}
										</span>
										<span className="block truncate text-muted-foreground text-xs">
											{user.email}
										</span>
									</span>
								</div>
							</td>
							<td className="px-4 py-3 text-muted-foreground">{user.role}</td>
							<td className="px-4 py-3">
								<span
									className={cn(
										"inline-flex rounded-full border px-2.5 py-0.5 text-xs capitalize",
										user.status === "active"
											? "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
											: "border-border bg-muted/50 text-muted-foreground"
									)}
								>
									{user.status}
								</span>
							</td>
							<td className="whitespace-nowrap px-5 py-3 text-right text-muted-foreground text-xs">
								{user.lastSeen}
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
