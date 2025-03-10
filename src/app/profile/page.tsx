'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase, getCurrentUser, getProfile, updateProfile } from '@/utils/supabase';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    bio: '',
    major: '',
    year: '',
    interests: '',
    skills: '',
    linkedin_url: '',
    twitter_url: '',
  });
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { user: currentUser, error } = await getCurrentUser();
        
        if (error || !currentUser) {
          router.push('/auth/signin');
          return;
        }
        
        setUser(currentUser);
        
        // Fetch user profile
        const { profile: userProfile, error: profileError } = await getProfile(currentUser.id);
        
        if (profileError) {
          console.error('Error fetching profile:', profileError);
          return;
        }
        
        if (userProfile) {
          setProfile(userProfile);
          setFormData({
            full_name: userProfile.full_name || '',
            bio: userProfile.bio || '',
            major: userProfile.major || '',
            year: userProfile.year || '',
            interests: userProfile.interests ? userProfile.interests.join(', ') : '',
            skills: userProfile.skills ? userProfile.skills.join(', ') : '',
            linkedin_url: userProfile.linkedin_url || '',
            twitter_url: userProfile.twitter_url || '',
          });
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        router.push('/auth/signin');
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    
    try {
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      // Convert comma-separated strings to arrays
      const interests = formData.interests
        .split(',')
        .map(item => item.trim())
        .filter(item => item !== '');
      
      const skills = formData.skills
        .split(',')
        .map(item => item.trim())
        .filter(item => item !== '');
      
      const updates = {
        full_name: formData.full_name,
        bio: formData.bio,
        major: formData.major,
        year: formData.year,
        interests,
        skills,
        linkedin_url: formData.linkedin_url,
        twitter_url: formData.twitter_url,
      };
      
      const { profile: updatedProfile, error } = await updateProfile(user.id, updates);
      
      if (error) {
        throw error;
      }
      
      if (updatedProfile) {
        setProfile(updatedProfile);
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
        setIsEditing(false);
      }
    } catch (error: any) {
      console.error('Error updating profile:', error);
      setMessage({ type: 'error', text: error.message || 'Failed to update profile' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090618] text-white">
      {/* Header */}
      <header className="bg-black/30 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/dashboard" className="text-2xl font-bold">FounderConnect</Link>
          <nav className="flex space-x-4">
            <Link href="/dashboard" className="px-3 py-2 rounded-md hover:bg-white/10 transition-colors">
              Dashboard
            </Link>
            <Link href="/founders" className="px-3 py-2 rounded-md hover:bg-white/10 transition-colors">
              Founders
            </Link>
            <Link href="/jobs" className="px-3 py-2 rounded-md hover:bg-white/10 transition-colors">
              Jobs
            </Link>
            <Link href="/resources" className="px-3 py-2 rounded-md hover:bg-white/10 transition-colors">
              Resources
            </Link>
            <Link href="/profile" className="px-3 py-2 rounded-md bg-white/20 transition-colors">
              Profile
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10 shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Your Profile</h1>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-white text-black rounded-md hover:bg-blue-50 transition-colors"
              >
                Edit Profile
              </button>
            )}
          </div>

          {message && (
            <div className={`mb-6 p-4 rounded-md ${message.type === 'success' ? 'bg-green-900/20 border border-green-500/50 text-green-200' : 'bg-red-900/20 border border-red-500/50 text-red-200'}`}>
              {message.text}
            </div>
          )}

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
            </div>
          ) : isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="full_name" className="block text-sm font-medium text-gray-200 mb-1">
                    Full Name
                  </label>
                  <input
                    id="full_name"
                    name="full_name"
                    type="text"
                    value={formData.full_name}
                    onChange={handleChange}
                    className="appearance-none block w-full px-3 py-2 border border-white/30 bg-black/30 text-white rounded-md shadow-sm focus:outline-none focus:ring-white/50 focus:border-white/50"
                  />
                </div>

                <div>
                  <label htmlFor="major" className="block text-sm font-medium text-gray-200 mb-1">
                    Major
                  </label>
                  <input
                    id="major"
                    name="major"
                    type="text"
                    value={formData.major}
                    onChange={handleChange}
                    className="appearance-none block w-full px-3 py-2 border border-white/30 bg-black/30 text-white rounded-md shadow-sm focus:outline-none focus:ring-white/50 focus:border-white/50"
                  />
                </div>

                <div>
                  <label htmlFor="year" className="block text-sm font-medium text-gray-200 mb-1">
                    Year
                  </label>
                  <select
                    id="year"
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    className="appearance-none block w-full px-3 py-2 border border-white/30 bg-black/30 text-white rounded-md shadow-sm focus:outline-none focus:ring-white/50 focus:border-white/50"
                  >
                    <option value="">Select Year</option>
                    <option value="Freshman">Freshman</option>
                    <option value="Sophomore">Sophomore</option>
                    <option value="Junior">Junior</option>
                    <option value="Senior">Senior</option>
                    <option value="Graduate">Graduate</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="interests" className="block text-sm font-medium text-gray-200 mb-1">
                    Interests (comma separated)
                  </label>
                  <input
                    id="interests"
                    name="interests"
                    type="text"
                    value={formData.interests}
                    onChange={handleChange}
                    className="appearance-none block w-full px-3 py-2 border border-white/30 bg-black/30 text-white rounded-md shadow-sm focus:outline-none focus:ring-white/50 focus:border-white/50"
                  />
                </div>

                <div>
                  <label htmlFor="skills" className="block text-sm font-medium text-gray-200 mb-1">
                    Skills (comma separated)
                  </label>
                  <input
                    id="skills"
                    name="skills"
                    type="text"
                    value={formData.skills}
                    onChange={handleChange}
                    className="appearance-none block w-full px-3 py-2 border border-white/30 bg-black/30 text-white rounded-md shadow-sm focus:outline-none focus:ring-white/50 focus:border-white/50"
                  />
                </div>

                <div>
                  <label htmlFor="linkedin_url" className="block text-sm font-medium text-gray-200 mb-1">
                    LinkedIn URL
                  </label>
                  <input
                    id="linkedin_url"
                    name="linkedin_url"
                    type="text"
                    value={formData.linkedin_url}
                    onChange={handleChange}
                    className="appearance-none block w-full px-3 py-2 border border-white/30 bg-black/30 text-white rounded-md shadow-sm focus:outline-none focus:ring-white/50 focus:border-white/50"
                  />
                </div>

                <div>
                  <label htmlFor="twitter_url" className="block text-sm font-medium text-gray-200 mb-1">
                    X (Twitter) URL
                  </label>
                  <input
                    id="twitter_url"
                    name="twitter_url"
                    type="text"
                    value={formData.twitter_url}
                    onChange={handleChange}
                    className="appearance-none block w-full px-3 py-2 border border-white/30 bg-black/30 text-white rounded-md shadow-sm focus:outline-none focus:ring-white/50 focus:border-white/50"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="bio" className="block text-sm font-medium text-gray-200 mb-1">
                  Bio
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  rows={4}
                  value={formData.bio}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-white/30 bg-black/30 text-white rounded-md shadow-sm focus:outline-none focus:ring-white/50 focus:border-white/50"
                />
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 border border-white/30 text-white rounded-md hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 bg-white text-black rounded-md hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          ) : profile ? (
            <div className="space-y-8">
              <div className="flex items-center">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-4xl font-bold">
                  {profile.full_name ? profile.full_name.charAt(0) : user?.email?.charAt(0) || '?'}
                </div>
                <div className="ml-6">
                  <h2 className="text-2xl font-bold">{profile.full_name || 'Anonymous User'}</h2>
                  <p className="text-gray-400">{profile.major} {profile.year ? `• ${profile.year}` : ''}</p>
                  <p className="text-gray-400">{user?.email}</p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Bio</h3>
                <p className="text-gray-300">{profile.bio || 'No bio provided.'}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {profile.interests && profile.interests.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Interests</h3>
                    <div className="flex flex-wrap gap-2">
                      {profile.interests.map((interest: string, index: number) => (
                        <span key={index} className="px-3 py-1 bg-blue-900/30 text-blue-200 text-sm rounded-md">
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {profile.skills && profile.skills.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {profile.skills.map((skill: string, index: number) => (
                        <span key={index} className="px-3 py-1 bg-purple-900/30 text-purple-200 text-sm rounded-md">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {(profile.linkedin_url || profile.twitter_url) && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Social Links</h3>
                  <div className="flex space-x-4">
                    {profile.linkedin_url && (
                      <a 
                        href={profile.linkedin_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-300 hover:text-blue-200 transition-colors"
                      >
                        LinkedIn
                      </a>
                    )}
                    {profile.twitter_url && (
                      <a 
                        href={profile.twitter_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-300 hover:text-blue-200 transition-colors"
                      >
                        X (Twitter)
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-xl text-gray-400">No profile information found.</p>
              <p className="mt-2 text-gray-500">Click "Edit Profile" to add your information.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
} 