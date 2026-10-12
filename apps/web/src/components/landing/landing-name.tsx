"use client";

import { createContext, type ReactNode, useContext, useState } from "react";

interface LandingNameContextValue {
	readonly name: string;
	readonly setName: (name: string) => void;
}

const LandingNameContext = createContext<LandingNameContextValue | null>(null);
export const DEFAULT_HOME_NAME = "Saksham";

export function LandingNameProvider({
	children,
}: {
	readonly children: ReactNode;
}) {
	const [name, setName] = useState("");

	return (
		<LandingNameContext value={{ name, setName }}>
			{children}
		</LandingNameContext>
	);
}

export function useLandingName(): LandingNameContextValue {
	const context = useContext(LandingNameContext);
	if (!context) {
		throw new Error("Landing name must be used inside LandingNameProvider.");
	}

	return context;
}
