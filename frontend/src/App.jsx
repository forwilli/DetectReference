import React, { useState, useEffect } from 'react'
import ReferenceInput from './components/ReferenceInput'
import VerificationResults from './components/VerificationResults'
import CitationFormatter from './components/CitationFormatter'
import SwanLogo from './components/SwanLogo'
import LanguageSelector from './components/LanguageSelector'
import SEOContent from './components/SEOContent'
import AnimatedBackground from './components/AnimatedBackground'
import useStore from './store/useStore'
import { useTranslation } from 'react-i18next'

function App() {
  // Add Google verification meta tag dynamically
  useEffect(() => {
    const verificationCode = import.meta.env.VITE_GOOGLE_SITE_VERIFICATION
    if (verificationCode && !document.querySelector('meta[name="google-site-verification"]')) {
      const meta = document.createElement('meta')
      meta.name = 'google-site-verification'
      meta.content = verificationCode
      document.head.appendChild(meta)
    }
  }, [])
  const { verificationResults } = useStore()
  const [activeTab, setActiveTab] = useState('verify')
  const { t } = useTranslation()

  return (
    <div className="min-h-screen bg-background flex flex-col relative">
      {/* Animated Background */}
      <AnimatedBackground />
      {/* Modern Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 flex">
            <a className="mr-6 flex items-center space-x-2" href="/">
              <SwanLogo className="h-6 w-6" />
              <span className="font-bold inline-block">
                SwanRef
              </span>
            </a>
            <nav className="flex items-center space-x-6 text-sm font-medium">
              <a href="#" className="transition-colors hover:text-foreground/80 text-foreground/60">
                {t('nav.docs')}
              </a>
              <a href="#" className="transition-colors hover:text-foreground/80 text-foreground/60">
                {t('nav.components')}
              </a>
              <a href="#" className="transition-colors hover:text-foreground/80 text-foreground/60">
                {t('nav.examples')}
              </a>
            </nav>
          </div>
          <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            <div className="flex items-center space-x-4">
              <LanguageSelector />
              <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15" fill="none" className="mr-2">
                  <path d="M12.5 3L2.5 3.00002C1.67157 3.00002 1 3.6716 1 4.50002V9.50003C1 10.3285 1.67157 11 2.5 11H7.50003C7.63264 11 7.75982 11.0527 7.85358 11.1465L10 13.2929V11.5C10 11.2239 10.2239 11 10.5 11H12.5C13.3284 11 14 10.3285 14 9.50003V4.5C14 3.67157 13.3284 3 12.5 3ZM2.49999 2.00002L12.5 2C13.8807 2 15 3.11929 15 4.5V9.50003C15 10.8807 13.8807 12 12.5 12H11V14.5C11 14.7022 10.8782 14.8845 10.6913 14.9619C10.5045 15.0393 10.2894 14.9965 10.1464 14.8536L7.29292 12H2.5C1.11929 12 0 10.8807 0 9.50003V4.50002C0 3.11931 1.11928 2.00003 2.49999 2.00002Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                </svg>
                {t('nav.github')}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container relative flex-1">
        <div className="mx-auto max-w-[980px] py-4 md:py-6 lg:py-10 w-full">
          {verificationResults.length === 0 ? (
            <>
              <div className="text-center space-y-4">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                  {t('app.mainTitle')}
                  <br className="hidden sm:inline" />
                  <span className="bg-gradient-to-r from-gray-600 to-gray-400 bg-clip-text text-transparent">{t('app.mainSubtitle')}</span>
                </h1>
                <p className="mx-auto max-w-[700px] text-lg text-muted-foreground sm:text-xl">
                  {t('app.mainDescription')}
                </p>
                
                {/* Tab Navigation */}
                <div className="flex justify-center gap-4 pt-8 pb-10">
                  <button
                    onClick={() => setActiveTab('verify')}
                    className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-8 ${
                      activeTab === 'verify'
                        ? 'bg-primary text-primary-foreground shadow hover:bg-primary/90'
                        : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                    }`}
                  >
                    {t('tabs.verify')}
                  </button>
                  <button
                    onClick={() => setActiveTab('format')}
                    className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-8 ${
                      activeTab === 'format'
                        ? 'bg-primary text-primary-foreground shadow hover:bg-primary/90'
                        : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                    }`}
                  >
                    {t('tabs.format')}
                  </button>
                </div>
              </div>
              
              <div className="relative">
                {/* Subtle background glow */}
                <div className="absolute inset-0 -z-10">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px]">
                    <div className="absolute inset-0 rounded-full bg-gradient-radial from-gray-100 to-transparent opacity-40" />
                  </div>
                </div>
                
                <div className="relative">
                  {activeTab === 'verify' ? <ReferenceInput /> : <CitationFormatter />}
                </div>
                
                {/* SEO Content Section - Only show on homepage */}
                <SEOContent />
              </div>
            </>
          ) : (
            <VerificationResults />
          )}
        </div>
      </main>

      {/* Compact Footer */}
      <footer className="border-t mt-auto bg-background relative z-10">
        <div className="container py-3">
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground">
            <span>© 2025 Cite</span>
            <span className="hidden sm:inline">•</span>
            <span>Free Forever</span>
            <span>•</span>
            <span className="hidden md:inline">AI Hallucination Detector</span>
            <span className="hidden md:inline">•</span>
            <span>APA • MLA • Chicago • Harvard</span>
            <span className="hidden sm:inline">•</span>
            <span className="hidden lg:inline">CrossRef & Google Scholar Verified</span>
            <span className="hidden lg:inline">•</span>
            <a href="https://github.com/forwitli/DetectReference" target="_blank" rel="noreferrer" className="hover:text-foreground transition-colors">
              Open Source
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App