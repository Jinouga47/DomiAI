import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: Number(process.env.EMAIL_SERVER_PORT),
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
});

export async function sendVerificationEmail(email: string, token: string) {
  const verificationUrl = `${process.env.NEXTAUTH_URL}/api/auth/verify-email?token=${token}`;

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Verify your email address',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #4F46E5;">Welcome to Domi AI</h1>
          <p>Thank you for registering. Please verify your email address by clicking the button below:</p>
          <a 
            href="${verificationUrl}" 
            style="
              display: inline-block;
              background-color: #4F46E5;
              color: white;
              padding: 12px 24px;
              text-decoration: none;
              border-radius: 4px;
              margin: 16px 0;
            "
          >
            Verify Email
          </a>
          <p style="color: #666;">If the button doesn't work, you can copy and paste this link into your browser:</p>
          <p style="color: #666; word-break: break-all;">${verificationUrl}</p>
          <p style="color: #666; margin-top: 24px;">This link will expire in 24 hours.</p>
        </div>
      `,
    });
    console.log('Verification email sent successfully to:', email);
  } catch (error) {
    console.error('Failed to send verification email:', error);
    throw error;
  }
} 