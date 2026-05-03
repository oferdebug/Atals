import nodemailer from 'nodemailer';
import { render } from '@react-email/components';
import { createElement } from 'react';
import { PasswordResetEmail } from '@/emails/password-reset';
import { VerifyEmail } from '@/emails/verify-email';

const transporter = nodemailer.createTransport({
	host: process.env.MAILTRAP_HOST,
	port: Number(process.env.MAILTRAP_PORT),
	auth: {
		user: process.env.MAILTRAP_USER,
		pass: process.env.MAILTRAP_PASS,
	},
});

const FROM = process.env.MAILTRAP_FROM_EMAIL ?? 'noreply@atals.dev';

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

	try {
		const info = await transporter.sendMail({
			from: `Atals <${FROM}>`,
			to,
			subject: 'Reset your Atals password',
			html,
		});
		return info;
	} catch (error) {
		console.error('Failed to send password reset email:', error);
		return null;
	}
}

export async function sendVerificationEmail({
	to,
	userName,
	verifyUrl,
}: {
	to: string;
	userName: string;
	verifyUrl: string;
}) {
	const html = await render(
		createElement(VerifyEmail, { userName, verifyUrl }),
	);

	try {
		const info = await transporter.sendMail({
			from: `Atals <${FROM}>`,
			to,
			subject: 'Verify your Atals email',
			html,
		});
		return info;
	} catch (error) {
		console.error('Failed to send verification email:', error);
		return null;
	}
}
