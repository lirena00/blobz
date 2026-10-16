import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const SURFACES = ["default", "outline", "elevated"] as const;
const SOURCES = [
	{ label: "Generated", name: "Vikram", src: undefined },
	{ label: "Image", name: "Lirena", src: "https://www.lirena.in/favicon.jpg" },
] as const;

export function AvatarSurfacesExample() {
	return (
		<div className="flex flex-col gap-8">
			{SOURCES.map(({ label, name, src }) => (
				<div className="flex flex-col gap-4" key={label}>
					<span className="text-muted-foreground text-xs">{label}</span>
					<div className="grid grid-cols-3 gap-6 sm:gap-10">
						{SURFACES.map((variant) => (
							<div className="flex flex-col items-center gap-3" key={variant}>
								<Avatar size="xl" variant={variant}>
									<AvatarImage alt={name} src={src} />
									<AvatarFallback name={name} />
								</Avatar>
								<span className="text-muted-foreground text-xs">{variant}</span>
							</div>
						))}
					</div>
				</div>
			))}
		</div>
	);
}
