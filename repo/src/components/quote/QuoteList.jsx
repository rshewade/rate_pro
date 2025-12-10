import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table'
import { formatExpirationDate, isQuoteExpired } from '@/lib/quote'
import { Search, Filter, Eye, RefreshCw, AlertCircle } from 'lucide-react'
import api from '@/services'

const STATUS_OPTIONS = [
  { value: 'all', label: 'All Statuses' },
  { value: 'draft', label: 'Draft' },
  { value: 'sent', label: 'Sent' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'expired', label: 'Expired' },
]

const STATUS_COLORS = {
  draft: 'secondary',
  sent: 'default',
  approved: 'default',
  rejected: 'destructive',
  expired: 'secondary',
}

/**
 * QuoteList - Display and manage list of quotes
 */
export function QuoteList({ onSelectQuote }) {
  const [quotes, setQuotes] = React.useState([])
  const [customers, setCustomers] = React.useState([])
  const [services, setServices] = React.useState([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState(null)

  // Filters
  const [searchTerm, setSearchTerm] = React.useState('')
  const [statusFilter, setStatusFilter] = React.useState('all')
  const [sortBy, setSortBy] = React.useState('created_at')
  const [sortOrder, setSortOrder] = React.useState('desc')

  const fetchData = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const [quotesData, customersData, servicesData] = await Promise.all([
        api.quotes.getAll(),
        api.customers.getAll(),
        api.services.getAll(),
      ])
      setQuotes(quotesData)
      setCustomers(customersData)
      setServices(servicesData)
    } catch (err) {
      console.error('Failed to fetch quotes:', err)
      setError(err.message || 'Failed to load quotes')
    } finally {
      setIsLoading(false)
    }
  }

  React.useEffect(() => {
    fetchData()
  }, [])

  // Get customer name by ID
  const getCustomerName = (customerId) => {
    const customer = customers.find((c) => c.id === customerId)
    return customer?.company_name || 'Unknown'
  }

  // Determine effective status (check expiration)
  const getEffectiveStatus = (quote) => {
    if (quote.status === 'draft' && isQuoteExpired(quote.expiration_date)) {
      return 'expired'
    }
    return quote.status
  }

  // Filter and sort quotes
  const filteredQuotes = React.useMemo(() => {
    let result = [...quotes]

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      result = result.filter((quote) => {
        const customerName = getCustomerName(quote.customer_id).toLowerCase()
        const quoteNumber = quote.quote_number?.toLowerCase() || ''
        return customerName.includes(term) || quoteNumber.includes(term)
      })
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter((quote) => {
        const effectiveStatus = getEffectiveStatus(quote)
        return effectiveStatus === statusFilter
      })
    }

    // Sort
    result.sort((a, b) => {
      let aVal, bVal
      if (sortBy === 'created_at') {
        aVal = new Date(a.created_at)
        bVal = new Date(b.created_at)
      } else if (sortBy === 'total_price') {
        aVal = a.total_price
        bVal = b.total_price
      } else if (sortBy === 'quote_number') {
        aVal = a.quote_number
        bVal = b.quote_number
      }

      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1
      }
      return aVal < bVal ? 1 : -1
    })

    return result
  }, [quotes, customers, searchTerm, statusFilter, sortBy, sortOrder])

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="h-7 w-7 text-red-500" />
          </div>
          <h2 className="text-lg font-semibold mb-2">Failed to Load Quotes</h2>
          <p className="text-muted-foreground mb-6 text-sm">{error}</p>
          <Button onClick={fetchData} variant="outline" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Try Again
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Quotes</CardTitle>
            <CardDescription>Manage and track all pricing quotes</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={fetchData} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by quote number or customer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[160px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="created_at">Date</SelectItem>
              <SelectItem value="total_price">Price</SelectItem>
              <SelectItem value="quote_number">Quote #</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
          >
            {sortOrder === 'asc' ? '↑' : '↓'}
          </Button>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-100 rounded animate-pulse" />
            ))}
          </div>
        ) : (
          /* Quotes Table */
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Quote #</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead>Expires</TableHead>
                <TableHead className="w-[80px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredQuotes.map((quote) => {
                const effectiveStatus = getEffectiveStatus(quote)
                const isExpired = isQuoteExpired(quote.expiration_date)

                return (
                  <TableRow key={quote.id}>
                    <TableCell className="font-mono font-medium">
                      {quote.quote_number}
                    </TableCell>
                    <TableCell>{getCustomerName(quote.customer_id)}</TableCell>
                    <TableCell>
                      <Badge
                        variant={STATUS_COLORS[effectiveStatus] || 'secondary'}
                        className={effectiveStatus === 'approved' ? 'bg-green-600' : ''}
                      >
                        {effectiveStatus.charAt(0).toUpperCase() + effectiveStatus.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      ${quote.total_price.toLocaleString()}
                    </TableCell>
                    <TableCell className={isExpired ? 'text-red-500' : ''}>
                      {formatExpirationDate(quote.expiration_date)}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onSelectQuote(quote)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })}
              {filteredQuotes.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                    {searchTerm || statusFilter !== 'all'
                      ? 'No quotes match your filters'
                      : 'No quotes found'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}

        {/* Summary */}
        {!isLoading && (
          <div className="text-sm text-muted-foreground">
            Showing {filteredQuotes.length} of {quotes.length} quotes
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default QuoteList
