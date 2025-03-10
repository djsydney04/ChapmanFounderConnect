'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase, signOut } from '@/utils/supabase';
import Link from 'next/link';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        setLoading(true);
        const { data } = await supabase.auth.getSession();
        
        if (!data.session) {
          // No active session, redirect to login
          router.push('/auth/signin');
          return;
        }
        
        // Get user details
        const { data: userData } = await supabase.auth.getUser();
        setUser(userData.user);
      } catch (error) {
        console.error('Error checking authentication:', error);
        router.push('/auth/signin');
      } finally {
        setLoading(false);
      }
    };
    
    checkUser();
  }, [router]);

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/auth/signin');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#090618] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mx-auto mb-4"></div>
          <h2 className="text-xl text-white font-medium">Loading...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#090618] text-white">
      {/* Header */}
      <header className="bg-black/30 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">FounderConnect</Link>
          <button
            onClick={handleSignOut}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-md transition-colors"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10 shadow-xl">
          <h1 className="text-2xl font-bold mb-6">Welcome to your Dashboard</h1>
          
          <div className="bg-white/10 rounded-lg p-4 mb-6">
            <h2 className="text-xl font-semibold mb-2">Your Account</h2>
            <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>User ID:</strong> {user?.id}</p>
            <p><strong>Last Sign In:</strong> {new Date(user?.last_sign_in_at || Date.now()).toLocaleString()}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/10 rounded-lg p-4">
              <h2 className="text-xl font-semibold mb-4">Find Co-Founders</h2>
              <p className="text-gray-300 mb-4">Connect with potential co-founders who complement your skills.</p>
              <button className="px-4 py-2 bg-white text-black rounded-md hover:bg-blue-50 transition-colors">
                Explore Founders
              </button>
            </div>
            
            <div className="bg-white/10 rounded-lg p-4">
              <h2 className="text-xl font-semibold mb-4">Startup Jobs</h2>
              <p className="text-gray-300 mb-4">Find opportunities at exciting startups or post your own listings.</p>
              <button className="px-4 py-2 bg-white text-black rounded-md hover:bg-blue-50 transition-colors">
                View Jobs
              </button>
            </div>
            
            <div className="bg-white/10 rounded-lg p-4">
              <h2 className="text-xl font-semibold mb-4">Upcoming Events</h2>
              <p className="text-gray-300 mb-4">Networking events, workshops, and pitch competitions.</p>
              <button className="px-4 py-2 bg-white text-black rounded-md hover:bg-blue-50 transition-colors">
                See Events
              </button>
            </div>
            
            <div className="bg-white/10 rounded-lg p-4">
              <h2 className="text-xl font-semibold mb-4">Resources</h2>
              <p className="text-gray-300 mb-4">Access startup guides, templates, and learning materials.</p>
              <button className="px-4 py-2 bg-white text-black rounded-md hover:bg-blue-50 transition-colors">
                Browse Resources
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 