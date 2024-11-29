'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [isLogin, setIsLogin] = useState(true);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    if (isLogin) {
      try {
        const response = await signIn('credentials', {
          email: formData.get('email'),
          password: formData.get('password'),
          redirect: false,
        });

        if (response?.error) {
          setError('Invalid credentials');
        } else {
          // console.log(`User ${formData.get('email')} successfully logged in`);
          // console.info(`Login successful - Email: ${formData.get('email')}, Time: ${new Date().toISOString()}`);
          router.push('/dashboard');
        }
      } catch (error) {
        setError('An error occurred during login');
      }
    } else {
      // Updated Registration logic
      try {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: formData.get('name'),
            email: formData.get('email'),
            password: formData.get('password'),
            // Add property data
            property: {
              address: formData.get('address'),
              city: formData.get('city'),
              state: formData.get('state'),
              zipCode: formData.get('zipCode'),
              country: formData.get('country'),
            }
          }),
        });

        if (res.ok) {
          // Switch to login after successful registration
          setIsLogin(true);
          setError('Registration successful! Please login.');
        } else {
          const data = await res.json();
          setError(data.message || 'Registration failed');
        }
      } catch (error) {
        setError('Something went wrong');
      }
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2 className="auth-title">
          {isLogin ? 'Sign in to your account' : 'Create an account'}
        </h2>
        
        {error && (
          <p className={`auth-error ${error.includes('successful') ? 'auth-error-success' : 'auth-error-failure'}`}>
            {error}
          </p>
        )}
        
        <form className="auth-form" onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <div>
                <input
                  name="name"
                  type="text"
                  required
                  className="auth-input"
                  placeholder="Full name"
                />
              </div>
              <div>
                <input
                  name="dateOfBirth"
                  type="date"
                  required
                  className="auth-input"
                />
              </div>
            </>
          )}
          <div>
            <input
              name="email"
              type="email"
              required
              className="auth-input"
              placeholder="Email address"
            />
          </div>
          <div>
            <input
              name="password"
              type="password"
              required
              className="auth-input"
              placeholder="Password"
            />
          </div>

          <button type="submit" className="auth-button">
            {isLogin ? 'Sign in' : 'Register'}
          </button>
          
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
            }}
            className="auth-switch"
          >
            {isLogin ? "Don't have an account? Register" : 'Already have an account? Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}