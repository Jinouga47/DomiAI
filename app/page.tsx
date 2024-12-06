'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

type UserRole = 'TENANT' | 'LANDLORD';

interface RegistrationFields {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: UserRole;
  // Landlord specific fields
  utrNumber?: string;
  // Tenant specific fields
  dateOfBirth?: string;
  nationalInsuranceNo?: string;
  employmentStatus?: 'EMPLOYED' | 'SELF_EMPLOYED' | 'RETIRED' | 'STUDENT' | 'UNEMPLOYED';
  annualIncome?: number;
  landlordEmail?: string;
}

export default function AuthPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState<UserRole>('LANDLORD');
  const [formData, setFormData] = useState<RegistrationFields>({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    role: 'LANDLORD',
    phone: '',
    utrNumber: '',
    dateOfBirth: '',
    nationalInsuranceNo: '',
    employmentStatus: undefined,
    annualIncome: undefined,
    landlordEmail: ''
  });
  const [landlordExists, setLandlordExists] = useState<boolean | null>(null);
  const [isCheckingLandlord, setIsCheckingLandlord] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'landlordEmail' && value) {
      await verifyLandlord(value);
    }
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRole = e.target.value as UserRole;
    setRole(newRole);
    setFormData(prev => ({
      ...prev,
      role: newRole
    }));
  };

  const verifyLandlord = async (email: string) => {
    setIsCheckingLandlord(true);
    try {
      const res = await fetch(`/api/auth/verify-landlord?email=${encodeURIComponent(email)}`);
      const data = await res.json();
      setLandlordExists(data.exists);
      return data.exists;
    } catch (error) {
      console.error('Error verifying landlord:', error);
      setLandlordExists(false);
      return false;
    } finally {
      setIsCheckingLandlord(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (isLogin) {
      try {
        const response = await signIn('credentials', {
          email: formData.email,
          password: formData.password,
          remember: rememberMe,
          redirect: false,
        });

        if (response?.error) {
          setError('Invalid credentials');
        } else {
          // Fetch user role after successful login
          const userResponse = await fetch('/api/auth/me');
          const userData = await userResponse.json();
          
          // Redirect based on role
          if (userData.role === 'TENANT') {
            router.push('/tenant-dashboard');
          } else if (userData.role === 'LANDLORD') {
            router.push('/dashboard');
          } else {
            router.push('/dashboard'); // fallback
          }
        }
      } catch (error) {
        setError('An error occurred during login');
      }
    } else {
      try {
        if (role === 'TENANT' && !formData.landlordEmail) {
          setError('Landlord email is required for tenant registration');
          return;
        }

        if (role === 'LANDLORD' && !formData.utrNumber) {
          setError('UTR Number is required for landlord registration');
          return;
        }

        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        const data = await res.json();

        if (res.ok) {
          setIsLogin(true);
          setError('Registration successful! Please verify your email before logging in.');
          resetForm();
          localStorage.setItem('pendingEmail', formData.email);
          router.push('/auth/verification-pending');
        } else {
          throw new Error(data.message || 'Registration failed');
        }
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Registration failed');
      }
    }
  };

  const resetForm = () => {
    setIsLogin(!isLogin);
    setError('');
    setFormData({
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      role: 'LANDLORD',
      phone: '',
      utrNumber: '',
      dateOfBirth: '',
      nationalInsuranceNo: '',
      employmentStatus: undefined,
      annualIncome: undefined,
      landlordEmail: ''
    });
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
              <select
                name="role"
                value={role}
                onChange={handleRoleChange}
                required
                className="auth-input"
              >
                <option value="LANDLORD">Landlord</option>
                <option value="TENANT">Tenant</option>
              </select>

              <input
                name="firstName"
                type="text"
                required
                className="auth-input"
                placeholder="First name"
                value={formData.firstName}
                onChange={handleInputChange}
              />

              <input
                name="lastName"
                type="text"
                required
                className="auth-input"
                placeholder="Last name"
                value={formData.lastName}
                onChange={handleInputChange}
              />

              <input
                name="phone"
                type="tel"
                className="auth-input"
                placeholder="Phone number (optional)"
                value={formData.phone}
                onChange={handleInputChange}
              />

              {role === 'LANDLORD' && (
                <input
                  name="utrNumber"
                  type="text"
                  required
                  className="auth-input"
                  placeholder="UTR Number"
                  value={formData.utrNumber}
                  onChange={handleInputChange}
                />
              )}

              {role === 'TENANT' && (
                <>
                  <input
                    name="dateOfBirth"
                    type="date"
                    required
                    className="auth-input"
                    value={formData.dateOfBirth || ''}
                    onChange={handleInputChange}
                  />

                  <input
                    name="nationalInsuranceNo"
                    type="text"
                    required
                    className="auth-input"
                    placeholder="National Insurance Number"
                    value={formData.nationalInsuranceNo || ''}
                    onChange={handleInputChange}
                  />

                  <select
                    name="employmentStatus"
                    required
                    className="auth-input"
                    value={formData.employmentStatus || ''}
                    onChange={handleInputChange}
                  >
                    <option value="">Select Employment Status</option>
                    <option value="EMPLOYED">Employed</option>
                    <option value="SELF_EMPLOYED">Self Employed</option>
                    <option value="RETIRED">Retired</option>
                    <option value="STUDENT">Student</option>
                    <option value="UNEMPLOYED">Unemployed</option>
                  </select>

                  <input
                    name="annualIncome"
                    type="number"
                    className="auth-input"
                    placeholder="Annual Income (optional)"
                    value={formData.annualIncome || ''}
                    onChange={handleInputChange}
                  />

                  <div className="landlord-verification">
                    <input
                      name="landlordEmail"
                      type="email"
                      required
                      className={`auth-input ${
                        formData.landlordEmail && (
                          landlordExists === true ? 'input-success' :
                          landlordExists === false ? 'input-error' : ''
                        )
                      }`}
                      placeholder="Your Landlord's Email"
                      value={formData.landlordEmail || ''}
                      onChange={handleInputChange}
                    />
                    
                    {isCheckingLandlord && (
                      <span className="verification-status">Verifying landlord...</span>
                    )}
                    
                    {formData.landlordEmail && !isCheckingLandlord && (
                      <span className={`verification-status ${landlordExists ? 'success' : 'error'}`}>
                        {landlordExists ? 'Landlord verified' : 'Landlord not found'}
                      </span>
                    )}
                  </div>
                </>
              )}
            </>
          )}

          <input
            name="email"
            type="email"
            required
            className="auth-input"
            placeholder="Email address"
            value={formData.email}
            onChange={handleInputChange}
          />

          <input
            name="password"
            type="password"
            required
            className="auth-input"
            placeholder="Password"
            value={formData.password}
            onChange={handleInputChange}
          />

          <div className="flex items-center justify-between mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="remember"
                className="form-checkbox h-4 w-4 text-indigo-600"
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span className="ml-2 text-sm text-gray-600">Remember me</span>
            </label>
          </div>

          <button 
            type="submit" 
            className="auth-button"
          >
            {isLogin ? 'Sign in' : 'Register'}
          </button>
          
          <button
            type="button"
            onClick={resetForm}
            className="auth-switch"
          >
            {isLogin ? "Don't have an account? Register" : 'Already have an account? Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}