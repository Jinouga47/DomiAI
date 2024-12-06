import Link from "next/link";

export default function VerifiedPage() {
  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1 className="auth-title">Email Verified!</h1>
        <p className="text-center mb-6">
          Your email has been successfully verified. You can now log in to your account.
        </p>
        <Link href="/" className="auth-button">
          Go to Login
        </Link>
      </div>
    </div>
  );
} 