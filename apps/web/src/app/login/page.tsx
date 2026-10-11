"use client";

import { Avatar } from "@blobz/react";
import { ArrowUpRight, Check, Code2, Globe2 } from "lucide-react";
import Link from "next/link";
import { useCallback, useState } from "react";

import SignInForm from "@/components/sign-in-form";
import SignUpForm from "@/components/sign-up-form";

const BENEFITS = [
	{
		copy: "A ready-to-embed image URL for any stable seed.",
		icon: Globe2,
	},
	{
		copy: "Approved origins, monthly usage, and billing in one place.",
		icon: Check,
	},
] as const;

const AUTH_AVATARS = [
	["api-lumi", ["#e8f7ff", "#38bdf8"]],
	["api-mango", ["#fff7ed", "#fb923c"]],
	["api-plum", ["#faf5ff", "#c084fc"]],
] as const;

export default function LoginPage() {
	const [showSignIn, setShowSignIn] = useState(true);
	const showSignInForm = useCallback(() => setShowSignIn(true), []);
	const showSignUpForm = useCallback(() => setShowSignIn(false), []);

	return (
		<main className="relative min-h-svh overflow-hidden bg-[#f4fbff] px-4 pt-28 pb-12 text-[#0b1830] sm:px-6 sm:pt-32">
			<div
				aria-hidden="true"
				className="absolute -top-64 -right-64 size-[44rem] rounded-full bg-[radial-gradient(circle,rgb(56_189_248_/_20%),transparent_67%)]"
			/>
			<div
				aria-hidden="true"
				className="absolute -bottom-72 -left-72 size-[46rem] rounded-full bg-[radial-gradient(circle,rgb(192_132_252_/_16%),transparent_67%)]"
			/>

			<section className="relative mx-auto grid w-full max-w-[70rem] overflow-hidden rounded-[2rem] border border-white/90 bg-white shadow-[0_35px_100px_rgb(14_116_144_/_14%)] lg:min-h-[42rem] lg:grid-cols-[0.92fr_1.08fr]">
				<div className="relative isolate hidden overflow-hidden bg-[#071426] p-10 text-white lg:flex lg:flex-col lg:justify-between xl:p-12">
					<div
						aria-hidden="true"
						className="absolute -top-40 -left-36 -z-1 size-[32rem] rounded-full bg-[radial-gradient(circle,rgb(14_165_233_/_28%),transparent_65%)]"
					/>
					<div className="flex flex-col gap-7">
						<div className="flex items-center gap-2 font-extrabold text-[#9cddff] text-xs uppercase tracking-[0.16em]">
							<Globe2 aria-hidden="true" className="size-4" />
							Hosted API
						</div>
						<p className="text-balance font-[780] font-[family-name:var(--font-bricolage)] text-5xl leading-[0.96] tracking-[-0.055em] xl:text-6xl">
							Avatars from a URL, without storing a file.
						</p>
						<p className="max-w-md text-pretty text-[#9fb4ca] text-base leading-7">
							The account is only for the paid hosted API. Creating avatars and
							using the React package remain free.
						</p>
						<ul className="flex flex-col gap-4">
							{BENEFITS.map(({ copy, icon: Icon }) => (
								<li
									className="flex items-start gap-3 text-[#d9effb] text-sm"
									key={copy}
								>
									<span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-full bg-white/8 text-[#7dd3fc]">
										<Icon aria-hidden="true" className="size-4" />
									</span>
									<span className="pt-1.5 leading-6">{copy}</span>
								</li>
							))}
						</ul>
					</div>

					<div className="flex items-end justify-between gap-6">
						<div aria-hidden="true" className="flex -space-x-3">
							{AUTH_AVATARS.map(([name, palette]) => (
								<Avatar
									alt=""
									className="rounded-2xl border-2 border-[#071426] bg-white p-0.5"
									key={name}
									name={name}
									palette={palette}
									size={58}
								/>
							))}
						</div>
						<Link
							className="inline-flex items-center gap-2 rounded-full px-3 py-2 font-bold text-[#9cddff] text-sm transition-colors duration-150 hover:bg-white/8 hover:text-white focus-visible:outline-2 focus-visible:outline-sky-300 focus-visible:outline-offset-2"
							href="/create"
						>
							Try it free
							<ArrowUpRight aria-hidden="true" className="size-4" />
						</Link>
					</div>
				</div>

				<div className="flex flex-col justify-center p-7 sm:p-10 lg:p-12 xl:p-16">
					<div className="mb-8 flex items-center justify-between gap-4 border-[#d8eef9] border-b pb-5 lg:hidden">
						<div className="flex items-center gap-2 font-extrabold text-sky-700 text-xs uppercase tracking-[0.14em]">
							<Code2 aria-hidden="true" className="size-4" />
							React stays free
						</div>
						<Link
							className="rounded-full font-bold text-sky-700 text-sm underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-sky-600 focus-visible:outline-offset-2"
							href="/create"
						>
							Try it live
						</Link>
					</div>
					{showSignIn ? (
						<SignInForm onSwitchToSignUp={showSignUpForm} />
					) : (
						<SignUpForm onSwitchToSignIn={showSignInForm} />
					)}
				</div>
			</section>
		</main>
	);
}
