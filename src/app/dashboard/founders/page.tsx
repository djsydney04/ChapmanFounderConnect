import { FC } from 'react'

interface Founder {
  id: number
  name: string
  role: string
  skills: string[]
  interests: string[]
  university: string
  imageUrl: string
}

const mockFounders: Founder[] = [
  {
    id: 1,
    name: "Sarah Chen",
    role: "Technical Co-Founder",
    skills: ["Full-Stack Development", "Machine Learning", "Cloud Architecture"],
    interests: ["EdTech", "AI", "Sustainability"],
    university: "Stanford University",
    imageUrl: "https://i.pravatar.cc/150?img=1"
  },
  {
    id: 2,
    name: "James Wilson",
    role: "Business Co-Founder",
    skills: ["Business Strategy", "Marketing", "Finance"],
    interests: ["FinTech", "E-commerce", "SaaS"],
    university: "Harvard Business School",
    imageUrl: "https://i.pravatar.cc/150?img=2"
  },
  {
    id: 3,
    name: "Maya Patel",
    role: "Product Co-Founder",
    skills: ["Product Management", "UX Design", "Data Analytics"],
    interests: ["HealthTech", "Social Impact", "Mobile Apps"],
    university: "MIT",
    imageUrl: "https://i.pravatar.cc/150?img=3"
  }
]

const FounderCard: FC<{ founder: Founder }> = ({ founder }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-start space-x-4">
        <img
          src={founder.imageUrl}
          alt={founder.name}
          className="w-20 h-20 rounded-full object-cover"
        />
        <div>
          <h3 className="text-xl font-semibold">{founder.name}</h3>
          <p className="text-primary font-medium">{founder.role}</p>
          <p className="text-gray-600">{founder.university}</p>
        </div>
      </div>
      
      <div className="mt-4">
        <h4 className="font-semibold mb-2">Skills</h4>
        <div className="flex flex-wrap gap-2">
          {founder.skills.map((skill) => (
            <span
              key={skill}
              className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <h4 className="font-semibold mb-2">Interests</h4>
        <div className="flex flex-wrap gap-2">
          {founder.interests.map((interest) => (
            <span
              key={interest}
              className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm"
            >
              {interest}
            </span>
          ))}
        </div>
      </div>

      <button className="mt-6 w-full bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary/90 transition">
        Connect
      </button>
    </div>
  )
}

export default function FoundersPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Find Co-Founders</h1>
        <div className="flex gap-4 mb-6">
          <input
            type="text"
            placeholder="Search by skills, interests, or university..."
            className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition">
            Search
          </button>
        </div>
        
        <div className="flex flex-wrap gap-4 mb-6">
          <select className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
            <option value="">Role</option>
            <option value="technical">Technical</option>
            <option value="business">Business</option>
            <option value="product">Product</option>
          </select>
          
          <select className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
            <option value="">University</option>
            <option value="stanford">Stanford</option>
            <option value="harvard">Harvard</option>
            <option value="mit">MIT</option>
          </select>
          
          <select className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
            <option value="">Interest Area</option>
            <option value="ai">AI/ML</option>
            <option value="fintech">FinTech</option>
            <option value="health">HealthTech</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockFounders.map((founder) => (
          <FounderCard key={founder.id} founder={founder} />
        ))}
      </div>
    </div>
  )
} 