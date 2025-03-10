'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { MessageCircle, Star, Filter } from 'react-feather';

export default function CoFoundersPage() {
  const [filters, setFilters] = useState({
    major: '',
    skills: [] as string[],
    location: '',
  });

  // Mock data - replace with real data from your backend
  const founders = [
    {
      id: 1,
      name: 'Sarah Chen',
      photo: 'https://i.pravatar.cc/150?img=1',
      major: 'Computer Science',
      skills: ['Full-stack Development', 'AI/ML', 'Product Management'],
      interests: ['EdTech', 'AI Applications', 'Mobile Apps'],
      location: 'San Francisco, CA',
      bio: 'CS student passionate about using AI to solve education challenges.',
    },
    {
      id: 2,
      name: 'Mike Johnson',
      photo: 'https://i.pravatar.cc/150?img=2',
      major: 'Business Administration',
      skills: ['Marketing', 'Business Strategy', 'Sales'],
      interests: ['E-commerce', 'SaaS', 'Digital Marketing'],
      location: 'New York, NY',
      bio: 'Business major with 2 years of marketing experience at startups.',
    },
    // Add more mock profiles as needed
  ];

  const pendingRequests = [
    {
      id: 1,
      name: 'Alex Rivera',
      photo: 'https://i.pravatar.cc/150?img=3',
      major: 'Design',
      sentAt: '2024-03-09',
    },
    {
      id: 2,
      name: 'Emma Wilson',
      photo: 'https://i.pravatar.cc/150?img=4',
      major: 'Computer Engineering',
      sentAt: '2024-03-08',
    },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Find Co-Founders</h1>
            <p className="text-gray-600">Connect with potential partners who share your vision</p>
          </div>
          <button
            onClick={() => {/* Toggle filter sidebar */}}
            className="flex items-center px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </button>
        </div>

        <div className="grid grid-cols-12 gap-8">
          {/* Main Content */}
          <div className="col-span-12 lg:col-span-8 space-y-6">
            {/* Founders Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {founders.map((founder) => (
                <div key={founder.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-4">
                        <img
                          src={founder.photo}
                          alt={founder.name}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                        <div>
                          <h3 className="font-semibold text-lg">{founder.name}</h3>
                          <p className="text-gray-600">{founder.major}</p>
                          <p className="text-sm text-gray-500">{founder.location}</p>
                        </div>
                      </div>
                      <button className="text-blue-600 hover:text-blue-700">
                        <Star className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="mt-4">
                      <p className="text-gray-700">{founder.bio}</p>
                    </div>

                    <div className="mt-4">
                      <h4 className="font-medium text-sm text-gray-700 mb-2">Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        {founder.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded-md"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-4">
                      <h4 className="font-medium text-sm text-gray-700 mb-2">Interests</h4>
                      <div className="flex flex-wrap gap-2">
                        {founder.interests.map((interest, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-blue-50 text-blue-600 text-sm rounded-md"
                          >
                            {interest}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-6 flex space-x-4">
                      <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                        Connect
                      </button>
                      <button className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        <MessageCircle className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="col-span-12 lg:col-span-4 space-y-6">
            {/* Pending Requests */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Pending Requests</h2>
              <div className="space-y-4">
                {pendingRequests.map((request) => (
                  <div key={request.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <img
                        src={request.photo}
                        alt={request.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <h3 className="font-medium">{request.name}</h3>
                        <p className="text-sm text-gray-600">{request.major}</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700">
                        Accept
                      </button>
                      <button className="px-3 py-1 border border-gray-300 text-sm rounded-md hover:bg-gray-50">
                        Decline
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Filters Panel */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Filters</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Major
                  </label>
                  <select
                    className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={filters.major}
                    onChange={(e) => setFilters({ ...filters, major: e.target.value })}
                  >
                    <option value="">All Majors</option>
                    <option value="cs">Computer Science</option>
                    <option value="business">Business</option>
                    <option value="design">Design</option>
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
                    Skills
                  </label>
                  <div className="space-y-2">
                    {['Programming', 'Design', 'Marketing', 'Business'].map((skill) => (
                      <label key={skill} className="flex items-center">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          checked={filters.skills.includes(skill)}
                          onChange={(e) => {
                            const newSkills = e.target.checked
                              ? [...filters.skills, skill]
                              : filters.skills.filter((s) => s !== skill);
                            setFilters({ ...filters, skills: newSkills });
                          }}
                        />
                        <span className="ml-2 text-sm text-gray-600">{skill}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 