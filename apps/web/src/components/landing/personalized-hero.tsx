import { buttonVariants } from "@blobz/ui/components/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

import styles from "@/app/personalized-hero.module.css";
import { HeroAvatarDemo } from "./hero-avatar-demo";

export function PersonalizedHero() {
	return (
		<section aria-labelledby="hero-title" className={styles.hero}>
			<div className={`site-container ${styles.inner}`}>
				<div className={styles.copy}>
					<p className={styles.eyebrow}>Open-source SVG avatars</p>
					<h1 className={styles.title} id="hero-title">
						Expressive default avatars <span>for React and shadcn apps.</span>
					</h1>
					<p className={styles.description}>
						Generate SVG avatars from user IDs, customize your brand colors, and
						ship with React components, shadcn blocks, or a hosted API.
					</p>
					<div className={styles.actions}>
						<Link
							className={buttonVariants({
								className: styles.primaryLink,
								size: "lg",
							})}
							href="#install"
						>
							Add to your app
							<ArrowRight aria-hidden="true" data-icon="inline-end" />
						</Link>
						<Link className={styles.secondaryLink} href="/create">
							Try the playground
							<ArrowRight aria-hidden="true" />
						</Link>
					</div>
					<ul aria-label="Blobz features" className={styles.features}>
						<li>MIT licensed</li>
						<li>Custom brand colors</li>
						<li>Free React &amp; shadcn toolkit</li>
					</ul>
				</div>
				<HeroAvatarDemo />
			</div>
		</section>
	);
}
