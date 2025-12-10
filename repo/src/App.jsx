import * as React from 'react'
import { Calculator } from '@/components/calculator'
import { AdminPanel } from '@/components/admin'
import { QuotesManager } from '@/components/quote'
import { Documentation } from '@/components/docs'
import { Calculator as CalcIcon, Settings, Trash2, FileText, BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/Button'

function App() {
  const [view, setView] = React.useState('calculator')

  const handleClearCache = () => {
    localStorage.clear()
    window.location.reload()
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#fafafa]">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#030213] rounded-lg flex items-center justify-center">
                <CalcIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-base font-semibold text-foreground leading-tight">RatePro</p>
                <p className="text-sm text-muted-foreground">Pricing Calculator</p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex items-center gap-2">
              <Button
                variant={view === 'calculator' ? 'default' : 'outline'}
                className="gap-2"
                onClick={() => setView('calculator')}
              >
                <CalcIcon className="w-4 h-4" />
                Calculator
              </Button>
              <Button
                variant={view === 'quotes' ? 'default' : 'outline'}
                className="gap-2"
                onClick={() => setView('quotes')}
              >
                <FileText className="w-4 h-4" />
                Quotes
              </Button>
              <Button
                variant={view === 'admin' ? 'default' : 'outline'}
                className="gap-2"
                onClick={() => setView('admin')}
              >
                <Settings className="w-4 h-4" />
                Admin
              </Button>
              <Button
                variant={view === 'docs' ? 'default' : 'outline'}
                className="gap-2"
                onClick={() => setView('docs')}
              >
                <BookOpen className="w-4 h-4" />
                Docs
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 py-12 px-6">
        {view === 'calculator' && <Calculator />}
        {view === 'quotes' && <QuotesManager />}
        {view === 'admin' && <AdminPanel />}
        {view === 'docs' && <Documentation />}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-10">
        <div className="max-w-7xl mx-auto px-6">
          {/* Footer Links */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* About */}
            <div>
              <h3 className="font-medium text-foreground mb-3">About RatePro</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Simplifying accounting services through transparent pricing and technology-driven solutions.
              </p>
            </div>

            {/* Services */}
            <div>
              <h3 className="font-medium text-foreground mb-3">Services</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Year-End Accounting
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Bookkeeping
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Payroll Services
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Tax Returns
                  </a>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="font-medium text-foreground mb-3">Support</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                For questions about pricing or services, please contact our team.
              </p>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-6 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              &copy; 2025 RatePro. All rights reserved. | Pricing estimates are for guidance only.
            </p>
            <button
              onClick={handleClearCache}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Clear Cache
            </button>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
