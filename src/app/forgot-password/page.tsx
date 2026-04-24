import { ForgotPasswordForm } from '@/components/forgot-password-form';
export default function ForgotPasswordPage() {
	return (
		<div className={'flex min-h-svh flex-col items-center justify-center p-8'}>
			<div className={'w-full max-w-md'}>
				<ForgotPasswordForm />
			</div>
		</div>
	);
}
