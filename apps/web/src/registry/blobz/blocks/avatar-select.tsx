"use client";

import { cn } from "cn";
import { useMemo } from "react";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
	type AvatarSource,
} from "@/components/ui/avatar";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	AvatarProfile,
	AvatarProfileContent,
	AvatarProfileDescription,
	AvatarProfileName,
} from "@/registry/blobz/components/avatar-profile";
export interface AvatarSelectOption {
	readonly avatar: AvatarSource;
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
		<AvatarProfile className="p-0" density="compact">
			<Avatar frame={option.avatar.frame}>
				<AvatarImage alt="" src={option.avatar.src} />
				<AvatarFallback
					alt=""
					choices={option.avatar.choices}
					name={option.avatar.name}
					palette={option.avatar.palette}
				/>
			</Avatar>
			<AvatarProfileContent>
				<AvatarProfileName>{option.name}</AvatarProfileName>
				{option.description ? (
					<AvatarProfileDescription>
						{option.description}
					</AvatarProfileDescription>
				) : null}
			</AvatarProfileContent>
		</AvatarProfile>
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
					"w-full min-w-0 rounded-xl border-border bg-card px-3 shadow-xs data-[size=default]:h-16",
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
