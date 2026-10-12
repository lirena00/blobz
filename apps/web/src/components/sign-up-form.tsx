// biome-ignore-all lint/performance/noJsxPropsBind: TanStack Form render props bind handlers to the current field instance.
"use client";

import { Button } from "@blobz/ui/components/button";
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@blobz/ui/components/field";
import { Input } from "@blobz/ui/components/input";
import { Spinner } from "@blobz/ui/components/spinner";
import { useForm } from "@tanstack/react-form";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import z from "zod";

import { authClient } from "@/lib/auth-client";

const errorMessage = (error: unknown): string | null => {
	if (typeof error === "string") {
		return error;
	}
	if (
		typeof error === "object" &&
		error !== null &&
		"message" in error &&
		typeof error.message === "string"
	) {
		return error.message;
	}
	return null;
};

export default function SignUpForm({
	onSwitchToSignIn,
}: {
	onSwitchToSignIn: () => void;
}) {
	const router = useRouter();

	const form = useForm({
		defaultValues: {
			email: "",
			name: "",
			password: "",
		},
		onSubmit: async ({ value }) => {
			await authClient.signUp.email(
				{
					email: value.email,
					name: value.name,
					password: value.password,
				},
				{
					onError: (error) => {
						toast.error(error.error.message || error.error.statusText);
					},
					onSuccess: () => {
						const billing = new URLSearchParams(window.location.search).get(
							"billing"
						);
						router.push(
							billing === "monthly"
								? "/dashboard?billing=monthly"
								: "/dashboard"
						);
						toast.success("API account created.");
					},
				}
			);
		},
		validators: {
			onSubmit: z.object({
				email: z.email("Enter a valid email address."),
				name: z.string().min(2, "Name must be at least 2 characters."),
				password: z.string().min(8, "Password must be at least 8 characters."),
			}),
		},
	});

	return (
		<div className="flex flex-col gap-8">
			<div className="flex flex-col gap-3">
				<p className="font-extrabold text-sky-600 text-xs uppercase tracking-[0.16em]">
					Hosted API
				</p>
				<h1 className="text-balance font-[780] font-[family-name:var(--font-bricolage)] text-4xl tracking-[-0.045em] sm:text-5xl">
					Create your API account.
				</h1>
				<p className="max-w-md text-pretty text-muted-foreground leading-7">
					Choose a plan after setup. The React package stays free and never
					requires an account.
				</p>
			</div>

			<form
				className="flex flex-col gap-6"
				onSubmit={async (event) => {
					event.preventDefault();
					event.stopPropagation();
					await form.handleSubmit();
				}}
			>
				<FieldGroup className="gap-5">
					<form.Field name="name">
						{(field) => {
							const message = errorMessage(field.state.meta.errors[0]);
							return (
								<Field data-invalid={Boolean(message)}>
									<FieldLabel htmlFor={field.name}>Name</FieldLabel>
									<Input
										aria-invalid={Boolean(message)}
										autoComplete="name"
										id={field.name}
										name={field.name}
										onBlur={field.handleBlur}
										onChange={(event) => field.handleChange(event.target.value)}
										required
										value={field.state.value}
									/>
									{message ? <FieldError>{message}</FieldError> : null}
								</Field>
							);
						}}
					</form.Field>

					<form.Field name="email">
						{(field) => {
							const message = errorMessage(field.state.meta.errors[0]);
							return (
								<Field data-invalid={Boolean(message)}>
									<FieldLabel htmlFor={field.name}>Email</FieldLabel>
									<Input
										aria-invalid={Boolean(message)}
										autoCapitalize="none"
										autoComplete="email"
										id={field.name}
										name={field.name}
										onBlur={field.handleBlur}
										onChange={(event) => field.handleChange(event.target.value)}
										required
										spellCheck={false}
										type="email"
										value={field.state.value}
									/>
									{message ? <FieldError>{message}</FieldError> : null}
								</Field>
							);
						}}
					</form.Field>

					<form.Field name="password">
						{(field) => {
							const message = errorMessage(field.state.meta.errors[0]);
							return (
								<Field data-invalid={Boolean(message)}>
									<FieldLabel htmlFor={field.name}>Password</FieldLabel>
									<Input
										aria-describedby="password-requirement"
										aria-invalid={Boolean(message)}
										autoComplete="new-password"
										id={field.name}
										name={field.name}
										onBlur={field.handleBlur}
										onChange={(event) => field.handleChange(event.target.value)}
										required
										type="password"
										value={field.state.value}
									/>
									<p
										className="text-muted-foreground text-xs"
										id="password-requirement"
									>
										Use at least 8 characters.
									</p>
									{message ? <FieldError>{message}</FieldError> : null}
								</Field>
							);
						}}
					</form.Field>
				</FieldGroup>

				<form.Subscribe selector={(state) => state.isSubmitting}>
					{(isSubmitting) => (
						<Button disabled={isSubmitting} size="lg" type="submit">
							{isSubmitting ? (
								<Spinner data-icon="inline-start" />
							) : (
								<ArrowRight data-icon="inline-end" />
							)}
							{isSubmitting ? "Creating account…" : "Create API Account"}
						</Button>
					)}
				</form.Subscribe>
			</form>

			<p className="text-center text-muted-foreground text-sm">
				Already have an API account?{" "}
				<Button onClick={onSwitchToSignIn} type="button" variant="link">
					Sign in
				</Button>
			</p>
		</div>
	);
}
