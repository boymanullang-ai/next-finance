import Link from 'next/link'
import { Flame, Calendar, BookOpen, Calculator } from 'lucide-react'

// ─── Activity Heatmap ───────────────────────────────────────────────────────
function ActivityHeatmap() {
  // 8 weeks × 7 days mock data (0-4 intensity)
  const weeks: number[][] = [
    [0,0,0,0,1,0,0],
    [0,0,0,0,0,0,0],
    [0,1,0,0,0,0,0],
    [0,0,0,1,0,0,0],
    [2,0,0,0,0,0,0],
    [0,0,3,0,0,0,0],
    [0,0,0,0,0,1,0],
    [0,0,4,3,0,0,0],
  ]
  const heatColors = [
    'var(--q-heat-0)',
    'var(--q-heat-1)',
    'var(--q-heat-2)',
    'var(--q-heat-3)',
    'var(--q-heat-4)',
  ]
  const dayLabels = ['','Mon','','Wed','','Fri','']

  return (
    <div className="q-card p-5" style={{ minWidth: 260 }}>
      <p className="text-xs font-semibold mb-3" style={{ color: 'var(--q-text-muted)' }}>
        103 points in the last 8 weeks
      </p>
      <div className="flex gap-1">
        {/* Day labels */}
        <div className="flex flex-col gap-1 mr-1">
          {dayLabels.map((d, i) => (
            <div key={i} style={{ height: 12, fontSize: 9, color: 'var(--q-text-light)', lineHeight: '12px' }}>
              {d}
            </div>
          ))}
        </div>
        {/* Grid */}
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-1">
            {week.map((val, di) => (
              <div
                key={di}
                title={`${val} points`}
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: 2,
                  background: heatColors[val],
                }}
              />
            ))}
          </div>
        ))}
      </div>
      {/* Legend */}
      <div className="flex items-center gap-1 mt-3">
        <span style={{ fontSize: 9, color: 'var(--q-text-light)' }}>Less</span>
        {heatColors.map((c, i) => (
          <div key={i} style={{ width: 10, height: 10, borderRadius: 2, background: c }} />
        ))}
        <span style={{ fontSize: 9, color: 'var(--q-text-light)' }}>More</span>
      </div>
    </div>
  )
}

// ─── Stat Card ──────────────────────────────────────────────────────────────
type StatCardProps = {
  label: string
  value: string
  icon: React.ReactNode
}
function StatCard({ label, value, icon }: StatCardProps) {
  return (
    <div className="q-card p-4 flex items-center gap-3" style={{ minWidth: 140 }}>
      <div className="shrink-0">{icon}</div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider mb-0.5" style={{ color: 'var(--q-text-muted)', fontSize: 10 }}>
          {label}
        </p>
        <p className="font-bold text-xl" style={{ color: 'var(--q-text-primary)' }}>
          {value}
        </p>
      </div>
    </div>
  )
}

// ─── Learning Progress Card ──────────────────────────────────────────────────
function LearningProgressCard() {
  return (
    <div className="relative mt-2">
      {/* Mascot bird */}
      <div
        className="absolute -top-8 left-5 text-3xl select-none"
        aria-hidden="true"
      >
        🐦
      </div>
      <div
        className="rounded-xl overflow-hidden"
        style={{ border: '2px solid var(--q-purple)' }}
      >
        {/* Progress bar header */}
        <div
          className="q-progress-bar-track h-10 flex items-center px-4"
        >
          <div
            className="q-progress-bar-fill h-full absolute left-0"
            style={{ width: '33%' }}
          />
          <span className="relative font-bold text-white text-sm z-10">33%</span>
        </div>
        {/* Card body */}
        <div className="bg-white p-5">
          <p className="text-sm font-semibold mb-3" style={{ color: 'var(--q-text-primary)' }}>
            Financial Statements
            <span className="mx-2 text-gray-400">›</span>
            Balance Sheet
          </p>
          <div className="rounded-lg p-3 mb-4" style={{ background: '#F9F9FB' }}>
            <span className="text-xs font-medium mr-2" style={{ color: 'var(--q-text-muted)' }}>
              Current Module:
            </span>
            <span
              className="rounded-full px-3 py-1 text-xs font-semibold"
              style={{ background: 'var(--q-purple-bg)', color: 'var(--q-purple)' }}
            >
              Liabilities
            </span>
          </div>
          <div className="flex items-center justify-between">
            <Link
              href="/dashboard/studyplan"
              className="text-xs font-semibold underline"
              style={{ color: 'var(--q-text-primary)' }}
            >
              VIEW SYLLABUS
            </Link>
            <Link href="/dashboard/learn">
              <button className="q-btn-primary">RESUME</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Featured Paths ──────────────────────────────────────────────────────────
const PATHS = [
  {
    id: 'entry',
    label: 'Entry Level',
    bg: 'linear-gradient(135deg, #7C6BE8 0%, #6B46FF 100%)',
    cards: [
      { title: 'Financial Statements', color: '#6B46FF', emoji: '📊' },
      { title: 'Analysis Basics', color: '#4CAF50', emoji: '📈' },
      { title: 'Intro to Modeling', color: '#3B82F6', emoji: '🧮' },
    ],
  },
  {
    id: 'skilled',
    label: 'Skilled Path',
    bg: 'linear-gradient(135deg, #1A1A2E 0%, #2D2D44 100%)',
    cards: [
      { title: '3-Statement Model', color: '#6B46FF', emoji: '📋' },
      { title: 'Valuation Methods', color: '#F59E0B', emoji: '💰' },
      { title: 'DCF Analysis', color: '#EF4444', emoji: '📉' },
    ],
  },
  {
    id: 'career',
    label: 'Career Path',
    bg: 'linear-gradient(135deg, #0F766E 0%, #047857 100%)',
    cards: [
      { title: 'Investment Banking', color: '#6B46FF', emoji: '🏦' },
      { title: 'Private Equity', color: '#EC4899', emoji: '🎯' },
      { title: 'Equity Research', color: '#F59E0B', emoji: '🔍' },
    ],
  },
]

function FeaturedCourses() {
  return (
    <div>
      <h2 className="font-bold text-xl mb-4" style={{ color: 'var(--q-text-primary)' }}>
        Featured courses and paths
      </h2>
      {/* Tab row */}
      <div className="flex gap-2 mb-4">
        {PATHS.map((p) => (
          <button
            key={p.id}
            className="rounded-full px-4 py-1.5 text-xs font-bold border transition-all"
            style={{
              background: p.id === 'entry' ? 'var(--q-purple)' : 'transparent',
              color: p.id === 'entry' ? '#fff' : 'var(--q-text-muted)',
              border: p.id === 'entry' ? 'none' : '1px solid var(--q-border)',
            }}
          >
            {p.label}
          </button>
        ))}
      </div>
      {/* Cards for Entry Level */}
      <div className="grid grid-cols-3 gap-4">
        {PATHS[0].cards.map((c) => (
          <div
            key={c.title}
            className="rounded-xl p-5 text-white cursor-pointer hover:opacity-90 transition-opacity"
            style={{ background: c.color, minHeight: 100 }}
          >
            <div className="text-2xl mb-2">{c.emoji}</div>
            <p className="font-bold text-sm">{c.title}</p>
          </div>
        ))}
      </div>

      {/* Recommend CTA */}
      <div
        className="mt-4 rounded-xl p-5 flex items-center justify-between cursor-pointer hover:opacity-90 transition-opacity"
        style={{ background: 'var(--q-purple)' }}
      >
        <div>
          <p className="text-white font-bold text-sm">Not sure where to start?</p>
          <p className="text-white/70 text-xs mt-1">Take a quick quiz and we'll recommend the best path for you.</p>
        </div>
        <button
          className="rounded-full px-4 py-2 text-xs font-bold bg-white shrink-0 ml-4"
          style={{ color: 'var(--q-purple)' }}
        >
          Get Recommendation
        </button>
      </div>
    </div>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────
export default function DashboardHomePage() {
  return (
    <div className="p-6 space-y-6" style={{ maxWidth: 1100 }}>
      {/* Stats row + heatmap */}
      <div className="flex flex-wrap gap-4 items-start">
        {/* Stat cards 2×2 */}
        <div className="grid grid-cols-2 gap-3 flex-1" style={{ minWidth: 280 }}>
          <StatCard
            label="Current Streak"
            value="3 days"
            icon={<Flame size={20} className="text-orange-500" />}
          />
          <StatCard
            label="Active Days"
            value="3 days"
            icon={<Calendar size={20} style={{ color: 'var(--q-purple)' }} />}
          />
          <StatCard
            label="Concepts Learned"
            value="5/91"
            icon={<BookOpen size={20} style={{ color: 'var(--q-purple)' }} />}
          />
          <StatCard
            label="Modeling Completed"
            value="0/21"
            icon={<Calculator size={20} style={{ color: 'var(--q-purple)' }} />}
          />
        </div>
        {/* Heatmap */}
        <ActivityHeatmap />
      </div>

      {/* Keep Learning section */}
      <div>
        <h2 className="font-bold text-xl mb-6" style={{ color: 'var(--q-text-primary)' }}>
          Keep learning ...
        </h2>
        <LearningProgressCard />
      </div>

      {/* Featured courses */}
      <FeaturedCourses />
    </div>
  )
}
