"use client";

import { Button } from "@blobz/ui/components/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@blobz/ui/components/dropdown-menu";
import { Menu } from "lucide-react";
import Link from "next/link";

import { authClient } from "@/lib/auth-client";
import { GITHUB_REPOSITORY_URL } from "@/lib/site";
import styles from "./header.module.css";

export function HeaderMobileMenu() {
	const { data: session } = authClient.useSession();

	return (
		<div className={styles.mobileNavigation}>
			<DropdownMenu>
				<DropdownMenuTrigger
					render={
						<Button
							aria-label="Open navigation menu"
							className={styles.menuTrigger}
							size="icon-lg"
							type="button"
							variant="ghost"
						/>
					}
				>
					<Menu aria-hidden="true" />
				</DropdownMenuTrigger>
				<DropdownMenuContent
					align="end"
					className={styles.mobileMenu}
					sideOffset={12}
				>
					<DropdownMenuGroup>
						<DropdownMenuItem
							className="min-h-11"
							render={<Link href={{ pathname: "/docs" }} />}
						>
							Docs
						</DropdownMenuItem>
						<DropdownMenuItem
							className="min-h-11"
							render={<Link href="/create" />}
						>
							Playground
						</DropdownMenuItem>
						<DropdownMenuItem
							className="min-h-11"
							render={<Link href="/docs/api" />}
						>
							Hosted API
						</DropdownMenuItem>
						<DropdownMenuItem
							className="min-h-11"
							render={
								<a
									href={GITHUB_REPOSITORY_URL}
									rel="noopener noreferrer"
									target="_blank"
								/>
							}
						>
							GitHub
						</DropdownMenuItem>
					</DropdownMenuGroup>
					<DropdownMenuSeparator />
					<DropdownMenuGroup>
						<DropdownMenuItem
							className="min-h-11"
							render={<Link href={session ? "/dashboard" : "/login"} />}
						>
							{session ? "API dashboard" : "Sign in"}
						</DropdownMenuItem>
					</DropdownMenuGroup>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}
