import { cn } from "cn";
import type { ComponentProps, ReactNode } from "react";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
	type AvatarSource,
} from "@/components/ui/avatar";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

const PROFILE_CARD_STYLES = {
	compact: {
		actions:
			"ms-auto @max-xs/profile-card:ms-0 @max-xs/profile-card:w-full @max-xs/profile-card:[&>*]:flex-1",
		avatar: "",
		footer:
			"justify-between pt-4 @max-xs/profile-card:flex-col @max-xs/profile-card:items-stretch",
		header: "flex-row items-center",
		root: "gap-4 py-5 [--card-spacing:--spacing(5)]",
		title: "text-xl leading-tight",
	},
	featured: {
		actions: "",
		avatar: "size-20 ring-4 ring-card",
		footer: "",
		header: "-mt-13 flex-col items-start",
		root: "gap-5 pt-0",
		title: "text-lg",
	},
} as const;

export interface ProfileCardProps
	extends Omit<ComponentProps<"div">, "children"> {
	readonly actions?: ReactNode;
	readonly avatar: AvatarSource;
	readonly badge?: ReactNode;
	readonly bio?: string;
	readonly description?: string;
	readonly metadata?: ReactNode;
	readonly name: string;
	readonly variant?: "compact" | "featured";
}

export function ProfileCard({
	actions,
	avatar,
	badge,
	bio,
	className,
	metadata,
	name,
	description,
	variant = "compact",
	...props
}: ProfileCardProps) {
	const featured = variant === "featured";
	const styles = PROFILE_CARD_STYLES[variant];
	const avatarBadge = featured ? badge : undefined;
	const nameBadge = featured ? undefined : badge;
	const bodyMetadata = featured ? metadata : undefined;
	const footerMetadata = featured ? undefined : metadata;
	return (
		<Card
			className={cn(
				"@container/profile-card w-full max-w-sm shadow-xs",
				styles.root,
				className
			)}
			data-slot="profile-card"
			data-variant={variant}
			{...props}
		>
			{featured ? (
				<div
					aria-hidden="true"
					className="h-24 border-border/60 border-b bg-[radial-gradient(var(--border)_1px,transparent_1px)] bg-muted/60 bg-size-[12px_12px]"
				/>
			) : null}
			<CardHeader className={cn("flex gap-4", styles.header)}>
				<div
					className={cn(
						"shrink-0",
						featured && "flex w-full items-end justify-between gap-3"
					)}
				>
					<Avatar className={styles.avatar} frame={avatar.frame} size="xl">
						<AvatarImage alt="" src={avatar.src} />
						<AvatarFallback
							alt=""
							choices={avatar.choices}
							name={avatar.name}
							palette={avatar.palette}
						/>
					</Avatar>
					{avatarBadge}
				</div>
				<div className="flex min-w-0 flex-1 flex-col gap-1.5">
					<div className="flex flex-wrap items-center gap-x-2 gap-y-1.5">
						<CardTitle className="min-w-0">
							<h3
								className={cn(
									"tracking-tight [overflow-wrap:anywhere]",
									styles.title
								)}
							>
								{name}
							</h3>
						</CardTitle>
						{nameBadge}
					</div>
					{description ? (
						<CardDescription className="leading-relaxed [overflow-wrap:anywhere]">
							{description}
						</CardDescription>
					) : null}
				</div>
			</CardHeader>
			{bio || bodyMetadata ? (
				<CardContent className="flex flex-col gap-4">
					{bio ? (
						<p className="text-muted-foreground text-sm leading-relaxed [overflow-wrap:anywhere]">
							{bio}
						</p>
					) : null}
					{bodyMetadata ? (
						<div className="text-muted-foreground text-xs">{bodyMetadata}</div>
					) : null}
				</CardContent>
			) : null}
			{actions || footerMetadata ? (
				<CardFooter
					className={cn(
						"flex-wrap gap-3 border-border/60 border-t",
						styles.footer
					)}
				>
					{footerMetadata ? (
						<div className="min-w-0 text-muted-foreground text-xs leading-relaxed [overflow-wrap:anywhere]">
							{footerMetadata}
						</div>
					) : null}
					{actions ? (
						<div
							className={cn(
								"flex min-w-0 max-w-full flex-wrap items-center gap-2",
								styles.actions
							)}
						>
							{actions}
						</div>
					) : null}
				</CardFooter>
			) : null}
		</Card>
	);
}
