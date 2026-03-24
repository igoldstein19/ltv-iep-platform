'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Compass, AlertCircle, Eye, EyeOff, Loader2 } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError('Invalid email or password. Please try again.')
      } else {
        router.push('/dashboard')
        router.refresh()
      }
    } catch (err) {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  function fillDemo(num: 1 | 2) {
    if (num === 1) {
      setEmail('teacher1@waypoint.edu')
      setPassword('password123')
    } else {
      setEmail('teacher2@waypoint.edu')
      setPassword('password123')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-500 rounded-2xl shadow-lg mb-4">
            <Compass className="w-9 h-9 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-800">Waypoint Learning</h1>
          <p className="text-slate-500 mt-2 text-sm leading-relaxed">
            Giving special education teachers<br />
            the time and tools they need
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
          <div className="px-8 pt-8 pb-6">
            <h2 className="text-xl font-bold text-slate-800 mb-1">Welcome back</h2>
            <p className="text-sm text-slate-500">Sign in to your teacher account</p>
          </div>

          <form onSubmit={handleSubmit} className="px-8 pb-8 space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="teacher@school.edu"
                required
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 pr-12 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-xl transition-colors shadow-sm disabled:opacity-70 text-sm"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : null}
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>

        {/* Demo Credentials */}
        <div className="mt-6 bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200 p-5">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 text-center">
            Demo Accounts
          </p>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => fillDemo(1)}
              className="p-3 bg-indigo-50 hover:bg-indigo-100 rounded-xl border border-indigo-100 text-left transition-colors"
            >
              <p className="text-xs font-bold text-indigo-700">Sarah Johnson</p>
              <p className="text-xs text-slate-500 mt-0.5">Grades 3-5 · 3 students</p>
              <p className="text-xs text-slate-400 mt-1 font-mono">teacher1@waypoint.edu</p>
            </button>
            <button
              onClick={() => fillDemo(2)}
              className="p-3 bg-purple-50 hover:bg-purple-100 rounded-xl border border-purple-100 text-left transition-colors"
            >
              <p className="text-xs font-bold text-purple-700">Marcus Williams</p>
              <p className="text-xs text-slate-500 mt-0.5">Grades 6-8 · 2 students</p>
              <p className="text-xs text-slate-400 mt-1 font-mono">teacher2@waypoint.edu</p>
            </button>
          </div>
          <p className="text-xs text-slate-400 text-center mt-3">
            Password: <span className="font-mono font-medium text-slate-600">password123</span>
          </p>
        </div>
      </div>
    </div>
  )
}
