'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase, getCurrentUser } from '@/utils/supabase';

interface Job {
  id: string;
  title: string;
  company: string;
  description: string;
  location: string;
  type: string; // 'full-time', 'part-time', 'internship', 'contract'
  skills_required: string[];
  posted_by: string;
  posted_at: string;
}

// Mock data for jobs until we have a real jobs table
const MOCK_JOBS: Job[] = [
  {
    id: '1',
    title: 'Frontend Developer',
    company: 'TechStartup',
    description: 'We are looking for a talented frontend developer to join our team and help build our next-generation web application. You will be responsible for implementing visual elements and user interactions that users see and interact with in the web application.',
    location: 'Remote',
    type: 'part-time',
    skills_required: ['React', 'TypeScript', 'Tailwind CSS'],
    posted_by: 'user123',
    posted_at: '2023-05-15T00:00:00Z',
  },
  {
    id: '2',
    title: 'UI/UX Designer',
    company: 'DesignHub',
    description: 'Join our creative team as a UI/UX Designer to create beautiful and functional interfaces for our clients. You will work closely with developers and product managers to deliver exceptional user experiences.',
    location: 'Hybrid',
    type: 'internship',
    skills_required: ['Figma', 'Adobe XD', 'User Research'],
    posted_by: 'user456',
    posted_at: '2023-05-10T00:00:00Z',
  },
  {
    id: '3',
    title: 'Full Stack Developer',
    company: 'WebSolutions',
    description: 'We are seeking a Full Stack Developer to join our team. You will be responsible for developing and maintaining both front-end and back-end components of our web applications.',
    location: 'On-site',
    type: 'full-time',
    skills_required: ['JavaScript', 'Node.js', 'React', 'MongoDB'],
    posted_by: 'user789',
    posted_at: '2023-05-05T00:00:00Z',
  },
  {
    id: '4',
    title: 'Marketing Intern',
    company: 'GrowthHackers',
    description: 'Join our marketing team as an intern and gain hands-on experience in digital marketing, social media management, and content creation. This is a great opportunity for students looking to build their marketing portfolio.',
    location: 'Remote',
    type: 'internship',
    skills_required: ['Social Media', 'Content Writing', 'Analytics'],
    posted_by: 'user101',
    posted_at: '2023-05-01T00:00:00Z',
  },
  {
    id: '5',
    title: 'Product Manager',
    company: 'InnovateCo',
    description: 'We are looking for a Product Manager to lead the development of our new SaaS platform. You will work with cross-functional teams to define product requirements, create roadmaps, and deliver a successful product.',
    location: 'Hybrid',
    type: 'full-time',
    skills_required: ['Product Management', 'Agile', 'User Stories', 'Roadmapping'],
    posted_by: 'user202',
    posted_at: '2023-04-28T00:00:00Z',
  },
];

export default function JobsPage() {
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [filter, setFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { user: currentUser, error } = await getCurrentUser();
        
        if (error || !currentUser) {
          router.push('/auth/signin');
          return;
        }
        
        setUser(currentUser);
        fetchJobs();
      } catch (error) {
        console.error('Error checking authentication:', error);
        router.push('/auth/signin');
      }
    };
    
    checkAuth();
  }, [router]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      
      // In a real app, you would fetch jobs from your database
      // For now, we'll use mock data
      setJobs(MOCK_JOBS);
      
      // Example of how you would fetch from a real jobs table:
      /*
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .order('posted_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching jobs:', error);
        return;
      }
      
      setJobs(data || []);
      */
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = 
      !filter || 
      job.title.toLowerCase().includes(filter.toLowerCase()) ||
      job.company.toLowerCase().includes(filter.toLowerCase()) ||
      job.description.toLowerCase().includes(filter.toLowerCase());
    
    const matchesType = 
      !typeFilter || 
      job.type.toLowerCase() === typeFilter.toLowerCase();
    
    const matchesLocation = 
      !locationFilter || 
      job.location.toLowerCase() === locationFilter.toLowerCase();
    
    return matchesSearch && matchesType && matchesLocation;
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
            <Link href="/founders" className="px-3 py-2 rounded-md hover:bg-white/10 transition-colors">
              Founders
            </Link>
            <Link href="/jobs" className="px-3 py-2 rounded-md bg-white/20 transition-colors">
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
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div>
              <h1 className="text-2xl font-bold">Startup Jobs</h1>
              <p className="text-gray-400">Find opportunities at exciting startups</p>
            </div>
            <div className="flex flex-col md:flex-row gap-4">
              <input
                type="text"
                placeholder="Search jobs..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-4 py-2 bg-black/30 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-white/50"
              />
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-4 py-2 bg-black/30 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-white/50"
              >
                <option value="">All Job Types</option>
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="internship">Internship</option>
                <option value="contract">Contract</option>
              </select>
              <select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="px-4 py-2 bg-black/30 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-white/50"
              >
                <option value="">All Locations</option>
                <option value="remote">Remote</option>
                <option value="on-site">On-site</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end mb-4">
            <button 
              className="px-4 py-2 bg-white text-black rounded-md hover:bg-blue-50 transition-colors"
              onClick={() => router.push('/jobs/post')}
            >
              Post a Job
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-gray-400">No jobs found matching your criteria.</p>
              <p className="mt-2 text-gray-500">Try adjusting your filters or check back later.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredJobs.map((job) => (
                <div 
                  key={job.id} 
                  className="bg-white/10 rounded-lg p-6 border border-white/10 hover:border-white/30 transition-all duration-300"
                >
                  <div className="flex flex-col md:flex-row justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold">{job.title}</h3>
                      <p className="text-gray-400">{job.company}</p>
                    </div>
                    <div className="flex items-center mt-2 md:mt-0 space-x-2">
                      <span className={`px-3 py-1 rounded-full text-xs ${
                        job.type === 'full-time' ? 'bg-green-900/30 text-green-200' :
                        job.type === 'part-time' ? 'bg-blue-900/30 text-blue-200' :
                        job.type === 'internship' ? 'bg-purple-900/30 text-purple-200' :
                        'bg-orange-900/30 text-orange-200'
                      }`}>
                        {job.type.charAt(0).toUpperCase() + job.type.slice(1)}
                      </span>
                      <span className="px-3 py-1 bg-gray-800 text-gray-200 rounded-full text-xs">
                        {job.location}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-gray-300 mb-4 line-clamp-3">
                    {job.description}
                  </p>
                  
                  {job.skills_required && job.skills_required.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-400 mb-2">Skills Required</h4>
                      <div className="flex flex-wrap gap-2">
                        {job.skills_required.map((skill, index) => (
                          <span key={index} className="px-2 py-1 bg-indigo-900/30 text-indigo-200 text-xs rounded-md">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-sm text-gray-400">
                      Posted {new Date(job.posted_at).toLocaleDateString()}
                    </span>
                    <button 
                      className="px-4 py-2 bg-white text-black rounded-md hover:bg-blue-50 transition-colors"
                      onClick={() => router.push(`/jobs/${job.id}`)}
                    >
                      View Details
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