import { Avatar } from "@blobz/react";
import { buttonVariants } from "@blobz/ui/components/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { GitHubLink } from "./github-link";
import styles from "./header.module.css";
import { HeaderMobileMenu } from "./header-mobile-menu";
import UserMenu from "./user-menu";

const NAV_ITEMS = [
	{ href: "/docs", label: "Docs" },
	{ href: "/create", label: "Playground" },
] as const;

export default function Header() {
	return (
		<header className={styles.header} data-site-header="">
			<div className={`site-container ${styles.inner}`}>
				<Link aria-label="Blobz home" className={styles.brand} href="/">
					<Avatar
						alt=""
						frame="circle"
						name="blobz"
						palette={["#eaf8ff", "#38bdf8"]}
						size={32}
					/>
					<span className={styles.wordmark}>blobz</span>
				</Link>

				<nav aria-label="Primary navigation" className={styles.navigation}>
					{NAV_ITEMS.map(({ href, label }) => (
						<Link
							className={styles.navLink}
							href={{ pathname: href }}
							key={href}
						>
							{label}
						</Link>
					))}
				</nav>
				<div className={styles.actions}>
					<GitHubLink />
					<UserMenu />
					<Link
						className={buttonVariants({ className: styles.headerAction })}
						href="/#install"
					>
						Add to your app
						<ArrowRight aria-hidden="true" data-icon="inline-end" />
					</Link>
					<HeaderMobileMenu />
				</div>
			</div>
		</header>
	);
}
