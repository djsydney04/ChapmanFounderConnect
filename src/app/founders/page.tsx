'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase, getCurrentUser, getProfile } from '@/utils/supabase';

interface Founder {
  id: string;
  user_id: string;
  full_name?: string;
  university: string;
  major?: string;
  year?: string;
  bio?: string;
  interests?: string[];
  skills?: string[];
}

export default function FoundersPage() {
  const router = useRouter();
  const [founders, setFounders] = useState<Founder[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [filter, setFilter] = useState('');
  const [skillFilter, setSkillFilter] = useState('');

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { user: currentUser, error } = await getCurrentUser();
        
        if (error || !currentUser) {
          router.push('/auth/signin');
          return;
        }
        
        setUser(currentUser);
        fetchFounders();
      } catch (error) {
        console.error('Error checking authentication:', error);
        router.push('/auth/signin');
      }
    };
    
    checkAuth();
  }, [router]);

  const fetchFounders = async () => {
    try {
      setLoading(true);
      
      // Get all profiles that have founder roles
      const { data: userRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id')
        .or('founder_looking_cofounder.eq.true,founder_looking_talent.eq.true');
      
      if (rolesError) {
        console.error('Error fetching founder roles:', rolesError);
        return;
      }
      
      if (!userRoles || userRoles.length === 0) {
        // If no founder roles found, just get all profiles as a fallback
        const { data: allProfiles, error: profilesError } = await supabase
          .from('profiles')
          .select('*');
        
        if (profilesError) {
          console.error('Error fetching profiles:', profilesError);
          return;
        }
        
        setFounders(allProfiles || []);
        return;
      }
      
      // Get the profiles for the founder user IDs
      const founderUserIds = userRoles.map(role => role.user_id);
      const { data: founderProfiles, error: foundersError } = await supabase
        .from('profiles')
        .select('*')
        .in('user_id', founderUserIds);
      
      if (foundersError) {
        console.error('Error fetching founder profiles:', foundersError);
        return;
      }
      
      setFounders(founderProfiles || []);
    } catch (error) {
      console.error('Error fetching founders:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredFounders = founders.filter(founder => {
    const matchesSearch = 
      !filter || 
      (founder.full_name && founder.full_name.toLowerCase().includes(filter.toLowerCase())) ||
      (founder.bio && founder.bio.toLowerCase().includes(filter.toLowerCase())) ||
      (founder.major && founder.major.toLowerCase().includes(filter.toLowerCase()));
    
    const matchesSkill = 
      !skillFilter || 
      (founder.skills && founder.skills.some(skill => 
        skill.toLowerCase().includes(skillFilter.toLowerCase())
      ));
    
    return matchesSearch && matchesSkill;
  });

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
            <Link href="/founders" className="px-3 py-2 rounded-md bg-white/20 transition-colors">
              Founders
            </Link>
            <Link href="/jobs" className="px-3 py-2 rounded-md hover:bg-white/10 transition-colors">
              Jobs
            </Link>
            <Link href="/resources" className="px-3 py-2 rounded-md hover:bg-white/10 transition-colors">
              Resources
            </Link>
            <Link href="/profile" className="px-3 py-2 rounded-md hover:bg-white/10 transition-colors">
              Profile
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10 shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Find Co-Founders</h1>
            <div className="flex space-x-4">
              <div>
                <input
                  type="text"
                  placeholder="Search by name, bio, major..."
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="px-4 py-2 bg-black/30 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-white/50"
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Filter by skill..."
                  value={skillFilter}
                  onChange={(e) => setSkillFilter(e.target.value)}
                  className="px-4 py-2 bg-black/30 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-white/50"
                />
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
            </div>
          ) : filteredFounders.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-gray-400">No founders found matching your criteria.</p>
              <p className="mt-2 text-gray-500">Try adjusting your filters or check back later.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFounders.map((founder) => (
                <div 
                  key={founder.id} 
                  className="bg-white/10 rounded-lg p-6 border border-white/10 hover:border-white/30 transition-all duration-300"
                >
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-xl font-bold">
                      {founder.full_name ? founder.full_name.charAt(0) : '?'}
                    </div>
                    <div className="ml-4">
                      <h3 className="text-xl font-semibold">{founder.full_name || 'Anonymous Founder'}</h3>
                      <p className="text-gray-400">{founder.major || 'Undisclosed Major'} • {founder.year || 'Undisclosed Year'}</p>
                    </div>
                  </div>
                  
                  <p className="text-gray-300 mb-4 line-clamp-3">
                    {founder.bio || 'No bio provided.'}
                  </p>
                  
                  {founder.interests && founder.interests.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-400 mb-2">Interests</h4>
                      <div className="flex flex-wrap gap-2">
                        {founder.interests.slice(0, 5).map((interest, index) => (
                          <span key={index} className="px-2 py-1 bg-blue-900/30 text-blue-200 text-xs rounded-md">
                            {interest}
                          </span>
                        ))}
                        {founder.interests.length > 5 && (
                          <span className="px-2 py-1 bg-blue-900/30 text-blue-200 text-xs rounded-md">
                            +{founder.interests.length - 5} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {founder.skills && founder.skills.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-400 mb-2">Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        {founder.skills.slice(0, 5).map((skill, index) => (
                          <span key={index} className="px-2 py-1 bg-purple-900/30 text-purple-200 text-xs rounded-md">
                            {skill}
                          </span>
                        ))}
                        {founder.skills.length > 5 && (
                          <span className="px-2 py-1 bg-purple-900/30 text-purple-200 text-xs rounded-md">
                            +{founder.skills.length - 5} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex justify-end mt-4">
                    <button 
                      className="px-4 py-2 bg-white text-black rounded-md hover:bg-blue-50 transition-colors"
                      onClick={() => router.push(`/profile/${founder.user_id}`)}
                    >
                      View Profile
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
} 