import React from 'react'
import ReferenceInput from './components/ReferenceInput'
import VerificationResults from './components/VerificationResults'
import useStore from './store/useStore'

function App() {
  const { verificationResults } = useStore()

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Modern Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-4">
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
      <main className="container mx-auto px-4 py-8 flex-1">
        <div className="max-w-4xl mx-auto">
          {verificationResults.length === 0 ? (
            <>
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold tracking-tight">
                  Verify Your References
                </h2>
                <p className="text-muted-foreground mt-2">
                  Ensure your academic citations are accurate and properly formatted
                </p>
              </div>
              <ReferenceInput />
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