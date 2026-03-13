'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { SpreadsheetGrid } from './SpreadsheetGrid'
import { SafeLessonPayload } from '@/lib/parser/types'
import { toast } from 'sonner'
import { CheckCircle2, AlertCircle } from 'lucide-react'

export function LessonWorkspace({ lesson }: { lesson: SafeLessonPayload }) {
  const [userValues, setUserValues] = useState<Record<string, string>>({})
  const [feedback, setFeedback] = useState<Record<string, { ok: boolean; explanation: string }>>({})
  const [revealed, setRevealed] = useState(false)
  const [hintsUsed, setHintsUsed] = useState(0)
  const [activeHints, setActiveHints] = useState<string[]>([])
  const [isChecking, setIsChecking] = useState(false)

  const handleCellChange = (cellRef: string, value: string) => {
    setUserValues((prev) => ({ ...prev, [cellRef]: value }))
    // Clear feedback when typing
    if (feedback[cellRef]) {
      setFeedback((prev) => {
        const nf = { ...prev }
        delete nf[cellRef]
        return nf
      })
    }
  }

  const checkAnswer = async () => {
    setIsChecking(true)
    try {
      const res = await fetch(`/api/lessons/${lesson.lessonSlug}/check`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cells: userValues })
      })
      const data = await res.json()
      
      const newFeedback: any = {}
      let anyWrong = false
      data.feedback.forEach((fb: any) => {
        newFeedback[fb.cell] = { ok: fb.ok, explanation: fb.explanation }
        if (!fb.ok) anyWrong = true
      })
      
      setFeedback(newFeedback)

      if (data.status === 'completed') {
        toast.success("All answers correct! You've completed the lesson.")
      } else if (anyWrong) {
        toast.error("Some answers are incorrect. Try again.")
      } else {
        toast.success("Partial answers are correct keep going.")
      }
    } catch {
      toast.error("Error checking answer.")
    } finally {
      setIsChecking(false)
    }
  }

  const unlockHint = async () => {
    if (hintsUsed >= lesson.hintCount) return
    try {
      const res = await fetch(`/api/lessons/${lesson.lessonSlug}/hint`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentHintLevel: hintsUsed })
      })
      const data = await res.json()
      if (data.hintText) {
        setActiveHints((prev) => [...prev, data.hintText])
        setHintsUsed(data.nextHintLevel)
      }
    } catch {
      toast.error('Failed to load hint')
    }
  }

  const revealSolution = async () => {
    try {
      const res = await fetch(`/api/lessons/${lesson.lessonSlug}/reveal`, { method: 'POST' })
      const data = await res.json()
      if (data.revealed) {
        setRevealed(true)
        setUserValues((prev) => ({ ...prev, ...data.cells }))
        // clear negative feedback
        setFeedback({})
        toast('Solution Revealed')
      }
    } catch {
      toast.error('Failed to reveal solution')
    }
  }

  const resetLesson = () => {
    setUserValues({})
    setFeedback({})
    setRevealed(false)
    setHintsUsed(0)
    setActiveHints([])
  }

  return (
    <div className="flex flex-col h-full space-y-4 max-w-7xl mx-auto w-full">
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row items-center justify-between bg-white border rounded-lg p-4 shadow-sm gap-4">
        <div>
          <h1 className="text-xl font-bold">{lesson.title}</h1>
          <p className="text-sm text-gray-500">{lesson.moduleSlug.replace('-', ' ')} • {lesson.difficulty} • {lesson.estimatedMinutes} Mins</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" onClick={resetLesson}>Reset</Button>
          <Button variant="outline" onClick={unlockHint} disabled={hintsUsed >= lesson.hintCount} className="text-blue-600 border-blue-200 hover:bg-blue-50">
            Hint ({lesson.hintCount - hintsUsed} left)
          </Button>
          {lesson.revealAllowed && (
            <Button variant="secondary" onClick={revealSolution} disabled={revealed} className="bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700">Reveal Solution</Button>
          )}
          <Button onClick={checkAnswer} disabled={isChecking || revealed}>Check Answer</Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-4 flex-1 h-[600px] min-h-[500px]">
        {/* Left Side: Context & Hints */}
        <div className="col-span-1 border rounded-lg bg-gray-50/50 flex flex-col overflow-hidden shadow-sm">
          <Tabs defaultValue="instructions" className="flex flex-col h-full">
            <TabsList className="w-full justify-start rounded-none border-b h-12 bg-white px-2">
              <TabsTrigger value="instructions">Instructions</TabsTrigger>
              <TabsTrigger value="hints">Hints ({hintsUsed})</TabsTrigger>
            </TabsList>
            <TabsContent value="instructions" className="p-4 flex-1 overflow-y-auto m-0">
              <h3 className="font-semibold text-lg mb-2">Objective</h3>
              <p className="text-sm text-gray-600 mb-6">{lesson.objective}</p>
              
              <h3 className="font-semibold text-lg mb-2">Requirements</h3>
              <p className="text-sm text-gray-600">{lesson.description}</p>
            </TabsContent>
            <TabsContent value="hints" className="p-4 flex-1 overflow-y-auto m-0">
              <div className="space-y-4">
                {activeHints.map((hint, i) => (
                  <div key={i} className="rounded-lg border bg-blue-50 p-4 text-sm text-blue-900 shadow-sm animate-in fade-in">
                    <span className="font-bold flex mb-1 text-blue-700">Hint {i + 1}</span>
                    {hint}
                  </div>
                ))}
                {hintsUsed < lesson.hintCount && (
                  <Button variant="outline" className="w-full border-blue-200 text-blue-600 hover:bg-blue-50" onClick={unlockHint}>
                    Unlock Hint {hintsUsed + 1}
                  </Button>
                )}
                {hintsUsed === lesson.hintCount && (
                  <p className="text-sm text-gray-500 italic text-center">No more hints available.</p>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Side: Spreadsheet Workspace */}
        <div className="col-span-3 border bg-white rounded-lg p-0 flex flex-col shadow-sm overflow-hidden">
          <SpreadsheetGrid 
            grid={lesson.grid} 
            userValues={userValues} 
            feedback={feedback} 
            revealed={revealed} 
            onCellChange={handleCellChange} 
          />
        </div>
      </div>
    </div>
  )
}
