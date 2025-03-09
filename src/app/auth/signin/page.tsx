'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { signIn } from '@/utils/supabase';
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

  // Generate random particles for the background effect
  const particles = Array.from({ length: 30 }, () => ({
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    opacity: Math.random() * 0.5 + 0.3,
    duration: Math.random() * 3 + 2,
    yOffset: Math.random() * 30 - 15
  }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await signIn(formData.email, formData.password);
      
      if (error) {
        throw error;
      }
      
      if (data?.user) {
        // Successful login, redirect to dashboard
        router.push('/dashboard');
      }
    } catch (err: any) {
      console.error('Sign in error:', err);
      setError(err.message || 'Failed to sign in. Please check your credentials and try again.');
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
            </form>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
} 