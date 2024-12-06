'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function VerificationPendingPage() {
  const [isResending, setIsResending] = useState(false);
  const [resendStatus, setResendStatus] = useState<{
    success?: string;
    error?: string;
  }>({});

  const handleResendEmail = async () => {
    setIsResending(true);
    setResendStatus({});

    try {
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: localStorage.getItem('pendingEmail') }),
      });

      if (response.ok) {
        setResendStatus({ 
          success: 'Verification email has been resent. Please check your inbox.' 
        });
      } else {
        const data = await response.json();
        throw new Error(data.message || 'Failed to resend verification email');
      }
    } catch (error) {
      setResendStatus({ 
        error: error instanceof Error ? error.message : 'Failed to resend verification email' 
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1 className="auth-title">Verify Your Email</h1>
        
        <div className="verification-content">
          <div className="verification-icon">
            ✉️
          </div>
          
          <p className="verification-message">
            We've sent you a verification email. Please check your inbox and click the verification link to activate your account.
          </p>

          {resendStatus.success && (
            <div className="auth-error auth-error-success">
              {resendStatus.success}
            </div>
          )}

          {resendStatus.error && (
            <div className="auth-error auth-error-failure">
              {resendStatus.error}
            </div>
          )}

          <div className="verification-actions">
            <button
              onClick={handleResendEmail}
              disabled={isResending}
              className="auth-button"
            >
              {isResending ? 'Resending...' : 'Resend Verification Email'}
            </button>

            <Link href="/" className="auth-switch">
              Return to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 