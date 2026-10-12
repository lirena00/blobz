import { Avatar } from "@blobz/react";
import { ArrowUpRight, Code2, Component, Globe2 } from "lucide-react";
import Link from "next/link";

const CARD_CLASS =
	"flex min-h-[20rem] flex-col rounded-[1.6rem] border border-white/12 bg-white/[0.055] p-7 shadow-[0_20px_60px_rgb(0_0_0_/_10%)] max-[640px]:min-h-0 max-[640px]:p-6";
const LINK_CLASS =
	"mt-auto inline-flex w-fit items-center gap-2 rounded-lg pt-7 font-bold text-[#9cddff] text-sm underline-offset-4 hover:text-white hover:underline focus-visible:outline-2 focus-visible:outline-sky-300 focus-visible:outline-offset-4";

export function WaysToUse() {
	return (
		<section
			aria-labelledby="docs-title"
			className="scroll-mt-20 bg-[#071426] px-6 py-28 text-white max-[640px]:px-4 max-[640px]:py-20"
			id="docs"
		>
			<div className="mx-auto max-w-[78rem]">
				<div className="max-w-[52rem]">
					<p className="mb-4 font-[850] text-[#7dd3fc] text-[0.72rem] uppercase tracking-[0.17em]">
						Ways to use Blobz
					</p>
					<h2
						className="font-[780] font-[family-name:var(--font-bricolage)] text-[clamp(3rem,6vw,6rem)] leading-[0.93] tracking-[-0.055em] max-[640px]:text-[3.2rem]"
						id="docs-title"
					>
						One identity. Three ways to ship it.
					</h2>
					<p className="mt-6 max-w-[38rem] text-[#9fb4ca] text-[1.05rem] leading-7">
						Use the same stable seed with a React component, a ready-made
						interface, or a hosted image URL.
					</p>
				</div>

				<div className="mt-12 grid gap-4 min-[821px]:grid-cols-3">
					<article className={CARD_CLASS}>
						<span className="grid size-12 place-items-center rounded-2xl bg-sky-400/15 text-[#7dd3fc]">
							<Code2 aria-hidden="true" className="size-6" />
						</span>
						<h3 className="mt-7 font-[760] font-[family-name:var(--font-bricolage)] text-2xl tracking-[-0.035em]">
							React package
						</h3>
						<p className="mt-2 text-[#9fb4ca] text-sm leading-6">
							Render SVG avatars directly in your app. Free and unlimited.
						</p>
						<code className="mt-6 block overflow-x-auto rounded-xl border border-white/10 bg-[#06101e] px-4 py-3 text-[#b9e8ff] text-xs">
							&lt;Avatar name=&#123;user.id&#125; /&gt;
						</code>
						<Link className={LINK_CLASS} href="/docs/react">
							Read React docs{" "}
							<ArrowUpRight aria-hidden="true" className="size-4" />
						</Link>
					</article>

					<article className={CARD_CLASS}>
						<span className="grid size-12 place-items-center rounded-2xl bg-violet-400/15 text-violet-200">
							<Component aria-hidden="true" className="size-6" />
						</span>
						<h3 className="mt-7 font-[760] font-[family-name:var(--font-bricolage)] text-2xl tracking-[-0.035em]">
							shadcn components
						</h3>
						<p className="mt-2 text-[#9fb4ca] text-sm leading-6">
							Install ready-to-use profile, account, and group UI into your
							project.
						</p>
						<div
							aria-hidden="true"
							className="mt-6 flex items-center gap-3 rounded-xl border border-white/10 bg-[#06101e] p-2.5"
						>
							<Avatar
								alt=""
								className="rounded-xl"
								name="Alex"
								palette={["#e8f7ff", "#38bdf8"]}
								size={40}
							/>
							<span className="text-sm">Alex</span>
							<span className="ml-auto rounded-full bg-emerald-400/15 px-2 py-1 text-[0.65rem] text-emerald-200">
								Online
							</span>
						</div>
						<Link className={LINK_CLASS} href="/docs/components">
							Explore components{" "}
							<ArrowUpRight aria-hidden="true" className="size-4" />
						</Link>
					</article>

					<article className={CARD_CLASS}>
						<span className="grid size-12 place-items-center rounded-2xl bg-emerald-400/15 text-emerald-200">
							<Globe2 aria-hidden="true" className="size-6" />
						</span>
						<h3 className="mt-7 font-[760] font-[family-name:var(--font-bricolage)] text-2xl tracking-[-0.035em]">
							Hosted API
						</h3>
						<p className="mt-2 text-[#9fb4ca] text-sm leading-6">
							Get the avatar as an image URL for any stack. Paid plans start
							when you need volume.
						</p>
						<div
							aria-hidden="true"
							className="mt-6 flex items-center gap-2 rounded-xl border border-white/10 bg-[#06101e] px-4 py-3 font-mono text-[#b9e8ff] text-xs"
						>
							<span className="rounded bg-emerald-400/15 px-1.5 py-1 text-emerald-200">
								GET
							</span>
							<span>avatar.svg</span>
							<ArrowUpRight className="ml-auto size-4" />
						</div>
						<Link className={LINK_CLASS} href="/docs/api">
							Read API docs{" "}
							<ArrowUpRight aria-hidden="true" className="size-4" />
						</Link>
					</article>
				</div>
			</div>
		</section>
	);
}
