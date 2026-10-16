"use client";

import { type MouseEvent, useCallback, useState } from "react";
import {
	Avatar,
	AvatarFallback,
	type AvatarFrame,
	type AvatarSource,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	AvatarChip,
	AvatarChipLabel,
	AvatarChipRemove,
} from "@/registry/blobz/components/avatar-chip";

interface Person {
	readonly frame: AvatarFrame;
	readonly name: string;
	readonly palette: NonNullable<AvatarSource["palette"]>;
}

const PEOPLE: readonly Person[] = [
	{
		frame: "rounded",
		name: "Janaki Ammal",
		palette: ["#dff4ff", "#38bdf8"],
	},
	{
		frame: "circle",
		name: "Vikram Sarabhai",
		palette: ["#fff0e2", "#fa9769"],
	},
	{
		frame: "square",
		name: "Kalpana Chawla",
		palette: ["#e7fbe8", "#9ce786"],
	},
];

export function AvatarChipExample() {
	const [selected, setSelected] = useState(PEOPLE);
	const removePerson = useCallback((event: MouseEvent<HTMLButtonElement>) => {
		const { name } = event.currentTarget.dataset;
		setSelected((current) => current.filter((person) => person.name !== name));
	}, []);
	const resetPeople = useCallback(() => setSelected(PEOPLE), []);
	return (
		<div className="flex flex-col items-center gap-5">
			<fieldset className="flex flex-wrap justify-center gap-3 border-0 p-0">
				<legend className="sr-only">Selected people</legend>
				{selected.map(({ frame, name, palette }) => (
					<AvatarChip key={name}>
						<Avatar frame={frame} size="sm">
							<AvatarFallback alt="" name={name} palette={palette} />
						</Avatar>
						<AvatarChipLabel>{name}</AvatarChipLabel>
						<AvatarChipRemove
							aria-label={`Remove ${name}`}
							data-name={name}
							onClick={removePerson}
						/>
					</AvatarChip>
				))}
				{selected.length === 0 ? (
					<span className="text-muted-foreground text-sm">
						No people selected
					</span>
				) : null}
			</fieldset>
			{selected.length < PEOPLE.length ? (
				<Button onClick={resetPeople} size="sm" variant="ghost">
					Reset selection
				</Button>
			) : null}
		</div>
	);
}
