import Link from 'next/link'
import { BookOpen, LayoutDashboard, Settings, User } from 'lucide-react'

export function Sidebar() {
  return (
    <div className="flex h-screen w-64 flex-col border-r bg-white">
      <div className="flex h-16 items-center px-6 border-b">
        <Link href="/dashboard" className="flex items-center gap-2 font-bold text-xl text-blue-700">
          <BookOpen className="h-6 w-6" />
          <span>Next Finance</span>
        </Link>
      </div>
      <div className="flex-1 py-6 flex flex-col gap-2 px-4">
        <Link href="/dashboard" className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-900 bg-gray-100 hover:bg-gray-100 transition-colors">
          <LayoutDashboard className="h-5 w-5 text-blue-600" />
          <span className="font-medium">Dashboard</span>
        </Link>
        <Link href="/courses" className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors">
          <BookOpen className="h-5 w-5" />
          <span className="font-medium">Courses</span>
        </Link>
      </div>
      <div className="border-t p-4 flex flex-col gap-2">
        <Link href="/profile" className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors">
          <User className="h-5 w-5" />
          <span className="font-medium">Profile</span>
        </Link>
        <Link href="/settings" className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors">
          <Settings className="h-5 w-5" />
          <span className="font-medium">Settings</span>
        </Link>
      </div>
    </div>
  )
}
