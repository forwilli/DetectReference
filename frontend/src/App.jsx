import React, { useState } from 'react'
import ReferenceInput from './components/ReferenceInput'
import VerificationResults from './components/VerificationResults'
import CitationFormatter from './components/CitationFormatter'
import SwanLogo from './components/SwanLogo'
import useStore from './store/useStore'

function App() {
  const { verificationResults } = useStore()
  const [activeTab, setActiveTab] = useState('verify')

  return (
    <div className="min-h-screen bg-background flex flex-col relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-50 pointer-events-none -z-10" />
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] pointer-events-none -z-10" />
      
      {/* Subtle decorative elements */}
      <div className="absolute left-0 top-1/3 w-px h-32 bg-gradient-to-b from-transparent via-gray-200 to-transparent pointer-events-none -z-10" />
      <div className="absolute right-0 top-1/3 w-px h-32 bg-gradient-to-b from-transparent via-gray-200 to-transparent pointer-events-none -z-10" />
      <div className="absolute left-10 top-1/2 w-px h-48 bg-gradient-to-b from-transparent via-gray-100 to-transparent pointer-events-none -z-10" />
      <div className="absolute right-10 top-1/2 w-px h-48 bg-gradient-to-b from-transparent via-gray-100 to-transparent pointer-events-none -z-10" />
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
                Docs
              </a>
              <a href="#" className="transition-colors hover:text-foreground/80 text-foreground/60">
                Components
              </a>
              <a href="#" className="transition-colors hover:text-foreground/80 text-foreground/60">
                Examples
              </a>
            </nav>
          </div>
          <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15" fill="none" className="mr-2">
                <path d="M12.5 3L2.5 3.00002C1.67157 3.00002 1 3.6716 1 4.50002V9.50003C1 10.3285 1.67157 11 2.5 11H7.50003C7.63264 11 7.75982 11.0527 7.85358 11.1465L10 13.2929V11.5C10 11.2239 10.2239 11 10.5 11H12.5C13.3284 11 14 10.3285 14 9.50003V4.5C14 3.67157 13.3284 3 12.5 3ZM2.49999 2.00002L12.5 2C13.8807 2 15 3.11929 15 4.5V9.50003C15 10.8807 13.8807 12 12.5 12H11V14.5C11 14.7022 10.8782 14.8845 10.6913 14.9619C10.5045 15.0393 10.2894 14.9965 10.1464 14.8536L7.29292 12H2.5C1.11929 12 0 10.8807 0 9.50003V4.50002C0 3.11931 1.11928 2.00003 2.49999 2.00002Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
              </svg>
              GitHub
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container relative flex-1">
        <div className="mx-auto max-w-[980px] py-8 md:py-12 lg:py-24 w-full">
          {verificationResults.length === 0 ? (
            <>
              <div className="text-center space-y-6">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                  Free Citation Generator
                  <br className="hidden sm:inline" />
                  <span className="bg-gradient-to-r from-gray-600 to-gray-400 bg-clip-text text-transparent">& Reference Verifier</span>
                </h1>
                <p className="mx-auto max-w-[700px] text-lg text-muted-foreground sm:text-xl">
                  Instantly verify academic references and create perfectly formatted citations in 
                  APA, MLA, Chicago, and Harvard styles. Trusted by 50,000+ students.
                </p>
                
                {/* Tab Navigation */}
                <div className="flex justify-center gap-4 py-8">
                  <button
                    onClick={() => setActiveTab('verify')}
                    className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-8 ${
                      activeTab === 'verify'
                        ? 'bg-primary text-primary-foreground shadow hover:bg-primary/90'
                        : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                    }`}
                  >
                    Verify References
                  </button>
                  <button
                    onClick={() => setActiveTab('format')}
                    className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-8 ${
                      activeTab === 'format'
                        ? 'bg-primary text-primary-foreground shadow hover:bg-primary/90'
                        : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                    }`}
                  >
                    Format Citations
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
              </div>
            </>
          ) : (
            <VerificationResults />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t mt-auto bg-background relative z-10">
        <div className="container py-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center md:items-start gap-4">
              <div className="flex items-center gap-2">
                <SwanLogo className="h-5 w-5" />
                <span className="font-semibold">Cite by SwanRef</span>
              </div>
              <p className="text-sm text-muted-foreground text-center md:text-left">
                Free citation generator trusted by students worldwide. 
                Verify references and format citations instantly.
              </p>
            </div>
            <div className="flex flex-col items-center md:items-start gap-4">
              <h3 className="font-semibold">Citation Styles</h3>
              <ul className="text-sm text-muted-foreground space-y-2 text-center md:text-left">
                <li>APA 7th Edition</li>
                <li>MLA 9th Edition</li>
                <li>Chicago 17th Edition</li>
                <li>Harvard Referencing</li>
              </ul>
            </div>
            <div className="flex flex-col items-center md:items-start gap-4">
              <h3 className="font-semibold">Resources</h3>
              <ul className="text-sm text-muted-foreground space-y-2 text-center md:text-left">
                <li><a href="#" className="hover:text-foreground transition-colors">How to Cite Sources</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Citation Guide</a></li>
                <li><a href="https://github.com/forwitli/DetectReference" target="_blank" rel="noreferrer" className="hover:text-foreground transition-colors">Open Source</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            © 2025 Cite. Made with ❤️ for students everywhere.
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App