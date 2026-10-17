"use client";

import { Avatar } from "@blobz/react";
import { Button } from "@blobz/ui/components/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@blobz/ui/components/dropdown-menu";
import { LayoutDashboard, LogOut } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { authClient } from "@/lib/auth-client";

export default function UserMenu() {
	const router = useRouter();
	const { data: session } = authClient.useSession();

	const handleSignOut = async (): Promise<void> => {
		await authClient.signOut();
		router.push("/");
		router.refresh();
	};

	if (!session) {
		return null;
	}

	const displayName = session.user.name.trim() || "Blobz user";

	return (
		<DropdownMenu>
			<DropdownMenuTrigger
				render={
					<Button
						aria-label={`Open account menu for ${displayName}`}
						className="size-11"
						size="icon-lg"
						variant="ghost"
					/>
				}
			>
				<Avatar
					alt=""
					className="rounded-full bg-muted ring-1 ring-border"
					frame="circle"
					name={session.user.id}
					palette={["#eaf8ff", "#38bdf8"]}
					size={34}
				/>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="min-w-64" sideOffset={8}>
				<DropdownMenuGroup>
					<DropdownMenuLabel className="flex items-center gap-3">
						<Avatar
							alt=""
							className="rounded-full bg-muted ring-1 ring-border"
							frame="circle"
							name={session.user.id}
							palette={["#eaf8ff", "#38bdf8"]}
							size={38}
						/>
						<span className="min-w-0">
							<span className="block truncate font-medium text-foreground text-sm">
								{displayName}
							</span>
							<span className="block truncate text-muted-foreground text-xs">
								{session.user.email}
							</span>
						</span>
					</DropdownMenuLabel>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownMenuItem render={<Link href="/dashboard" />}>
						<LayoutDashboard />
						API dashboard
					</DropdownMenuItem>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownMenuItem onClick={handleSignOut} variant="destructive">
						<LogOut />
						Sign out
					</DropdownMenuItem>
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
