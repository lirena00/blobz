// biome-ignore-all lint/performance/noJsxPropsBind: Builder callbacks intentionally close over the current controlled definition; memoizing them would not prevent child renders.
"use client";

import {
	AVATAR_CHOICES,
	type AvatarDefinition,
	type CustomAvatarChoices,
	type CustomAvatarDefinition,
	DEFAULT_AVATAR_PALETTE,
	DEFAULT_CUSTOM_AVATAR_CHOICES,
	type GeneratedAvatarDefinition,
	makeAvatar,
	toCustomAvatarChoices,
} from "@blobz/avatar-core";
import { RotateCcwIcon, ShuffleIcon } from "lucide-react";
import type { ChangeEvent, ComponentPropsWithoutRef, MouseEvent } from "react";
import { useId, useState } from "react";
import { Avatar } from "./avatar";
import { CustomAvatar } from "./custom-avatar";
import {
	AvatarPalettePicker,
	AVATAR_PALETTE_PRESETS as SHARED_PALETTE_PRESETS,
} from "./palette-picker";

export type AvatarBuilderValue = AvatarDefinition;
export const AVATAR_PALETTE_PRESETS = SHARED_PALETTE_PRESETS;

const DEFAULT_BUILDER_VALUE = {
	frame: "rounded",
	name: "Maria Mitchell",
	palette: DEFAULT_AVATAR_PALETTE,
	type: "generated",
	version: 1,
} as const satisfies GeneratedAvatarDefinition;

const BODY_TILTS = Array.from({ length: 15 }, (_, index) => (index - 7) * 2);
const FACE_ANGLES = Array.from({ length: 25 }, (_, index) => index - 12);
const HORIZONTAL_POSITIONS = [-2, -1, 0, 1, 2] as const;
const VERTICAL_POSITIONS = [-1, 0, 1] as const;

const joinClassNames = (
	baseClassName: string,
	className: string | undefined
): string => (className ? `${baseClassName} ${className}` : baseClassName);

const readChoice = <Choice extends string>(
	choices: readonly Choice[],
	value: string
): Choice => {
	const choice = choices.find((candidate) => candidate === value);
	if (choice === undefined) {
		throw new RangeError(`Unknown avatar choice: ${value}`);
	}
	return choice;
};

const randomItem = <Item,>(items: readonly Item[]): Item => {
	const item = items[Math.floor(Math.random() * items.length)];
	if (item === undefined) {
		throw new RangeError("Cannot choose from an empty avatar option list.");
	}
	return item;
};

const createRandomChoices = (): CustomAvatarChoices => ({
	bodyTilt: randomItem(BODY_TILTS),
	brows: randomItem(AVATAR_CHOICES.brows),
	eyeSpacing: randomItem(AVATAR_CHOICES.gap),
	eyes: randomItem(AVATAR_CHOICES.eyes),
	faceAngle: randomItem(FACE_ANGLES),
	facePosition: {
		x: randomItem(HORIZONTAL_POSITIONS),
		y: randomItem(VERTICAL_POSITIONS),
	},
	look: randomItem(AVATAR_CHOICES.look),
	mirrored: Math.random() >= 0.5,
	mouth: randomItem(AVATAR_CHOICES.mouth),
	shape: randomItem(AVATAR_CHOICES.shape),
});

const createCustomDefinitionFromGenerated = (
	definition: GeneratedAvatarDefinition
): CustomAvatarDefinition => {
	const generated = makeAvatar(
		definition.name,
		definition.palette,
		definition.frame
	);
	return {
		choices: toCustomAvatarChoices(generated.choices),
		frame: definition.frame,
		palette: definition.palette,
		type: "custom",
		version: 1,
	};
};

interface AvatarBuilderPreviewProps {
	readonly definition: AvatarDefinition;
}

function AvatarBuilderPreview({ definition }: AvatarBuilderPreviewProps) {
	return (
		<div className="blobz-builder__preview">
			{definition.type === "generated" ? (
				<Avatar
					frame={definition.frame}
					name={definition.name}
					palette={definition.palette}
					size="100%"
				/>
			) : (
				<CustomAvatar definition={definition} size="100%" />
			)}
		</div>
	);
}

interface ModeSwitchProps {
	readonly mode: AvatarDefinition["type"];
	readonly onModeChange: (mode: AvatarDefinition["type"]) => void;
}

function ModeSwitch({ mode, onModeChange }: ModeSwitchProps) {
	const handleModeChange = (event: MouseEvent<HTMLButtonElement>) => {
		const nextMode = event.currentTarget.value;
		if (nextMode === "generated" || nextMode === "custom") {
			onModeChange(nextMode);
		}
	};

	return (
		<fieldset className="blobz-builder__mode-switch">
			<legend>Creation mode</legend>
			<button
				aria-pressed={mode === "generated"}
				onClick={handleModeChange}
				type="button"
				value="generated"
			>
				From name
			</button>
			<button
				aria-pressed={mode === "custom"}
				onClick={handleModeChange}
				type="button"
				value="custom"
			>
				Build my own
			</button>
		</fieldset>
	);
}

interface AppearanceControlsProps {
	readonly definition: AvatarDefinition;
	readonly idPrefix: string;
	readonly onDefinitionChange: (definition: AvatarDefinition) => void;
}

function AppearanceControls({
	definition,
	idPrefix,
	onDefinitionChange,
}: AppearanceControlsProps) {
	const handleFrameChange = (event: ChangeEvent<HTMLInputElement>) => {
		const { value } = event.currentTarget;
		if (value === "square" || value === "rounded" || value === "circle") {
			onDefinitionChange({ ...definition, frame: value });
		}
	};
	return (
		<div className="blobz-builder__appearance">
			<fieldset className="blobz-builder__frame-options">
				<legend>Frame</legend>
				{(["square", "rounded", "circle"] as const).map((frame) => (
					<label key={frame}>
						<input
							checked={definition.frame === frame}
							name={`${idPrefix}-frame`}
							onChange={handleFrameChange}
							type="radio"
							value={frame}
						/>
						<span>{frame}</span>
					</label>
				))}
			</fieldset>

			<AvatarPalettePicker
				idPrefix={idPrefix}
				onPaletteChange={(palette) =>
					onDefinitionChange({ ...definition, palette })
				}
				palette={definition.palette}
			/>
		</div>
	);
}

interface GeneratedControlsProps {
	readonly definition: GeneratedAvatarDefinition;
	readonly idPrefix: string;
	readonly onDefinitionChange: (definition: GeneratedAvatarDefinition) => void;
}

function GeneratedControls({
	definition,
	idPrefix,
	onDefinitionChange,
}: GeneratedControlsProps) {
	const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
		onDefinitionChange({
			...definition,
			name: event.currentTarget.value,
		});
	};

	return (
		<div className="blobz-builder__generated-controls">
			<label htmlFor={`${idPrefix}-name`}>Name or email</label>
			<input
				autoComplete="off"
				id={`${idPrefix}-name`}
				name="avatar-seed"
				onChange={handleNameChange}
				placeholder="Type a name"
				spellCheck={false}
				type="text"
				value={definition.name}
			/>
			<p>The same normalized name always creates the same avatar.</p>
		</div>
	);
}

interface VisualChoiceGroupProps<Choice extends string> {
	readonly createDefinition: (choice: Choice) => CustomAvatarDefinition;
	readonly label: string;
	readonly onSelect: (choice: Choice) => void;
	readonly options: readonly Choice[];
	readonly selected: Choice;
}

function VisualChoiceGroup<Choice extends string>({
	createDefinition,
	label,
	onSelect,
	options,
	selected,
}: VisualChoiceGroupProps<Choice>) {
	const handleSelect = (event: MouseEvent<HTMLButtonElement>) => {
		onSelect(readChoice(options, event.currentTarget.value));
	};

	return (
		<fieldset className="blobz-builder__choice-group">
			<legend>{label}</legend>
			<div className="blobz-builder__choice-grid">
				{options.map((option) => (
					<button
						aria-label={`Use ${label.toLowerCase()}: ${option}`}
						aria-pressed={selected === option}
						className="blobz-builder__choice"
						key={option}
						onClick={handleSelect}
						type="button"
						value={option}
					>
						<CustomAvatar
							alt=""
							definition={createDefinition(option)}
							size={56}
						/>
						<span>{option}</span>
					</button>
				))}
			</div>
		</fieldset>
	);
}

interface RangeControlProps {
	readonly id: string;
	readonly label: string;
	readonly maximum: number;
	readonly minimum: number;
	readonly onValueChange: (value: number) => void;
	readonly step?: number;
	readonly suffix?: string;
	readonly value: number;
}

function RangeControl({
	id,
	label,
	maximum,
	minimum,
	onValueChange,
	step = 1,
	suffix = "",
	value,
}: RangeControlProps) {
	const handleValueChange = (event: ChangeEvent<HTMLInputElement>) => {
		onValueChange(Number(event.currentTarget.value));
	};

	return (
		<label className="blobz-builder__range" htmlFor={id}>
			<span>{label}</span>
			<input
				id={id}
				max={maximum}
				min={minimum}
				onChange={handleValueChange}
				step={step}
				type="range"
				value={value}
			/>
			<output htmlFor={id}>{`${value}${suffix}`}</output>
		</label>
	);
}

interface CustomControlsProps {
	readonly definition: CustomAvatarDefinition;
	readonly idPrefix: string;
	readonly onDefinitionChange: (definition: CustomAvatarDefinition) => void;
}

function CustomControls({
	definition,
	idPrefix,
	onDefinitionChange,
}: CustomControlsProps) {
	const currentChoices = definition.choices;
	const updateChoices = (nextChoices: CustomAvatarChoices) => {
		onDefinitionChange({ ...definition, choices: nextChoices });
	};
	const createDefinition = (
		nextChoices: CustomAvatarChoices
	): CustomAvatarDefinition => ({ ...definition, choices: nextChoices });
	const handleReset = () => {
		updateChoices(DEFAULT_CUSTOM_AVATAR_CHOICES);
	};
	const handleRandomize = () => {
		updateChoices(createRandomChoices());
	};
	const createShapeDefinition = (shape: CustomAvatarChoices["shape"]) =>
		createDefinition({ ...currentChoices, shape });
	const selectShape = (shape: CustomAvatarChoices["shape"]) => {
		updateChoices({ ...currentChoices, shape });
	};
	const createEyesDefinition = (eyes: CustomAvatarChoices["eyes"]) =>
		createDefinition({ ...currentChoices, eyes });
	const selectEyes = (eyes: CustomAvatarChoices["eyes"]) => {
		updateChoices({ ...currentChoices, eyes });
	};
	const createMouthDefinition = (mouth: CustomAvatarChoices["mouth"]) =>
		createDefinition({ ...currentChoices, mouth });
	const selectMouth = (mouth: CustomAvatarChoices["mouth"]) => {
		updateChoices({ ...currentChoices, mouth });
	};
	const createBrowsDefinition = (brows: CustomAvatarChoices["brows"]) =>
		createDefinition({ ...currentChoices, brows });
	const selectBrows = (brows: CustomAvatarChoices["brows"]) => {
		updateChoices({ ...currentChoices, brows });
	};
	const handleLookChange = (event: ChangeEvent<HTMLSelectElement>) => {
		updateChoices({
			...currentChoices,
			look: readChoice(AVATAR_CHOICES.look, event.currentTarget.value),
		});
	};
	const handleEyeSpacingChange = (event: ChangeEvent<HTMLSelectElement>) => {
		updateChoices({
			...currentChoices,
			eyeSpacing: readChoice(AVATAR_CHOICES.gap, event.currentTarget.value),
		});
	};
	const handleMirroredChange = (event: ChangeEvent<HTMLInputElement>) => {
		updateChoices({
			...currentChoices,
			mirrored: event.currentTarget.checked,
		});
	};
	const handleFaceAngleChange = (faceAngle: number) => {
		updateChoices({ ...currentChoices, faceAngle });
	};
	const handleBodyTiltChange = (bodyTilt: number) => {
		updateChoices({ ...currentChoices, bodyTilt });
	};
	const handleFaceXChange = (x: number) => {
		updateChoices({
			...currentChoices,
			facePosition: { ...currentChoices.facePosition, x },
		});
	};
	const handleFaceYChange = (y: number) => {
		updateChoices({
			...currentChoices,
			facePosition: { ...currentChoices.facePosition, y },
		});
	};

	return (
		<div className="blobz-builder__custom-controls">
			<div className="blobz-builder__custom-actions">
				<button onClick={handleReset} type="button">
					<RotateCcwIcon aria-hidden="true" />
					Reset face
				</button>
				<button onClick={handleRandomize} type="button">
					<ShuffleIcon aria-hidden="true" />
					Randomize
				</button>
			</div>

			<VisualChoiceGroup
				createDefinition={createShapeDefinition}
				label="Blob shape"
				onSelect={selectShape}
				options={AVATAR_CHOICES.shape}
				selected={currentChoices.shape}
			/>
			<VisualChoiceGroup
				createDefinition={createEyesDefinition}
				label="Eyes"
				onSelect={selectEyes}
				options={AVATAR_CHOICES.eyes}
				selected={currentChoices.eyes}
			/>
			<VisualChoiceGroup
				createDefinition={createMouthDefinition}
				label="Mouth"
				onSelect={selectMouth}
				options={AVATAR_CHOICES.mouth}
				selected={currentChoices.mouth}
			/>
			<VisualChoiceGroup
				createDefinition={createBrowsDefinition}
				label="Brows"
				onSelect={selectBrows}
				options={AVATAR_CHOICES.brows}
				selected={currentChoices.brows}
			/>

			<fieldset className="blobz-builder__details">
				<legend>Face details</legend>
				<label htmlFor={`${idPrefix}-look`}>
					<span>Looking</span>
					<select
						id={`${idPrefix}-look`}
						onChange={handleLookChange}
						value={currentChoices.look}
					>
						{AVATAR_CHOICES.look.map((look) => (
							<option key={look} value={look}>
								{look}
							</option>
						))}
					</select>
				</label>

				<label htmlFor={`${idPrefix}-eye-spacing`}>
					<span>Eye spacing</span>
					<select
						id={`${idPrefix}-eye-spacing`}
						onChange={handleEyeSpacingChange}
						value={currentChoices.eyeSpacing}
					>
						{AVATAR_CHOICES.gap.map((spacing) => (
							<option key={spacing} value={spacing}>
								{spacing}
							</option>
						))}
					</select>
				</label>

				<label className="blobz-builder__checkbox">
					<input
						checked={currentChoices.mirrored}
						onChange={handleMirroredChange}
						type="checkbox"
					/>
					<span>Mirror body and face</span>
				</label>

				<RangeControl
					id={`${idPrefix}-face-angle`}
					label="Face angle"
					maximum={12}
					minimum={-12}
					onValueChange={handleFaceAngleChange}
					suffix="°"
					value={currentChoices.faceAngle}
				/>
				<RangeControl
					id={`${idPrefix}-body-tilt`}
					label="Body tilt"
					maximum={14}
					minimum={-14}
					onValueChange={handleBodyTiltChange}
					step={2}
					suffix="°"
					value={currentChoices.bodyTilt}
				/>
				<RangeControl
					id={`${idPrefix}-face-x`}
					label="Face position, horizontal"
					maximum={2}
					minimum={-2}
					onValueChange={handleFaceXChange}
					value={currentChoices.facePosition.x}
				/>
				<RangeControl
					id={`${idPrefix}-face-y`}
					label="Face position, vertical"
					maximum={1}
					minimum={-1}
					onValueChange={handleFaceYChange}
					value={currentChoices.facePosition.y}
				/>
			</fieldset>
		</div>
	);
}

export interface AvatarBuilderProps
	extends Omit<ComponentPropsWithoutRef<"div">, "defaultValue"> {
	/** Initial definition when the builder manages its own state. */
	readonly defaultValue?: AvatarBuilderValue;
	/** Called after every generated or custom edit. */
	readonly onValueChange?: (value: AvatarBuilderValue) => void;
	/** Controlled active avatar definition. */
	readonly value?: AvatarBuilderValue;
}

export function AvatarBuilder({
	children,
	className,
	defaultValue = DEFAULT_BUILDER_VALUE,
	onValueChange,
	value,
	...rootProps
}: AvatarBuilderProps) {
	const idPrefix = useId().replaceAll(":", "");
	const initialValue = value ?? defaultValue;
	const [uncontrolledValue, setUncontrolledValue] = useState<AvatarDefinition>(
		() => initialValue
	);
	const [generatedDraft, setGeneratedDraft] =
		useState<GeneratedAvatarDefinition>(() =>
			initialValue.type === "generated" ? initialValue : DEFAULT_BUILDER_VALUE
		);
	const [customDraft, setCustomDraft] = useState<CustomAvatarDefinition | null>(
		() => (initialValue.type === "custom" ? initialValue : null)
	);
	const currentValue = value ?? uncontrolledValue;

	const commit = (nextValue: AvatarDefinition) => {
		if (value === undefined) {
			setUncontrolledValue(nextValue);
		}
		if (nextValue.type === "generated") {
			setGeneratedDraft(nextValue);
		} else {
			setCustomDraft(nextValue);
		}
		onValueChange?.(nextValue);
	};

	const changeMode = (mode: AvatarDefinition["type"]) => {
		if (mode === currentValue.type) {
			return;
		}
		if (currentValue.type === "generated") {
			setGeneratedDraft(currentValue);
			const nextCustom =
				customDraft ?? createCustomDefinitionFromGenerated(currentValue);
			commit({
				...nextCustom,
				frame: currentValue.frame,
				palette: currentValue.palette,
			});
			return;
		}

		setCustomDraft(currentValue);
		commit({
			...generatedDraft,
			frame: currentValue.frame,
			palette: currentValue.palette,
		});
	};

	return (
		<div
			{...rootProps}
			className={joinClassNames("blobz-builder", className)}
			data-mode={currentValue.type}
		>
			<div className="blobz-builder__studio">
				<div className="blobz-builder__preview-rail">
					<AvatarBuilderPreview definition={currentValue} />
					{children ? (
						<div className="blobz-builder__preview-actions">{children}</div>
					) : null}
				</div>
				<div className="blobz-builder__controls">
					<div className="blobz-builder__primary-controls">
						<ModeSwitch mode={currentValue.type} onModeChange={changeMode} />
						<AppearanceControls
							definition={currentValue}
							idPrefix={idPrefix}
							onDefinitionChange={commit}
						/>
						{currentValue.type === "generated" ? (
							<GeneratedControls
								definition={currentValue}
								idPrefix={idPrefix}
								onDefinitionChange={commit}
							/>
						) : null}
					</div>

					{currentValue.type === "custom" ? (
						<CustomControls
							definition={currentValue}
							idPrefix={idPrefix}
							onDefinitionChange={commit}
						/>
					) : null}
				</div>
			</div>
		</div>
	);
}
