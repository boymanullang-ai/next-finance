import Link from 'next/link'
import { ChevronDown, ChevronRight, Plus } from 'lucide-react'

// ─── Course Info Bar ────────────────────────────────────────────────────────
function CourseInfoBar() {
  const infos = [
    { icon: '📊', label: 'Skill level', value: 'Beginners' },
    { icon: '⏱️', label: 'Time to complete', value: '10 hours' },
    { icon: '📝', label: 'Number of practices', value: '40 practice(s)' },
    { icon: '📋', label: 'Prerequisites', value: 'None' },
  ]
  return (
    <div className="flex flex-wrap gap-0 border-b border-[var(--q-border)] bg-white px-6 py-4">
      {infos.map((info, i) => (
        <div key={i} className={`flex items-center gap-3 flex-1 min-w-40 ${i > 0 ? 'pl-6 border-l border-[var(--q-border)]' : ''}`}>
          <span className="text-xl">{info.icon}</span>
          <div>
            <p className="text-xs" style={{ color: 'var(--q-text-muted)' }}>{info.label}</p>
            <p className="font-semibold text-sm" style={{ color: 'var(--q-text-primary)' }}>{info.value}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Balance Sheet Visual Panel ──────────────────────────────────────────────
function BalanceSheetPanel() {
  return (
    <div
      className="rounded-xl p-4 h-full"
      style={{ background: '#FFF8DC', minWidth: 220, maxWidth: 260 }}
    >
      <div className="bg-white rounded-lg shadow-sm p-3 h-full">
        <p className="text-center font-black text-sm mb-3" style={{ color: 'var(--q-text-primary)' }}>
          BALANCE SHEET
        </p>
        <div className="grid grid-cols-2 gap-2 text-xs font-bold mb-2">
          <div style={{ color: 'var(--q-purple)' }}>Assets</div>
          <div style={{ color: 'var(--q-danger)' }}>Liabilities</div>
        </div>
        {/* Placeholder rows */}
        {[1,2,3,4,5].map(i => (
          <div key={i} className="grid grid-cols-2 gap-2 mb-1.5">
            <div className="h-2 rounded bg-gray-200" />
            <div className="h-2 rounded bg-gray-200" />
          </div>
        ))}
        <div className="mt-3">
          <div className="text-xs font-bold mb-1" style={{ color: '#4CAF50' }}>Equity</div>
          {[1,2].map(i => (
            <div key={i} className="h-2 rounded bg-gray-200 mb-1.5" />
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Syllabus Modules ────────────────────────────────────────────────────────
const modules = [
  {
    title: 'Balance Sheet',
    emoji: '📘',
    topics: [
      { name: 'Assets', done: true },
      { name: 'Liabilities', done: false },
      { name: 'Equity', done: false },
      { name: 'Market Value', done: false },
    ],
  },
  {
    title: 'Income Statement',
    emoji: '📗',
    topics: [],
  },
  {
    title: 'Cash Flow Statement',
    emoji: '📙',
    topics: [],
  },
]

// ─── Page ────────────────────────────────────────────────────────────────────
export default function LearnPage() {
  return (
    <div>
      {/* Purple gradient header */}
      <div className="q-purple-header px-6 py-5 flex items-start justify-between">
        <div className="flex items-center gap-4">
          {/* Mascot */}
          <div className="text-4xl select-none">🐦</div>
          <div>
            <h1 className="font-black text-2xl text-white">Financial Statements</h1>
            <p className="text-white/70 text-sm mt-0.5">
              Start your finance journey by learning the core concepts behind financial statements.
            </p>
          </div>
        </div>
        {/* Streak counter */}
        <div
          className="flex items-center gap-1.5 rounded-full px-3 py-1.5 font-bold text-sm"
          style={{ background: 'rgba(255,255,255,0.15)', color: '#fff' }}
        >
          🔥 3
        </div>
      </div>

      {/* Info bar */}
      <CourseInfoBar />

      {/* Main content */}
      <div className="flex gap-6 p-6">
        {/* Accordion */}
        <div className="flex-1">
          {modules.map((mod, mi) => (
            <div key={mi} className="mb-4 q-card overflow-hidden">
              {/* Module header */}
              <div className="flex items-center justify-between px-5 py-4">
                <div className="flex items-center gap-3">
                  <ChevronDown size={16} style={{ color: 'var(--q-purple)' }} />
                  <span className="mr-2">{mod.emoji}</span>
                  <span
                    className="font-bold text-base"
                    style={{ color: mi === 0 ? 'var(--q-purple)' : 'var(--q-text-primary)' }}
                  >
                    {mod.title}
                  </span>
                </div>
                <Link href="/dashboard/learn">
                  <button className="q-btn-primary text-xs px-4 py-2">START</button>
                </Link>
              </div>

              {/* Active module topics */}
              {mi === 0 && (
                <div className="px-5 pb-4 border-t border-[var(--q-border)]">
                  {/* Accounting Equation */}
                  <div className="py-4">
                    <p className="font-bold text-sm mb-3" style={{ color: 'var(--q-text-primary)' }}>
                      The Accounting Equation:
                    </p>
                    <div className="flex items-center gap-2 flex-wrap">
                      {['Assets', 'Liabilities', 'Equity'].map((term, ti) => (
                        <span key={ti}>
                          {ti > 0 && (
                            <span className="mx-1 font-bold text-gray-500">
                              {ti === 1 ? '=' : '+'}
                            </span>
                          )}
                          <span
                            className="rounded px-3 py-1 text-white text-sm font-bold"
                            style={{ background: '#2D2D44' }}
                          >
                            {term}
                          </span>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end mb-3">
                    <button className="text-xs underline" style={{ color: 'var(--q-text-muted)' }}>
                      expand all
                    </button>
                  </div>

                  {/* Topic list */}
                  {mod.topics.map((topic, ti) => (
                    <div
                      key={ti}
                      className="flex items-center justify-between py-3 border-t border-[var(--q-border)]"
                    >
                      <div className="flex items-center gap-3">
                        {topic.done ? (
                          <div
                            className="rounded-full flex items-center justify-center"
                            style={{ width: 22, height: 22, background: 'var(--q-success)' }}
                          >
                            <span className="text-white text-xs">✓</span>
                          </div>
                        ) : (
                          <div
                            className="rounded-full border-2"
                            style={{ width: 22, height: 22, borderColor: '#D1D5DB' }}
                          />
                        )}
                        <span className="text-sm font-medium" style={{ color: 'var(--q-text-primary)' }}>
                          {topic.name}
                        </span>
                      </div>
                      <button
                        className="rounded-lg flex items-center justify-center"
                        style={{ width: 28, height: 28, background: 'var(--q-purple)' }}
                      >
                        <Plus size={14} className="text-white" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Visual panel */}
        <BalanceSheetPanel />
      </div>
    </div>
  )
}
