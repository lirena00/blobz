import { cn } from "cn";
import type { ComponentProps } from "react";

import {
	Avatar,
	AvatarFallback,
	AvatarImage,
	type AvatarSource,
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
	AvatarProfile,
	AvatarProfileContent,
	AvatarProfileDescription,
	AvatarProfileName,
} from "@/registry/blobz/components/avatar-profile";
export interface UserTableRow {
	readonly avatar: AvatarSource;
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
				"w-full overflow-x-auto rounded-2xl border border-border bg-card shadow-xs",
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
						<tr
							className="transition-colors hover:bg-muted/30 motion-reduce:transition-none"
							key={user.id}
						>
							<td className="px-5 py-3">
								<AvatarProfile className="p-0">
									<Avatar frame={user.avatar.frame}>
										<AvatarImage alt="" src={user.avatar.src} />
										<AvatarFallback
											alt=""
											choices={user.avatar.choices}
											name={user.avatar.name}
											palette={user.avatar.palette}
										/>
									</Avatar>
									<AvatarProfileContent>
										<AvatarProfileName>{user.name}</AvatarProfileName>
										<AvatarProfileDescription>
											{user.email}
										</AvatarProfileDescription>
									</AvatarProfileContent>
								</AvatarProfile>
							</td>
							<td className="px-4 py-3 text-muted-foreground">{user.role}</td>
							<td className="px-4 py-3">
								<Badge
									className="capitalize"
									variant={user.status === "active" ? "secondary" : "outline"}
								>
									{user.status}
								</Badge>
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
