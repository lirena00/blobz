import type { SVGProps } from "react";

import { GITHUB_REPOSITORY_URL } from "@/lib/site";

import styles from "./header.module.css";

const GITHUB_REPOSITORY_API = "https://api.github.com/repos/lirena00/blobz";

export function MdiGithub(props: SVGProps<SVGSVGElement>) {
	return (
		<svg
			height="1em"
			viewBox="0 0 24 24"
			width="1em"
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			<title>GitHub</title>
			{/* Material Design Icons by Pictogrammers, Templarian/MaterialDesign license. */}
			<path
				d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5c.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34c-.46-1.16-1.11-1.47-1.11-1.47c-.91-.62.07-.6.07-.6c1 .07 1.53 1.03 1.53 1.03c.87 1.52 2.34 1.07 2.91.83c.09-.65.35-1.09.63-1.34c-2.22-.25-4.55-1.11-4.55-4.92c0-1.11.38-2 1.03-2.71c-.1-.25-.45-1.29.1-2.64c0 0 .84-.27 2.75 1.02c.79-.22 1.65-.33 2.5-.33s1.71.11 2.5.33c1.91-1.29 2.75-1.02 2.75-1.02c.55 1.35.2 2.39.1 2.64c.65.71 1.03 1.6 1.03 2.71c0 3.82-2.34 4.66-4.57 4.91c.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2"
				fill="currentColor"
			/>
		</svg>
	);
}

const getStarCount = async (): Promise<number | null> => {
	try {
		const response = await fetch(GITHUB_REPOSITORY_API, {
			headers: { Accept: "application/vnd.github+json" },
			next: { revalidate: 3600 },
		});
		if (!response.ok) {
			return null;
		}

		const repository: unknown = await response.json();
		if (
			typeof repository !== "object" ||
			repository === null ||
			!("stargazers_count" in repository) ||
			typeof repository.stargazers_count !== "number"
		) {
			return null;
		}

		return repository.stargazers_count;
	} catch {
		return null;
	}
};

export async function GitHubStars() {
	const stars = await getStarCount();
	const starLabel = stars === null ? "GitHub stars" : `${stars} GitHub stars`;

	return (
		<a
			aria-label={`View Blobz on GitHub: ${starLabel}`}
			className={`${styles.githubLink} pointer-events-auto inline-flex h-10 items-center gap-2 whitespace-nowrap rounded-full border border-sky-200 bg-sky-50 px-3 font-[720] text-[#0b1830] text-[0.78rem] transition-[background-color,border-color,transform] duration-150 hover:border-sky-300 hover:bg-sky-100 focus-visible:outline-2 focus-visible:outline-sky-600 focus-visible:outline-offset-2 max-[460px]:gap-1.5 max-[460px]:px-2.5`}
			href={GITHUB_REPOSITORY_URL}
			rel="noopener noreferrer"
			target="_blank"
		>
			<MdiGithub aria-hidden="true" className="size-[1.1rem]" />
			<span>
				{stars === null ? "?" : new Intl.NumberFormat("en").format(stars)} stars
			</span>
		</a>
	);
}
