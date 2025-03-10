'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase, signOut, getCurrentUser, getProfile } from '@/utils/supabase';
import Link from 'next/link';

export default function DashboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isDemo = searchParams?.get('demo') === 'true';
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        setLoading(true);
        
        // If in demo mode, create a fake user
        if (isDemo) {
          setUser({
            id: 'demo-user-id',
            email: 'demo@example.com',
            last_sign_in_at: new Date().toISOString()
          });
          
          setProfile({
            id: 'demo-profile-id',
            user_id: 'demo-user-id',
            university: 'Chapman University',
            bio: 'Demo User - Computer Science Student',
            interests: ['Startups', 'Technology', 'Entrepreneurship'],
            created_at: new Date().toISOString(),
            full_name: 'Demo User',
            major: 'Computer Science',
            year: 'Senior',
            skills: ['Programming', 'Design', 'Marketing'],
            linkedin_url: 'https://linkedin.com',
            twitter_url: 'https://twitter.com'
          });
          
          setLoading(false);
          return;
        }
        
        // Check for manual session first
        const manualSession = localStorage.getItem('supabase.auth.token');
        if (manualSession) {
          try {
            const parsed = JSON.parse(manualSession);
            if (parsed.currentSession && parsed.currentSession.user) {
              const userData = parsed.currentSession.user;
              setUser(userData);
              
              // Get profile for this user
              const { profile } = await getProfile(userData.id);
              if (profile) {
                setProfile(profile);
              }
              
              setLoading(false);
              return;
            }
          } catch (e) {
            console.error('Error parsing manual session:', e);
          }
        }
        
        // Fall back to Supabase session
        const { user: currentUser, error } = await getCurrentUser();
        
        if (error || !currentUser) {
          console.error('Error fetching user or no user found:', error);
          router.push('/auth/signin');
          return;
        }
        
        setUser(currentUser);
        
        // Fetch user profile
        const { profile } = await getProfile(currentUser.id);
        if (profile) {
          setProfile(profile);
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        if (!isDemo) {
          router.push('/auth/signin');
        }
      } finally {
        setLoading(false);
      }
    };
    
    checkUser();
  }, [router, isDemo]);

  const handleSignOut = async () => {
    try {
      // Clear any manual session
      localStorage.removeItem('supabase.auth.token');
      
      if (isDemo) {
        // In demo mode, just redirect to signin
        router.push('/auth/signin');
        return;
      }
      
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
          <div className="flex items-center space-x-4">
            {isDemo && (
              <div className="px-3 py-1 bg-yellow-500/20 text-yellow-300 text-sm rounded-md">
                Demo Mode
              </div>
            )}
            <button
              onClick={handleSignOut}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-md transition-colors"
            >
              Sign Out
            </button>
          </div>
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
            {profile && (
              <div className="mt-4 pt-4 border-t border-white/10">
                <h3 className="text-lg font-semibold mb-2">Profile Information</h3>
                {profile.full_name && <p><strong>Name:</strong> {profile.full_name}</p>}
                {profile.major && <p><strong>Major:</strong> {profile.major}</p>}
                {profile.year && <p><strong>Year:</strong> {profile.year}</p>}
                {profile.bio && <p><strong>Bio:</strong> {profile.bio}</p>}
                {profile.university && <p><strong>University:</strong> {profile.university}</p>}
                {profile.interests && profile.interests.length > 0 && (
                  <div className="mt-2">
                    <strong>Interests:</strong>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {profile.interests.map((interest: string, index: number) => (
                        <span key={index} className="px-2 py-1 bg-white/10 rounded-md text-xs">
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            {isDemo && (
              <div className="mt-2 p-2 bg-yellow-500/10 text-yellow-300 text-sm rounded">
                <p>You are viewing the dashboard in demo mode. Some features may be limited.</p>
              </div>
            )}
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