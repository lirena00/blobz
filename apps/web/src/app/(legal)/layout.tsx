import { SiteFooter } from "@/components/site-footer";

export default function LegalLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<>
			{children}
			<SiteFooter />
		</>
	);
}
