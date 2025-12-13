import * as React from 'react'
import { Separator } from '@/components/ui/Separator'
import { Badge } from '@/components/ui/Badge'
import { cn } from '@/lib/utils'
import { formatCurrencyWhole } from '@/lib/currency'
import { Receipt, CheckCircle2, AlertCircle, ChevronDown, Sparkles, TrendingUp, Package } from 'lucide-react'

/**
 * PriceBreakdown - Displays itemized price breakdown
 * @param {Object} props
 * @param {Object} props.breakdown - Price breakdown from calculator
 * @param {number} props.totalPrice - Final calculated price
 * @param {boolean} props.isValid - Whether calculation is valid
 * @param {Array} props.errors - Validation errors
 */
export function PriceBreakdown({ breakdown, totalPrice, isValid, errors = [] }) {
  const [isDetailsOpen, setIsDetailsOpen] = React.useState(false)

  if (!breakdown) {
    return (
      <div className="card-elevated sticky top-4 overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
              <Receipt className="w-5 h-5 text-muted-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Price Summary</h3>
              <p className="text-xs text-muted-foreground">Your quote breakdown</p>
            </div>
          </div>
        </div>

        {/* Empty state */}
        <div className="p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-primary" />
          </div>
          <p className="text-muted-foreground text-sm">
            Select a service to see your personalized pricing
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="card-elevated sticky top-4 overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center">
              <Receipt className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Price Summary</h3>
              <p className="text-xs text-muted-foreground">Your quote breakdown</p>
            </div>
          </div>
          {isValid ? (
            <Badge className="badge-success border gap-1">
              <CheckCircle2 className="w-3 h-3" />
              Ready
            </Badge>
          ) : (
            <Badge variant="outline" className="badge-warning border gap-1">
              <AlertCircle className="w-3 h-3" />
              Incomplete
            </Badge>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 space-y-4">
        {/* Base Price */}
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Base Price</span>
          <span className="font-medium">{formatCurrencyWhole(breakdown.basePrice)}</span>
        </div>

        {/* Fixed Impacts */}
        {breakdown.fixedImpactsTotal !== 0 && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Fixed Adjustments</span>
            <span className={cn(
              'font-medium',
              breakdown.fixedImpactsTotal > 0 ? 'text-amber-600' : 'text-emerald-600'
            )}>
              {breakdown.fixedImpactsTotal > 0 ? '+' : ''}{formatCurrencyWhole(breakdown.fixedImpactsTotal)}
            </span>
          </div>
        )}

        {/* Percentage Impacts */}
        {breakdown.percentageImpactsTotal !== 0 && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Percentage Adjustments</span>
            <span className={cn(
              'font-medium',
              breakdown.percentageImpactsTotal > 0 ? 'text-amber-600' : 'text-emerald-600'
            )}>
              {breakdown.percentageImpactsTotal > 0 ? '+' : ''}{formatCurrencyWhole(breakdown.percentageImpactsTotal)}
            </span>
          </div>
        )}

        {/* Subtotal before multipliers */}
        {(breakdown.fixedImpactsTotal !== 0 || breakdown.percentageImpactsTotal !== 0) && (
          <>
            <Separator className="bg-gray-100" />
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Subtotal</span>
              <span className="font-medium">{formatCurrencyWhole(breakdown.subtotalBeforeMultipliers)}</span>
            </div>
          </>
        )}

        {/* Multipliers */}
        {(breakdown.multiplierEffect !== 1 || breakdown.entityTypeMultiplier !== 1) && (
          <div className="p-3 rounded-lg bg-blue-50/50 border border-blue-100 space-y-2">
            <div className="flex items-center gap-2 text-sm text-blue-700 font-medium">
              <TrendingUp className="w-4 h-4" />
              Multipliers Applied
            </div>
            {breakdown.multiplierEffect !== 1 && (
              <div className="flex justify-between items-center text-sm">
                <span className="text-blue-600/80">Complexity</span>
                <span className="font-medium text-blue-700">×{breakdown.multiplierEffect}</span>
              </div>
            )}
            {breakdown.entityTypeMultiplier !== 1 && (
              <div className="flex justify-between items-center text-sm">
                <span className="text-blue-600/80">Entity Type</span>
                <span className="font-medium text-blue-700">×{breakdown.entityTypeMultiplier}</span>
              </div>
            )}
          </div>
        )}

        {/* Add-ons */}
        {breakdown.addonsTotal > 0 && (
          <>
            <Separator className="bg-gray-100" />
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Package className="w-4 h-4 text-primary" />
                Add-ons
              </div>
              {breakdown.addonDetails?.map((addon, index) => (
                <div key={index} className="flex justify-between items-center text-sm pl-6">
                  <span className="text-muted-foreground">{addon.name}</span>
                  <span className="font-medium text-emerald-600">+{formatCurrencyWhole(addon.price)}</span>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Factor Details (collapsible) */}
        {breakdown.factorDetails?.length > 0 && (
          <button
            onClick={() => setIsDetailsOpen(!isDetailsOpen)}
            className="w-full flex items-center justify-between text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
          >
            <span>View breakdown details ({breakdown.factorDetails.length})</span>
            <ChevronDown className={cn(
              'w-4 h-4 transition-transform duration-200',
              isDetailsOpen && 'rotate-180'
            )} />
          </button>
        )}

        {isDetailsOpen && breakdown.factorDetails?.length > 0 && (
          <div className="p-3 rounded-lg bg-gray-50 space-y-2 text-sm">
            {breakdown.factorDetails.map((factor, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-muted-foreground truncate pr-4">{factor.name}</span>
                <span className="font-medium shrink-0">
                  {factor.type === 'fixed' && `+${formatCurrencyWhole(factor.impact)}`}
                  {factor.type === 'percentage' && `+${formatCurrencyWhole(factor.impact)}`}
                  {factor.type === 'multiplier' && `×${factor.impact}`}
                  {factor.type === 'entity_multiplier' && `×${factor.impact}`}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Errors */}
        {errors.length > 0 && (
          <div className="p-4 rounded-lg bg-red-50 border border-red-100">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-700">Complete required fields</p>
                <ul className="mt-1 text-sm text-red-600 list-disc list-inside">
                  {errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Total Footer */}
      <div className="p-5 bg-gradient-to-r from-gray-50 to-white border-t border-gray-100">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Total Price</p>
            <p className="text-sm text-muted-foreground">Monthly estimate</p>
          </div>
          <p className="price-tag text-3xl">{formatCurrencyWhole(totalPrice)}</p>
        </div>
      </div>
    </div>
  )
}

export default PriceBreakdown
