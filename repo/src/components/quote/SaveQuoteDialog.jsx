import * as React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/Dialog'
import { Button } from '@/components/ui/Button'
import { Label } from '@/components/ui/Label'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { Separator } from '@/components/ui/Separator'
import { CustomerForm } from './CustomerForm'
import { validateCustomer, createQuoteFromCalculation, formatExpirationDate } from '@/lib/quote'
import { Save, FileText, CheckCircle } from 'lucide-react'
import api from '@/services/api'

/**
 * SaveQuoteDialog - Dialog for saving a quote with customer information
 */
export function SaveQuoteDialog({
  open,
  onOpenChange,
  service,
  selectedFactors,
  entityType,
  selectedAddons,
  calculationResult,
  entityTypes,
  onQuoteSaved,
}) {
  const [customer, setCustomer] = React.useState({
    company_name: '',
    contact_name: '',
    email: '',
    phone: '',
    entity_type_id: entityType?.id || null,
    notes: '',
  })
  const [errors, setErrors] = React.useState({})
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [savedQuote, setSavedQuote] = React.useState(null)
  const [expirationDays, setExpirationDays] = React.useState(30)

  // Reset state when dialog opens
  React.useEffect(() => {
    if (open) {
      setCustomer({
        company_name: '',
        contact_name: '',
        email: '',
        phone: '',
        entity_type_id: entityType?.id || null,
        notes: '',
      })
      setErrors({})
      setSavedQuote(null)
    }
  }, [open, entityType])

  const handleSave = async () => {
    // Validate customer data
    const validation = validateCustomer(customer)
    if (!validation.isValid) {
      setErrors(validation.errors)
      return
    }

    setIsSubmitting(true)
    setErrors({})

    try {
      // Fetch existing quotes for quote number generation
      const existingQuotes = await api.quotes.getAll()

      // Create quote data
      const quoteData = createQuoteFromCalculation({
        customer,
        service,
        selectedFactors,
        entityType,
        selectedAddons,
        calculationResult,
        existingQuotes,
        expirationDays,
      })

      // 1. Create customer
      const createdCustomer = await api.customers.create(quoteData.customer)

      // 2. Create quote with customer_id
      const quoteToSave = {
        ...quoteData.quote,
        customer_id: createdCustomer.id,
      }
      const createdQuote = await api.quotes.create(quoteToSave)

      // 3. Create line item with quote_id
      const lineItemToSave = {
        ...quoteData.lineItem,
        quote_id: createdQuote.id,
      }
      await api.quoteLineItems.create(lineItemToSave)

      // Set saved quote for success state
      setSavedQuote(createdQuote)

      // Notify parent
      if (onQuoteSaved) {
        onQuoteSaved(createdQuote)
      }
    } catch (err) {
      console.error('Failed to save quote:', err)
      setErrors({ submit: err.message || 'Failed to save quote. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    onOpenChange(false)
  }

  // Success state
  if (savedQuote) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md">
          <div className="text-center py-6">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Quote Saved!</h2>
            <p className="text-muted-foreground mb-4">
              Your quote has been saved successfully.
            </p>
            <div className="bg-muted rounded-lg p-4 mb-6">
              <div className="flex items-center justify-center gap-2 mb-2">
                <FileText className="h-5 w-5" />
                <span className="font-mono font-semibold">{savedQuote.quote_number}</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Expires: {formatExpirationDate(savedQuote.expiration_date)}
              </p>
            </div>
            <Button onClick={handleClose} className="w-full">
              Done
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Save className="h-5 w-5" />
            Save Quote
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Quote Summary */}
          <div className="bg-muted rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">{service?.name}</span>
              <Badge variant="outline">Draft</Badge>
            </div>
            <div className="text-2xl font-bold">
              ${calculationResult?.totalPrice?.toLocaleString() || '0'}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Quote will expire in {expirationDays} days
            </p>
          </div>

          <Separator />

          {/* Customer Information */}
          <div>
            <h3 className="text-base font-medium mb-4">Customer Information</h3>
            <CustomerForm
              customer={customer}
              onChange={setCustomer}
              entityTypes={entityTypes}
              errors={errors}
            />
          </div>

          <Separator />

          {/* Expiration Settings */}
          <div>
            <h3 className="text-base font-medium mb-4">Quote Settings</h3>
            <div className="space-y-2">
              <Label htmlFor="expiration_days">Quote Valid For (days)</Label>
              <Input
                id="expiration_days"
                type="number"
                min="1"
                max="365"
                value={expirationDays}
                onChange={(e) => setExpirationDays(Number(e.target.value) || 30)}
                className="w-32"
              />
              <p className="text-sm text-muted-foreground">
                Quote will expire on {formatExpirationDate(
                  new Date(Date.now() + expirationDays * 24 * 60 * 60 * 1000).toISOString()
                )}
              </p>
            </div>
          </div>

          {/* Error message */}
          {errors.submit && (
            <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
              {errors.submit}
            </div>
          )}
        </div>

        <DialogFooter className="mt-6">
          <Button type="button" variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSubmitting} className="gap-2">
            <Save className="h-4 w-4" />
            {isSubmitting ? 'Saving...' : 'Save Quote'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default SaveQuoteDialog
