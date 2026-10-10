import { useEffect, useState } from "react";

const MOBILE_BREAKPOINT_PX = 768;

export function useIsMobile(): boolean {
	const [isMobile, setIsMobile] = useState<boolean | undefined>(undefined);

	useEffect(() => {
		const mediaQuery = window.matchMedia(
			`(max-width: ${MOBILE_BREAKPOINT_PX - 1}px)`
		);
		const updateMobileState = (): void => {
			setIsMobile(window.innerWidth < MOBILE_BREAKPOINT_PX);
		};

		mediaQuery.addEventListener("change", updateMobileState);
		updateMobileState();

		return () => mediaQuery.removeEventListener("change", updateMobileState);
	}, []);

	return Boolean(isMobile);
}
