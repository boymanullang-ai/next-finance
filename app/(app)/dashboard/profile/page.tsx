import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

async function signOut() {
  'use server'
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const displayName = user?.user_metadata?.full_name ?? user?.email ?? 'User'
  const joinDate = user?.created_at
    ? new Date(user.created_at).toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : 'Recently'

  return (
    <div className="p-8">
      {/* Avatar */}
      <div
        className="rounded-xl bg-gray-200 flex items-center justify-center mb-5"
        style={{ width: 120, height: 120 }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-16 h-16 text-gray-400"
        >
          <path
            fillRule="evenodd"
            d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
            clipRule="evenodd"
          />
        </svg>
      </div>

      {/* Name */}
      <h1 className="font-bold text-2xl mb-1" style={{ color: 'var(--q-text-primary)' }}>
        {displayName}
      </h1>
      <p className="text-sm mb-5" style={{ color: 'var(--q-text-muted)' }}>
        Joined: {joinDate}
      </p>

      {/* Log out button */}
      <form action={signOut}>
        <button
          type="submit"
          className="rounded-lg border-2 font-bold text-sm px-8 py-2 hover:bg-yellow-50 transition-all"
          style={{ borderColor: 'var(--q-gold)', color: 'var(--q-text-primary)', background: '#FFFDE7' }}
        >
          LOG OUT
        </button>
      </form>
    </div>
  )
}
