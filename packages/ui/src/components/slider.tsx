// biome-ignore-all lint: This file is generated from the upstream shadcn registry and preserves its public API and component behavior.

import { Slider as SliderPrimitive } from "@base-ui/react/slider";
import { cn } from "cn";

function Slider({
	className,
	defaultValue,
	value,
	min = 0,
	max = 100,
	...props
}: SliderPrimitive.Root.Props) {
	const _values = Array.isArray(value)
		? value
		: Array.isArray(defaultValue)
			? defaultValue
			: [min, max];

	return (
		<SliderPrimitive.Root
			className={cn("data-vertical:h-full data-horizontal:w-full", className)}
			data-slot="slider"
			defaultValue={defaultValue}
			max={max}
			min={min}
			thumbAlignment="edge"
			value={value}
			{...props}
		>
			<SliderPrimitive.Control className="relative flex w-full touch-none select-none items-center data-vertical:h-full data-vertical:min-h-40 data-vertical:w-auto data-vertical:flex-col data-disabled:opacity-50">
				<SliderPrimitive.Track
					className="relative grow select-none overflow-hidden rounded-4xl bg-muted data-horizontal:h-3 data-vertical:h-full data-horizontal:w-full data-vertical:w-3"
					data-slot="slider-track"
				>
					<SliderPrimitive.Indicator
						className="select-none bg-primary data-horizontal:h-full data-vertical:w-full"
						data-slot="slider-range"
					/>
				</SliderPrimitive.Track>
				{Array.from({ length: _values.length }, (_, index) => (
					<SliderPrimitive.Thumb
						className="block size-4 shrink-0 select-none rounded-4xl border border-primary bg-white shadow-sm ring-ring/50 transition-colors hover:ring-4 focus-visible:outline-hidden focus-visible:ring-4 disabled:pointer-events-none disabled:opacity-50"
						data-slot="slider-thumb"
						key={index}
					/>
				))}
			</SliderPrimitive.Control>
		</SliderPrimitive.Root>
	);
}

export { Slider };
