"use client";

import { Highlight, type Language, themes } from "prism-react-renderer";

interface HighlightedCodeProps {
	readonly code: string;
	readonly label: string;
	readonly language: Language;
}

export function HighlightedCode({
	code,
	label,
	language,
}: HighlightedCodeProps) {
	return (
		<Highlight code={code} language={language} theme={themes.nightOwl}>
			{({ className, getLineProps, getTokenProps, style, tokens }) => (
				<section aria-label={label}>
					<pre
						className={`${className} max-h-[34rem] overflow-auto p-4 font-mono text-xs leading-6 sm:p-5`}
						style={style}
						translate="no"
					>
						<code>
							{tokens.map((line, lineIndex) => (
								<span
									// biome-ignore lint/suspicious/noArrayIndexKey: Highlighted source lines are immutable ordered output without stable semantic IDs.
									key={lineIndex}
									{...getLineProps({ className: "block min-w-max", line })}
								>
									<span
										aria-hidden="true"
										className="mr-5 inline-block w-6 select-none text-right text-slate-500"
									>
										{lineIndex + 1}
									</span>
									{line.map((token, tokenIndex) => (
										<span
											// biome-ignore lint/suspicious/noArrayIndexKey: Prism tokens preserve source order and do not expose stable IDs.
											key={tokenIndex}
											{...getTokenProps({ token })}
										/>
									))}
								</span>
							))}
						</code>
					</pre>
				</section>
			)}
		</Highlight>
	);
}
