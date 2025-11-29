import { useState } from 'react';
import { Calculator } from './components/Calculator';
import { AdminDashboard } from './components/AdminDashboard';
import { Button } from './components/ui/button';
import { Calculator as CalculatorIcon, Settings, Menu, Trash2 } from 'lucide-react@0.487.0';
import { Toaster } from './components/ui/sonner';
import { Sheet, SheetContent, SheetTrigger } from './components/ui/sheet';
import { ThemeProvider } from './components/ThemeProvider';
import { toast } from 'sonner@2.0.3';

export default function App() {
  const [activeView, setActiveView] = useState<'calculator' | 'admin'>('calculator');

  const clearCache = () => {
    if (confirm('This will clear all cached data and reload from db.json. Continue?')) {
      localStorage.clear();
      toast.success('Cache cleared! Reloading...');
      setTimeout(() => window.location.reload(), 500);
    }
  };

  const NavigationButtons = () => (
    <div className="flex gap-2">
      <Button
        variant={activeView === 'calculator' ? 'default' : 'outline'}
        onClick={() => setActiveView('calculator')}
      >
        <CalculatorIcon className="w-4 h-4 mr-2" />
        Calculator
      </Button>
      <Button
        variant={activeView === 'admin' ? 'default' : 'outline'}
        onClick={() => setActiveView('admin')}
      >
        <Settings className="w-4 h-4 mr-2" />
        Admin
      </Button>
    </div>
  );

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b bg-card">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                  <CalculatorIcon className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h2>Equallto</h2>
                  <p className="text-sm text-muted-foreground">Pricing Calculator</p>
                </div>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden md:block">
                <NavigationButtons />
              </div>

              {/* Mobile Navigation */}
              <div className="md:hidden">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Menu className="w-5 h-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent>
                    <div className="mt-8 space-y-4">
                      <Button
                        variant={activeView === 'calculator' ? 'default' : 'outline'}
                        onClick={() => setActiveView('calculator')}
                        className="w-full"
                      >
                        <CalculatorIcon className="w-4 h-4 mr-2" />
                        Calculator
                      </Button>
                      <Button
                        variant={activeView === 'admin' ? 'default' : 'outline'}
                        onClick={() => setActiveView('admin')}
                        className="w-full"
                      >
                        <Settings className="w-4 h-4 mr-2" />
                        Admin
                      </Button>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="py-8">
          {activeView === 'calculator' ? <Calculator /> : <AdminDashboard />}
        </main>

        {/* Footer */}
        <footer className="border-t bg-card mt-16">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="mb-2">About Equallto</h3>
                <p className="text-sm text-muted-foreground">
                  Simplifying accounting services through transparent pricing and technology-driven solutions.
                </p>
              </div>
              <div>
                <h3 className="mb-2">Services</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>Year-End Accounting</li>
                  <li>Bookkeeping</li>
                  <li>Payroll Services</li>
                  <li>Tax Returns</li>
                </ul>
              </div>
              <div>
                <h3 className="mb-2">Support</h3>
                <p className="text-sm text-muted-foreground">
                  For questions about pricing or services, please contact our team.
                </p>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t">
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  © 2025 Equallto. All rights reserved. | Pricing estimates are for guidance only.
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={clearCache}
                  className="text-muted-foreground"
                >
                  <Trash2 className="w-3 h-3 mr-2" />
                  Clear Cache
                </Button>
              </div>
            </div>
          </div>
        </footer>

        <Toaster />
      </div>
    </ThemeProvider>
  );
}
