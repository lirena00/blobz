import { Avatar } from "@blobz/react";
import { ArrowUpRight } from "lucide-react";

import { SPONSOR_URL } from "@/lib/site";

import styles from "./sponsor-card.module.css";

interface SponsorCardProps {
	readonly compact?: boolean;
}

export function SponsorCard({ compact = false }: SponsorCardProps) {
	return (
		<a
			className={compact ? `${styles.card} ${styles.compact}` : styles.card}
			href={SPONSOR_URL}
			rel="noopener noreferrer"
			target="_blank"
		>
			<span className={styles.header}>
				<span>Sponsors</span>
				<ArrowUpRight aria-hidden="true" className={styles.arrow} />
			</span>
			<span className={styles.invite}>
				<span className={styles.avatar}>
					<Avatar
						alt=""
						name="future-blobz-sponsor"
						palette={["#eaf8ff", "#38bdf8"]}
						size={38}
					/>
				</span>
				<span>You can be here, with a Blobz beside your name.</span>
			</span>
		</a>
	);
}
