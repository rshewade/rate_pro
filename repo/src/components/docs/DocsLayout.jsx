import * as React from 'react'
import { cn } from '@/lib/utils'
import { ChevronRight, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'

/**
 * Documentation sections configuration
 */
export const DOC_SECTIONS = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    label: 'Getting Started',
  },
  {
    id: 'calculator-usage',
    title: 'Calculator Usage',
    label: 'Calculator',
    subsections: [
      { id: 'selecting-service', title: 'Selecting a Service' },
      { id: 'pricing-factors', title: 'Configuring Pricing Factors' },
      { id: 'factor-input-types', title: 'Factor Input Types' },
      { id: 'entity-types', title: 'Entity Types' },
      { id: 'add-ons', title: 'Selecting Add-ons' },
      { id: 'generating-quote', title: 'Generating a Quote' },
    ],
  },
  {
    id: 'quote-management',
    title: 'Quote Management',
    label: 'Quotes',
    subsections: [
      { id: 'quote-list', title: 'Quote List View' },
      { id: 'quote-detail', title: 'Quote Details' },
      { id: 'quote-status', title: 'Status Management' },
      { id: 'quote-versioning', title: 'Versioning' },
    ],
  },
  {
    id: 'pdf-export',
    title: 'PDF Export',
    label: 'PDF Export',
  },
  {
    id: 'admin-panel',
    title: 'Admin Panel',
    label: 'Admin',
    subsections: [
      { id: 'admin-services', title: 'Managing Services' },
      { id: 'admin-pricing-factors', title: 'Pricing Factors & Options' },
      { id: 'admin-entity-types', title: 'Entity Types' },
      { id: 'admin-add-ons', title: 'Add-ons' },
      { id: 'admin-dependencies', title: 'Factor Dependencies' },
      { id: 'admin-test-calculator', title: 'Test Calculator' },
    ],
  },
  {
    id: 'pricing-concepts',
    title: 'Pricing Concepts',
    label: 'Pricing',
    subsections: [
      { id: 'price-impact-types', title: 'Price Impact Types' },
      { id: 'calculation-walkthrough', title: 'Calculation Walkthrough' },
    ],
  },
  {
    id: 'audit-trail',
    title: 'Audit Trail',
    label: 'Audit Trail',
  },
]

/**
 * DocsLayout - Two-column documentation layout with sidebar navigation
 */
export function DocsLayout({ children, activeSection, onSectionChange }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)
  const [expandedSections, setExpandedSections] = React.useState(['calculator-usage', 'admin-panel', 'pricing-concepts'])

  const toggleSection = (sectionId) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId]
    )
  }

  const handleNavClick = (sectionId) => {
    onSectionChange?.(sectionId)
    setIsMobileMenuOpen(false)
    // Scroll to section
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const NavItem = ({ section, isSubsection = false }) => {
    const hasSubsections = section.subsections?.length > 0
    const isExpanded = expandedSections.includes(section.id)
    const isActive = activeSection === section.id

    return (
      <div>
        <button
          onClick={() => {
            if (hasSubsections) {
              toggleSection(section.id)
            }
            handleNavClick(section.id)
          }}
          className={cn(
            'w-full flex items-center justify-between px-3 py-2 text-sm rounded-md transition-colors',
            isSubsection && 'pl-6',
            isActive
              ? 'bg-[#030213] text-white font-medium'
              : 'text-muted-foreground hover:bg-gray-100 hover:text-foreground'
          )}
        >
          <span>{section.title}</span>
          {hasSubsections && (
            <ChevronRight
              className={cn(
                'w-4 h-4 transition-transform',
                isExpanded && 'rotate-90'
              )}
            />
          )}
        </button>
        {hasSubsections && isExpanded && (
          <div className="ml-2 mt-1 space-y-1 border-l border-gray-200 pl-2">
            {section.subsections.map((sub) => (
              <NavItem key={sub.id} section={sub} isSubsection />
            ))}
          </div>
        )}
      </div>
    )
  }

  const Sidebar = () => (
    <nav className="space-y-1">
      {DOC_SECTIONS.map((section) => (
        <NavItem key={section.id} section={section} />
      ))}
    </nav>
  )

  return (
    <div className="max-w-7xl mx-auto">
      {/* Mobile menu button */}
      <div className="lg:hidden mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="gap-2"
        >
          {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          {isMobileMenuOpen ? 'Close Menu' : 'Documentation Menu'}
        </Button>
      </div>

      {/* Mobile menu overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/50" onClick={() => setIsMobileMenuOpen(false)}>
          <div
            className="absolute left-0 top-0 bottom-0 w-72 bg-white p-4 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold">Documentation</h2>
              <Button variant="ghost" size="sm" onClick={() => setIsMobileMenuOpen(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            <Sidebar />
          </div>
        </div>
      )}

      <div className="flex gap-8">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="sticky top-4 max-h-[calc(100vh-8rem)] overflow-y-auto pr-4">
            <h2 className="font-semibold mb-4 text-lg">Documentation</h2>
            <Sidebar />
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          <div className="prose prose-slate max-w-none">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

export default DocsLayout
