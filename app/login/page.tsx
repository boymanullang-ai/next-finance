import { login } from '@/app/auth/actions'
import { Input } from '@/components/ui/input'
import Link from 'next/link'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams

  return (
    <div
      className="flex flex-col h-screen w-screen"
      style={{ background: 'linear-gradient(135deg, #7B5CF5 0%, #6B46FF 60%, #8B5CF6 100%)' }}
    >
      {/* Top nav */}
      <header className="flex items-center justify-between px-8 py-4">
        <Link href="/" className="flex items-center gap-2 select-none">
          <div
            className="rounded-full flex items-center justify-center text-white font-black"
            style={{
              width: 32, height: 32,
              background: 'linear-gradient(135deg, #FFB800 0%, #FF8C00 100%)',
              fontSize: 14,
            }}
          >Q</div>
          <span className="font-black text-white text-lg">
            <span style={{ color: '#FFD700' }}>Q</span>uantus
          </span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-white/80 text-sm font-medium hover:text-white">
            Pricing
          </Link>
          <Link
            href="/login"
            className="rounded-lg px-5 py-2 font-bold text-sm"
            style={{ background: 'var(--q-purple-dark, #5533CC)', color: '#fff' }}
          >
            SIGN IN
          </Link>
        </div>
      </header>

      {/* Center card */}
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full p-8" style={{ maxWidth: 420 }}>
          {/* Logo */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <div
              className="rounded-full flex items-center justify-center text-white font-black"
              style={{
                width: 36, height: 36,
                background: 'linear-gradient(135deg, #FFB800 0%, #FF8C00 100%)',
                fontSize: 16,
              }}
            >Q</div>
            <span className="font-black text-2xl">
              <span style={{ color: '#FFD700' }}>Q</span>
              <span style={{ color: '#6B46FF' }}>uantus</span>
            </span>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700 font-semibold border border-red-200">
              {error}
            </div>
          )}

          {/* Google OAuth (visual only — wired if needed) */}
          <button
            type="button"
            className="w-full flex items-center justify-center gap-3 rounded-lg border border-gray-200 py-3 text-sm font-medium mb-6 hover:bg-gray-50 transition-all"
            style={{ color: '#374151' }}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Sign in with Google
          </button>

          {/* Email/Password form */}
          <form action={login} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: '#374151' }}>
                Email address
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Your email address"
                required
                className="rounded-lg border-gray-200 bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: '#374151' }}>
                Your Password
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Your password"
                required
                className="rounded-lg border-gray-200 bg-gray-50"
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-lg py-3 font-bold text-white text-sm transition-opacity hover:opacity-90"
              style={{ background: 'var(--q-purple, #6B46FF)' }}
            >
              Sign in
            </button>
          </form>

          {/* Links */}
          <div className="mt-5 text-center space-y-2">
            <p>
              <Link
                href="/login"
                className="text-xs underline"
                style={{ color: '#374151' }}
              >
                Forgot your password?
              </Link>
            </p>
            <p>
              <Link
                href="/register"
                className="text-xs underline"
                style={{ color: '#374151' }}
              >
                Don&apos;t have an account? Sign up
              </Link>
            </p>
          </div>

          {/* Terms */}
          <p className="text-center text-xs mt-5" style={{ color: '#9CA3AF' }}>
            By signing up, you agree to our{' '}
            <Link href="#" className="underline hover:text-gray-600">Terms of Use</Link>
            {' '}and{' '}
            <Link href="#" className="underline hover:text-gray-600">Privacy Policy</Link>.
          </p>
        </div>
      </div>
    </div>
  )
}
