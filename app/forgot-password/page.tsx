// app/signup/page.tsx
'use client'
import Image from 'next/image'
import Link from 'next/link'
import { FormEvent, useState } from 'react'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { useRouter } from 'next/navigation'
import Footer from '../components/Footer'

export default function SignUpPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Basic validation
    const confirmPassword = (e.currentTarget.elements.namedItem('confirm-password') as HTMLInputElement).value
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    try {
      // Create user with Firebase Auth
      await createUserWithEmailAndPassword(auth, email, password)

      // Redirect after successful signup
      router.push('/signin')
    } catch (error: any) {
      console.error('Signup error:', error)
      setError(error.message || 'Failed to create account')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-purple-950 to-purple-800">
      {/* Header - Consistent with landing page */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-purple-900 bg-opacity-70 backdrop-blur-sm shadow-sm">
        <div className="container mx-auto px-4 py-3 sm:px-6 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Back Button */}
              <button
                onClick={() => router.back()}
                className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-purple-800 hover:bg-purple-700 text-green-400 hover:text-green-300 transition-all duration-300 border border-purple-600 cursor-pointer"
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
      <main className="flex-grow relative pt-24">
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

        {/* Sign Up Form */}
        <div className="container mx-auto px-6 py-16 relative z-10">
          <div className="max-w-md mx-auto bg-purple-900 bg-opacity-70 backdrop-blur-sm rounded-xl shadow-xl overflow-hidden border border-purple-700">
            <div className="bg-gradient-to-r from-green-600 to-green-500 py-5 px-6">
              <h2 className="text-2xl font-bold text-white">Create Your Account</h2>
            </div>

            <form className="p-6" onSubmit={handleSubmit}>
              {error && (
                <div className="mb-4 p-3 bg-red-500 bg-opacity-20 text-red-100 rounded-md border border-red-400">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="first-name" className="block text-green-100 font-medium mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="first-name"
                    className="w-full px-4 py-3 bg-purple-800 bg-opacity-50 border border-purple-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 text-white placeholder-purple-300"
                    placeholder="Enter your first name"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="last-name" className="block text-green-100 font-medium mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="last-name"
                    className="w-full px-4 py-3 bg-purple-800 bg-opacity-50 border border-purple-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 text-white placeholder-purple-300"
                    placeholder="Enter your last name"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </div>

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


              <div className="mb-4">
                <label htmlFor="password" className="block text-green-100 font-medium mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    className="w-full px-4 py-3 bg-purple-800 bg-opacity-50 border border-purple-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 text-white placeholder-purple-300 pr-12"
                    placeholder=""
                    required
                    minLength={8}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-300 hover:text-green-400 transition-colors cursor-pointer"
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                <p className="text-xs text-green-300 mt-1">
                  Must be at least 8 characters
                </p>
              </div>

              <div className="mb-6">
                <label htmlFor="confirm-password" className="block text-green-100 font-medium mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirm-password"
                    className="w-full px-4 py-3 bg-purple-800 bg-opacity-50 border border-purple-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 text-white placeholder-purple-300 pr-12"
                    placeholder=""
                    required
                    minLength={8}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-300 hover:text-green-400 transition-colors cursor-pointer"
                  >
                    {showConfirmPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-center">
                  <input
                    id="terms"
                    type="checkbox"
                    className="h-4 w-4 text-green-500 focus:ring-green-400 border-purple-600 rounded bg-purple-800 bg-opacity-50 cursor-pointer"
                    required
                  />
                  <label htmlFor="terms" className="ml-2 block text-purple-200">
                    I agree to the <Link href="/terms" className="text-green-300 hover:text-white">Terms of Service</Link> and <Link href="/privacy" className="text-green-300 hover:text-white">Privacy Policy</Link>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-white font-bold py-3 px-4 rounded-lg transition duration-300 mb-4 flex justify-center items-center shadow-lg hover:shadow-green-500/30 cursor-pointer"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Account...
                  </>
                ) : 'Create Account'}
              </button>

              <div className="text-center">
                <p className="text-purple-200">
                  Already have an account?{' '}
                  <Link href="/signin" className="text-green-300 hover:text-white font-medium">
                    Sign in
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </main>

      {/* Footer - Consistent with landing page */}
      <Footer />
    </div>
  )
}