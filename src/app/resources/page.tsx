'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { Book, Download, Star, Search, Bookmark, BookOpen } from 'react-feather';

export default function ResourcesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Mock data - replace with real data from your backend
  const resources = [
    {
      id: 1,
      title: 'How to Register Your Startup',
      description: 'A comprehensive guide to legally registering your startup, including necessary documents and steps.',
      category: 'Legal',
      type: 'Guide',
      author: 'Legal Team',
      downloadCount: 234,
      lastUpdated: '2024-02-15',
    },
    {
      id: 2,
      title: 'Pitch Deck Template',
      description: 'Professional pitch deck template with example slides and presentation tips.',
      category: 'Fundraising',
      type: 'Template',
      author: 'Investment Team',
      downloadCount: 567,
      lastUpdated: '2024-03-01',
    },
    {
      id: 3,
      title: 'Marketing Strategy Toolkit',
      description: 'Complete toolkit for planning and executing your startup\'s marketing strategy.',
      category: 'Marketing',
      type: 'Template',
      author: 'Marketing Team',
      downloadCount: 389,
      lastUpdated: '2024-03-10',
    },
    // Add more resources as needed
  ];

  const categories = [
    { id: 'all', name: 'All Resources', icon: Book },
    { id: 'legal', name: 'Legal', icon: BookOpen },
    { id: 'fundraising', name: 'Fundraising', icon: Star },
    { id: 'marketing', name: 'Marketing', icon: Bookmark },
  ];

  const filteredResources = resources.filter(resource => {
    if (selectedCategory !== 'all' && resource.category.toLowerCase() !== selectedCategory) {
      return false;
    }
    if (searchQuery) {
      return (
        resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return true;
  });

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Startup Resources</h1>
          <p className="text-gray-600">Access guides, templates, and tools to help grow your startup</p>
        </div>

        {/* Search and Categories */}
        <div className="space-y-6">
          {/* Search */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search resources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Categories */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`p-4 rounded-lg flex items-center space-x-3 transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-blue-50 text-blue-600'
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{category.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((resource) => (
            <div key={resource.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{resource.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">By {resource.author}</p>
                  </div>
                  <span className={`px-3 py-1 text-sm rounded-md ${
                    resource.type === 'Guide'
                      ? 'bg-purple-100 text-purple-600'
                      : 'bg-blue-100 text-blue-600'
                  }`}>
                    {resource.type}
                  </span>
                </div>

                <p className="mt-4 text-gray-600">{resource.description}</p>

                <div className="mt-4 flex items-center text-sm text-gray-500">
                  <Download className="w-4 h-4 mr-1" />
                  <span>{resource.downloadCount} downloads</span>
                  <span className="mx-2">•</span>
                  <span>Updated {resource.lastUpdated}</span>
                </div>

                <div className="mt-6 flex space-x-4">
                  <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Download
                  </button>
                  <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    Preview
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Featured Resources */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
          <h2 className="text-xl font-semibold mb-2">Featured Resource</h2>
          <p className="mb-4">Complete Startup Launch Checklist - Everything you need to know to launch your startup</p>
          <button className="px-6 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
            Get Started
          </button>
        </div>

        {/* Help Section */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Need Help?</h2>
          <p className="text-gray-600 mb-4">
            Can't find what you're looking for? Our team is here to help you find the right resources.
          </p>
          <button className="text-blue-600 hover:text-blue-700 font-medium">
            Contact Support →
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
} 