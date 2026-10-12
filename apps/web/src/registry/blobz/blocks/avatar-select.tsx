"use client";

import { cn } from "cn";
import { useMemo } from "react";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	BlobAvatar,
	type BlobAvatarProps,
} from "@/registry/blobz/components/avatar";

export interface AvatarSelectOption {
	readonly avatar: Omit<BlobAvatarProps, "alt" | "size">;
	readonly description?: string;
	readonly id: string;
	readonly name: string;
}

export interface AvatarSelectProps {
	readonly className?: string;
	readonly contentClassName?: string;
	readonly defaultValue?: string;
	readonly disabled?: boolean;
	readonly items: readonly AvatarSelectOption[];
	readonly name?: string;
	readonly onValueChange?: (value: string | null) => void;
	readonly placeholder?: string;
	readonly triggerLabel?: string;
	readonly value?: string | null;
}

function AvatarSelectIdentity({
	option,
}: {
	readonly option: AvatarSelectOption;
}) {
	return (
		<span className="flex min-w-0 items-center gap-3">
			<BlobAvatar {...option.avatar} alt="" size="default" />
			<span className="flex min-w-0 flex-col gap-0.5 text-start">
				<span className="block truncate font-medium text-foreground text-sm">
					{option.name}
				</span>
				{option.description ? (
					<span className="block truncate text-muted-foreground text-xs">
						{option.description}
					</span>
				) : null}
			</span>
		</span>
	);
}

export function AvatarSelect({
	className,
	contentClassName,
	defaultValue,
	disabled,
	items,
	name,
	onValueChange,
	placeholder = "Select a person",
	triggerLabel = "Select a person",
	value,
}: AvatarSelectProps) {
	const itemById = useMemo(
		() => new Map(items.map((item) => [item.id, item])),
		[items]
	);
	const selectItems = useMemo(
		() => items.map((item) => ({ label: item.name, value: item.id })),
		[items]
	);

	return (
		<Select
			defaultValue={defaultValue ?? items.at(0)?.id}
			disabled={disabled}
			items={selectItems}
			name={name}
			onValueChange={onValueChange}
			value={value}
		>
			<SelectTrigger
				aria-label={triggerLabel}
				className={cn(
					"w-full min-w-72 rounded-xl border-border bg-card px-4 shadow-sm data-[size=default]:h-16",
					className
				)}
			>
				<SelectValue>
					{(selectedValue: string | null) => {
						const option = selectedValue
							? itemById.get(selectedValue)
							: undefined;
						return option ? (
							<AvatarSelectIdentity option={option} />
						) : (
							placeholder
						);
					}}
				</SelectValue>
			</SelectTrigger>
			<SelectContent alignItemWithTrigger={false} className={contentClassName}>
				<SelectGroup>
					{items.map((option) => (
						<SelectItem key={option.id} value={option.id}>
							<AvatarSelectIdentity option={option} />
						</SelectItem>
					))}
				</SelectGroup>
			</SelectContent>
		</Select>
	);
}
