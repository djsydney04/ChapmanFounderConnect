'use client'

import { useState } from 'react'

interface Profile {
  name: string
  role: string
  university: string
  graduationYear: string
  major: string
  bio: string
  skills: string[]
  interests: string[]
  links: {
    linkedin?: string
    github?: string
    portfolio?: string
  }
  achievements: {
    id: number
    title: string
    date: string
    description: string
  }[]
}

const mockProfile: Profile = {
  name: "Alex Thompson",
  role: "Technical Co-Founder",
  university: "Stanford University",
  graduationYear: "2025",
  major: "Computer Science",
  bio: "Passionate about building technology that makes a difference. Currently working on AI-powered education tools and looking for co-founders.",
  skills: [
    "Full-Stack Development",
    "Machine Learning",
    "Product Management",
    "UI/UX Design"
  ],
  interests: [
    "EdTech",
    "Artificial Intelligence",
    "Social Impact",
    "Mobile Apps"
  ],
  links: {
    linkedin: "https://linkedin.com/in/alexthompson",
    github: "https://github.com/alexthompson",
    portfolio: "https://alexthompson.dev"
  },
  achievements: [
    {
      id: 1,
      title: "First Place - University Hackathon",
      date: "2023",
      description: "Built an AI-powered study assistant that won first place among 50+ teams."
    },
    {
      id: 2,
      title: "Student Startup Grant Recipient",
      date: "2023",
      description: "Received $10,000 in funding for developing an educational technology platform."
    }
  ]
}

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState<Profile>(mockProfile)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-primary to-secondary p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-primary text-3xl font-bold">
                  {profile.name.charAt(0)}
                </div>
                <div>
                  <h1 className="text-2xl font-bold">{profile.name}</h1>
                  <p className="text-white/90">{profile.role}</p>
                  <p className="text-white/80">{profile.university} • Class of {profile.graduationYear}</p>
                </div>
              </div>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="bg-white text-primary px-4 py-2 rounded-lg hover:bg-blue-50 transition"
              >
                {isEditing ? 'Save Changes' : 'Edit Profile'}
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="p-6">
            {/* Bio Section */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">About</h2>
              {isEditing ? (
                <textarea
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  rows={4}
                />
              ) : (
                <p className="text-gray-600">{profile.bio}</p>
              )}
            </section>

            {/* Skills & Interests */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <section>
                <h2 className="text-xl font-semibold mb-4">Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill) => (
                    <span
                      key={skill}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                  {isEditing && (
                    <button className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm hover:bg-gray-200">
                      + Add Skill
                    </button>
                  )}
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-4">Interests</h2>
                <div className="flex flex-wrap gap-2">
                  {profile.interests.map((interest) => (
                    <span
                      key={interest}
                      className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"
                    >
                      {interest}
                    </span>
                  ))}
                  {isEditing && (
                    <button className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm hover:bg-gray-200">
                      + Add Interest
                    </button>
                  )}
                </div>
              </section>
            </div>

            {/* Links Section */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Links</h2>
              <div className="space-y-3">
                {Object.entries(profile.links).map(([platform, url]) => (
                  <a
                    key={platform}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-gray-600 hover:text-primary"
                  >
                    <span className="capitalize">{platform}:</span>
                    <span className="ml-2 text-primary">{url}</span>
                  </a>
                ))}
              </div>
            </section>

            {/* Achievements Section */}
            <section>
              <h2 className="text-xl font-semibold mb-4">Achievements</h2>
              <div className="space-y-4">
                {profile.achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className="border-l-4 border-primary pl-4"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">{achievement.title}</h3>
                      <span className="text-gray-500 text-sm">{achievement.date}</span>
                    </div>
                    <p className="text-gray-600 mt-1">{achievement.description}</p>
                  </div>
                ))}
                {isEditing && (
                  <button className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-primary hover:text-primary transition">
                    + Add Achievement
                  </button>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
} 