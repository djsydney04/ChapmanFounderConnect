import { FC } from 'react'

interface Event {
  id: number
  title: string
  date: string
  time: string
  location: string
  type: string
  organizer: string
  description: string
  imageUrl: string
  attendees: number
}

const mockEvents: Event[] = [
  {
    id: 1,
    title: "Spring Startup Pitch Competition",
    date: "2024-04-15",
    time: "2:00 PM - 6:00 PM",
    location: "University Innovation Center",
    type: "Competition",
    organizer: "Entrepreneurship Club",
    description: "Present your startup idea to a panel of VCs and angel investors. Top teams will receive funding and mentorship opportunities.",
    imageUrl: "https://i.pravatar.cc/150?img=7",
    attendees: 120
  },
  {
    id: 2,
    title: "Founder Networking Mixer",
    date: "2024-03-28",
    time: "6:30 PM - 8:30 PM",
    location: "Startup Hub Lounge",
    type: "Networking",
    organizer: "Student Founders Association",
    description: "Connect with fellow student entrepreneurs over drinks and snacks. Share experiences and build valuable relationships.",
    imageUrl: "https://i.pravatar.cc/150?img=8",
    attendees: 75
  },
  {
    id: 3,
    title: "Tech Stack Workshop Series",
    date: "2024-04-02",
    time: "4:00 PM - 6:00 PM",
    location: "Virtual",
    type: "Workshop",
    organizer: "CS Department",
    description: "Learn how to build and scale your startup's tech infrastructure. Topics include cloud services, security, and DevOps.",
    imageUrl: "https://i.pravatar.cc/150?img=9",
    attendees: 200
  }
]

const EventCard: FC<{ event: Event }> = ({ event }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="h-48 bg-gray-200">
        {/* Placeholder for event image */}
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
          <span className="text-2xl font-bold text-primary">{event.type}</span>
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
              {event.type}
            </span>
            <h3 className="text-xl font-semibold mt-2">{event.title}</h3>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <div className="flex items-center text-gray-600">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{event.date} • {event.time}</span>
          </div>
          
          <div className="flex items-center text-gray-600">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{event.location}</span>
          </div>

          <div className="flex items-center text-gray-600">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span>{event.attendees} Attending</span>
          </div>
        </div>

        <p className="mt-4 text-gray-600">
          {event.description}
        </p>

        <div className="mt-6 flex items-center justify-between">
          <span className="text-sm text-gray-500">By {event.organizer}</span>
          <button className="bg-primary text-white py-2 px-6 rounded-lg hover:bg-primary/90 transition">
            RSVP
          </button>
        </div>
      </div>
    </div>
  )
}

export default function EventsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Startup Events</h1>
        <p className="text-gray-600 mb-6">
          Discover and join upcoming events, workshops, and networking opportunities.
        </p>

        <div className="flex gap-4 mb-6">
          <input
            type="text"
            placeholder="Search events..."
            className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition">
            Search
          </button>
        </div>

        <div className="flex flex-wrap gap-4 mb-6">
          <select className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
            <option value="">Event Type</option>
            <option value="workshop">Workshops</option>
            <option value="networking">Networking</option>
            <option value="competition">Competitions</option>
            <option value="hackathon">Hackathons</option>
          </select>

          <select className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
            <option value="">Date Range</option>
            <option value="today">Today</option>
            <option value="this-week">This Week</option>
            <option value="this-month">This Month</option>
            <option value="next-month">Next Month</option>
          </select>

          <select className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
            <option value="">Location</option>
            <option value="in-person">In Person</option>
            <option value="virtual">Virtual</option>
            <option value="hybrid">Hybrid</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockEvents.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Featured Event Series</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-2">Startup Weekend</h3>
            <p className="mb-4">54-hour event where you'll experience the highs, lows, fun, and pressure that make up life at a startup.</p>
            <button className="bg-white text-blue-600 px-6 py-2 rounded-lg hover:bg-blue-50 transition">
              Learn More
            </button>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-2">Founder Speaker Series</h3>
            <p className="mb-4">Weekly talks featuring successful founders sharing their startup journeys and lessons learned.</p>
            <button className="bg-white text-purple-600 px-6 py-2 rounded-lg hover:bg-purple-50 transition">
              View Schedule
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 