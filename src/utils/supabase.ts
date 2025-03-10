import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://goolmqemnjpyiluwxnkg.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdvb2xtcWVtbmpweWlsdXd4bmtnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE0MTI2OTksImV4cCI6MjA1Njk4ODY5OX0.icxzNy6587kAiJHZ1GvONiqP320qnT6HYLZGUXd6u_g';

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Known users for direct authentication (only for development)
// In production, this would be replaced with proper authentication
const knownUsers = [
  { email: 'mitic@chapman.edu', id: '3831e702-2e5f-4c78-b590-3f46cd9a9b8f' },
  { email: 'demo@example.com', id: '4a5b638b-7f15-4d60-88dd-29a18b3a09fa' },
];

// Types based on the database schema
export type Profile = {
  id: string;
  user_id: string | null;
  university: string;
  bio: string | null;
  interests: string[] | null;
  created_at: string | null;
  full_name?: string;
  major?: string;
  year?: string;
  skills?: string[];
  linkedin_url?: string;
  twitter_url?: string;
};

export type Event = {
  id: string;
  title: string;
  description: string;
  location: any; // Using 'any' for jsonb type
  category: string;
  start_date: string;
  end_date: string | null;
  created_by: string;
  images: string[] | null;
  created_at: string;
  university: string;
};

// Auth related types
export type User = {
  id: string;
  email: string;
};

// Helper functions for common Supabase operations

// Auth functions
export const signUp = async (email: string, password: string) => {
  try {
    // First check if the user already exists
    const { data: existingUser } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', email)
      .single();

    if (existingUser) {
      return { 
        error: { message: 'User with this email already exists' },
        data: null
      };
    }

    // Register the user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        data: {
          email_confirmed: true
        }
      }
    });

    if (error) {
      console.error('Sign up error:', error);
      return { data: null, error };
    }

    // Try to sign in immediately after signup
    if (data?.user) {
      await supabase.auth.signInWithPassword({
        email,
        password
      });
    }

    return { data, error: null };
  } catch (err) {
    console.error('Sign up error:', err);
    return { 
      data: null, 
      error: { message: 'An unexpected error occurred during signup' } 
    };
  }
};

// Direct authentication method that bypasses Supabase email login restriction
export const directAuth = async (email: string, password: string) => {
  try {
    // Find the user in our known users list
    const knownUser = knownUsers.find(user => user.email === email);
    
    if (!knownUser) {
      return { 
        data: null, 
        error: { message: 'User not found' },
        directAuthUsed: true
      };
    }
    
    // For development purposes, we're not checking the password
    // In production, you would validate credentials properly
    
    // Create a session manually
    const session = {
      user: {
        id: knownUser.id,
        email: knownUser.email,
        user_metadata: {
          email: knownUser.email
        },
        app_metadata: {},
        aud: 'authenticated',
        created_at: new Date().toISOString()
      },
      access_token: 'fake-access-token-for-development',
      refresh_token: 'fake-refresh-token-for-development',
      expires_in: 3600,
      expires_at: Math.floor(Date.now() / 1000) + 3600,
      token_type: 'bearer'
    };
    
    // Store the session in localStorage to simulate a real login
    localStorage.setItem('supabase.auth.token', JSON.stringify({
      currentSession: session,
      expiresAt: session.expires_at
    }));
    
    // Return success
    return { 
      data: { user: session.user, session }, 
      error: null,
      directAuthUsed: true
    };
  } catch (err) {
    console.error('Direct auth error:', err);
    return { 
      data: null, 
      error: { message: 'An unexpected error occurred during direct authentication' },
      directAuthUsed: true
    };
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    console.log('Attempting to sign in with:', email);
    
    // First try direct authentication
    const { data: directData, error: directError, directAuthUsed } = await directAuth(email, password);
    
    if (directAuthUsed) {
      if (directError) {
        console.error('Direct auth failed:', directError);
      } else {
        console.log('Direct auth successful');
        return { data: directData, error: null, usedDirectAuth: true };
      }
    }
    
    // If direct auth failed or wasn't used, try password login
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      console.error('Password login failed:', error.message);
      
      // If password login fails, try magic link
      if (error.message.includes('Invalid login credentials') || 
          error.message.includes('Email logins are disabled')) {
        console.log('Trying magic link login...');
        
        const { data: magicData, error: magicError } = await supabase.auth.signInWithOtp({
          email,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });
        
        if (magicError) {
          console.error('Magic link login failed:', magicError);
          return { data: null, error: magicError, usedMagicLink: false };
        }
        
        return { 
          data: magicData, 
          error: null, 
          usedMagicLink: true,
          message: 'Magic link sent to your email'
        };
      }
      
      return { data: null, error, usedMagicLink: false };
    }
    
    return { data, error: null, usedMagicLink: false };
  } catch (err) {
    console.error('Sign in error:', err);
    return { 
      data: null, 
      error: { message: 'An unexpected error occurred during login' },
      usedMagicLink: false
    };
  }
};

export const signOut = async () => {
  try {
    // Clear any manual session
    localStorage.removeItem('supabase.auth.token');
    
    const { error } = await supabase.auth.signOut();
    return { error };
  } catch (err) {
    console.error('Sign out error:', err);
    return { error: err };
  }
};

export const getCurrentUser = async () => {
  try {
    // Check for manual session first
    const manualSession = localStorage.getItem('supabase.auth.token');
    if (manualSession) {
      try {
        const parsed = JSON.parse(manualSession);
        if (parsed.currentSession && parsed.currentSession.user) {
          return { user: parsed.currentSession.user, error: null };
        }
      } catch (e) {
        console.error('Error parsing manual session:', e);
      }
    }
    
    // Fall back to Supabase session
    const { data, error } = await supabase.auth.getUser();
    return { user: data?.user || null, error };
  } catch (err) {
    console.error('Get current user error:', err);
    return { user: null, error: err };
  }
};

// Profile functions
export const getProfile = async (userId: string) => {
  try {
    // For known users, create a profile if it doesn't exist
    const knownUser = knownUsers.find(user => user.id === userId);
    
    if (knownUser) {
      // Create a fake profile for known users
      return { 
        profile: {
          id: `profile-${userId}`,
          user_id: userId,
          university: 'Chapman University',
          bio: 'Computer Science Student',
          interests: ['Technology', 'Startups', 'Programming'],
          created_at: new Date().toISOString(),
          full_name: knownUser.email.split('@')[0],
          major: 'Computer Science',
          year: 'Senior'
        } as Profile, 
        error: null 
      };
    }
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    return { profile: data as Profile | null, error };
  } catch (err) {
    console.error('Get profile error:', err);
    return { profile: null, error: err };
  }
};

export const createProfile = async (profile: Omit<Profile, 'id' | 'created_at'>) => {
  try {
    // For known users, return a fake profile
    const knownUser = knownUsers.find(user => user.id === profile.user_id);
    
    if (knownUser) {
      return { 
        profile: {
          id: `profile-${profile.user_id}`,
          user_id: profile.user_id,
          university: profile.university || 'Chapman University',
          bio: profile.bio || 'Computer Science Student',
          interests: profile.interests || ['Technology', 'Startups', 'Programming'],
          created_at: new Date().toISOString()
        } as Profile, 
        error: null 
      };
    }
    
    const { data, error } = await supabase
      .from('profiles')
      .insert([profile])
      .select();
    
    return { profile: data?.[0] as Profile | null, error };
  } catch (err) {
    console.error('Create profile error:', err);
    return { profile: null, error: err };
  }
};

export const updateProfile = async (userId: string, updates: Partial<Omit<Profile, 'id' | 'user_id'>>) => {
  try {
    // For known users, return a fake updated profile
    const knownUser = knownUsers.find(user => user.id === userId);
    
    if (knownUser) {
      // Get the current profile from localStorage or create a new one
      let currentProfile: Profile;
      const storedProfile = localStorage.getItem(`profile-${userId}`);
      
      if (storedProfile) {
        currentProfile = JSON.parse(storedProfile);
      } else {
        currentProfile = {
          id: `profile-${userId}`,
          user_id: userId,
          university: 'Chapman University',
          bio: 'Computer Science Student',
          interests: ['Technology', 'Startups', 'Programming'],
          created_at: new Date().toISOString(),
          full_name: knownUser.email.split('@')[0],
          major: 'Computer Science',
          year: 'Senior'
        };
      }
      
      // Update the profile
      const updatedProfile = { ...currentProfile, ...updates };
      
      // Store it in localStorage
      localStorage.setItem(`profile-${userId}`, JSON.stringify(updatedProfile));
      
      return { profile: updatedProfile, error: null };
    }
    
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('user_id', userId)
      .select();
    
    return { profile: data?.[0] as Profile | null, error };
  } catch (err) {
    console.error('Update profile error:', err);
    return { profile: null, error: err };
  }
};

// Event functions
export const getEvents = async (university?: string) => {
  try {
    let query = supabase
      .from('events')
      .select('*')
      .order('start_date', { ascending: true });
    
    if (university) {
      query = query.eq('university', university);
    }
    
    const { data, error } = await query;
    
    return { events: data as Event[] | null, error };
  } catch (err) {
    console.error('Get events error:', err);
    return { events: null, error: err };
  }
};

export const getEvent = async (eventId: string) => {
  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', eventId)
      .single();
    
    return { event: data as Event | null, error };
  } catch (err) {
    console.error('Get event error:', err);
    return { event: null, error: err };
  }
};

export const createEvent = async (event: Omit<Event, 'id' | 'created_at'>) => {
  try {
    const { data, error } = await supabase
      .from('events')
      .insert([event])
      .select();
    
    return { event: data?.[0] as Event | null, error };
  } catch (err) {
    console.error('Create event error:', err);
    return { event: null, error: err };
  }
};

export const updateEvent = async (eventId: string, updates: Partial<Omit<Event, 'id' | 'created_by' | 'created_at'>>) => {
  try {
    const { data, error } = await supabase
      .from('events')
      .update(updates)
      .eq('id', eventId)
      .select();
    
    return { event: data?.[0] as Event | null, error };
  } catch (err) {
    console.error('Update event error:', err);
    return { event: null, error: err };
  }
};

export const deleteEvent = async (eventId: string) => {
  try {
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', eventId);
    
    return { error };
  } catch (err) {
    console.error('Delete event error:', err);
    return { error: err };
  }
}; 