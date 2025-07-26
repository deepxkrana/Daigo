import React, { useState } from 'react';
import { 
  createUserWithEmailPassword, 
  updateUserProfile, 
  signInWithGoogle, 
  sendEmailVerification 
} from '../../firebaseConfig';
import { database } from '../../firebaseConfig';
import { ref, set } from 'firebase/database';
import { useNavigate, Link } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { toast } from 'react-hot-toast';

const SignUp: React.FC = (): JSX.Element => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [displayName, setDisplayName] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [googleLoading, setGoogleLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleEmailPasswordSignUp = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password should be at least 6 characters');
      return;
    }

    setLoading(true);
    
    try {
      // Create user with email and password
      const user = await createUserWithEmailPassword(email, password);
      
      // Update user profile with display name
      await updateUserProfile(user, { displayName });
      
      // Send verification email
      await sendEmailVerification(user);
      
      // Save user data to database
      await set(ref(database, 'users/' + user.uid), {
        email: user.email,
        displayName: displayName,
        emailVerified: false,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      });
      
      toast.success('Account created! Please check your email to verify your account.');
      navigate('/verify-email');
    } catch (error: any) {
      console.error('Signup error:', error);
      let errorMessage = 'Failed to create an account. ';
      
      // More specific error messages
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'This email is already in use. Please use a different email or sign in.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak. Please use at least 6 characters.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Please enter a valid email address.';
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = 'Network error. Please check your internet connection.';
      } else {
        errorMessage += error.message || 'Please try again.';
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  
  const handleGoogleSignUp = async (): Promise<void> => {
    setGoogleLoading(true);
    setError('');
    
    try {
      const result = await signInWithGoogle();
      const { user } = result;
      
      if (user) {
        // Save user data to database
        await set(ref(database, 'users/' + user.uid), {
          email: user.email,
          displayName: user.displayName || '',
          emailVerified: user.emailVerified,
          photoURL: user.photoURL || '',
          provider: 'google.com',
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString()
        });
        
        toast.success('Successfully signed in with Google!');
        navigate('/dashboard');
      }
    } catch (error: any) {
      console.error('Google sign in error:', error);
      let errorMessage = 'Failed to sign in with Google. ';
      
      if (error.code === 'auth/account-exists-with-different-credential') {
        errorMessage = 'An account already exists with the same email but different sign-in method.';
      } else if (error.code === 'auth/popup-closed-by-user') {
        // User closed the popup, no need to show an error
        errorMessage = '';
      } else {
        errorMessage += error.message || 'Please try again.';
      }
      
      if (errorMessage) {
        setError(errorMessage);
        toast.error(errorMessage);
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="min-h-screen flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <div className="bg-white/5 backdrop-blur-2xl rounded-3xl p-8 border border-white/10 shadow-2xl shadow-black/20">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white/95 mb-3 tracking-tight">Create your account</h2>
              <p className="text-white/60 font-medium">
                Already have an account?{' '}
                <Link to="/login" className="text-indigo-400 hover:text-indigo-300 transition-colors">
                  Sign in
                </Link>
              </p>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-200 px-4 py-3 rounded-lg text-sm mb-6" role="alert">
                {error}
              </div>
            )}

            <form className="space-y-6" onSubmit={handleEmailPasswordSignUp}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="display-name" className="block text-sm font-medium text-white/80 mb-1">
                    Full Name
                  </label>
                  <input
                    id="display-name"
                    name="displayName"
                    type="text"
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white/90 placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                    placeholder="John Doe"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="email-address" className="block text-sm font-medium text-white/80 mb-1">
                    Email address
                  </label>
                  <input
                    id="email-address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white/90 placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-white/80 mb-1">
                    Password (min 6 characters)
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    minLength={6}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white/90 placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="confirm-password" className="block text-sm font-medium text-white/80 mb-1">
                    Confirm Password
                  </label>
                  <input
                    id="confirm-password"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    minLength={6}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white/90 placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Creating account...' : 'Sign up with Email'}
              </button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white/5 text-white/60">Or continue with</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleGoogleSignUp}
                disabled={googleLoading}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-white/10 rounded-xl shadow-sm text-sm font-medium text-white/90 bg-white/5 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <FcGoogle className="w-5 h-5" />
                {googleLoading ? 'Signing up...' : 'Sign up with Google'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
