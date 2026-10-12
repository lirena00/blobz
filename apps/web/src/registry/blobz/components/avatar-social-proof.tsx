import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";
import type { ComponentProps, ReactNode } from "react";
import {
	BlobAvatar,
	type BlobAvatarProps,
} from "@/registry/blobz/components/avatar";
import {
	BlobAvatarGroup,
	BlobAvatarGroupItem,
} from "@/registry/blobz/components/avatar-group";

const avatarSocialProofVariants = cva(
	"inline-flex max-w-full items-center gap-3 rounded-full text-muted-foreground text-sm",
	{
		defaultVariants: {
			variant: "outline",
		},
		variants: {
			variant: {
				default: "bg-transparent",
				muted: "bg-muted/70 px-3 py-2",
				outline: "border border-border bg-card px-3 py-2 shadow-sm",
			},
		},
	}
);

export interface AvatarSocialProofPerson
	extends Omit<BlobAvatarProps, "alt" | "size"> {
	readonly id: string;
}

export interface AvatarSocialProofProps
	extends Omit<ComponentProps<"div">, "children">,
		VariantProps<typeof avatarSocialProofVariants> {
	readonly avatars: readonly AvatarSocialProofPerson[];
	readonly children: ReactNode;
	readonly groupLabel?: string;
}

export function AvatarSocialProof({
	avatars,
	children,
	className,
	groupLabel = "Community members",
	variant = "outline",
	...props
}: AvatarSocialProofProps) {
	return (
		<div
			className={cn(avatarSocialProofVariants({ variant }), className)}
			data-slot="avatar-social-proof"
			{...props}
		>
			<BlobAvatarGroup aria-label={groupLabel}>
				{avatars.map(({ id, ...avatar }) => (
					<BlobAvatarGroupItem frame={avatar.frame} key={id}>
						<BlobAvatar {...avatar} alt="" size="sm" />
					</BlobAvatarGroupItem>
				))}
			</BlobAvatarGroup>
			<span className="truncate">{children}</span>
		</div>
	);
}

export { avatarSocialProofVariants };
