'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-xl font-bold text-primary">
            FounderConnect
          </Link>
          
          <div className="hidden md:flex space-x-8">
            <Link 
              href="/founders"
              className={`${isActive('/founders') ? 'text-primary' : 'text-gray-600'} hover:text-primary transition`}
            >
              Find Co-Founders
            </Link>
            <Link 
              href="/jobs"
              className={`${isActive('/jobs') ? 'text-primary' : 'text-gray-600'} hover:text-primary transition`}
            >
              Jobs
            </Link>
            <Link 
              href="/resources"
              className={`${isActive('/resources') ? 'text-primary' : 'text-gray-600'} hover:text-primary transition`}
            >
              Resources
            </Link>
            <Link 
              href="/events"
              className={`${isActive('/events') ? 'text-primary' : 'text-gray-600'} hover:text-primary transition`}
            >
              Events
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link 
              href="/profile"
              className="text-gray-600 hover:text-primary transition"
            >
              Profile
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
} 