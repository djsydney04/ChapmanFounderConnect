import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://goolmqemnjpyiluwxnkg.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdvb2xtcWVtbmpweWlsdXd4bmtnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE0MTI2OTksImV4cCI6MjA1Njk4ODY5OX0.icxzNy6587kAiJHZ1GvONiqP320qnT6HYLZGUXd6u_g';

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types based on the database schema
export type Profile = {
  id: string;
  user_id: string | null;
  university: string;
  bio: string | null;
  interests: string[] | null;
  created_at: string | null;
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
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  return { data, error };
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
  const { data, error } = await supabase.auth.getUser();
  return { user: data.user, error };
};

// Profile functions
export const getProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .single();
  
  return { profile: data as Profile | null, error };
};

export const createProfile = async (profile: Omit<Profile, 'id' | 'created_at'>) => {
  const { data, error } = await supabase
    .from('profiles')
    .insert([profile])
    .select();
  
  return { profile: data?.[0] as Profile | null, error };
};

export const updateProfile = async (userId: string, updates: Partial<Omit<Profile, 'id' | 'user_id'>>) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('user_id', userId)
    .select();
  
  return { profile: data?.[0] as Profile | null, error };
};

// Event functions
export const getEvents = async (university?: string) => {
  let query = supabase
    .from('events')
    .select('*')
    .order('start_date', { ascending: true });
  
  if (university) {
    query = query.eq('university', university);
  }
  
  const { data, error } = await query;
  
  return { events: data as Event[] | null, error };
};

export const getEvent = async (eventId: string) => {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('id', eventId)
    .single();
  
  return { event: data as Event | null, error };
};

export const createEvent = async (event: Omit<Event, 'id' | 'created_at'>) => {
  const { data, error } = await supabase
    .from('events')
    .insert([event])
    .select();
  
  return { event: data?.[0] as Event | null, error };
};

export const updateEvent = async (eventId: string, updates: Partial<Omit<Event, 'id' | 'created_by' | 'created_at'>>) => {
  const { data, error } = await supabase
    .from('events')
    .update(updates)
    .eq('id', eventId)
    .select();
  
  return { event: data?.[0] as Event | null, error };
};

export const deleteEvent = async (eventId: string) => {
  const { error } = await supabase
    .from('events')
    .delete()
    .eq('id', eventId);
  
  return { error };
}; 