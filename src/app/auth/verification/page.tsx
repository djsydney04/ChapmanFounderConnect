'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

export default function VerificationPage() {
  const router = useRouter();
  const [particles, setParticles] = useState<any[]>([]);
  const [countdown, setCountdown] = useState(60);
  const [email, setEmail] = useState('');
  const [resendDisabled, setResendDisabled] = useState(true);

  useEffect(() => {
    // Get email from localStorage or URL params if available
    const storedEmail = localStorage.getItem('pendingVerificationEmail');
    if (storedEmail) {
      setEmail(storedEmail);
    }

    // Generate particles for background effect
    setParticles(Array.from({ length: 30 }, () => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      opacity: Math.random() * 0.5 + 0.3,
      duration: Math.random() * 3 + 2,
      yOffset: Math.random() * 30 - 15
    })));

    // Start countdown for resend button
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setResendDisabled(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleResendVerification = () => {
    // TODO: Implement resend verification logic
    setResendDisabled(true);
    setCountdown(60);
    
    // Start countdown again
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setResendDisabled(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
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
              Verify your email
            </h2>
          </motion.div>

          <motion.div 
            variants={fadeIn}
            className="mt-8 bg-white/10 backdrop-blur-md py-8 px-4 shadow-xl rounded-xl sm:px-10 border border-white/20"
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500/20 rounded-full mx-auto flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              
              <h3 className="text-xl font-medium text-white mb-2">Check your inbox</h3>
              
              <p className="text-gray-300 mb-6">
                We've sent a verification link to{' '}
                <span className="font-medium text-white">
                  {email || 'your email address'}
                </span>
                . Click the link to verify your account.
              </p>
              
              <div className="space-y-4">
                <button
                  onClick={handleResendVerification}
                  disabled={resendDisabled}
                  className="w-full flex justify-center py-2 px-4 border border-white/30 rounded-md shadow-sm text-sm font-medium text-white bg-transparent hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {resendDisabled 
                    ? `Resend email (${countdown}s)` 
                    : 'Resend verification email'}
                </button>
                
                <Link
                  href="/auth/signin"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-black bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white/50 transition-all duration-300"
                >
                  Back to sign in
                </Link>
              </div>
              
              <div className="mt-6 text-sm text-gray-400">
                <p>
                  Didn't receive the email? Check your spam folder or make sure you entered the correct email address.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
} 