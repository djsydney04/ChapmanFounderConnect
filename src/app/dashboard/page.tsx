'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase, signOut, getCurrentUser, getProfile } from '@/utils/supabase';
import Link from 'next/link';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { Users, Briefcase, Calendar, Book } from 'react-feather';

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

  // Mock data - replace with real data from your backend
  const userMock = {
    name: 'John',
    suggestedConnections: [
      { id: 1, name: 'Sarah Chen', role: 'Software Engineer', major: 'Computer Science' },
      { id: 2, name: 'Mike Johnson', role: 'Product Designer', major: 'Design' },
    ],
  };

  const announcements = [
    {
      id: 1,
      title: 'New Feature: Video Chat',
      content: 'Connect with potential co-founders through our new video chat feature!',
      date: '2024-03-10',
    },
    {
      id: 2,
      title: 'Upcoming Pitch Night',
      content: 'Join us for our monthly pitch night next week.',
      date: '2024-03-15',
    },
  ];

  const recentActivity = [
    {
      id: 1,
      type: 'connection',
      content: 'Alex matched with you!',
      time: '2 hours ago',
    },
    {
      id: 2,
      type: 'job',
      content: 'New job posted: Frontend Developer at TechStart',
      time: '5 hours ago',
    },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Welcome Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h1 className="text-2xl font-bold text-gray-800">Welcome back, {userMock.name}! 👋</h1>
          <p className="mt-2 text-gray-600">Ready to find your next co-founder or startup opportunity?</p>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href="/co-founders" className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold">Find Co-Founders</h3>
                <p className="text-sm text-gray-600">Match with potential partners</p>
              </div>
            </div>
          </Link>

          <Link href="/jobs" className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <Briefcase className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold">Job Board</h3>
                <p className="text-sm text-gray-600">Find startup opportunities</p>
              </div>
            </div>
          </Link>

          <Link href="/events" className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-4">
              <div className="bg-purple-100 p-3 rounded-lg">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold">Events</h3>
                <p className="text-sm text-gray-600">Join startup events</p>
              </div>
            </div>
          </Link>

          <Link href="/resources" className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-4">
              <div className="bg-orange-100 p-3 rounded-lg">
                <Book className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold">Resources</h3>
                <p className="text-sm text-gray-600">Access startup guides</p>
              </div>
            </div>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Announcements */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Announcements</h2>
            <div className="space-y-4">
              {announcements.map((announcement) => (
                <div key={announcement.id} className="border-b pb-4 last:border-b-0 last:pb-0">
                  <h3 className="font-medium">{announcement.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{announcement.content}</p>
                  <span className="text-xs text-gray-500 mt-2 block">{announcement.date}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Feed */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.type === 'connection' ? 'bg-blue-500' : 'bg-green-500'
                  }`} />
                  <div>
                    <p className="text-sm">{activity.content}</p>
                    <span className="text-xs text-gray-500">{activity.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 