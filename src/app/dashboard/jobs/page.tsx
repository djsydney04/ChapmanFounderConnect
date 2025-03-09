import { FC } from 'react'

interface Job {
  id: number
  title: string
  company: string
  location: string
  type: string
  description: string
  requirements: string[]
  postedDate: string
  logoUrl: string
}

const mockJobs: Job[] = [
  {
    id: 1,
    title: "Frontend Developer",
    company: "EduTech Innovators",
    location: "Remote / San Francisco",
    type: "Part-time",
    description: "Join our student-led startup building the future of online education. Looking for a passionate frontend developer to help create engaging learning experiences.",
    requirements: ["React/Next.js", "TypeScript", "UI/UX Design", "Git"],
    postedDate: "2 days ago",
    logoUrl: "https://i.pravatar.cc/150?img=4"
  },
  {
    id: 2,
    title: "Growth Marketing Intern",
    company: "FinStart",
    location: "New York",
    type: "Internship",
    description: "Help us grow our fintech platform for student entrepreneurs. Focus on social media, content creation, and community engagement.",
    requirements: ["Digital Marketing", "Social Media", "Analytics", "Content Creation"],
    postedDate: "1 week ago",
    logoUrl: "https://i.pravatar.cc/150?img=5"
  },
  {
    id: 3,
    title: "Product Manager",
    company: "CampusConnect",
    location: "Boston",
    type: "Full-time",
    description: "Lead product development for our campus networking platform. Perfect for graduating seniors with startup experience.",
    requirements: ["Product Management", "Agile", "Data Analysis", "User Research"],
    postedDate: "3 days ago",
    logoUrl: "https://i.pravatar.cc/150?img=6"
  }
]

const JobCard: FC<{ job: Job }> = ({ job }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-start space-x-4">
        <img
          src={job.logoUrl}
          alt={job.company}
          className="w-16 h-16 rounded-lg object-cover"
        />
        <div>
          <h3 className="text-xl font-semibold">{job.title}</h3>
          <p className="text-primary font-medium">{job.company}</p>
          <div className="flex items-center space-x-4 text-gray-600 text-sm mt-1">
            <span>{job.location}</span>
            <span>•</span>
            <span>{job.type}</span>
          </div>
        </div>
      </div>

      <p className="mt-4 text-gray-600">
        {job.description}
      </p>

      <div className="mt-4">
        <h4 className="font-semibold mb-2">Requirements</h4>
        <div className="flex flex-wrap gap-2">
          {job.requirements.map((req) => (
            <span
              key={req}
              className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm"
            >
              {req}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <span className="text-gray-500 text-sm">Posted {job.postedDate}</span>
        <button className="bg-primary text-white py-2 px-6 rounded-lg hover:bg-primary/90 transition">
          Apply Now
        </button>
      </div>
    </div>
  )
}

export default function JobsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Startup Jobs & Internships</h1>
        <div className="flex gap-4 mb-6">
          <input
            type="text"
            placeholder="Search by title, company, or skills..."
            className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition">
            Search
          </button>
        </div>

        <div className="flex flex-wrap gap-4 mb-6">
          <select className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
            <option value="">Job Type</option>
            <option value="full-time">Full-time</option>
            <option value="part-time">Part-time</option>
            <option value="internship">Internship</option>
          </select>

          <select className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
            <option value="">Location</option>
            <option value="remote">Remote</option>
            <option value="san-francisco">San Francisco</option>
            <option value="new-york">New York</option>
            <option value="boston">Boston</option>
          </select>

          <select className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
            <option value="">Role Category</option>
            <option value="engineering">Engineering</option>
            <option value="marketing">Marketing</option>
            <option value="product">Product</option>
            <option value="design">Design</option>
          </select>
        </div>
      </div>

      <div className="space-y-6">
        {mockJobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
    </div>
  )
} 