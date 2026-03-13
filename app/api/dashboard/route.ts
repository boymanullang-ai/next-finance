import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // To fetch actual stats, we would aggregate `lesson_attempts`
  // For MVP, if there are no real attempts yet, return mock stats combined with reality.
  const { count: completedCount } = await supabase
    .from('lesson_attempts')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('status', 'completed')

  const { data: latestAttempt } = await supabase
    .from('lesson_attempts')
    .select('lessons(title, module_id, slug, lesson_id), status')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false })
    .limit(1)
    .single()

  const fallbackContinue = {
    lessonId: 'acct-eq-001',
    lessonSlug: 'accounting-equation-basics',
    title: 'Accounting Equation Basics',
    module: 'Balance Sheet',
  }

  // @ts-ignore: Next.js build complains about missing properties if inferred as array
  const activeLesson = Array.isArray(latestAttempt?.lessons) ? latestAttempt?.lessons[0] : latestAttempt?.lessons;

  return NextResponse.json({
    stats: {
      currentStreak: 2, 
      conceptsLearned: (completedCount || 0) * 2,
      practiceCompleted: completedCount || 0,
      currentFocus: activeLesson?.title || 'Balance Sheet'
    },
    continueLearning: activeLesson ? {
      lessonId: activeLesson.lesson_id,
      lessonSlug: activeLesson.slug,
      title: activeLesson.title,
      module: 'Continue where you left off',
    } : fallbackContinue,
    modules: [] // fetched from db
  })
}
