// app/components/Footer.tsx
'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function Footer() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    const handleNavigation = (e: React.MouseEvent, url: string) => {
        e.preventDefault()
        setLoading(true)
        setTimeout(() => {
            router.push(url)
        }, 100)
    }

    return (
        <footer className="bg-purple-950 text-white py-12 border-t border-purple-800">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-start">
                    <div className="mb-8 md:mb-0">
                        <div className="flex items-center mb-4">
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
    )
}