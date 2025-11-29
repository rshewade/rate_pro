import * as React from 'react'
import { QuoteList } from './QuoteList'
import { QuoteDetail } from './QuoteDetail'
import { FileText } from 'lucide-react'

/**
 * QuotesManager - Main quotes management interface
 * Handles navigation between list and detail views
 */
export function QuotesManager() {
  const [selectedQuote, setSelectedQuote] = React.useState(null)

  const handleSelectQuote = (quote) => {
    setSelectedQuote(quote)
  }

  const handleBack = () => {
    setSelectedQuote(null)
  }

  const handleQuoteUpdated = (updatedQuote) => {
    setSelectedQuote(updatedQuote)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Page Title */}
      <div className="text-center space-y-2">
        <h1 className="flex items-center justify-center gap-2 text-xl font-semibold">
          <FileText className="w-6 h-6" />
          Quote Management
        </h1>
        <p className="text-muted-foreground text-sm">
          View, track, and manage all your pricing quotes
        </p>
      </div>

      {/* Content */}
      {selectedQuote ? (
        <QuoteDetail
          quote={selectedQuote}
          onBack={handleBack}
          onQuoteUpdated={handleQuoteUpdated}
        />
      ) : (
        <QuoteList onSelectQuote={handleSelectQuote} />
      )}
    </div>
  )
}

export default QuotesManager
