import { FC } from 'react'

interface Resource {
  id: number
  title: string
  description: string
  category: string
  type: string
  link: string
  author: string
  imageUrl: string
}

const mockResources: Resource[] = [
  {
    id: 1,
    title: "Student Startup Legal Guide",
    description: "Everything you need to know about forming a legal entity, protecting IP, and managing contracts as a student founder.",
    category: "Legal",
    type: "Guide",
    link: "/guides/legal",
    author: "University Legal Clinic",
    imageUrl: "/images/legal.jpg"
  },
  {
    id: 2,
    title: "Pitch Deck Template",
    description: "A customizable pitch deck template specifically designed for student-led startups, with examples and best practices.",
    category: "Fundraising",
    type: "Template",
    link: "/templates/pitch-deck",
    author: "Startup Accelerator Program",
    imageUrl: "/images/pitch.jpg"
  },
  {
    id: 3,
    title: "Student Founder Grant Directory",
    description: "Comprehensive list of grants, competitions, and funding opportunities available for student entrepreneurs.",
    category: "Funding",
    type: "Directory",
    link: "/funding/grants",
    author: "Entrepreneurship Center",
    imageUrl: "/images/funding.jpg"
  }
]

const categories = [
  "All",
  "Legal",
  "Fundraising",
  "Marketing",
  "Product",
  "Technology",
  "Design",
  "Funding"
]

const ResourceCard: FC<{ resource: Resource }> = ({ resource }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="h-48 bg-gray-200">
        {/* Placeholder for resource image */}
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
          <span className="text-2xl font-bold text-primary">{resource.category}</span>
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
              {resource.type}
            </span>
            <h3 className="text-xl font-semibold mt-2">{resource.title}</h3>
          </div>
        </div>

        <p className="mt-2 text-gray-600">
          {resource.description}
        </p>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-sm text-gray-500">By {resource.author}</span>
          <a
            href={resource.link}
            className="text-primary font-semibold hover:underline"
          >
            Access Resource →
          </a>
        </div>
      </div>
    </div>
  )
}

export default function ResourcesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Startup Resources</h1>
        <p className="text-gray-600 mb-6">
          Access curated resources, templates, and guides to help you build and grow your startup.
        </p>

        <div className="flex gap-4 mb-6">
          <input
            type="text"
            placeholder="Search resources..."
            className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition">
            Search
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((category) => (
            <button
              key={category}
              className={`px-4 py-2 rounded-full text-sm font-medium 
                ${category === 'All' 
                  ? 'bg-primary text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockResources.map((resource) => (
          <ResourceCard key={resource.id} resource={resource} />
        ))}
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Featured Collections</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-2">First-Time Founder Essentials</h3>
            <p className="mb-4">Everything you need to get your startup off the ground.</p>
            <a href="#" className="text-white hover:underline">Browse Collection →</a>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-2">Fundraising Toolkit</h3>
            <p className="mb-4">Resources to help you raise your first round.</p>
            <a href="#" className="text-white hover:underline">Browse Collection →</a>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-2">Growth & Marketing</h3>
            <p className="mb-4">Strategies and tools for startup growth.</p>
            <a href="#" className="text-white hover:underline">Browse Collection →</a>
          </div>
        </div>
      </div>
    </div>
  )
} 