import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth, signInWithGoogle, signInWithEmailPassword } from '../../firebaseConfig';
import { FcGoogle } from 'react-icons/fc';
import { toast } from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showResendLink, setShowResendLink] = useState(false);
  const [resendStatus, setResendStatus] = useState<{success?: boolean; message: string} | null>(null);
  const navigate = useNavigate();

  const handleResendVerification = async () => {
    try {
      setResendStatus({ message: 'Sending verification email...' });
      const { sendEmailVerification } = await import('../../firebaseConfig');
      const user = auth.currentUser;
      
      if (user) {
        await sendEmailVerification(user);
        setResendStatus({
          success: true,
          message: 'Verification email sent! Please check your inbox.'
        });
      }
    } catch (error: any) {
      console.error('Resend verification error:', error);
      setResendStatus({
        success: false,
        message: error.message || 'Failed to send verification email. Please try again.'
      });
    } finally {
      setTimeout(() => setResendStatus(null), 5000);
    }
  };

  const handleEmailPasswordLogin = async (e: React.FormEvent) => {
    console.log('Form submitted');
    e.preventDefault();
    setError('');
    setResendStatus(null);
    setLoading(true);
    console.log('Attempting login with:', { email });

    try {
      // Use the signInWithEmailPassword function from firebaseConfig
      console.log('signInWithEmailPassword called');
      const user = await signInWithEmailPassword(email, password);
      console.log('User object received:', user);
      
      if (user && 'emailVerified' in user && !user.emailVerified) {
        console.log('Email not verified');
        setShowResendLink(true);
        toast.error('Please verify your email before signing in.', {
          icon: '✉️',
          duration: 5000,
          style: {
            background: '#1F2937',
            color: '#F9FAFB',
            padding: '16px',
            borderRadius: '8px',
            borderLeft: '4px solid #EF4444',
            fontSize: '14px',
          },
        });
        await auth.signOut();
        return;
      }
      
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Login error:', error);
      console.error('Error code:', error.code, 'Message:', error.message);
      let errorMessage = 'Failed to sign in. ';
      if (error.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password. Please try again.';
      } else if (error.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email. Please sign up.';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many failed attempts. Please try again later or reset your password.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Please enter a valid email address.';
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = 'Network error. Please check your internet connection.';
      } else {
        errorMessage += error.message || 'Please check your credentials and try again.';
      }
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setGoogleLoading(true);
      setError('');
      await signInWithGoogle();
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Google Sign-In Error:', error);
      setError('Failed to sign in with Google. ' + (error.message || 'Please try again.'));
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
              <h2 className="text-3xl font-bold text-white/95 mb-3 tracking-tight">Welcome back to Daigo</h2>
              <p className="text-white/60 font-medium">Sign in to track your progress and level up!</p>
            </div>
          
            {(error || resendStatus) && (
              <div className="space-y-4 mb-6">
                {error && (
                  <div className="bg-red-500/10 border border-red-500/30 text-red-200 px-4 py-3 rounded-lg text-sm" role="alert">
                    {error}
                  </div>
                )}
                {resendStatus && (
                  <div className={`${resendStatus.success ? 'bg-green-500/10 border-green-500/30 text-green-200' : 'bg-yellow-500/10 border-yellow-500/30 text-yellow-200'} border px-4 py-3 rounded-lg text-sm`}>
                    {resendStatus.message}
                  </div>
                )}
              </div>
            )}
            
            <form className="space-y-6" onSubmit={(e) => {
  console.log('Form onSubmit triggered');
  handleEmailPasswordLogin(e);
}}>
              <div className="space-y-4">
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
                  <div className="flex items-center justify-between mb-1">
                    <label htmlFor="password" className="block text-sm font-medium text-white/80">
                      Password
                    </label>
                    <Link to="/forgot-password" className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors">
                      Forgot password?
                    </Link>
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white/90 placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Signing in...' : 'Sign in!!!'}
              </button>

              {showResendLink && (
                <div className="text-center mt-4">
                  <button
                    type="button"
                    onClick={handleResendVerification}
                    disabled={resendStatus?.success}
                    className="text-sm font-medium text-indigo-400 hover:text-indigo-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none"
                  >
                    {resendStatus?.success ? 'Email sent!' : 'Resend verification email'}
                  </button>
                </div>
              )}

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
                onClick={handleGoogleSignIn}
                disabled={googleLoading}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-white/10 rounded-xl shadow-sm text-sm font-medium text-white/90 bg-white/5 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <FcGoogle className="w-5 h-5" />
                {googleLoading ? 'Signing in...' : 'Sign in with Google'}
              </button>

              <p className="text-center text-sm text-white/60 mt-6">
                Don't have an account?{' '}
                <Link
                  to="/signup"
                  className="font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  Sign up
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Login;
