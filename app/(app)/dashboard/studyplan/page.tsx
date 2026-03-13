import Link from 'next/link'

// ─── Types ────────────────────────────────────────────────────────────────────
type PlanModule = {
  title: string
  description: string
}

type StudyPlanCardProps = {
  title: string
  subtitle: string
  difficulty: string
  duration: string
  modules: PlanModule[]
  dark?: boolean
}

// ─── Study Plan Card ─────────────────────────────────────────────────────────
function StudyPlanCard({ title, subtitle, difficulty, duration, modules, dark }: StudyPlanCardProps) {
  return (
    <div className="q-card overflow-hidden">
      {/* Header */}
      <div
        className="px-6 py-4 flex items-center justify-between"
        style={{
          background: dark
            ? 'linear-gradient(135deg, #1A1A2E 0%, #2D2D44 100%)'
            : 'linear-gradient(135deg, #7B5CF5 0%, #6B46FF 100%)',
        }}
      >
        <div>
          <h3 className="font-black text-white text-base">{title}</h3>
          <p className="text-white/70 text-xs mt-0.5">{subtitle}</p>
        </div>
        <button
          className="text-xs font-semibold rounded border border-white/40 text-white px-3 py-1 hover:bg-white/10 transition-all"
        >
          Expand All
        </button>
      </div>

      {/* Meta row */}
      <div className="px-6 py-3 flex items-center justify-between border-b border-[var(--q-border)]">
        <span
          className="text-xs font-semibold"
          style={{ color: 'var(--q-purple)' }}
        >
          {difficulty}
        </span>
        <span className="text-xs" style={{ color: 'var(--q-text-muted)' }}>
          {duration}
        </span>
      </div>

      {/* Module list */}
      <div className="px-6 py-4 space-y-3">
        {modules.map((mod, i) => (
          <div key={i} className="flex items-start gap-3">
            <div
              className="rounded flex items-center justify-center mt-0.5 shrink-0"
              style={{ width: 18, height: 18, background: 'var(--q-purple)', opacity: 0.8 }}
            >
              <span className="text-white" style={{ fontSize: 10 }}>▶</span>
            </div>
            <div>
              <p className="text-sm font-semibold" style={{ color: 'var(--q-text-primary)' }}>
                {mod.title}
              </p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--q-text-muted)' }}>
                {mod.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Start button */}
      <div className="px-6 pb-5">
        <Link href="/dashboard/learn">
          <button
            className="w-full rounded-lg py-3 text-sm font-bold text-white transition-opacity hover:opacity-90"
            style={{ background: 'var(--q-purple)' }}
          >
            Start
          </button>
        </Link>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function StudyPlanPage() {
  return (
    <div>
      {/* Purple header */}
      <div className="q-purple-header px-6 py-5">
        <h1 className="font-black text-2xl text-white">Study Plan</h1>
        <p className="text-white/70 text-sm mt-0.5">
          Choose a path to start building your modeling skills.
        </p>
      </div>

      <div className="p-6 space-y-8">
        {/* Modeling Foundations */}
        <div>
          <h2 className="font-bold text-xl mb-4" style={{ color: 'var(--q-text-primary)' }}>
            Modeling Foundations
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <StudyPlanCard
              title="Financial Statement Fundamentals"
              subtitle="Master individual financial statements"
              difficulty="Beginners / Intermediate"
              duration="1.5 weeks"
              modules={[
                {
                  title: 'Individual Financial Statement Modeling',
                  description: 'Build a strong foundation in financial modeling by practicing individual financial statements.',
                },
              ]}
            />
            <StudyPlanCard
              title="Integrated Modeling"
              subtitle="Master fully integrated three-statement models."
              difficulty="Intermediate friendly"
              duration="1 week"
              modules={[
                {
                  title: 'Integrated 3-Statement Modeling',
                  description: 'Practice building integrated financial models that link the income statement, balance sheet, and cash flow statement.',
                },
              ]}
            />
          </div>
        </div>

        {/* Career Tracks */}
        <div>
          <h2 className="font-bold text-xl mb-4" style={{ color: 'var(--q-text-primary)' }}>
            Career Tracks
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <StudyPlanCard
              dark
              title="Investment Banking"
              subtitle="Practice valuation and deal modeling like an IB analyst."
              difficulty="Intermediate / Advance"
              duration="2 weeks"
              modules={[
                {
                  title: 'Investment Banking Modeling',
                  description: 'Practice M&A, LBO, and comparable companies analysis used in IB.',
                },
              ]}
            />
            <StudyPlanCard
              dark
              title="Private Equity"
              subtitle="Practice modeling PE deals from statements to LBO."
              difficulty="Intermediate / Advance"
              duration="2.5 weeks"
              modules={[
                {
                  title: 'Private Equity Modeling',
                  description: 'Practice PE deal structures, returns analysis, and LBO models.',
                },
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
