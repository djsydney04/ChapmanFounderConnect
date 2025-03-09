'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  UserGroupIcon,
  BriefcaseIcon,
  BookOpenIcon,
  CalendarIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface Particle {
  left: string;
  top: string;
  opacity: number;
  duration: number;
  yOffset: number;
}

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const staggerChildren = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function LandingPage() {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [transitionParticles, setTransitionParticles] = useState<Particle[]>([]);

  useEffect(() => {
    setParticles(Array.from({ length: 50 }, () => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      opacity: Math.random() * 0.5 + 0.3,
      duration: Math.random() * 3 + 2,
      yOffset: Math.random() * 30 - 15
    })));

    setTransitionParticles(Array.from({ length: 20 }, () => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 30}%`,
      opacity: Math.random() * 0.3 + 0.1,
      duration: Math.random() * 3 + 2,
      yOffset: Math.random() * 20 - 10
    })));
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen overflow-hidden">
        {/* Debug element to verify positioning */}
        <div className="fixed top-2 left-2 z-50 bg-black/50 text-white text-xs px-2 py-1 rounded">
          Background Status
        </div>

        {/* Galaxy Background - Using img tag with higher priority */}
        <img 
          src="/images/background.png"
          alt="Galaxy background"
          className="fixed top-0 left-0 w-full h-full object-cover"
          style={{ 
            opacity: 1,
            zIndex: 0
          }}
          loading="eager"
          decoding="sync"
        />
        
        {/* Fallback color in case image fails to load */}
        <div className="fixed inset-0 bg-[#090618] -z-10" />
        
        {/* Overlay Gradient - Reduced opacity for better image visibility */}
        <div className="fixed inset-0 z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-[#090618]/30 to-[#090618]/80" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1a1333]/5 via-transparent to-[#1a1333]/5" />
        </div>
        
        {/* Animated Particles */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
          className="absolute inset-0"
        >
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
        </motion.div>

        {/* Content Container - Ensure it's above everything */}
        <div className="relative z-20">
          {/* Content */}
          <div className="container relative mx-auto px-4 pt-24 pb-16">
            <motion.div
              variants={staggerChildren}
              initial="initial"
              animate="animate"
              className="max-w-4xl mx-auto"
            >
              {/* Main Content */}
              <div className="text-center relative">              
                <motion.h1
                  variants={fadeInUp}
                  className="text-6xl sm:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-blue-100"
                >
                  Connect. Build.
                  <br />
                  <span className="text-white">Launch Your Startup.</span>
                </motion.h1>

                <motion.p
                  variants={fadeInUp}
                  className="text-xl mb-8 text-white/80 max-w-2xl mx-auto"
                >
                  Join an exclusive network of student founders, developers, and visionaries building the next generation of startups.
                </motion.p>

                <motion.div
                  variants={fadeInUp}
                  className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4"
                >
                  <Link
                    href="/auth/signup"
                    className="group relative px-8 py-4 bg-white text-black rounded-xl font-semibold shadow-lg hover:shadow-white/25 transition-all duration-300 overflow-hidden"
                  >
                    <span className="relative z-10">Get Started</span>
                    <div className="absolute inset-0 bg-blue-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </Link>
                  
                  <Link
                    href="/auth/signin"
                    className="px-8 py-4 backdrop-blur-md bg-white/10 rounded-xl font-semibold text-white border border-white/20 hover:bg-white/20 transition-all duration-300"
                  >
                    Sign In
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black to-transparent" />
      </section>

      {/* Features Section */}
      <section className="relative py-16 bg-[#090618]">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#1a1333]/30 via-[#090618]/50 to-[#090618] opacity-80" />
        </div>
        
        {/* Additional Particles for Transition */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
          className="absolute inset-0 overflow-hidden"
        >
          {transitionParticles.map((particle, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                left: particle.left,
                top: particle.top,
                opacity: particle.opacity,
                boxShadow: '0 0 4px rgba(255, 255, 255, 0.3)'
              }}
              animate={{
                y: [0, particle.yOffset],
                opacity: [0.1, 0.3, 0.1],
                scale: [1, 1.2, 1]
              }}
              transition={{
                duration: particle.duration,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            />
          ))}
        </motion.div>

        <div className="container mx-auto px-4">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerChildren}
            className="max-w-6xl mx-auto"
          >
            {/* Section Title */}
            <motion.h2
              variants={fadeInUp}
              className="text-4xl md:text-5xl font-bold text-center mb-12 text-white"
            >
              Everything You Need to Launch
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
              {/* Feature 1 */}
              <motion.div
                variants={fadeInUp}
                className="group relative backdrop-blur-lg bg-white/5 p-8 rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300"
                whileHover={{ y: -5 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-blue-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative">
                  <div className="w-14 h-14 bg-gradient-to-br from-gray-800 to-blue-900 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <UserGroupIcon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-4 text-white">Find Your Co-Founder</h3>
                  <p className="text-gray-300 text-lg">
                    Connect with talented students from diverse disciplines—business minds, engineers, designers, and more.
                  </p>
                </div>
              </motion.div>

              {/* Feature 2 */}
              <motion.div
                variants={fadeInUp}
                className="group relative backdrop-blur-lg bg-white/5 p-8 rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300"
                whileHover={{ y: -5 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-blue-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative">
                  <div className="w-14 h-14 bg-gradient-to-br from-gray-800 to-blue-900 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <BriefcaseIcon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-4 text-white">Student-Focused Job Board</h3>
                  <p className="text-gray-300 text-lg">
                    Browse or post part-time roles, internships, or collaboration projects. Source talent from a pool of innovative peers.
                  </p>
                </div>
              </motion.div>

              {/* Feature 3 */}
              <motion.div
                variants={fadeInUp}
                className="group relative backdrop-blur-lg bg-white/5 p-8 rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300"
                whileHover={{ y: -5 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-blue-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative">
                  <div className="w-14 h-14 bg-gradient-to-br from-gray-800 to-blue-900 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <BookOpenIcon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-4 text-white">Startup Resources</h3>
                  <p className="text-gray-300 text-lg">
                    Access curated guides, templates, and checklists tailored to help you navigate funding, pitching, and team building.
                  </p>
                </div>
              </motion.div>

              {/* Feature 4 */}
              <motion.div
                variants={fadeInUp}
                className="group relative backdrop-blur-lg bg-white/5 p-8 rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300"
                whileHover={{ y: -5 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-blue-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative">
                  <div className="w-14 h-14 bg-gradient-to-br from-gray-800 to-blue-900 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <CalendarIcon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-4 text-white">Startup Events</h3>
                  <p className="text-gray-300 text-lg">
                    Discover upcoming pitch nights, hackathons, networking meetups, and entrepreneurial workshops.
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-16 bg-[#090618]">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#1a1333]/20 via-[#090618]/30 to-[#090618] opacity-70" />
        </div>
        
        <div className="container relative mx-auto px-4">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerChildren}
            className="max-w-4xl mx-auto text-center"
          >
            <motion.h2
              variants={fadeInUp}
              className="text-4xl md:text-5xl font-bold mb-6 text-white"
            >
              Join Chapman's Entrepreneurial Community
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-xl md:text-2xl mb-8 text-white/90"
            >
              Start building your startup journey today with fellow Panthers.
            </motion.p>
            <motion.div variants={fadeInUp}>
              <Link
                href="/auth/signup"
                className="group relative inline-flex items-center px-8 py-4 bg-white text-black rounded-xl font-semibold shadow-lg hover:shadow-white/25 transition-all duration-300 overflow-hidden"
              >
                <span className="relative z-10">Get Started Now</span>
                <svg
                  className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
                <div className="absolute inset-0 bg-blue-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative bg-[#090618] text-white py-12">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-[#090618] to-transparent opacity-50" />
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div>
              <h3 className="text-2xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">FounderConnect</h3>
              <p className="text-gray-400 text-lg">
                Empowering Chapman's student entrepreneurs to build amazing startups together.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-6 text-white">Features</h4>
              <ul className="space-y-4 text-gray-400">
                <li className="hover:text-white transition-colors duration-200">Co-Founder Matching</li>
                <li className="hover:text-white transition-colors duration-200">Startup Jobs</li>
                <li className="hover:text-white transition-colors duration-200">Resource Hub</li>
                <li className="hover:text-white transition-colors duration-200">Events</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-6 text-white">Resources</h4>
              <ul className="space-y-4 text-gray-400">
                <li className="hover:text-white transition-colors duration-200">Leatherby Center</li>
                <li className="hover:text-white transition-colors duration-200">eVillage</li>
                <li className="hover:text-white transition-colors duration-200">Help Center</li>
                <li className="hover:text-white transition-colors duration-200">Contact Us</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-6 text-white">Legal</h4>
              <ul className="space-y-4 text-gray-400">
                <li className="hover:text-white transition-colors duration-200">Privacy Policy</li>
                <li className="hover:text-white transition-colors duration-200">Terms of Service</li>
                <li className="hover:text-white transition-colors duration-200">Cookie Policy</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 mt-8 pt-6 text-center text-gray-400">
            <p>&copy; 2024 FounderConnect. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 