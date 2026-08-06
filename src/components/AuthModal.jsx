import React, { useState } from 'react';
import { X, Mail, Lock, LogIn, UserPlus, Sparkles, AlertCircle } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export default function AuthModal({ isOpen, onClose }) {
  const { signInWithGoogle, signInWithEmail, signUpWithEmail } = useStore();

  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [authError, setAuthError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    setLoading(true);

    try {
      if (isSignUp) {
        const { error } = await signUpWithEmail(email, password, fullName);
        if (error) throw error;
      } else {
        const { error } = await signInWithEmail(email, password);
        if (error) throw error;
      }
      onClose();
    } catch (err) {
      setAuthError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setAuthError('');
    setLoading(true);
    try {
      const { error } = await signInWithGoogle();
      if (error) throw error;
    } catch (err) {
      setAuthError(err.message || 'Google Sign-In failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 md:p-8 shadow-2xl border border-brand-gold/30 relative">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 p-1 rounded-full"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="text-center space-y-2 mb-6">
          <img src="/logo.png" alt="Ella Creations Logo" className="h-10 w-auto mx-auto" />
          <h2 className="font-serif text-2xl font-bold text-stone-900">
            {isSignUp ? 'Create Your Account' : 'Sign In to Ella Creations'}
          </h2>
          <p className="text-xs text-stone-500">
            Access your wishlist, order tracking, and exclusive artificial jewelry VIP perks.
          </p>
        </div>

        {authError && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-xs text-rose-700">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{authError}</span>
          </div>
        )}

        {/* Google Sign-In Button */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full bg-white hover:bg-stone-50 text-stone-700 font-semibold text-xs py-3 px-4 rounded-xl border border-stone-300 flex items-center justify-center gap-3 shadow-sm transition-all mb-4"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
          </svg>
          Continue with Google
        </button>

        <div className="flex items-center my-4">
          <div className="flex-1 border-t border-stone-200"></div>
          <span className="px-3 text-[11px] text-stone-400 uppercase tracking-widest font-semibold">Or Email</span>
          <div className="flex-1 border-t border-stone-200"></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {isSignUp && (
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Full Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Priyanshu Sharma"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-300 outline-none focus:border-brand-rose"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Email Address</label>
            <input
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-300 outline-none focus:border-brand-rose"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Password</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-300 outline-none focus:border-brand-rose"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-rose hover:bg-brand-rose/90 text-white font-semibold text-xs py-3 rounded-xl shadow-soft-rose transition-colors flex items-center justify-center gap-2 uppercase tracking-wider"
          >
            {isSignUp ? <UserPlus className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
            {isSignUp ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-xs text-stone-600 hover:text-brand-rose font-semibold transition-colors"
          >
            {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Create One"}
          </button>
        </div>

      </div>
    </div>
  );
}
