'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { signIn, supabase, directAuth } from '@/utils/supabase';
import { useRouter } from 'next/navigation';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

export default function SignInPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [demoUsers, setDemoUsers] = useState<{email: string, password: string}[]>([]);
  const [particles, setParticles] = useState<any[]>([]);

  // Check for existing session on page load and generate particles
  useEffect(() => {
    // Generate particles for the background effect
    setParticles(Array.from({ length: 30 }, () => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      opacity: Math.random() * 0.5 + 0.3,
      duration: Math.random() * 3 + 2,
      yOffset: Math.random() * 30 - 15
    })));
    
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        router.push('/dashboard');
      }
    };
    
    checkSession();
    
    // Fetch demo users
    const fetchDemoUsers = async () => {
      try {
        // In a real app, you would not expose this, but for demo purposes it's helpful
        setDemoUsers([
          { email: 'demo@example.com', password: 'password123' },
          { email: 'mitic@chapman.edu', password: 'password123' }
        ]);
      } catch (err) {
        console.error('Error fetching demo users:', err);
      }
    };
    
    fetchDemoUsers();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setMagicLinkSent(false);
    
    try {
      console.log('Attempting to sign in with:', formData.email);
      
      // Try direct authentication first for immediate login
      const { data: directData, error: directError, directAuthUsed } = await directAuth(formData.email, formData.password);
      
      if (directAuthUsed && !directError) {
        console.log('Direct auth successful, redirecting to dashboard');
        // Force a hard navigation to ensure the page reloads
        window.location.href = '/dashboard';
        return;
      }
      
      // If direct auth failed or wasn't used, try regular sign in
      const { data, error, usedDirectAuth, usedMagicLink } = await signIn(formData.email, formData.password);
      
      if (error) {
        console.error('Sign in error:', error);
        throw error;
      }
      
      if (usedMagicLink) {
        // If we used a magic link, show the user a message
        setMagicLinkSent(true);
        return;
      }
      
      if (data?.user || usedDirectAuth) {
        console.log('Login successful, redirecting to dashboard');
        // Force a hard navigation to ensure the page reloads
        window.location.href = '/dashboard';
      }
    } catch (err: any) {
      console.error('Sign in error:', err);
      setError(err.message || 'Failed to sign in. Please check your credentials and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async (email: string, password: string) => {
    setFormData({ ...formData, email, password });
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Attempting login with:', email);
      
      // Use direct auth for known users
      const { data: directData, error: directError, directAuthUsed } = await directAuth(email, password);
      
      if (directAuthUsed && !directError) {
        console.log('Direct auth successful, redirecting to dashboard');
        // Force a hard navigation to ensure the page reloads
        window.location.href = '/dashboard';
        return;
      }
      
      // Fall back to regular sign in if direct auth fails
      const { data, error, usedDirectAuth } = await signIn(email, password);
      
      if (error) {
        console.error('Login error:', error);
        throw error;
      }
      
      if (data?.user || usedDirectAuth) {
        console.log('Login successful, redirecting to dashboard');
        // Force a hard navigation to ensure the page reloads
        window.location.href = '/dashboard';
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Failed to sign in. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Galaxy Background */}
      <img 
        src="/images/background.png"
        alt="Galaxy background"
        className="fixed top-0 left-0 w-full h-full object-cover z-0"
      />
      
      {/* Fallback color in case image fails to load */}
      <div className="fixed inset-0 bg-[#090618] -z-10" />
      
      {/* Overlay Gradient */}
      <div className="fixed inset-0 z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-[#090618]/30 to-[#090618]/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1a1333]/5 via-transparent to-[#1a1333]/5" />
      </div>
      
      {/* Animated Particles */}
      <div className="absolute inset-0">
        {particles.map((particle, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: particle.left,
              top: particle.top,
              opacity: particle.opacity,
              boxShadow: '0 0 4px rgba(255, 255, 255, 0.5)'
            }}
            animate={{
              y: [0, particle.yOffset],
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.5, 1]
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-20 flex flex-col justify-center min-h-screen py-12">
        <motion.div 
          initial="initial"
          animate="animate"
          variants={{
            animate: {
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
          className="sm:mx-auto sm:w-full sm:max-w-md px-4"
        >
          <motion.div variants={fadeIn} className="text-center">
            <Link href="/" className="inline-block text-white font-bold text-3xl mb-6">
              FounderConnect
            </Link>
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-200">
              Welcome back
            </h2>
            <p className="mt-2 text-gray-300">
              Don't have an account?{' '}
              <Link href="/auth/signup" className="text-white hover:text-blue-200 font-medium underline">
                Sign up
              </Link>
            </p>
          </motion.div>

          <motion.div 
            variants={fadeIn}
            className="mt-8 bg-white/10 backdrop-blur-md py-8 px-4 shadow-xl rounded-xl sm:px-10 border border-white/20"
          >
            {error && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-md text-white text-sm">
                {error}
              </div>
            )}
            
            {magicLinkSent ? (
              <div className="text-center py-4">
                <div className="w-16 h-16 bg-blue-500/20 rounded-full mx-auto flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-white mb-2">Check your inbox</h3>
                <p className="text-gray-300 mb-6">
                  We've sent a magic link to <span className="font-medium text-white">{formData.email}</span>. 
                  Click the link to sign in.
                </p>
                <button
                  onClick={() => setMagicLinkSent(false)}
                  className="w-full flex justify-center py-2 px-4 border border-white/30 rounded-md shadow-sm text-sm font-medium text-white bg-transparent hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white/50 transition-all duration-300"
                >
                  Try again
                </button>
              </div>
            ) : (
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-200">
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
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="appearance-none block w-full px-3 py-2 border border-white/30 bg-black/30 text-white rounded-md shadow-sm focus:outline-none focus:ring-white/50 focus:border-white/50"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-200">
                    Password
                  </label>
                  <div className="mt-1">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="appearance-none block w-full px-3 py-2 border border-white/30 bg-black/30 text-white rounded-md shadow-sm focus:outline-none focus:ring-white/50 focus:border-white/50"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      checked={formData.rememberMe}
                      onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                      className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-200">
                      Remember me
                    </label>
                  </div>

                  <div className="text-sm">
                    <Link href="/auth/forgot-password" className="font-medium text-blue-200 hover:text-white">
                      Forgot your password?
                    </Link>
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-lg text-sm font-medium text-black bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Signing in...' : 'Sign in'}
                  </button>
                </div>
                
                {/* Known Users Section */}
                {demoUsers.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-white/10">
                    <h3 className="text-sm font-medium text-gray-200 mb-4 text-center">
                      Quick Login
                    </h3>
                    <div className="space-y-2">
                      {demoUsers.map((user, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => handleDemoLogin(user.email, user.password)}
                          disabled={isLoading}
                          className="w-full flex justify-center py-2 px-4 border border-white/20 rounded-md shadow-sm text-sm font-medium text-white bg-white/5 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Login as {user.email}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </form>
            )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
} 