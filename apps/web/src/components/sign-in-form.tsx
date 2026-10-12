"use client";

import { Button } from "@blobz/ui/components/button";
import { Spinner } from "@blobz/ui/components/spinner";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";

export default function SignInForm({
	callbackURL,
	errorCallbackURL,
	hasAuthError,
}: {
	callbackURL: string;
	errorCallbackURL: string;
	hasAuthError: boolean;
}) {
	const [isSubmitting, setIsSubmitting] = useState(false);

	const signInWithGoogle = async () => {
		setIsSubmitting(true);
		try {
			const { error } = await authClient.signIn.social({
				callbackURL,
				errorCallbackURL,
				provider: "google",
			});
			if (error) {
				toast.error(error.message ?? "Could not sign in with Google.");
			}
		} catch {
			toast.error("Could not sign in with Google. Please try again.");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="flex flex-col gap-8">
			<div className="flex flex-col gap-3">
				<p className="font-extrabold text-sky-600 text-xs uppercase tracking-[0.16em]">
					API account
				</p>
				<h1 className="text-balance font-[780] font-[family-name:var(--font-bricolage)] text-4xl tracking-[-0.045em] sm:text-5xl">
					Your API account starts here.
				</h1>
				<p className="max-w-md text-pretty text-muted-foreground leading-7">
					Continue with Google to create an account or manage your hosted image
					endpoint, approved origins, billing, and monthly usage.
				</p>
			</div>

			{hasAuthError ? (
				<p
					className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-destructive text-sm"
					role="alert"
				>
					Google sign-in did not finish. Please try again.
				</p>
			) : null}

			<Button
				disabled={isSubmitting}
				onClick={signInWithGoogle}
				size="lg"
				type="button"
			>
				{isSubmitting ? (
					<Spinner data-icon="inline-start" />
				) : (
					<ArrowRight data-icon="inline-end" />
				)}
				{isSubmitting ? "Connecting to Google…" : "Continue with Google"}
			</Button>
			<p className="text-center text-muted-foreground text-sm">
				The React package stays free and does not require an account.
			</p>
		</div>
	);
}
