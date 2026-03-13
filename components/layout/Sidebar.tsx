'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, BookOpen, ClipboardList, User, Mail, Bot } from 'lucide-react'

const navItems = [
  { label: 'DASHBOARD', href: '/dashboard', icon: LayoutDashboard },
  { label: 'LEARN', href: '/dashboard/learn', icon: BookOpen },
  { label: 'STUDY PLAN', href: '/dashboard/studyplan', icon: ClipboardList },
  { label: 'PROFILE', href: '/dashboard/profile', icon: User },
  { label: 'CONTACT', href: '/dashboard/contact', icon: Mail },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside
      className="flex flex-col h-screen q-sidebar border-r border-[var(--q-border)] shrink-0"
      style={{ width: 200 }}
    >
      {/* Logo */}
      <div
        className="flex items-center px-4 py-4 border-b border-[var(--q-border)]"
        style={{ minHeight: 60 }}
      >
        <Link href="/dashboard" className="flex items-center gap-2 select-none">
          {/* Fish mascot placeholder circle */}
          <div
            className="rounded-full flex items-center justify-center text-white font-black text-sm"
            style={{
              width: 32,
              height: 32,
              background: 'linear-gradient(135deg, #FFB800 0%, #FF8C00 100%)',
              fontSize: 14,
            }}
          >
            Q
          </div>
          <span
            className="font-black tracking-tight"
            style={{ fontSize: 18, color: '#1A1A2E' }}
          >
            <span style={{ color: '#FFB800' }}>Q</span>
            <span style={{ color: '#6B46FF' }}>uantus</span>
          </span>
        </Link>
      </div>

      {/* Nav links */}
      <nav className="flex-1 flex flex-col gap-1 py-4 px-3">
        {navItems.map(({ label, href, icon: Icon }) => {
          // Dashboard active when at /dashboard exactly or /dashboard (without sub-routes)
          const isActive =
            href === '/dashboard'
              ? pathname === '/dashboard' || pathname === '/dashboard/'
              : pathname.startsWith(href)

          return (
            <Link
              key={href}
              href={href}
              className={`q-nav-link ${isActive ? 'active' : ''}`}
            >
              <Icon size={16} strokeWidth={2} />
              <span>{label}</span>
            </Link>
          )
        })}
      </nav>

      {/* AI Learning Assistant button */}
      <div className="p-3 border-t border-[var(--q-border)]">
        <button
          className="flex items-center gap-2 w-full rounded-lg text-white font-semibold text-xs px-3 py-2.5 transition-all hover:opacity-90"
          style={{ background: 'var(--q-purple)' }}
        >
          <Bot size={16} />
          <span>AI Learning Assistant</span>
        </button>
      </div>
    </aside>
  )
}
