import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { AUTH_SERVICE_URL } from '../config';
import { auth, googleProvider } from '@privschool-lms/common/lib/firebase';
import { 
  signInWithPopup, 
  createUserWithEmailAndPassword,
  updateProfile 
} from 'firebase/auth';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleGoogleSignIn = async () => {
    try {
      console.log('Starting Google Sign In process...');
      setLoading(true);
      setError(null);
      
      console.log('Initiating Google sign-in popup...');
      const result = await signInWithPopup(auth, googleProvider);
      console.log('Google sign-in successful:', { 
        uid: result.user.uid,
        email: result.user.email,
        displayName: result.user.displayName
      });

      const user = result.user;
      console.log('Getting Firebase ID token...');
      const idToken = await user.getIdToken();
      console.log('ID token obtained, sending to backend...');

      console.log('Making backend request to:', `${AUTH_SERVICE_URL}/api/auth/google`);
      const backendResponse = await fetch(`${AUTH_SERVICE_URL}/api/auth/google`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ idToken })
      });

      if (!backendResponse.ok) {
        console.error('Backend response not OK:', {
          status: backendResponse.status,
          statusText: backendResponse.statusText
        });
        const errorText = await backendResponse.text();
        console.error('Backend error details:', errorText);
        throw new Error('Failed to authenticate with backend');
      }

      console.log('Backend response OK, parsing response...');
      const data = await backendResponse.json();
      console.log('Backend authentication successful:', {
        user: {
          ...data.user,
          id: typeof data.user.id === 'number' ? data.user.id : null,
          isOnboarded: !!data.user.isOnboarded
        },
        hasToken: !!data.token,
        tokenPreview: data.token ? `${data.token.substring(0, 10)}...` : undefined
      });

      // Update auth context with user data and token
      console.log('Updating auth context...');
      if (!data.token) {
        console.error('No token received from server');
        throw new Error('Authentication failed: No token received');
      }

      setAuth(data.user, data.token);

      console.log('Auth context updated, checking onboarding status...');
      if (!data.user.isOnboarded) {
        console.log('User not onboarded, redirecting to onboarding...');
        navigate('/onboarding');
        return;
      }

      console.log('User already onboarded, redirecting to dashboard...');
      navigate('/dashboard');
    } catch (err: any) {
      console.error('Google Sign In Error:', {
        code: err.code,
        message: err.message,
        fullError: err
      });

      if (err.code === 'auth/popup-closed-by-user') {
        setError('Sign in cancelled. Please try again.');
      } else if (err.code === 'auth/popup-blocked') {
        setError('Pop-up was blocked by your browser. Please allow pop-ups and try again.');
      } else if (err.code === 'auth/unauthorized-domain') {
        console.error('Domain not authorized. Check Firebase Console configuration.');
        setError('This domain is not authorized for sign-in. Please contact support.');
      } else if (err.code === 'auth/internal-error') {
        console.error('Internal Firebase error:', err);
        setError('An internal error occurred. Please try again later.');
      } else {
        setError(err.message || 'Failed to sign in with Google');
      }
    } finally {
      setLoading(false);
      console.log('Google Sign In process completed.');
    }
  };

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log('Starting email registration...');
      setLoading(true);
      setError(null);

      // Validate form data
      if (!formData.email || !formData.password || !formData.firstName || !formData.lastName) {
        throw new Error('All fields are required');
      }

      console.log('Creating user with email and password...');
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      console.log('User created successfully, updating profile...');
      await updateProfile(userCredential.user, {
        displayName: `${formData.firstName} ${formData.lastName}`
      });

      console.log('Profile updated, getting ID token...');
      const idToken = await userCredential.user.getIdToken();

      console.log('Making backend request...');
      const backendResponse = await fetch(`${AUTH_SERVICE_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email
        })
      });

      if (!backendResponse.ok) {
        const errorData = await backendResponse.json();
        throw new Error(errorData.error || 'Failed to register with backend');
      }

      const data = await backendResponse.json();
      console.log('Registration successful, updating auth context...', data);

      // Update auth context with user data and token
      setAuth(data.user, data.token);

      console.log('Checking onboarding status...');
      if (!data.user.isOnboarded) {
        console.log('User not onboarded, redirecting to onboarding...');
        navigate('/onboarding');
        return;
      }

      console.log('User already onboarded, redirecting to dashboard...');
      navigate('/dashboard');
    } catch (err: any) {
      console.error('Registration error:', err);
      if (err.code === 'auth/email-already-in-use') {
        setError('This email is already registered. Please try logging in.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Invalid email address.');
      } else if (err.code === 'auth/weak-password') {
        setError('Password should be at least 6 characters.');
      } else {
        setError(err.message || 'Failed to register');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="mb-4 text-red-600 text-center">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleEmailSignup}>
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                First Name
              </label>
              <div className="mt-1">
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                Last Name
              </label>
              <div className="mt-1">
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? 'Creating account...' : 'Create account'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? 'Signing in...' : 'Continue with Google'}
              </button>
            </div>
          </div>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Already have an account?
                </span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <Link
                to="/login"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};