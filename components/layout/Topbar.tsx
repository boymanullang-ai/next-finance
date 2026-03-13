import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/server'
import { User } from 'lucide-react'
import { redirect } from 'next/navigation'

export async function Topbar() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  async function signOut() {
    'use server'
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/login')
  }

  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-6">
      <div className="flex items-center gap-4">
        {/* Mobile menu toggle can go here */}
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-gray-700">
          {user?.email}
        </span>
        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700">
          <User className="h-5 w-5" />
        </div>
        <form action={signOut}>
          <Button variant="outline" size="sm">Log out</Button>
        </form>
      </div>
    </header>
  )
}
