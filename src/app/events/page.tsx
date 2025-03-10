'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { Calendar, MapPin, Users, Clock, Filter } from 'react-feather';

export default function EventsPage() {
  const [filters, setFilters] = useState({
    category: '',
    date: '',
  });

  // Mock data - replace with real data from your backend
  const events = [
    {
      id: 1,
      title: 'Startup Pitch Night',
      description: 'Join us for an evening of exciting startup pitches from student entrepreneurs.',
      date: '2024-03-20',
      time: '6:00 PM - 9:00 PM',
      location: 'Innovation Center, Room 101',
      category: 'Pitch Competition',
      organizer: 'Entrepreneurship Club',
      attendees: 45,
      maxCapacity: 100,
      image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 2,
      title: 'Tech Startup Workshop',
      description: 'Learn the fundamentals of building a successful tech startup from industry experts.',
      date: '2024-03-25',
      time: '2:00 PM - 5:00 PM',
      location: 'Virtual Event',
      category: 'Workshop',
      organizer: 'Tech Incubator',
      attendees: 120,
      maxCapacity: 200,
      image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    },
    // Add more mock events as needed
  ];

  const upcomingEvents = events.filter(event => new Date(event.date) >= new Date());

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Upcoming Events</h1>
            <p className="text-gray-600">Discover and join startup events, workshops, and competitions</p>
          </div>
          <button className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </button>
        </div>

        <div className="grid grid-cols-12 gap-8">
          {/* Main Content */}
          <div className="col-span-12 lg:col-span-8">
            {/* Events Grid */}
            <div className="space-y-6">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="md:flex">
                    <div className="md:w-1/3">
                      <img
                        src={event.image}
                        alt={event.title}
                        className="h-48 w-full object-cover md:h-full"
                      />
                    </div>
                    <div className="p-6 md:w-2/3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h2 className="text-xl font-semibold text-gray-800">{event.title}</h2>
                          <p className="text-gray-600 mt-1">{event.organizer}</p>
                        </div>
                        <span className="px-3 py-1 bg-blue-100 text-blue-600 text-sm rounded-md">
                          {event.category}
                        </span>
                      </div>

                      <p className="mt-4 text-gray-700">{event.description}</p>

                      <div className="mt-4 grid grid-cols-2 gap-4">
                        <div className="flex items-center text-gray-600">
                          <Calendar className="w-4 h-4 mr-2" />
                          <span>{event.date}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Clock className="w-4 h-4 mr-2" />
                          <span>{event.time}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <MapPin className="w-4 h-4 mr-2" />
                          <span>{event.location}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Users className="w-4 h-4 mr-2" />
                          <span>{event.attendees}/{event.maxCapacity} attending</span>
                        </div>
                      </div>

                      <div className="mt-6 flex items-center justify-between">
                        <div className="flex -space-x-2">
                          {[...Array(3)].map((_, i) => (
                            <img
                              key={i}
                              className="w-8 h-8 rounded-full border-2 border-white"
                              src={`https://i.pravatar.cc/150?img=${i + 10}`}
                              alt="Attendee"
                            />
                          ))}
                          {event.attendees > 3 && (
                            <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-xs text-gray-600">
                              +{event.attendees - 3}
                            </div>
                          )}
                        </div>
                        <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                          RSVP
                        </button>
                      </div>
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
                    Category
                  </label>
                  <select
                    className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={filters.category}
                    onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                  >
                    <option value="">All Categories</option>
                    <option value="pitch">Pitch Competitions</option>
                    <option value="workshop">Workshops</option>
                    <option value="networking">Networking</option>
                    <option value="hackathon">Hackathons</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={filters.date}
                    onChange={(e) => setFilters({ ...filters, date: e.target.value })}
                  />
                </div>

                <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Apply Filters
                </button>
              </div>
            </div>

            {/* Calendar */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Calendar</h2>
              <div className="text-center text-gray-500">
                Calendar component will be implemented here
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Event Stats</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Upcoming Events</span>
                  <span className="font-semibold">8</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">This Month</span>
                  <span className="font-semibold">12</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Your RSVPs</span>
                  <span className="font-semibold">3</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 