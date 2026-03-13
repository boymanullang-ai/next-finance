import { StatCards } from '@/components/dashboard/StatCards'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowRight, PlayCircle } from 'lucide-react'
import Link from 'next/link'

export default async function DashboardPage() {
  // Mock data for MVP UI testing
  const stats = {
    currentStreak: 2,
    conceptsLearned: 5,
    practiceCompleted: 3,
    currentFocus: 'Balance Sheet',
  }

  const continueLearning = {
    lessonId: 'acct-eq-001',
    lessonSlug: 'accounting-equation-basics',
    title: 'Accounting Equation Basics',
    module: 'Balance Sheet',
  }

  return (
    <div className="flex-1 space-y-6 pt-2">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>

      <StatCards stats={stats} />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Continue Learning</CardTitle>
            <CardDescription>
              Pick up where you left off
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border bg-blue-50/50 p-6 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="space-y-1">
                <p className="text-sm font-medium text-blue-600 uppercase tracking-wider">{continueLearning.module}</p>
                <h3 className="text-xl font-bold">{continueLearning.title}</h3>
                <p className="text-sm text-gray-500">Resume your practice on this topic.</p>
              </div>
              <Link href={`/lesson/${continueLearning.lessonSlug}`}>
                <Button size="lg" className="gap-2">
                  <PlayCircle className="h-5 w-5" />
                  Resume
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Available Modules</CardTitle>
            <CardDescription>
              Explore our curriculum
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { title: 'Balance Sheet', activeCount: 3 },
                { title: 'Income Statement', activeCount: 2 },
                { title: 'Cash Flow', activeCount: 1 }
              ].map((mod, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">{mod.title}</p>
                    <p className="text-sm text-muted-foreground">{mod.activeCount} lessons</p>
                  </div>
                  <Link href={`/courses`}>
                    <Button variant="ghost" size="sm" className="gap-1 rounded-full h-8">
                      View
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
