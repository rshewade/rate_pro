import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Label } from '@/components/ui/Label'
import { Input } from '@/components/ui/Input'
import { Separator } from '@/components/ui/Separator'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/Dialog'
import { formatExpirationDate, isQuoteExpired } from '@/lib/quote'
import {
  ArrowLeft,
  Edit,
  Copy,
  Send,
  CheckCircle,
  XCircle,
  Clock,
  Building2,
  User,
  Mail,
  Phone,
  FileText,
  AlertCircle,
  Eye,
} from 'lucide-react'
import api from '@/services/api'
import { QuotePreview } from './QuotePreview'

const STATUS_OPTIONS = [
  { value: 'draft', label: 'Draft', icon: FileText },
  { value: 'sent', label: 'Sent', icon: Send },
  { value: 'approved', label: 'Approved', icon: CheckCircle },
  { value: 'rejected', label: 'Rejected', icon: XCircle },
]

const STATUS_COLORS = {
  draft: 'secondary',
  sent: 'default',
  approved: 'default',
  rejected: 'destructive',
  expired: 'secondary',
}

/**
 * QuoteDetail - Detailed view of a single quote
 */
export function QuoteDetail({ quote, onBack, onQuoteUpdated }) {
  const [customer, setCustomer] = React.useState(null)
  const [lineItems, setLineItems] = React.useState([])
  const [services, setServices] = React.useState([])
  const [entityTypes, setEntityTypes] = React.useState([])
  const [factorOptions, setFactorOptions] = React.useState([])
  const [pricingFactors, setPricingFactors] = React.useState([])
  const [addons, setAddons] = React.useState([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [isUpdating, setIsUpdating] = React.useState(false)
  const [showStatusDialog, setShowStatusDialog] = React.useState(false)
  const [newStatus, setNewStatus] = React.useState('')
  const [showVersionDialog, setShowVersionDialog] = React.useState(false)
  const [showPreview, setShowPreview] = React.useState(false)

  React.useEffect(() => {
    async function fetchDetails() {
      setIsLoading(true)
      try {
        const [
          customerData,
          lineItemsData,
          servicesData,
          entityTypesData,
          factorOptionsData,
          pricingFactorsData,
          addonsData,
        ] = await Promise.all([
          api.customers.getById(quote.customer_id),
          api.quoteLineItems.getByQuoteId(quote.id),
          api.services.getAll(),
          api.entityTypes.getAll(),
          api.factorOptions.getAll(),
          api.pricingFactors.getAll(),
          api.addons.getAll(),
        ])
        setCustomer(customerData)
        setLineItems(lineItemsData)
        setServices(servicesData)
        setEntityTypes(entityTypesData)
        setFactorOptions(factorOptionsData)
        setPricingFactors(pricingFactorsData)
        setAddons(addonsData)
      } catch (err) {
        console.error('Failed to fetch quote details:', err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchDetails()
  }, [quote])

  const effectiveStatus = React.useMemo(() => {
    if (quote.status === 'draft' && isQuoteExpired(quote.expiration_date)) {
      return 'expired'
    }
    return quote.status
  }, [quote])

  const getServiceName = (serviceId) => {
    const service = services.find((s) => s.id === serviceId)
    return service?.name || 'Unknown Service'
  }

  const getEntityTypeName = (entityTypeId) => {
    const entity = entityTypes.find((e) => e.id === entityTypeId)
    return entity?.name || 'N/A'
  }

  const getFactorOptionLabel = (optionId) => {
    const option = factorOptions.find((o) => o.id === optionId)
    return option?.label || 'N/A'
  }

  const getFactorName = (factorId) => {
    const factor = pricingFactors.find((f) => f.id === factorId)
    return factor?.name || 'Unknown Factor'
  }

  const getAddonName = (addonId) => {
    const addon = addons.find((a) => a.id === addonId)
    return addon?.name || 'Unknown Add-on'
  }

  const handleStatusChange = async () => {
    if (!newStatus || newStatus === quote.status) return

    setIsUpdating(true)
    try {
      const updatedQuote = {
        ...quote,
        status: newStatus,
        updated_at: new Date().toISOString(),
      }
      await api.quotes.update(quote.id, updatedQuote)
      setShowStatusDialog(false)
      if (onQuoteUpdated) {
        onQuoteUpdated(updatedQuote)
      }
    } catch (err) {
      console.error('Failed to update status:', err)
      alert('Failed to update quote status')
    } finally {
      setIsUpdating(false)
    }
  }

  const handleCreateVersion = async () => {
    setIsUpdating(true)
    try {
      // Create new quote as a version
      const existingQuotes = await api.quotes.getAll()
      const now = new Date().toISOString()

      // Generate new quote number with version suffix
      const baseNumber = quote.quote_number.replace(/-v\d+$/, '')
      const versionQuotes = existingQuotes.filter((q) =>
        q.quote_number.startsWith(baseNumber)
      )
      const versionNum = versionQuotes.length + 1

      const newQuote = {
        quote_number: `${baseNumber}-v${versionNum}`,
        customer_id: quote.customer_id,
        status: 'draft',
        total_price: quote.total_price,
        expiration_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        created_at: now,
        updated_at: now,
        notes: `Version ${versionNum} of ${quote.quote_number}`,
        parent_quote_id: quote.id,
      }

      const createdQuote = await api.quotes.create(newQuote)

      // Copy line items
      for (const item of lineItems) {
        await api.quoteLineItems.create({
          ...item,
          id: undefined,
          quote_id: createdQuote.id,
        })
      }

      setShowVersionDialog(false)
      if (onQuoteUpdated) {
        onQuoteUpdated(createdQuote)
      }
      alert(`New version created: ${createdQuote.quote_number}`)
    } catch (err) {
      console.error('Failed to create version:', err)
      alert('Failed to create new version')
    } finally {
      setIsUpdating(false)
    }
  }

  if (isLoading) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <div className="h-6 bg-gray-100 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-100 rounded w-1/2"></div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="h-32 bg-gray-100 rounded"></div>
          <div className="h-48 bg-gray-100 rounded"></div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Quotes
        </Button>
        <div className="flex gap-2">
          {effectiveStatus === 'draft' && (
            <Button variant="outline" size="sm" className="gap-2">
              <Edit className="h-4 w-4" />
              Edit
            </Button>
          )}
          {(effectiveStatus === 'sent' || effectiveStatus === 'approved') && (
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => setShowVersionDialog(true)}
            >
              <Copy className="h-4 w-4" />
              Create Version
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => setShowPreview(true)}
          >
            <Eye className="h-4 w-4" />
            Preview PDF
          </Button>
          <Button
            size="sm"
            className="gap-2"
            onClick={() => {
              setNewStatus(quote.status)
              setShowStatusDialog(true)
            }}
          >
            Update Status
          </Button>
        </div>
      </div>

      {/* Quote Info Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="font-mono">{quote.quote_number}</CardTitle>
              <CardDescription>
                Created {new Date(quote.created_at).toLocaleDateString()}
              </CardDescription>
            </div>
            <div className="text-right">
              <Badge
                variant={STATUS_COLORS[effectiveStatus]}
                className={`text-sm px-3 py-1 ${effectiveStatus === 'approved' ? 'bg-green-600' : ''}`}
              >
                {effectiveStatus.charAt(0).toUpperCase() + effectiveStatus.slice(1)}
              </Badge>
              {isQuoteExpired(quote.expiration_date) && effectiveStatus !== 'expired' && (
                <div className="flex items-center gap-1 text-red-500 text-sm mt-1">
                  <AlertCircle className="h-4 w-4" />
                  Expired
                </div>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Customer Info */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-3">Customer Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <span>{customer?.company_name || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>{customer?.contact_name || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{customer?.email || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{customer?.phone || 'N/A'}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Quote Details */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <Label className="text-muted-foreground">Total Price</Label>
              <p className="text-2xl font-bold">${quote.total_price.toLocaleString()}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Expiration Date</Label>
              <p className={`font-medium ${isQuoteExpired(quote.expiration_date) ? 'text-red-500' : ''}`}>
                {formatExpirationDate(quote.expiration_date)}
              </p>
            </div>
            <div>
              <Label className="text-muted-foreground">Last Updated</Label>
              <p>{new Date(quote.updated_at).toLocaleDateString()}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Entity Type</Label>
              <p>{customer ? getEntityTypeName(customer.entity_type_id) : 'N/A'}</p>
            </div>
          </div>

          {quote.notes && (
            <>
              <Separator />
              <div>
                <Label className="text-muted-foreground">Notes</Label>
                <p className="mt-1">{quote.notes}</p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Line Items */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Line Items</CardTitle>
        </CardHeader>
        <CardContent>
          {lineItems.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No line items</p>
          ) : (
            <div className="space-y-4">
              {lineItems.map((item, index) => (
                <div key={item.id || index} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-medium">{getServiceName(item.service_id)}</h4>
                      <p className="text-sm text-muted-foreground">
                        Base Price: ${item.base_price.toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">
                        ${item.calculated_price.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Selected Factors */}
                  {item.selected_factors && item.selected_factors.length > 0 && (
                    <div className="mt-3">
                      <p className="text-sm font-medium text-muted-foreground mb-2">
                        Configuration
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {item.selected_factors.map((sf, i) => (
                          <Badge key={i} variant="outline">
                            {getFactorName(sf.factor_id)}: {getFactorOptionLabel(sf.option_id)}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Selected Add-ons */}
                  {item.selected_addons && item.selected_addons.length > 0 && (
                    <div className="mt-3">
                      <p className="text-sm font-medium text-muted-foreground mb-2">Add-ons</p>
                      <div className="flex flex-wrap gap-2">
                        {item.selected_addons.map((addonId, i) => (
                          <Badge key={i} variant="secondary">
                            {getAddonName(addonId)}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {item.entity_type_id && (
                    <div className="mt-3">
                      <p className="text-sm text-muted-foreground">
                        Entity Type: {getEntityTypeName(item.entity_type_id)}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Status Update Dialog */}
      <Dialog open={showStatusDialog} onOpenChange={setShowStatusDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Quote Status</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>New Status</Label>
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger>
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
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowStatusDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleStatusChange} disabled={isUpdating}>
              {isUpdating ? 'Updating...' : 'Update Status'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Version Dialog */}
      <Dialog open={showVersionDialog} onOpenChange={setShowVersionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Version</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-muted-foreground">
              This will create a new draft version of this quote. The original quote will remain
              unchanged.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowVersionDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateVersion} disabled={isUpdating}>
              {isUpdating ? 'Creating...' : 'Create Version'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Quote Preview Dialog */}
      <QuotePreview
        open={showPreview}
        onOpenChange={setShowPreview}
        quote={quote}
        customer={customer}
        lineItems={lineItems}
        services={services}
        entityTypes={entityTypes}
        pricingFactors={pricingFactors}
        factorOptions={factorOptions}
        addons={addons}
      />
    </div>
  )
}

export default QuoteDetail
