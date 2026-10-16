import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";
import { XIcon } from "lucide-react";
import type { ComponentProps } from "react";

const avatarChipVariants = cva(
	// Match the 32px avatar's corner radius plus its 4px inset.
	"inline-flex h-10 max-w-full items-center gap-2 rounded-[calc(--spacing(8)*0.225+--spacing(1))] border ps-0.75 pe-2 font-medium text-sm transition-colors has-data-[frame=circle]:rounded-full has-data-[frame=square]:rounded-none",
	{
		defaultVariants: {
			variant: "secondary",
		},
		variants: {
			variant: {
				outline: "border-border bg-card text-foreground",
				secondary: "border-border/60 bg-secondary/65 text-secondary-foreground",
				soft: "border-transparent bg-muted/70 text-foreground",
			},
		},
	}
);

export interface AvatarChipProps
	extends ComponentProps<"span">,
		VariantProps<typeof avatarChipVariants> {}

export function AvatarChip({
	className,
	variant = "secondary",
	...props
}: AvatarChipProps) {
	return (
		<span
			className={cn(avatarChipVariants({ variant }), className)}
			data-slot="avatar-chip"
			{...props}
		/>
	);
}

export function AvatarChipLabel({
	className,
	...props
}: ComponentProps<"span">) {
	return (
		<span
			className={cn("truncate", className)}
			data-slot="avatar-chip-label"
			{...props}
		/>
	);
}

export function AvatarChipRemove({
	"aria-label": ariaLabel = "Remove",
	className,
	...props
}: ComponentProps<"button">) {
	return (
		<button
			aria-label={ariaLabel}
			className={cn(
				"relative inline-flex size-5 shrink-0 items-center justify-center rounded-full text-muted-foreground outline-none transition-colors after:absolute after:-inset-2 after:content-[''] hover:bg-foreground/10 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50 motion-reduce:transition-none [&>svg]:size-3",
				className
			)}
			data-slot="avatar-chip-remove"
			type="button"
			{...props}
		>
			<XIcon aria-hidden="true" />
		</button>
	);
}

export { avatarChipVariants };
