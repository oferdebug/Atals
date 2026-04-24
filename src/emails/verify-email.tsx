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

interface VerifyEmailProps {
	userName: string;
	verifyUrl: string;
}

export function VerifyEmail({ userName, verifyUrl }: VerifyEmailProps) {
	return (
		<Html>
			<Head />
			<Preview>Verify Your Email To Get Started On Atals</Preview>
			<Body style={main}>
				<Container style={container}>
					<Heading style={heading}>Welcome To Atals</Heading>
					<Text style={paragraph}>Hey {userName}!</Text>
					<Text style={paragraph}>
						Confirm your email to start getting curated job matches tailored to
						your profile.
					</Text>
					<Button href={verifyUrl} style={button}>
						Verify Email
					</Button>
					<Text style={paragraph}>
						Or Copy And Paste This URL Into Your Browser:
					</Text>
					<Link href={verifyUrl} style={link}>
						{verifyUrl}
					</Link>
					<hr style={hr} />
					<Text style={footer}>
						If you didn&apos;t create an Atals account, you can safely ignore
						this email.
					</Text>

					<Text style={footer}>— The Atals team</Text>
				</Container>
			</Body>
		</Html>
	);
}
export default VerifyEmail;

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
