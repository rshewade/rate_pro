import * as React from 'react'
import { pdf } from '@react-pdf/renderer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Separator } from '@/components/ui/Separator'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/Dialog'
import { QuotePDF } from './QuotePDF'
import { formatExpirationDate, isQuoteExpired } from '@/lib/quote'
import { Download, Eye, Printer, X, FileText, Building2, User, Mail, Phone } from 'lucide-react'

/**
 * QuotePreview - Preview and export quote as PDF
 */
export function QuotePreview({
  open,
  onOpenChange,
  quote,
  customer,
  lineItems,
  services,
  entityTypes,
  pricingFactors,
  factorOptions,
  addons,
}) {
  const [isGenerating, setIsGenerating] = React.useState(false)

  const getServiceName = (serviceId) => {
    const service = services?.find((s) => s.id === serviceId)
    return service?.name || 'Unknown Service'
  }

  const getEntityTypeName = (entityTypeId) => {
    const entity = entityTypes?.find((e) => e.id === entityTypeId)
    return entity?.name || 'N/A'
  }

  const getFactorName = (factorId) => {
    const factor = pricingFactors?.find((f) => f.id === factorId)
    return factor?.name || 'Unknown'
  }

  const getFactorOptionLabel = (optionId) => {
    const option = factorOptions?.find((o) => o.id === optionId)
    return option?.label || 'N/A'
  }

  const getAddonName = (addonId) => {
    const addon = addons?.find((a) => a.id === addonId)
    return addon?.name || 'Unknown'
  }

  const handleDownloadPDF = async () => {
    setIsGenerating(true)
    try {
      const doc = (
        <QuotePDF
          quote={quote}
          customer={customer}
          lineItems={lineItems}
          services={services}
          entityTypes={entityTypes}
          pricingFactors={pricingFactors}
          factorOptions={factorOptions}
          addons={addons}
        />
      )
      const blob = await pdf(doc).toBlob()
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${quote?.quote_number || 'quote'}.pdf`
      link.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Failed to generate PDF:', err)
      alert('Failed to generate PDF. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const handlePrint = () => {
    window.print()
  }

  const expired = isQuoteExpired(quote?.expiration_date)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Quote Preview
            </DialogTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadPDF}
                disabled={isGenerating}
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                {isGenerating ? 'Generating...' : 'Download PDF'}
              </Button>
            </div>
          </div>
        </DialogHeader>

        {/* Preview Content - mimics PDF layout */}
        <div className="bg-white border rounded-lg p-8 space-y-6 print:border-0 print:p-0">
          {/* Header */}
          <div className="flex justify-between items-start pb-6 border-b-2 border-[#030213]">
            <div>
              <h1 className="text-3xl font-bold text-[#030213]">RatePro</h1>
              <p className="text-sm text-muted-foreground mt-1">Professional Pricing Solutions</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold font-mono">{quote?.quote_number || 'DRAFT'}</p>
              <p className="text-sm text-muted-foreground mt-1">
                Date: {new Date(quote?.created_at).toLocaleDateString()}
              </p>
              <Badge
                className="mt-2"
                variant={quote?.status === 'approved' ? 'default' : 'secondary'}
              >
                {(quote?.status || 'draft').toUpperCase()}
              </Badge>
            </div>
          </div>

          {/* Customer Info */}
          <div>
            <h2 className="text-sm font-semibold text-[#030213] mb-3 pb-2 border-b">
              Customer Information
            </h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Company:</span>
                <span className="font-medium">{customer?.company_name || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Contact:</span>
                <span className="font-medium">{customer?.contact_name || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Email:</span>
                <span className="font-medium">{customer?.email || 'N/A'}</span>
              </div>
              {customer?.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Phone:</span>
                  <span className="font-medium">{customer.phone}</span>
                </div>
              )}
            </div>
          </div>

          {/* Quote Details */}
          <div>
            <h2 className="text-sm font-semibold text-[#030213] mb-3 pb-2 border-b">
              Quote Details
            </h2>
            <div className="text-sm">
              <span className="text-muted-foreground">Valid Until: </span>
              <span className={`font-medium ${expired ? 'text-red-500' : ''}`}>
                {formatExpirationDate(quote?.expiration_date)}
                {expired && ' (EXPIRED)'}
              </span>
            </div>
          </div>

          {/* Line Items */}
          <div>
            <h2 className="text-sm font-semibold text-[#030213] mb-3 pb-2 border-b">
              Services & Pricing
            </h2>
            <div className="border rounded-lg overflow-hidden">
              <div className="grid grid-cols-12 gap-4 bg-gray-50 p-3 text-sm font-medium">
                <div className="col-span-6">Service</div>
                <div className="col-span-3 text-right">Base Price</div>
                <div className="col-span-3 text-right">Total</div>
              </div>
              {lineItems?.map((item, index) => (
                <div key={index} className="border-t">
                  <div className="grid grid-cols-12 gap-4 p-3 text-sm">
                    <div className="col-span-6 font-medium">
                      {getServiceName(item.service_id)}
                    </div>
                    <div className="col-span-3 text-right">
                      ${item.base_price?.toLocaleString()}
                    </div>
                    <div className="col-span-3 text-right font-medium">
                      ${item.calculated_price?.toLocaleString()}
                    </div>
                  </div>
                  {/* Factor details */}
                  {item.selected_factors?.length > 0 && (
                    <div className="px-3 pb-2 text-xs text-muted-foreground">
                      {item.selected_factors.map((sf, i) => (
                        <div key={i}>
                          • {getFactorName(sf.factor_id)}: {getFactorOptionLabel(sf.option_id)}
                        </div>
                      ))}
                    </div>
                  )}
                  {/* Addon details */}
                  {item.selected_addons?.length > 0 && (
                    <div className="px-3 pb-2 text-xs text-muted-foreground">
                      Add-ons: {item.selected_addons.map(id => getAddonName(id)).join(', ')}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="pt-4 border-t-2 border-[#030213]">
            <div className="flex justify-end">
              <div className="text-right">
                <span className="text-lg font-bold text-[#030213] mr-8">TOTAL:</span>
                <span className="text-2xl font-bold text-[#030213]">
                  ${quote?.total_price?.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Notes */}
          {quote?.notes && (
            <div>
              <h2 className="text-sm font-semibold text-[#030213] mb-3 pb-2 border-b">
                Notes
              </h2>
              <div className="bg-gray-50 p-3 rounded text-sm">
                {quote.notes}
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="pt-4 border-t text-center text-xs text-muted-foreground">
            <p>This quote is valid until {formatExpirationDate(quote?.expiration_date)}.</p>
            <p>Prices are estimates and may vary based on specific requirements.</p>
            <p className="mt-2">© {new Date().getFullYear()} RatePro - Professional Pricing Solutions</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default QuotePreview
