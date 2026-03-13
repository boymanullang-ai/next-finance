import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { BookA, Clock, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default async function CoursesPage() {
  const modules = [
    {
      id: 1,
      title: 'Financial Statements Fundamentals',
      description: 'Master the three core financial statements through practical, hands-on building exercises.',
      lessons: [
        {
          id: 'acct-eq-001',
          slug: 'accounting-equation-basics',
          title: 'Accounting Equation Basics',
          difficulty: 'Beginner',
          minutes: 12,
        },
        {
          id: 'bs-build-001',
          slug: 'simple-balance-sheet-completion',
          title: 'Simple Balance Sheet Completion',
          difficulty: 'Intermediate',
          minutes: 20,
        }
      ]
    }
  ]

  return (
    <div className="flex-1 space-y-8 pt-2 max-w-5xl mx-auto w-full">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Courses & Curriculum</h2>
        <p className="text-gray-500 mt-2">Browse the available learning modules and start practicing.</p>
      </div>

      <div className="space-y-6">
        {modules.map((module) => (
          <Card key={module.id} className="overflow-hidden">
            <CardHeader className="bg-gray-50/50 border-b">
              <CardTitle className="text-2xl">{module.title}</CardTitle>
              <CardDescription className="text-sm mt-2">{module.description}</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-gray-100">
                {module.lessons.map((lesson, idx) => (
                  <div key={lesson.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 hover:bg-gray-50/50 transition-colors gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center justify-center shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-semibold text-sm">
                          {idx + 1}
                        </span>
                        <h4 className="font-semibold text-lg">{lesson.title}</h4>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500 pl-11">
                        <span className="flex items-center gap-1">
                          <BookA className="h-4 w-4" /> {lesson.difficulty}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" /> {lesson.minutes} min
                        </span>
                      </div>
                    </div>
                    <Link href={`/lesson/${lesson.slug}`} className="w-full sm:w-auto mt-2 sm:mt-0 pl-11 sm:pl-0">
                      <Button className="w-full sm:w-auto gap-2">
                        Start Lesson <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
