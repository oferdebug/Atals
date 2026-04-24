'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
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

const editorialInputClass =
	'h-12 border-0 border-b border-white/30 rounded-none bg-transparent px-0 text-base placeholder:text-white/30 focus-visible:border-white focus-visible:ring-0';

export function ResetPasswordForm() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const token = searchParams.get('token');
	const urlError = searchParams.get('error');

	const [isPending, setIsPending] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState(false);

	if (urlError === 'INVALID_TOKEN' || !token) {
		return (
			<div className="w-full space-y-6">
				<div className="space-y-3">
					<p className="font-label text-xs tracking-[0.22em] uppercase opacity-60">
						Link expired
					</p>
					<h1 className="font-display text-5xl italic leading-[0.95]">
						Try <em className="not-italic font-sans font-black">again.</em>
					</h1>
				</div>
				<p className="text-sm opacity-80">
					This reset link is invalid or has expired. Links expire after 1 hour
					for your security.
				</p>
				<Link
					href="/forgot-password"
					className="inline-block text-sm underline underline-offset-4"
				>
					Request a new link
				</Link>
			</div>
		);
	}

	if (success) {
		return (
			<div className="w-full space-y-6">
				<div className="space-y-3">
					<p className="font-label text-xs tracking-[0.22em] uppercase opacity-60">
						All set
					</p>
					<h1 className="font-display text-5xl italic leading-[0.95]">
						Password{' '}
						<em className="not-italic font-sans font-black">updated.</em>
					</h1>
				</div>
				<p className="text-sm opacity-80">
					Your password has been reset. Redirecting to sign in...
				</p>
			</div>
		);
	}

	async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setError(null);

		const formData = new FormData(e.currentTarget);
		const newPassword = formData.get('new-password') as string;
		const confirmPassword = formData.get('confirm-password') as string;

		if (newPassword !== confirmPassword) {
			setError('Passwords do not match');
			return;
		}

		setIsPending(true);

		await authClient.resetPassword(
			{
				newPassword,
				token: token!,
			},
			{
				onSuccess: () => {
					setSuccess(true);
					setTimeout(() => router.push('/login'), 2000);
				},
				onError: (ctx) => {
					setError(ctx.error.message);
					setIsPending(false);
				},
			},
		);
	}

	return (
		<div className="w-full space-y-10">
			<div className="space-y-3">
				<p className="font-label text-xs tracking-[0.22em] uppercase opacity-60">
					Reset
				</p>
				<h1 className="font-display text-5xl italic leading-[0.95]">
					New <em className="not-italic font-sans font-black">password.</em>
				</h1>
				<p className="text-sm opacity-80 pt-2">
					Choose a strong password with at least 8 characters.
				</p>
			</div>

			<form onSubmit={onSubmit}>
				<FieldGroup>
					<Field>
						<FieldLabel htmlFor="new-password">New Password</FieldLabel>
						<Input
							id="new-password"
							name="new-password"
							type="password"
							autoComplete="new-password"
							minLength={8}
							required
							className={editorialInputClass}
						/>
					</Field>
					<Field>
						<FieldLabel htmlFor="confirm-password">Confirm Password</FieldLabel>
						<Input
							id="confirm-password"
							name="confirm-password"
							type="password"
							autoComplete="new-password"
							required
							className={editorialInputClass}
						/>
					</Field>
					{error && <FieldError errors={[{ message: error }]} />}
					<Field>
						<Button
							type="submit"
							disabled={isPending}
							className="bg-white text-primary hover:bg-white/90"
						>
							{isPending ? 'Updating...' : 'Update password'}
						</Button>
					</Field>
					<FieldDescription className="px-6 text-center">
						<Link href="/login" className="underline underline-offset-4">
							Back to sign in
						</Link>
					</FieldDescription>
				</FieldGroup>
			</form>
		</div>
	);
}
