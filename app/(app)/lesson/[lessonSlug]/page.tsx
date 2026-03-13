import { notFound } from 'next/navigation'
import { LessonWorkspace } from '@/components/lesson/LessonWorkspace'
import { toSafePayload } from '@/lib/parser/lessonParser'
import { mockLesson } from '@/lib/parser/mockLesson'
import { headers } from 'next/headers'

interface LessonPageProps {
  params: Promise<{
    lessonSlug: string
  }>
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { lessonSlug } = await params
  
  if (!lessonSlug) return notFound()

  // In production, we'd fetch this from via the API or supabase directly
  // const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/lessons/${lessonSlug}`)
  // const lessonPayload = await res.json()
  
  const lessonPayload = toSafePayload(mockLesson)

  return (
    <LessonWorkspace lesson={lessonPayload} />
  )
}
