import { Resend } from 'resend';
import { render } from '@react-email/components';
import { createElement } from 'react';
import { PasswordResetEmail } from '@/emails/password-reset';

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = process.env.RESEND_FROM_EMAIL ?? 'onboarding@resend.dev';

export async function sendPasswordResetEmail({
	to,
	userName,
	resetUrl,
}: {
	to: string;
	userName: string;
	resetUrl: string;
}) {
	const html = await render(
		createElement(PasswordResetEmail, { userName, resetUrl }),
	);

	const { data, error } = await resend.emails.send({
		from: `Atals <${FROM}>`,
		to,
		subject: 'Your Atals Password Reset Link',
		html,
	});

	if (error) {
		console.error('Failed to send password reset email:', error);
		return null;
	}
	return data;
}
