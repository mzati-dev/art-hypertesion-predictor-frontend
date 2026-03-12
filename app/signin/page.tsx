// app/signin/page.tsx
'use client'
import Image from 'next/image'
import Link from 'next/link'
import { FormEvent, useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { useRouter } from 'next/navigation'

export default function SignInPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await signInWithEmailAndPassword(auth, email, password)
      router.push('/dashboard')
    } catch (error: any) {
      console.error('Signin error:', error)
      setError(error.message || 'Failed to sign in. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-purple-950 to-purple-800">
      {/* Header - Consistent with landing page */}
      <header className="bg-purple-900 bg-opacity-70 backdrop-blur-sm shadow-sm">
        <div className="container mx-auto px-4 py-3 sm:px-6 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Back Button */}
              <button
                onClick={() => router.back()}
                className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-purple-800 hover:bg-purple-700 text-green-400 hover:text-green-300 transition-all duration-300 border border-purple-600"
                aria-label="Go back"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
              </button>

              <div className="flex items-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 relative mr-2 sm:mr-3 rounded-full overflow-hidden">
                  <Image
                    src="/maternal_Ai_logo-removebg-preview.png"
                    alt="Hypertension Risk Logo"
                    fill
                    className="object-contain"
                    priority
                    sizes="(max-width: 640px) 48px, 64px"
                  />
                </div>
                <h1 className="text-lg sm:text-xl font-bold text-white">HYPERTENSION RISK PREDICTION FOR ART PATIENTS</h1>
              </div>
            </div>
          </div>
        </div>
        <div className="h-1 bg-gradient-to-r from-green-400 to-green-300"></div>
      </header>

      {/* Main Content with Background */}
      <main className="flex-grow relative">
        {/* Background Image */}
        <div className="absolute inset-0 z-0 opacity-20">
          <Image
            src="/maternal-bg.jpeg"
            alt="Hypertension Risk Background"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Sign In Form */}
        <div className="container mx-auto px-6 py-16 relative z-10">
          <div className="max-w-md mx-auto bg-purple-900 bg-opacity-70 backdrop-blur-sm rounded-xl shadow-xl overflow-hidden border border-purple-700">
            <div className="bg-gradient-to-r from-green-600 to-green-500 py-5 px-6">
              <h2 className="text-2xl font-bold text-white">Sign In to Your Account</h2>
            </div>

            <form className="p-6" onSubmit={handleSubmit}>
              {error && (
                <div className="mb-4 p-3 bg-red-500 bg-opacity-20 text-red-100 rounded-md border border-red-400">
                  {error}
                </div>
              )}

              <div className="mb-4">
                <label htmlFor="email" className="block text-green-100 font-medium mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-4 py-3 bg-purple-800 bg-opacity-50 border border-purple-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 text-white placeholder-purple-300"
                  placeholder="your@email.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="mb-6">
                <label htmlFor="password" className="block text-green-100 font-medium mb-2">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  className="w-full px-4 py-3 bg-purple-800 bg-opacity-50 border border-purple-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 text-white placeholder-purple-300"
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <div className="text-right mt-2">
                  <Link href="/forgot-password" className="text-sm text-green-300 hover:text-green-200">
                    Forgot password?
                  </Link>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-white font-bold py-3 px-4 rounded-lg transition duration-300 mb-4 flex justify-center items-center shadow-lg hover:shadow-green-500/30"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing In...
                  </>
                ) : 'Sign In'}
              </button>

              <div className="text-center">
                <p className="text-purple-200">
                  Don't have an account?{' '}
                  <Link href="/signup" className="text-green-300 hover:text-white font-medium">
                    Sign up
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </main>

      {/* Footer - Consistent with landing page */}
      <footer className="bg-purple-950 text-white py-8 border-t border-purple-800">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-bold mb-2 text-green-400">HYPERTENSION RISK PREDICTION FOR ART PATIENTS</h3>
              <p className="text-purple-300">Early detection and management of hypertension in HIV patients on ART</p>
            </div>
            <div className="flex space-x-6">
              <Link href="/about" className="text-purple-200 hover:text-green-300 transition duration-300">About</Link>
              <Link href="/research" className="text-purple-200 hover:text-green-300 transition duration-300">Research</Link>
              <Link href="/contact" className="text-purple-200 hover:text-green-300 transition duration-300">Contact</Link>
              <Link href="/privacy" className="text-purple-200 hover:text-green-300 transition duration-300">Privacy</Link>
            </div>
          </div>
          <div className="mt-6 text-center md:text-left text-green-400 text-sm">
            © {new Date().getFullYear()} Hypertension Risk Prediction System for ART Patients. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}