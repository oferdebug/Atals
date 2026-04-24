/** biome-ignore-all assist/source/organizeImports: <explanation> */
import {
	Body,
	Button,
	Container,
	Head,
	Heading,
	Hr,
	Html,
	Link,
	Preview,
	Text,
} from '@react-email/components';

interface PasswordResetEmailProps {
	userName: string;
	resetUrl: string;
}
export function PasswordResetEmail({
	userName,
	resetUrl,
}: PasswordResetEmailProps) {
	return (
		<div>
			<Html>
				<Head />
				<Preview>Reset Your Atals Account Password</Preview>
				<Body style={main}>
					<Container>
						<Heading style={heading}>Reset Your Password</Heading>

						<Text style={paragraph}>Hello, {userName}! ,</Text>

						<Text style={paragraph}>
							Someone (hopefully You) Requested A Password Reset for your Atals
							Account,If This Wasn't You,Please Ignore This Email,If That Was
							You,Click The Button Below To Set You'r New Password.
						</Text>

						<Button href={resetUrl} style={button}>
							Reset Your Password
						</Button>

						<Text style={paragraph}>
							Or Copy And Paste The Link Below Into Your Browser:
						</Text>

						<Link href={resetUrl} style={link}>
							{resetUrl}
						</Link>

						<Hr style={hr} />

						<Text style={footer}>
							This link will expire in 1 hour. If you didn&apos;t request this,
							you can safely ignore this email — your password will stay the
							same.
						</Text>

						<Text style={paragraph}>
							If you need any help, feel free to contact us at{' '}
							<Link href="mailto:support@atals.com" style={link}>
								support@atals.com
							</Link>
						</Text>
						<Text style={footer}>— The Atals Team</Text>
					</Container>
				</Body>
			</Html>
		</div>
	);
}

export default PasswordResetEmail;

const main = {
	backgroundColor: '#ffffff',
	fontFamily:
		'-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
};

const container = {
	margin: '0 auto',
	padding: '40px 24px',
	maxWidth: '560px',
};

const heading = {
	fontSize: '24px',
	fontWeight: '600',
	color: '#00236f',
	margin: '0 0 24px',
};

const paragraph = {
	fontSize: '15px',
	lineHeight: '24px',
	color: '#333',
	margin: '0 0 16px',
};

const button = {
	backgroundColor: '#00236f',
	color: '#ffffff',
	padding: '12px 24px',
	fontSize: '14px',
	fontWeight: '500',
	textDecoration: 'none',
	display: 'inline-block',
	margin: '16px 0',
};

const link = {
	color: '#00236f',
	fontSize: '13px',
	wordBreak: 'break-all' as const,
};

const hr = {
	borderColor: '#e6e6e6',
	margin: '32px 0',
};

const footer = {
	fontSize: '13px',
	color: '#888',
	lineHeight: '20px',
	margin: '0 0 8px',
};
