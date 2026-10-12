"use client";

import { Monitor, Moon, Sun, SunMoon } from "lucide-react";
import { useTheme } from "next-themes";
import { useCallback } from "react";

const themeOptions = [
	{ icon: Monitor, label: "System", value: "system" },
	{ icon: Sun, label: "Light", value: "light" },
	{ icon: Moon, label: "Dark", value: "dark" },
] as const;

function ThemeOption({
	option,
	selectedTheme,
	setTheme,
}: {
	option: (typeof themeOptions)[number];
	selectedTheme: string | undefined;
	setTheme: (theme: string) => void;
}) {
	const { icon: Icon, label, value } = option;
	const handleClick = useCallback(() => setTheme(value), [setTheme, value]);

	return (
		<button
			aria-label={`${label} theme`}
			aria-pressed={selectedTheme === value}
			className={`flex size-8 items-center justify-center rounded-full transition-colors hover:text-fd-foreground focus-visible:outline-2 focus-visible:outline-fd-ring focus-visible:outline-offset-2 ${selectedTheme === value ? "bg-fd-accent text-fd-accent-foreground shadow-sm" : "text-fd-muted-foreground"}`}
			onClick={handleClick}
			title={`${label} theme`}
			type="button"
		>
			<Icon aria-hidden="true" className="size-4" />
		</button>
	);
}

export function DocsThemeSwitch() {
	const { setTheme, theme } = useTheme();

	return (
		<div className="mb-6 flex items-center justify-between gap-2 rounded-2xl border border-fd-border bg-fd-card px-3 py-2 text-fd-card-foreground">
			<span className="flex items-center gap-2 font-medium text-sm">
				<SunMoon
					aria-hidden="true"
					className="size-4 text-fd-muted-foreground"
				/>
				Theme
			</span>
			<fieldset
				aria-label="Documentation theme"
				className="flex items-center gap-0.5 rounded-full border border-fd-border bg-fd-background p-0.5"
			>
				{themeOptions.map((option) => (
					<ThemeOption
						key={option.value}
						option={option}
						selectedTheme={theme}
						setTheme={setTheme}
					/>
				))}
			</fieldset>
		</div>
	);
}
