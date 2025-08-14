import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { app } from '../services/firebase';
import { getUserByFirebaseId, createUser } from '../services/userServices';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { useScrollToTop } from "../hooks/useScrollToTop.js";
import { FcGoogle } from 'react-icons/fc';

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

const AuthForm = ({ mode = 'login' }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    username: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const isLogin = mode === 'login';

  useScrollToTop();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!isLogin && formData.password !== formData.confirmPassword) throw new Error('Passwords do not match');

      let userCredential;

      if (isLogin) {
        userCredential = await signInWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );
      } else {
        userCredential = await createUserWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );

        await createUser({
          firebase_id: userCredential.user.uid,
          email: formData.email,
          username: formData.username,
          login_method: "email"
        });
      }

      if (isLogin) {
        await getUserByFirebaseId(userCredential.user.uid);
      }

      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      try {
        await getUserByFirebaseId(user.uid);
      } catch (backendErr) {
        if (backendErr.response?.status === 404) {
          await createUser({
            firebase_id: user.uid,
            email: user.email,
            username: user.displayName || '',
            login_method: "google"
          });
        } else {
          throw backendErr;
        }
      }

      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError(err.message || 'Google sign in failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="bg-secondary p-8 rounded-lg shadow-md max-w-md w-full mx-auto">
        <h2 className="text-2xl font-bold text-text mb-6 text-center">
          {isLogin ? 'Login to Your Account' : 'Create a New Account'}
        </h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-text mb-1">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required={!isLogin}
                value={formData.username}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-background border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-text mb-1">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-background border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-text mb-1">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-background border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {!isLogin && (
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-text mb-1">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required={!isLogin}
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-background border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-opacity-90 transition-colors disabled:opacity-50"
          >
            {loading ? 'Processing...' : isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-secondary text-text">Or continue with</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="mt-4 w-full flex items-center justify-center gap-2 bg-white text-gray-800 py-2 px-4 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <FcGoogle size={18} />
            {isLogin ? 'Sign in with Google' : 'Sign up with Google'}
          </button>
        </div>

        <div className="mt-6 text-center text-sm text-text">
          {isLogin ? (
            <>
              Don't have an account?{' '}
              <a href="/signup" className="text-primary hover:underline">
                Sign up
              </a>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <a href="/login" className="text-primary hover:underline">
                Login
              </a>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthForm;