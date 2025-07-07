import React, { useState } from 'react'
import ReferenceInput from './components/ReferenceInput'
import VerificationResults from './components/VerificationResults'
import CitationFormatter from './components/CitationFormatter'
import useStore from './store/useStore'

function App() {
  const { verificationResults } = useStore()
  const [activeTab, setActiveTab] = useState('verify')

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Modern Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="w-full px-12 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-4 flex-1">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Reference Verifier
            </h1>
            <span className="text-sm text-muted-foreground">
              Academic Citation Verification Tool
            </span>
          </div>
          <nav className="flex items-center space-x-6">
            <a href="#" className="text-sm font-medium text-foreground/60 hover:text-foreground transition-colors">
              About
            </a>
            <a href="#" className="text-sm font-medium text-foreground/60 hover:text-foreground transition-colors">
              Help
            </a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 pt-20 pb-12 flex-1">
        <div className="max-w-6xl mx-auto">
          {verificationResults.length === 0 ? (
            <>
              <div className="text-center mb-16">
                <h1 className="scroll-m-20 text-4xl font-bold tracking-tight lg:text-5xl text-foreground mb-8">
                  Reference Tools
                </h1>
                <p className="text-xl text-gray-700 font-semibold leading-relaxed max-w-2xl mx-auto mb-8">
                  Verify your academic citations and format them to standard styles
                </p>
                
                {/* Tab Navigation */}
                <div className="flex justify-center mb-8">
                  <div className="bg-gray-100 p-1 rounded-lg">
                    <button
                      onClick={() => setActiveTab('verify')}
                      className={`px-6 py-2 rounded-md font-medium transition-colors ${
                        activeTab === 'verify'
                          ? 'bg-white text-gray-900 shadow'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      Verify References
                    </button>
                    <button
                      onClick={() => setActiveTab('format')}
                      className={`px-6 py-2 rounded-md font-medium transition-colors ${
                        activeTab === 'format'
                          ? 'bg-white text-gray-900 shadow'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      Format Citations
                    </button>
                  </div>
                </div>
              </div>
              
              {activeTab === 'verify' ? <ReferenceInput /> : <CitationFormatter />}
            </>
          ) : (
            <VerificationResults />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t mt-auto">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-sm text-muted-foreground">
            © 2025 Reference Verifier. Built with shadcn/ui.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App