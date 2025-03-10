'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser } from '@/utils/supabase';

interface Resource {
  id: string;
  title: string;
  description: string;
  category: string;
  url: string;
  image: string;
}

// Mock data for resources
const RESOURCES: Resource[] = [
  {
    id: '1',
    title: 'Startup Legal Guide',
    description: 'A comprehensive guide to legal considerations for startups, including incorporation, intellectual property, and contracts.',
    category: 'Legal',
    url: 'https://example.com/startup-legal-guide',
    image: '/images/resources/legal.jpg',
  },
  {
    id: '2',
    title: 'Pitch Deck Template',
    description: 'A customizable pitch deck template to help you create a compelling presentation for investors.',
    category: 'Fundraising',
    url: 'https://example.com/pitch-deck-template',
    image: '/images/resources/pitch.jpg',
  },
  {
    id: '3',
    title: 'Marketing Strategy for Startups',
    description: 'Learn how to create an effective marketing strategy for your startup with limited resources.',
    category: 'Marketing',
    url: 'https://example.com/startup-marketing',
    image: '/images/resources/marketing.jpg',
  },
  {
    id: '4',
    title: 'Financial Modeling Template',
    description: 'A financial modeling template to help you forecast your startup\'s financial performance.',
    category: 'Finance',
    url: 'https://example.com/financial-model',
    image: '/images/resources/finance.jpg',
  },
  {
    id: '5',
    title: 'User Research Guide',
    description: 'A guide to conducting effective user research to validate your product ideas.',
    category: 'Product',
    url: 'https://example.com/user-research',
    image: '/images/resources/research.jpg',
  },
  {
    id: '6',
    title: 'Startup Funding Options',
    description: 'An overview of different funding options for startups, from bootstrapping to venture capital.',
    category: 'Fundraising',
    url: 'https://example.com/funding-options',
    image: '/images/resources/funding.jpg',
  },
  {
    id: '7',
    title: 'Product Development Roadmap',
    description: 'A template for creating a product development roadmap for your startup.',
    category: 'Product',
    url: 'https://example.com/product-roadmap',
    image: '/images/resources/product.jpg',
  },
  {
    id: '8',
    title: 'Startup Hiring Guide',
    description: 'Best practices for hiring and building a team for your startup.',
    category: 'HR',
    url: 'https://example.com/startup-hiring',
    image: '/images/resources/hiring.jpg',
  },
];

// Resource categories
const CATEGORIES = [
  'All',
  'Legal',
  'Fundraising',
  'Marketing',
  'Finance',
  'Product',
  'HR',
];

export default function ResourcesPage() {
  const router = useRouter();
  const [resources, setResources] = useState<Resource[]>(RESOURCES);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [filter, setFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { user: currentUser, error } = await getCurrentUser();
        
        if (error || !currentUser) {
          router.push('/auth/signin');
          return;
        }
        
        setUser(currentUser);
        setLoading(false);
      } catch (error) {
        console.error('Error checking authentication:', error);
        router.push('/auth/signin');
      }
    };
    
    checkAuth();
  }, [router]);

  const filteredResources = resources.filter(resource => {
    const matchesSearch = 
      !filter || 
      resource.title.toLowerCase().includes(filter.toLowerCase()) ||
      resource.description.toLowerCase().includes(filter.toLowerCase());
    
    const matchesCategory = 
      categoryFilter === 'All' || 
      resource.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  const handleResourceClick = (url: string) => {
    window.open(url, '_blank');
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
            <Link href="/resources" className="px-3 py-2 rounded-md bg-white/20 transition-colors">
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
              <h1 className="text-2xl font-bold">Startup Resources</h1>
              <p className="text-gray-400">Guides, templates, and tools to help you build your startup</p>
            </div>
            <div className="flex flex-col md:flex-row gap-4">
              <input
                type="text"
                placeholder="Search resources..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-4 py-2 bg-black/30 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-white/50"
              />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-4 py-2 bg-black/30 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-white/50"
              >
                {CATEGORIES.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
            </div>
          ) : filteredResources.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-gray-400">No resources found matching your criteria.</p>
              <p className="mt-2 text-gray-500">Try adjusting your filters or check back later.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResources.map((resource) => (
                <div 
                  key={resource.id} 
                  className="bg-white/10 rounded-lg overflow-hidden border border-white/10 hover:border-white/30 transition-all duration-300 cursor-pointer"
                  onClick={() => handleResourceClick(resource.url)}
                >
                  <div className="h-40 bg-gradient-to-br from-purple-900/50 to-blue-900/50 flex items-center justify-center">
                    <div className="text-4xl font-bold text-white/70">
                      {resource.category.charAt(0)}
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-semibold">{resource.title}</h3>
                      <span className="px-2 py-1 bg-white/10 text-white/70 text-xs rounded-md">
                        {resource.category}
                      </span>
                    </div>
                    <p className="text-gray-300 mb-4 line-clamp-3">
                      {resource.description}
                    </p>
                    <div className="flex justify-end">
                      <button className="text-sm text-blue-300 hover:text-blue-200 transition-colors">
                        View Resource →
                      </button>
                    </div>
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