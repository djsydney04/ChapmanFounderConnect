'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { Briefcase, MapPin, Clock, DollarSign, Plus, Filter } from 'react-feather';

export default function JobBoardPage() {
  const [showPostJob, setShowPostJob] = useState(false);
  const [filters, setFilters] = useState({
    type: '',
    location: '',
    category: '',
  });

  // Mock data - replace with real data from your backend
  const jobs = [
    {
      id: 1,
      title: 'Frontend Developer',
      company: 'TechStart',
      location: 'San Francisco, CA',
      type: 'Full-time',
      category: 'Engineering',
      salary: '$80,000 - $120,000',
      description: 'Looking for a frontend developer to join our early-stage startup...',
      requirements: [
        'Strong experience with React and TypeScript',
        'Understanding of modern web technologies',
        '2+ years of experience',
      ],
      postedAt: '2 days ago',
      applicants: 12,
    },
    {
      id: 2,
      title: 'Product Marketing Manager',
      company: 'GrowthLabs',
      location: 'Remote',
      type: 'Part-time',
      category: 'Marketing',
      salary: '$50,000 - $70,000',
      description: 'Join our marketing team to help launch new products...',
      requirements: [
        'Experience in B2B SaaS marketing',
        'Strong analytical skills',
        'Excellent communication',
      ],
      postedAt: '1 week ago',
      applicants: 8,
    },
    // Add more mock jobs as needed
  ];

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Job Board</h1>
            <p className="text-gray-600">Find startup opportunities or post your own listings</p>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={() => setShowPostJob(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Post a Job
            </button>
            <button className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </button>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-8">
          {/* Main Content */}
          <div className="col-span-12 lg:col-span-8">
            {/* Job Listings */}
            <div className="space-y-6">
              {jobs.map((job) => (
                <div key={job.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <h2 className="text-xl font-semibold text-gray-800">{job.title}</h2>
                        <p className="text-gray-600 mt-1">{job.company}</p>
                      </div>
                      <span className="px-3 py-1 bg-blue-100 text-blue-600 text-sm rounded-md">
                        {job.type}
                      </span>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-4 text-gray-600">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2" />
                        {job.location}
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="w-4 h-4 mr-2" />
                        {job.salary}
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2" />
                        {job.postedAt}
                      </div>
                      <div className="flex items-center">
                        <Briefcase className="w-4 h-4 mr-2" />
                        {job.category}
                      </div>
                    </div>

                    <div className="mt-4">
                      <p className="text-gray-700">{job.description}</p>
                    </div>

                    <div className="mt-4">
                      <h3 className="font-medium text-gray-800 mb-2">Requirements</h3>
                      <ul className="list-disc list-inside space-y-1 text-gray-600">
                        {job.requirements.map((req, index) => (
                          <li key={index}>{req}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-6 flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        {job.applicants} applicants
                      </span>
                      <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        Apply Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="col-span-12 lg:col-span-4 space-y-6">
            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Filters</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Job Type
                  </label>
                  <select
                    className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={filters.type}
                    onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                  >
                    <option value="">All Types</option>
                    <option value="full-time">Full-time</option>
                    <option value="part-time">Part-time</option>
                    <option value="internship">Internship</option>
                    <option value="contract">Contract</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Enter location..."
                    value={filters.location}
                    onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={filters.category}
                    onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                  >
                    <option value="">All Categories</option>
                    <option value="engineering">Engineering</option>
                    <option value="design">Design</option>
                    <option value="marketing">Marketing</option>
                    <option value="sales">Sales</option>
                    <option value="product">Product</option>
                  </select>
                </div>

                <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Apply Filters
                </button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Quick Stats</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Jobs</span>
                  <span className="font-semibold">42</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">New Today</span>
                  <span className="font-semibold">8</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Companies Hiring</span>
                  <span className="font-semibold">15</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Post Job Modal */}
      {showPostJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <h2 className="text-2xl font-bold mb-4">Post a New Job</h2>
            {/* Add job posting form here */}
            <button
              onClick={() => setShowPostJob(false)}
              className="mt-4 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
} 