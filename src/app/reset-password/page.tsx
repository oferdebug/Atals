import { Suspense } from 'react';
import { ResetPasswordForm } from '@/components/reset-password-form';

export default function ResetPasswordPage() {
	return (
		<div className="flex min-h-svh flex-col items-center justify-center p-8">
			<div className="w-full max-w-md">
				<Suspense fallback={<p className="opacity-60">Loading...</p>}>
					<ResetPasswordForm />
				</Suspense>
			</div>
		</div>
	);
}
