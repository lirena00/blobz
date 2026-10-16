import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";
import type { ComponentProps, ReactNode } from "react";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
	type AvatarSource,
} from "@/components/ui/avatar";

const testimonialCardVariants = cva(
	"m-0 grid w-full min-w-0 max-w-2xl gap-6 bg-card text-card-foreground",
	{
		defaultVariants: { variant: "editorial" },
		variants: {
			variant: {
				compact: "max-w-sm rounded-2xl border border-border/80 p-6 shadow-xs",
				editorial:
					"border-border border-y py-6 sm:grid-cols-[10rem_minmax(0,1fr)] sm:gap-8 sm:py-0",
			},
		},
	}
);

export interface TestimonialCardProps
	extends Omit<ComponentProps<"figure">, "children">,
		VariantProps<typeof testimonialCardVariants> {
	readonly attribution?: string;
	readonly avatar: AvatarSource;
	readonly name: string;
	readonly quote: ReactNode;
}

export function TestimonialCard({
	avatar,
	className,
	name,
	quote,
	attribution,
	variant = "editorial",
	...props
}: TestimonialCardProps) {
	return (
		<figure
			className={cn(testimonialCardVariants({ variant }), className)}
			data-slot="testimonial-card"
			data-variant={variant}
			{...props}
		>
			<div
				className={cn(
					"flex items-start",
					variant === "editorial" &&
						"sm:items-center sm:border-border sm:border-e"
				)}
			>
				<Avatar
					className={cn(
						variant === "editorial" ? "size-20 sm:size-40" : "size-12"
					)}
					frame={
						avatar.frame ?? (variant === "editorial" ? "square" : "rounded")
					}
				>
					<AvatarImage alt="" src={avatar.src} />
					<AvatarFallback
						alt=""
						choices={avatar.choices}
						name={avatar.name}
						palette={avatar.palette}
					/>
				</Avatar>
			</div>
			<div
				className={cn(
					"flex min-w-0 flex-col justify-center gap-5",
					variant === "editorial" && "sm:py-5 sm:pe-6"
				)}
			>
				<blockquote className="m-0 text-pretty font-medium text-xl leading-snug tracking-tight [overflow-wrap:anywhere] sm:text-[22px]">
					{quote}
				</blockquote>
				<figcaption className="flex min-w-0 flex-col gap-1 text-sm">
					<span className="font-medium [overflow-wrap:anywhere]">{name}</span>
					{attribution ? (
						<span className="text-muted-foreground text-xs leading-relaxed [overflow-wrap:anywhere]">
							{attribution}
						</span>
					) : null}
				</figcaption>
			</div>
		</figure>
	);
}
