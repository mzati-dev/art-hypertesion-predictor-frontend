// app/page.tsx
'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

// Progress Bar Component
function ProgressBar({ show }: { show: boolean }) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (show) {
      setProgress(0)
      const timer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 95) return 95
          return prev + 5
        })
      }, 100)
      return () => clearInterval(timer)
    } else {
      setProgress(0)
    }
  }, [show])

  if (!show) return null

  return (
    <div className="fixed top-0 left-0 w-full h-1 z-50">
      <div
        className="h-full bg-green-500 transition-all duration-100 ease-linear"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  )
}

export default function LandingPage() {
  const [loading, setLoading] = useState(false)
  const [targetUrl, setTargetUrl] = useState('')
  const [pulse, setPulse] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const interval = setInterval(() => {
      setPulse(prev => !prev)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  const handleNavigation = (e: React.MouseEvent, url: string) => {
    e.preventDefault()
    setLoading(true)
    setTargetUrl(url)
    
    setTimeout(() => {
      router.push(url)
    }, 100)
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-purple-950 to-purple-800">
      <ProgressBar show={loading} />
      
      {/* Header */}
      <header className="bg-purple-900 bg-opacity-70 backdrop-blur-sm shadow-sm">
        <div className="container mx-auto px-4 py-3 sm:px-6 sm:py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0">
            <div className="flex items-center w-full sm:w-auto justify-between sm:justify-start">

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
             {/* <div className="w-12 h-12 sm:w-16 sm:h-16 relative mr-2 sm:mr-3">
  <Image
    src="/maternal_Ai_logo-removebg-preview.png"
    alt="Hypertension Risk Logo"
    fill
    className="object-contain"
    priority
    sizes="(max-width: 640px) 48px, 64px"
  />
</div> */}
    {/* <div className="w-8 h-8 sm:w-10 sm:h-10 relative mr-2 sm:mr-3">
                <Image
                  src="/maternal_Ai_logo-removebg-preview.png"
                  alt="Maternal Risk Logo"
                  fill
                  className="object-contain"
                  priority
                  sizes="(max-width: 640px) 32px, 40px"
                />
              </div> */}
              <h1 className="text-lg sm:text-xl font-bold text-white whitespace-nowrap">
                HYPERTENSION RISK PREDICTION FOR ART PATIENTS
              </h1>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4 w-full sm:w-auto justify-end">
              <Link 
                href="/signin" 
                onClick={(e) => handleNavigation(e, '/signin')}
                className="bg-green-600 hover:bg-green-500 text-white font-bold py-1.5 px-3 sm:py-2 sm:px-4 rounded-md transition duration-300 text-sm sm:text-base"
              >
                Sign In
              </Link>
              <Link 
                href="/signup" 
                onClick={(e) => handleNavigation(e, '/signup')}
                className="bg-green-600 hover:bg-green-500 text-white font-bold py-1.5 px-3 sm:py-2 sm:px-4 rounded-md transition duration-300 text-sm sm:text-base"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
        <div className="h-1 bg-gradient-to-r from-green-400 to-green-300"></div>
      </header>

      {/* Hero Section */}
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

        {/* Content Overlay */}
        <div className="container mx-auto px-6 py-24 relative z-10 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className={`text-5xl md:text-7xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-green-300 via-green-400 to-green-500 ${pulse ? 'scale-105' : 'scale-100'} transition-transform duration-1000`}>
              PREDICTING HYPERTENSION IN HIV PATIENTS ON ART
            </h2>
            
            <div className="bg-purple-900 bg-opacity-50 backdrop-blur-sm p-8 rounded-xl border border-purple-700">
              <p className="text-xl md:text-2xl mb-8 text-green-100">
                Our AI-powered system predicts hypertension risk in HIV patients on ART with 94% accuracy,
                enabling early intervention and personalized care recommendations.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="bg-purple-800 bg-opacity-60 p-4 rounded-lg border border-purple-700">
                  <div className="w-12 h-12 mx-auto mb-3 bg-green-500 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-green-300">Early Detection</h3>
                  <p className="text-green-100">Identify hypertension risk before clinical symptoms appear</p>
                </div>
                <div className="bg-purple-800 bg-opacity-60 p-4 rounded-lg border border-purple-700">
                  <div className="w-12 h-12 mx-auto mb-3 bg-green-500 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-green-300">ART-Specific Insights</h3>
                  <p className="text-green-100">Tailored recommendations considering ART medication interactions</p>
                </div>
                <div className="bg-purple-800 bg-opacity-60 p-4 rounded-lg border border-purple-700">
                  <div className="w-12 h-12 mx-auto mb-3 bg-green-500 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-green-300">Risk Monitoring</h3>
                  <p className="text-green-100">Track cardiovascular health alongside HIV management</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                <Link 
                  href="/signup" 
                  onClick={(e) => handleNavigation(e, '/signup')}
                  className="bg-green-600 hover:bg-green-500 text-white font-bold py-4 px-8 rounded-lg transition duration-300 text-lg shadow-lg hover:shadow-green-500/30 flex items-center justify-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                  </svg>
                  Start Risk Assessment
                </Link>
                <Link 
                  href="/about" 
                  onClick={(e) => handleNavigation(e, '/about')}
                  className="bg-transparent hover:bg-purple-800 text-green-300 font-bold py-4 px-8 border-2 border-green-500 rounded-lg transition duration-300 text-lg flex items-center justify-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
                  How It Works
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section className="bg-purple-950 py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-12">
            Why Monitor Hypertension in ART Patients?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                ),
                title: "Fast Results",
                description: "Get hypertension risk assessments in minutes"
              },
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                ),
                title: "Clinically Validated",
                description: "Developed with HIV and cardiology specialists"
              },
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                ),
                title: "Secure & Private",
                description: "Your health data is encrypted and protected"
              },
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                  </svg>
                ),
                title: "Cloud-Based",
                description: "Access patient data securely from anywhere"
              }
            ].map((feature, index) => (
              <div key={index} className="bg-purple-900 bg-opacity-50 p-6 rounded-xl border border-purple-700 hover:border-green-400 transition duration-300">
                <div className="text-green-400 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-green-200">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-purple-950 text-white py-12 border-t border-purple-800">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start">
            <div className="mb-8 md:mb-0">
              <div className="flex items-center mb-4">
                {/* <div className="w-10 h-10 relative mr-3">
                  <Image
                    src="/maternal_Ai_logo-removebg-preview.png"
                    alt="Hypertension Risk Logo"
                    fill
                    className="object-contain"
                  />
                </div> */}
                <div className="w-10 h-10 relative mr-3 rounded-full overflow-hidden">
  <Image
    src="/maternal_Ai_logo-removebg-preview.png"
    alt="Hypertension Risk Logo"
    fill
    className="object-contain"
  />
</div>
                <h3 className="text-xl font-bold text-green-400">HYPERTENSION RISK PREDICTION</h3>
              </div>
              <p className="text-green-300 max-w-md">
                Empowering healthcare providers with AI-driven insights for managing hypertension risk in HIV patients on ART.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h4 className="text-lg font-semibold text-green-300 mb-4">Quick Links</h4>
                <ul className="space-y-2">
                  <li><Link href="/about" onClick={(e) => handleNavigation(e, '/about')} className="text-green-200 hover:text-white transition duration-300">About Us</Link></li>
                  <li><Link href="/research" onClick={(e) => handleNavigation(e, '/research')} className="text-green-200 hover:text-white transition duration-300">Research</Link></li>
                  <li><Link href="/contact" onClick={(e) => handleNavigation(e, '/contact')} className="text-green-200 hover:text-white transition duration-300">Contact</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-green-300 mb-4">Resources</h4>
                <ul className="space-y-2">
                  <li><Link href="/faq" onClick={(e) => handleNavigation(e, '/faq')} className="text-green-200 hover:text-white transition duration-300">FAQ</Link></li>
                  <li><Link href="/blog" onClick={(e) => handleNavigation(e, '/blog')} className="text-green-200 hover:text-white transition duration-300">Blog</Link></li>
                  <li><Link href="/privacy" onClick={(e) => handleNavigation(e, '/privacy')} className="text-green-200 hover:text-white transition duration-300">Privacy Policy</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-green-300 mb-4">Connect</h4>
                <div className="flex space-x-4">
                  <Link href="#" className="text-green-200 hover:text-green-400 transition duration-300">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                    </svg>
                  </Link>
                  <Link href="#" className="text-green-200 hover:text-green-400 transition duration-300">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                  </Link>
                  <Link href="#" className="text-green-200 hover:text-green-400 transition duration-300">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06-4.123 0-2.43-.013-2.784-.06-3.808-.049-1.064-.218-1.791-.465-2.427a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 0115.45.525c.636-.247 1.363-.416 2.427-.465C18.901.013 19.256 0 21.685 0h.63c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63zm-.81 7.46l4.665-3.215a1 1 0 011.54.053 1 1 0 01.053 1.54l-4.664 3.215a1 1 0 01-1.54-.053 1 1 0 01-.053-1.54z" clipRule="evenodd" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-purple-800 text-center text-green-400 text-sm">
            © {new Date().getFullYear()} Hypertension Risk Prediction System for ART Patients. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}


// // app/page.tsx
// 'use client'
// import Image from 'next/image'
// import Link from 'next/link'
// import { useState, useEffect } from 'react'
// import { useRouter } from 'next/navigation'

// // Progress Bar Component
// function ProgressBar({ show }: { show: boolean }) {
//   const [progress, setProgress] = useState(0)

//   useEffect(() => {
//     if (show) {
//       setProgress(0)
//       const timer = setInterval(() => {
//         setProgress((prev) => {
//           if (prev >= 95) return 95
//           return prev + 5
//         })
//       }, 100)
//       return () => clearInterval(timer)
//     } else {
//       setProgress(0)
//     }
//   }, [show])

//   if (!show) return null

//   return (
//     <div className="fixed top-0 left-0 w-full h-1 z-50">
//       <div
//         className="h-full bg-green-500 transition-all duration-100 ease-linear"
//         style={{ width: `${progress}%` }}
//       ></div>
//     </div>
//   )
// }

// export default function LandingPage() {
//   const [loading, setLoading] = useState(false)
//   const [targetUrl, setTargetUrl] = useState('')
//   const [pulse, setPulse] = useState(false)
//   const router = useRouter()

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setPulse(prev => !prev)
//     }, 2000)
//     return () => clearInterval(interval)
//   }, [])

//   const handleNavigation = (e: React.MouseEvent, url: string) => {
//     e.preventDefault()
//     setLoading(true)
//     setTargetUrl(url)
    
//     setTimeout(() => {
//       router.push(url)
//     }, 100)
//   }

//   return (
//     <div className="min-h-screen flex flex-col bg-gradient-to-b from-purple-950 to-purple-800">
//       <ProgressBar show={loading} />
      
//       {/* Header */}
//       <header className="bg-purple-900 bg-opacity-70 backdrop-blur-sm shadow-sm">
//         <div className="container mx-auto px-4 py-3 sm:px-6 sm:py-4">
//           <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0">
//             <div className="flex items-center w-full sm:w-auto justify-between sm:justify-start">
//               <div className="w-8 h-8 sm:w-10 sm:h-10 relative mr-2 sm:mr-3">
//                 <Image
//                   src="/maternal_Ai_logo-removebg-preview.png"
//                   alt="Hypertension Risk Logo"
//                   fill
//                   className="object-contain"
//                   priority
//                   sizes="(max-width: 640px) 32px, 40px"
//                 />
//               </div>
//               <h1 className="text-lg sm:text-xl font-bold text-white whitespace-nowrap">
//                 HYPERTENSION RISK PREDICTION FOR ART PATIENTS
//               </h1>
//             </div>
//             <div className="flex items-center space-x-2 sm:space-x-4 w-full sm:w-auto justify-end">
//               <Link 
//                 href="/signin" 
//                 onClick={(e) => handleNavigation(e, '/signin')}
//                 className="bg-green-600 hover:bg-green-500 text-white font-bold py-1.5 px-3 sm:py-2 sm:px-4 rounded-md transition duration-300 text-sm sm:text-base"
//               >
//                 Sign In
//               </Link>
//               <Link 
//                 href="/signup" 
//                 onClick={(e) => handleNavigation(e, '/signup')}
//                 className="bg-yellow-600 hover:bg-yellow-500 text-white font-bold py-1.5 px-3 sm:py-2 sm:px-4 rounded-md transition duration-300 text-sm sm:text-base"
//               >
//                 Sign Up
//               </Link>
//             </div>
//           </div>
//         </div>
//         <div className="h-1 bg-gradient-to-r from-green-400 to-green-300"></div>
//       </header>

//       {/* Hero Section */}
//       <main className="flex-grow relative">
//         {/* Background Image */}
//         <div className="absolute inset-0 z-0 opacity-20">
//           <Image
//             src="/maternal-bg.jpeg"
//             alt="Hypertension Risk Background"
//             fill
//             className="object-cover"
//             priority
//           />
//         </div>

//         {/* Content Overlay */}
//         <div className="container mx-auto px-6 py-24 relative z-10 text-white">
//           <div className="max-w-4xl mx-auto text-center">
//             <h2 className={`text-5xl md:text-7xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-green-300 via-green-400 to-yellow-500 ${pulse ? 'scale-105' : 'scale-100'} transition-transform duration-1000`}>
//               PREDICTING HYPERTENSION IN HIV PATIENTS ON ART
//             </h2>
            
//             <div className="bg-purple-900 bg-opacity-50 backdrop-blur-sm p-8 rounded-xl border border-purple-700">
//               <p className="text-xl md:text-2xl mb-8 text-green-100">
//                 Our AI-powered system predicts hypertension risk in HIV patients on ART with 94% accuracy,
//                 enabling early intervention and personalized care recommendations.
//               </p>
              
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
//                 <div className="bg-purple-800 bg-opacity-60 p-4 rounded-lg border border-purple-700">
//                   <div className="w-12 h-12 mx-auto mb-3 bg-yellow-500 rounded-full flex items-center justify-center">
//                     <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//                     </svg>
//                   </div>
//                   <h3 className="text-xl font-semibold mb-2 text-yellow-300">Early Detection</h3>
//                   <p className="text-green-100">Identify hypertension risk before clinical symptoms appear</p>
//                 </div>
//                 <div className="bg-purple-800 bg-opacity-60 p-4 rounded-lg border border-purple-700">
//                   <div className="w-12 h-12 mx-auto mb-3 bg-yellow-500 rounded-full flex items-center justify-center">
//                     <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//                     </svg>
//                   </div>
//                   <h3 className="text-xl font-semibold mb-2 text-yellow-300">ART-Specific Insights</h3>
//                   <p className="text-green-100">Tailored recommendations considering ART medication interactions</p>
//                 </div>
//                 <div className="bg-purple-800 bg-opacity-60 p-4 rounded-lg border border-purple-700">
//                   <div className="w-12 h-12 mx-auto mb-3 bg-yellow-500 rounded-full flex items-center justify-center">
//                     <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
//                     </svg>
//                   </div>
//                   <h3 className="text-xl font-semibold mb-2 text-yellow-300">Risk Monitoring</h3>
//                   <p className="text-green-100">Track cardiovascular health alongside HIV management</p>
//                 </div>
//               </div>

//               <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
//                 <Link 
//                   href="/signup" 
//                   onClick={(e) => handleNavigation(e, '/signup')}
//                   className="bg-yellow-600 hover:bg-yellow-500 text-white font-bold py-4 px-8 rounded-lg transition duration-300 text-lg shadow-lg hover:shadow-yellow-500/30 flex items-center justify-center"
//                 >
//                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
//                     <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
//                   </svg>
//                   Start Risk Assessment
//                 </Link>
//                 <Link 
//                   href="/about" 
//                   onClick={(e) => handleNavigation(e, '/about')}
//                   className="bg-transparent hover:bg-purple-800 text-yellow-300 font-bold py-4 px-8 border-2 border-yellow-500 rounded-lg transition duration-300 text-lg flex items-center justify-center"
//                 >
//                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
//                     <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
//                   </svg>
//                   How It Works
//                 </Link>
//               </div>
//             </div>
//           </div>
//         </div>
//       </main>

//       {/* Features Section */}
//       <section className="bg-purple-950 py-16">
//         <div className="container mx-auto px-6">
//           <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-12">
//             Why Monitor Hypertension in ART Patients?
//           </h2>
          
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
//             {[
//               {
//                 icon: (
//                   <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
//                   </svg>
//                 ),
//                 title: "Fast Results",
//                 description: "Get hypertension risk assessments in minutes"
//               },
//               {
//                 icon: (
//                   <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
//                   </svg>
//                 ),
//                 title: "Clinically Validated",
//                 description: "Developed with HIV and cardiology specialists"
//               },
//               {
//                 icon: (
//                   <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
//                   </svg>
//                 ),
//                 title: "Secure & Private",
//                 description: "Your health data is encrypted and protected"
//               },
//               {
//                 icon: (
//                   <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
//                   </svg>
//                 ),
//                 title: "Cloud-Based",
//                 description: "Access patient data securely from anywhere"
//               }
//             ].map((feature, index) => (
//               <div key={index} className="bg-purple-900 bg-opacity-50 p-6 rounded-xl border border-purple-700 hover:border-yellow-400 transition duration-300">
//                 <div className="text-yellow-400 mb-4">
//                   {feature.icon}
//                 </div>
//                 <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
//                 <p className="text-green-200">{feature.description}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Footer */}
//       <footer className="bg-purple-950 text-white py-12 border-t border-purple-800">
//         <div className="container mx-auto px-6">
//           <div className="flex flex-col md:flex-row justify-between items-start">
//             <div className="mb-8 md:mb-0">
//               <div className="flex items-center mb-4">
//                 <div className="w-10 h-10 relative mr-3">
//                   <Image
//                     src="/pregnancy-icon.png"
//                     alt="Hypertension Risk Logo"
//                     fill
//                     className="object-contain"
//                   />
//                 </div>
//                 <h3 className="text-xl font-bold text-yellow-400">HYPERTENSION RISK PREDICTION</h3>
//               </div>
//               <p className="text-green-300 max-w-md">
//                 Empowering healthcare providers with AI-driven insights for managing hypertension risk in HIV patients on ART.
//               </p>
//             </div>
//             <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
//               <div>
//                 <h4 className="text-lg font-semibold text-yellow-300 mb-4">Quick Links</h4>
//                 <ul className="space-y-2">
//                   <li><Link href="/about" onClick={(e) => handleNavigation(e, '/about')} className="text-green-200 hover:text-white transition duration-300">About Us</Link></li>
//                   <li><Link href="/research" onClick={(e) => handleNavigation(e, '/research')} className="text-green-200 hover:text-white transition duration-300">Research</Link></li>
//                   <li><Link href="/contact" onClick={(e) => handleNavigation(e, '/contact')} className="text-green-200 hover:text-white transition duration-300">Contact</Link></li>
//                 </ul>
//               </div>
//               <div>
//                 <h4 className="text-lg font-semibold text-yellow-300 mb-4">Resources</h4>
//                 <ul className="space-y-2">
//                   <li><Link href="/faq" onClick={(e) => handleNavigation(e, '/faq')} className="text-green-200 hover:text-white transition duration-300">FAQ</Link></li>
//                   <li><Link href="/blog" onClick={(e) => handleNavigation(e, '/blog')} className="text-green-200 hover:text-white transition duration-300">Blog</Link></li>
//                   <li><Link href="/privacy" onClick={(e) => handleNavigation(e, '/privacy')} className="text-green-200 hover:text-white transition duration-300">Privacy Policy</Link></li>
//                 </ul>
//               </div>
//               <div>
//                 <h4 className="text-lg font-semibold text-yellow-300 mb-4">Connect</h4>
//                 <div className="flex space-x-4">
//                   <Link href="#" className="text-green-200 hover:text-yellow-400 transition duration-300">
//                     <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
//                       <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
//                     </svg>
//                   </Link>
//                   <Link href="#" className="text-green-200 hover:text-yellow-400 transition duration-300">
//                     <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
//                       <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
//                     </svg>
//                   </Link>
//                   <Link href="#" className="text-green-200 hover:text-yellow-400 transition duration-300">
//                     <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
//                       <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06-4.123 0-2.43-.013-2.784-.06-3.808-.049-1.064-.218-1.791-.465-2.427a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 0115.45.525c.636-.247 1.363-.416 2.427-.465C18.901.013 19.256 0 21.685 0h.63c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63zm-.81 7.46l4.665-3.215a1 1 0 011.54.053 1 1 0 01.053 1.54l-4.664 3.215a1 1 0 01-1.54-.053 1 1 0 01-.053-1.54z" clipRule="evenodd" />
//                     </svg>
//                   </Link>
//                 </div>
//               </div>
//             </div>
//           </div>
//           <div className="mt-12 pt-8 border-t border-purple-800 text-center text-green-400 text-sm">
//             © {new Date().getFullYear()} Hypertension Risk Prediction System for ART Patients. All rights reserved.
//           </div>
//         </div>
//       </footer>
//     </div>
//   )
// }

// // app/page.tsx
// 'use client'
// import Image from 'next/image'
// import Link from 'next/link'
// import { useState, useEffect } from 'react'
// import { useRouter } from 'next/navigation'

// // Progress Bar Component
// function ProgressBar({ show }: { show: boolean }) {
//   const [progress, setProgress] = useState(0)

//   useEffect(() => {
//     if (show) {
//       setProgress(0)
//       const timer = setInterval(() => {
//         setProgress((prev) => {
//           if (prev >= 95) return 95
//           return prev + 5
//         })
//       }, 100)
//       return () => clearInterval(timer)
//     } else {
//       setProgress(0)
//     }
//   }, [show])

//   if (!show) return null

//   return (
//     <div className="fixed top-0 left-0 w-full h-1 z-50">
//       <div
//         className="h-full bg-green-500 transition-all duration-100 ease-linear"
//         style={{ width: `${progress}%` }}
//       ></div>
//     </div>
//   )
// }

// export default function LandingPage() {
//   const [loading, setLoading] = useState(false)
//   const [targetUrl, setTargetUrl] = useState('')
//   const [pulse, setPulse] = useState(false)
//   const router = useRouter()

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setPulse(prev => !prev)
//     }, 2000)
//     return () => clearInterval(interval)
//   }, [])

//   const handleNavigation = (e: React.MouseEvent, url: string) => {
//     e.preventDefault()
//     setLoading(true)
//     setTargetUrl(url)
    
//     setTimeout(() => {
//       router.push(url)
//     }, 100)
//   }

//   return (
//     <div className="min-h-screen flex flex-col bg-gradient-to-b from-green-950 to-green-800">
//       <ProgressBar show={loading} />
      
//       {/* Header */}
//       <header className="bg-green-900 bg-opacity-70 backdrop-blur-sm shadow-sm">
//         <div className="container mx-auto px-4 py-3 sm:px-6 sm:py-4">
//           <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0">
//             <div className="flex items-center w-full sm:w-auto justify-between sm:justify-start">
//               <div className="w-8 h-8 sm:w-10 sm:h-10 relative mr-2 sm:mr-3">
//                 <Image
//                   src="/maternal_Ai_logo-removebg-preview.png"
//                   alt="Hypertension Risk Logo"
//                   fill
//                   className="object-contain"
//                   priority
//                   sizes="(max-width: 640px) 32px, 40px"
//                 />
//               </div>
//               <h1 className="text-lg sm:text-xl font-bold text-white whitespace-nowrap">
//                 HYPERTENSION RISK PREDICTION FOR ART PATIENTS
//               </h1>
//             </div>
//             <div className="flex items-center space-x-2 sm:space-x-4 w-full sm:w-auto justify-end">
//               <Link 
//                 href="/signin" 
//                 onClick={(e) => handleNavigation(e, '/signin')}
//                 className="bg-green-600 hover:bg-green-500 text-white font-bold py-1.5 px-3 sm:py-2 sm:px-4 rounded-md transition duration-300 text-sm sm:text-base"
//               >
//                 Sign In
//               </Link>
//               <Link 
//                 href="/signup" 
//                 onClick={(e) => handleNavigation(e, '/signup')}
//                 className="bg-yellow-600 hover:bg-yellow-500 text-white font-bold py-1.5 px-3 sm:py-2 sm:px-4 rounded-md transition duration-300 text-sm sm:text-base"
//               >
//                 Sign Up
//               </Link>
//             </div>
//           </div>
//         </div>
//         <div className="h-1 bg-gradient-to-r from-green-400 to-green-300"></div>
//       </header>

//       {/* Hero Section */}
//       <main className="flex-grow relative">
//         {/* Background Image */}
//         <div className="absolute inset-0 z-0 opacity-20">
//           <Image
//             src="/maternal-bg.jpeg"
//             alt="Hypertension Risk Background"
//             fill
//             className="object-cover"
//             priority
//           />
//         </div>

//         {/* Content Overlay */}
//         <div className="container mx-auto px-6 py-24 relative z-10 text-white">
//           <div className="max-w-4xl mx-auto text-center">
//             <h2 className={`text-5xl md:text-7xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-green-300 via-green-400 to-yellow-500 ${pulse ? 'scale-105' : 'scale-100'} transition-transform duration-1000`}>
//               PREDICTING HYPERTENSION IN HIV PATIENTS ON ART
//             </h2>
            
//             <div className="bg-green-900 bg-opacity-50 backdrop-blur-sm p-8 rounded-xl border border-green-700">
//               <p className="text-xl md:text-2xl mb-8 text-green-100">
//                 Our AI-powered system predicts hypertension risk in HIV patients on ART with 94% accuracy,
//                 enabling early intervention and personalized care recommendations.
//               </p>
              
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
//                 <div className="bg-green-800 bg-opacity-60 p-4 rounded-lg border border-green-700">
//                   <div className="w-12 h-12 mx-auto mb-3 bg-yellow-500 rounded-full flex items-center justify-center">
//                     <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//                     </svg>
//                   </div>
//                   <h3 className="text-xl font-semibold mb-2 text-yellow-300">Early Detection</h3>
//                   <p className="text-green-100">Identify hypertension risk before clinical symptoms appear</p>
//                 </div>
//                 <div className="bg-green-800 bg-opacity-60 p-4 rounded-lg border border-green-700">
//                   <div className="w-12 h-12 mx-auto mb-3 bg-yellow-500 rounded-full flex items-center justify-center">
//                     <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//                     </svg>
//                   </div>
//                   <h3 className="text-xl font-semibold mb-2 text-yellow-300">ART-Specific Insights</h3>
//                   <p className="text-green-100">Tailored recommendations considering ART medication interactions</p>
//                 </div>
//                 <div className="bg-green-800 bg-opacity-60 p-4 rounded-lg border border-green-700">
//                   <div className="w-12 h-12 mx-auto mb-3 bg-yellow-500 rounded-full flex items-center justify-center">
//                     <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
//                     </svg>
//                   </div>
//                   <h3 className="text-xl font-semibold mb-2 text-yellow-300">Risk Monitoring</h3>
//                   <p className="text-green-100">Track cardiovascular health alongside HIV management</p>
//                 </div>
//               </div>

//               <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
//                 <Link 
//                   href="/signup" 
//                   onClick={(e) => handleNavigation(e, '/signup')}
//                   className="bg-yellow-600 hover:bg-yellow-500 text-white font-bold py-4 px-8 rounded-lg transition duration-300 text-lg shadow-lg hover:shadow-yellow-500/30 flex items-center justify-center"
//                 >
//                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
//                     <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
//                   </svg>
//                   Start Risk Assessment
//                 </Link>
//                 <Link 
//                   href="/about" 
//                   onClick={(e) => handleNavigation(e, '/about')}
//                   className="bg-transparent hover:bg-green-800 text-yellow-300 font-bold py-4 px-8 border-2 border-yellow-500 rounded-lg transition duration-300 text-lg flex items-center justify-center"
//                 >
//                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
//                     <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
//                   </svg>
//                   How It Works
//                 </Link>
//               </div>
//             </div>
//           </div>
//         </div>
//       </main>

//       {/* Features Section */}
//       <section className="bg-green-950 py-16">
//         <div className="container mx-auto px-6">
//           <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-12">
//             Why Monitor Hypertension in ART Patients?
//           </h2>
          
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
//             {[
//               {
//                 icon: (
//                   <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
//                   </svg>
//                 ),
//                 title: "Fast Results",
//                 description: "Get hypertension risk assessments in minutes"
//               },
//               {
//                 icon: (
//                   <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
//                   </svg>
//                 ),
//                 title: "Clinically Validated",
//                 description: "Developed with HIV and cardiology specialists"
//               },
//               {
//                 icon: (
//                   <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
//                   </svg>
//                 ),
//                 title: "Secure & Private",
//                 description: "Your health data is encrypted and protected"
//               },
//               {
//                 icon: (
//                   <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
//                   </svg>
//                 ),
//                 title: "Cloud-Based",
//                 description: "Access patient data securely from anywhere"
//               }
//             ].map((feature, index) => (
//               <div key={index} className="bg-green-900 bg-opacity-50 p-6 rounded-xl border border-green-700 hover:border-yellow-400 transition duration-300">
//                 <div className="text-yellow-400 mb-4">
//                   {feature.icon}
//                 </div>
//                 <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
//                 <p className="text-green-200">{feature.description}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Footer */}
//       <footer className="bg-green-950 text-white py-12 border-t border-green-800">
//         <div className="container mx-auto px-6">
//           <div className="flex flex-col md:flex-row justify-between items-start">
//             <div className="mb-8 md:mb-0">
//               <div className="flex items-center mb-4">
//                 <div className="w-10 h-10 relative mr-3">
//                   <Image
//                     src="/pregnancy-icon.png"
//                     alt="Hypertension Risk Logo"
//                     fill
//                     className="object-contain"
//                   />
//                 </div>
//                 <h3 className="text-xl font-bold text-yellow-400">HYPERTENSION RISK PREDICTION</h3>
//               </div>
//               <p className="text-green-300 max-w-md">
//                 Empowering healthcare providers with AI-driven insights for managing hypertension risk in HIV patients on ART.
//               </p>
//             </div>
//             <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
//               <div>
//                 <h4 className="text-lg font-semibold text-yellow-300 mb-4">Quick Links</h4>
//                 <ul className="space-y-2">
//                   <li><Link href="/about" onClick={(e) => handleNavigation(e, '/about')} className="text-green-200 hover:text-white transition duration-300">About Us</Link></li>
//                   <li><Link href="/research" onClick={(e) => handleNavigation(e, '/research')} className="text-green-200 hover:text-white transition duration-300">Research</Link></li>
//                   <li><Link href="/contact" onClick={(e) => handleNavigation(e, '/contact')} className="text-green-200 hover:text-white transition duration-300">Contact</Link></li>
//                 </ul>
//               </div>
//               <div>
//                 <h4 className="text-lg font-semibold text-yellow-300 mb-4">Resources</h4>
//                 <ul className="space-y-2">
//                   <li><Link href="/faq" onClick={(e) => handleNavigation(e, '/faq')} className="text-green-200 hover:text-white transition duration-300">FAQ</Link></li>
//                   <li><Link href="/blog" onClick={(e) => handleNavigation(e, '/blog')} className="text-green-200 hover:text-white transition duration-300">Blog</Link></li>
//                   <li><Link href="/privacy" onClick={(e) => handleNavigation(e, '/privacy')} className="text-green-200 hover:text-white transition duration-300">Privacy Policy</Link></li>
//                 </ul>
//               </div>
//               <div>
//                 <h4 className="text-lg font-semibold text-yellow-300 mb-4">Connect</h4>
//                 <div className="flex space-x-4">
//                   <Link href="#" className="text-green-200 hover:text-yellow-400 transition duration-300">
//                     <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
//                       <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
//                     </svg>
//                   </Link>
//                   <Link href="#" className="text-green-200 hover:text-yellow-400 transition duration-300">
//                     <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
//                       <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
//                     </svg>
//                   </Link>
//                   <Link href="#" className="text-green-200 hover:text-yellow-400 transition duration-300">
//                     <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
//                       <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06-4.123 0-2.43-.013-2.784-.06-3.808-.049-1.064-.218-1.791-.465-2.427a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 0115.45.525c.636-.247 1.363-.416 2.427-.465C18.901.013 19.256 0 21.685 0h.63c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63zm-.81 7.46l4.665-3.215a1 1 0 011.54.053 1 1 0 01.053 1.54l-4.664 3.215a1 1 0 01-1.54-.053 1 1 0 01-.053-1.54z" clipRule="evenodd" />
//                     </svg>
//                   </Link>
//                 </div>
//               </div>
//             </div>
//           </div>
//           <div className="mt-12 pt-8 border-t border-green-800 text-center text-green-400 text-sm">
//             © {new Date().getFullYear()} Hypertension Risk Prediction System for ART Patients. All rights reserved.
//           </div>
//         </div>
//       </footer>
//     </div>
//   )
// }