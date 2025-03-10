'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase, signIn, signUp, signOut, getCurrentUser, getProfile, createProfile as createUserProfile, updateProfile as updateUserProfile, User, Profile } from './supabase';

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ data: any; error: any }>;
  signUp: (email: string, password: string) => Promise<{ data: any; error: any }>;
  signOut: () => Promise<{ error: any }>;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isDemo = searchParams?.get('demo') === 'true';
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check active session and fetch user profile
    const checkUser = async () => {
      try {
        setIsLoading(true);
        
        // Handle demo mode
        if (isDemo) {
          console.log('Demo mode detected, creating demo user');
          setUser({
            id: 'demo-user-id',
            email: 'demo@example.com',
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
          
          setIsLoading(false);
          return;
        }
        
        const { user, error } = await getCurrentUser();
        
        if (error) {
          console.error('Error fetching user:', error);
          return;
        }
        
        if (user) {
          setUser({
            id: user.id,
            email: user.email || '',
          });
          
          // Fetch user profile
          try {
            const { profile, error: profileError } = await getProfile(user.id);
            
            if (profileError) {
              console.error('Error fetching profile:', profileError);
            }
            
            // If profile exists, set it
            if (profile) {
              setProfile(profile);
            } else {
              // If no profile exists, create a basic one
              console.log('No profile found, creating a basic one');
              try {
                // Create a minimal profile to avoid errors
                const basicProfile = {
                  user_id: user.id,
                  university: 'Chapman University',
                  bio: null,
                  interests: [],
                };
                
                const { profile: newProfile, error: createError } = await createUserProfile(basicProfile);
                
                if (createError) {
                  console.error('Error creating basic profile:', createError);
                  // Create a fallback profile in memory if we can't create one in the database
                  setProfile({
                    id: 'temp-' + user.id,
                    user_id: user.id,
                    university: 'Chapman University',
                    bio: null,
                    interests: [],
                    created_at: new Date().toISOString()
                  });
                } else if (newProfile) {
                  setProfile(newProfile);
                }
              } catch (createProfileError) {
                console.error('Error creating basic profile:', createProfileError);
                // Create a fallback profile in memory
                setProfile({
                  id: 'temp-' + user.id,
                  user_id: user.id,
                  university: 'Chapman University',
                  bio: null,
                  interests: [],
                  created_at: new Date().toISOString()
                });
              }
            }
          } catch (profileError) {
            console.error('Error handling profile:', profileError);
            // Create a fallback profile in memory
            setProfile({
              id: 'temp-' + user.id,
              user_id: user.id,
              university: 'Chapman University',
              bio: null,
              interests: [],
              created_at: new Date().toISOString()
            });
          }
        }
      } catch (error) {
        console.error('Error in auth state check:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkUser();
    
    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email || '',
          });
          
          // Fetch user profile
          try {
            const { profile, error: profileError } = await getProfile(session.user.id);
            
            if (profileError) {
              console.error('Error fetching profile on auth change:', profileError);
            }
            
            if (profile) {
              setProfile(profile);
            } else {
              // If no profile exists, create a basic one
              try {
                // Create a minimal profile to avoid errors
                const basicProfile = {
                  user_id: session.user.id,
                  university: 'Chapman University',
                  bio: null,
                  interests: [],
                };
                
                const { profile: newProfile, error: createError } = await createUserProfile(basicProfile);
                
                if (createError) {
                  console.error('Error creating basic profile on auth change:', createError);
                  // Create a fallback profile in memory
                  setProfile({
                    id: 'temp-' + session.user.id,
                    user_id: session.user.id,
                    university: 'Chapman University',
                    bio: null,
                    interests: [],
                    created_at: new Date().toISOString()
                  });
                } else if (newProfile) {
                  setProfile(newProfile);
                }
              } catch (createProfileError) {
                console.error('Error creating basic profile on auth change:', createProfileError);
                // Create a fallback profile in memory
                setProfile({
                  id: 'temp-' + session.user.id,
                  user_id: session.user.id,
                  university: 'Chapman University',
                  bio: null,
                  interests: [],
                  created_at: new Date().toISOString()
                });
              }
            }
          } catch (profileError) {
            console.error('Error handling profile on auth change:', profileError);
            // Create a fallback profile in memory
            setProfile({
              id: 'temp-' + session.user.id,
              user_id: session.user.id,
              university: 'Chapman University',
              bio: null,
              interests: [],
              created_at: new Date().toISOString()
            });
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setProfile(null);
        }
      }
    );
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [router, isDemo]);

  // Handle sign in
  const handleSignIn = async (email: string, password: string) => {
    return await signIn(email, password);
  };

  // Handle sign up
  const handleSignUp = async (email: string, password: string) => {
    return await signUp(email, password);
  };

  // Handle sign out
  const handleSignOut = async () => {
    const { error } = await signOut();
    if (!error) {
      router.push('/');
    }
    return { error };
  };

  // Handle profile update
  const handleUpdateProfile = async (updates: Partial<Profile>) => {
    try {
      if (!user) throw new Error('User not authenticated');
      
      // If we're in demo mode or using a temporary profile, just update the local state
      if (isDemo || profile?.id.startsWith('temp-')) {
        setProfile({
          ...profile!,
          ...updates,
        });
        return;
      }
      
      const { profile: updatedProfile, error } = await updateUserProfile(user.id, updates);
      
      if (error) throw error;
      if (updatedProfile) setProfile(updatedProfile);
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  const value = {
    user,
    profile,
    isLoading,
    signIn: handleSignIn,
    signUp: handleSignUp,
    signOut: handleSignOut,
    updateProfile: handleUpdateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 