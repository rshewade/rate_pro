import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Checkbox } from '@/components/ui/Checkbox'
import { Label } from '@/components/ui/Label'
import { Badge } from '@/components/ui/Badge'
import { CURRENCY_SYMBOL } from '@/lib/currency'

/**
 * AddonSelector - Select optional add-on services
 * @param {Object} props
 * @param {Array} props.addons - Available add-ons
 * @param {Array} props.selectedAddonIds - Currently selected addon IDs
 * @param {Function} props.onAddonToggle - Callback when addon is toggled
 * @param {number|null} props.serviceId - Current service ID for filtering
 */
export function AddonSelector({ addons = [], selectedAddonIds = [], onAddonToggle, serviceId }) {
  // Filter addons: show global addons and service-specific addons
  const availableAddons = addons.filter((addon) => {
    if (addon.is_global) return true
    if (!serviceId) return false
    return addon.service_ids?.includes(serviceId)
  })

  if (!availableAddons.length) {
    return null
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Optional Add-ons</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {availableAddons.map((addon) => {
            const isSelected = selectedAddonIds.includes(addon.id)
            return (
              <div
                key={addon.id}
                className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors"
                onClick={() => onAddonToggle(addon.id)}
              >
                <Checkbox checked={isSelected} onCheckedChange={() => onAddonToggle(addon.id)} />
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <Label className="font-medium cursor-pointer">{addon.name}</Label>
                    <Badge variant="outline">+{CURRENCY_SYMBOL}{addon.price}</Badge>
                  </div>
                  {addon.description && (
                    <p className="text-sm text-muted-foreground">{addon.description}</p>
                  )}
                  {addon.is_global && (
                    <Badge variant="secondary" className="text-xs">
                      Available for all services
                    </Badge>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

export default AddonSelector
