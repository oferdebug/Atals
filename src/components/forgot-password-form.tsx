'use client';
import { useState } from 'react';
import Link from 'next/link';
import { authClient } from '@/lib/auth/client';
import { Button } from '@/components/ui/button';
import {
	Field,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';

const editorinLInputClass =
	'h-12 border-0 border-b border-white/30 rounded-none bg-transparent px-0 text-base placeholder:text-white/30 focus-visible:border-white focus-visible:ring-0';

export function ForgotPasswordForm() {
	const [isPending, setIsPending] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [sent, setSent] = useState(false);

	async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setError(null);
		setIsPending(true);

		const formData = new FormData(e.currentTarget);
		const email = formData.get('email') as string;

		await authClient.requestPasswordReset(
			{
				email,
				redirectTo: `${window.location.origin}/reset-password`,
			},
			{
				onSuccess: () => {
					setSent(true);
					setIsPending(false);
				},
				onError: (ctx) => {
					setError(ctx.error.message);
					setIsPending(false);
				},
			},
		);
	}
	if (sent) {
		return (
			<div className={'w-full space-y-6'}>
				<div className={'space-y-3'}>
					<p
						className={
							'font-label text-ss tracking-[0.2em] uppercase opacity-60'
						}
					>
						Check Your Email For A Reset Link
					</p>
					<h1 className={'font-display text-6xl italic leading-[1.05em]'}>
						Email <em className={'not-italic font-sans font-black'}>Sent!</em>
					</h1>
				</div>
				<p className={'text-sm opacity-80'}>
					If an account exists with that email, you&apos;ll receive a link to
					reset your password. The link will expire in 1 hour.
				</p>
				<Link
					href={'/login'}
					className={'inline-block text-sm underline underline-offset-4'}
				>
					Back To Login
				</Link>
			</div>
		);
	}
	return (
		<div className={'w-full space-y-10'}>
			<div className={'space-y-4'}>
				<p
					className={'font-label text-xs tracking-[1.0em] uppercase opacity-75'}
				>
					Forgot Your Password?
				</p>
				<h1 className={'font-display text-6xl italic leading-[1.05em]'}>
					Reset your{' '}
					<em className={'not-italic font-sans font-black'}>password.</em>
				</h1>
				<p className={'text-sm opacity-80 pt-2'}>
					Enter your email and we&apos;ll send you a link to set a new password.
				</p>
			</div>
			<form onSubmit={onSubmit}>
				<FieldGroup>
					<Field>
						<FieldLabel htmlFor="email">Email</FieldLabel>
						<Input
							id="email"
							name="email"
							type="email"
							placeholder="[email Protected]"
							autoComplete="email"
							required
						/>
					</Field>
					{error && <FieldError errors={[{ message: error }]} />}
					<Field>
						<Button
							type="submit"
							disabled={isPending}
							className={'bg-white text-primary hover:bg-white/90'}
						>
							{isPending ? 'Sending Reset Link...' : 'Send Reset Link'}
						</Button>
					</Field>
					<FieldDescription className={'px-6 text-center'}>
						Did You Rembmember Your Password?{' '}
						<Link href={'/login'} className={'underline underline-offset-4'}>
							Login
						</Link>
					</FieldDescription>
				</FieldGroup>
			</form>
		</div>
	);
}
