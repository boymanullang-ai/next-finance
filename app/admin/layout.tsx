import Link from 'next/link'
import { LayoutDashboard, Users, FileSpreadsheet, BookOpen, Settings } from 'lucide-react'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 text-gray-900 font-sans">
      {/* Admin Sidebar */}
      <div className="flex h-screen w-64 flex-col border-r bg-slate-900 text-slate-300">
        <div className="flex h-16 items-center px-6 border-b border-slate-800">
          <Link href="/admin" className="flex items-center gap-2 font-bold text-xl text-white">
            <span>NextFinance Admin</span>
          </Link>
        </div>
        <div className="flex-1 py-6 flex flex-col gap-2 px-4">
          <Link href="/admin" className="flex items-center gap-3 rounded-lg px-3 py-2 text-white bg-slate-800 transition-colors">
            <LayoutDashboard className="h-5 w-5" />
            <span className="font-medium">Overview</span>
          </Link>
          <Link href="/admin/users" className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-slate-800 hover:text-white transition-colors">
            <Users className="h-5 w-5" />
            <span className="font-medium">Users</span>
          </Link>
          <Link href="/admin/courses" className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-slate-800 hover:text-white transition-colors">
            <BookOpen className="h-5 w-5" />
            <span className="font-medium">Curriculum</span>
          </Link>
          <Link href="/admin/spreadsheets" className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-slate-800 hover:text-white transition-colors">
            <FileSpreadsheet className="h-5 w-5" />
            <span className="font-medium">Spreadsheets</span>
          </Link>
        </div>
        <div className="border-t border-slate-800 p-4">
          <Link href="/admin/settings" className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-slate-800 hover:text-white transition-colors">
            <Settings className="h-5 w-5" />
            <span className="font-medium">Settings</span>
          </Link>
        </div>
      </div>
      
      {/* Admin Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-16 items-center justify-between border-b bg-white px-6">
          <h2 className="font-semibold text-lg">Backoffice</h2>
          <div className="flex gap-4 items-center">
             <Link href="/dashboard" className="text-sm text-blue-600 hover:underline">Exit to App</Link>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
