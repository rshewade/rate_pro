import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Label } from '@/components/ui/Label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select'

/**
 * EntityTypeSelector - Select business entity type
 * @param {Object} props
 * @param {Array} props.entityTypes - Available entity types
 * @param {number|null} props.selectedEntityTypeId - Currently selected entity type ID
 * @param {Function} props.onEntityTypeChange - Callback when selection changes
 */
export function EntityTypeSelector({ entityTypes = [], selectedEntityTypeId, onEntityTypeChange }) {
  // Format price modifier display
  const formatPriceModifier = (entity) => {
    if (entity.price_modifier !== 1) {
      return ` (×${entity.price_modifier})`
    }
    return ''
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Business Entity Type</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Label htmlFor="entity-type" className="text-sm text-muted-foreground">
            Select your business structure to apply appropriate pricing
          </Label>
          <Select
            value={selectedEntityTypeId ? String(selectedEntityTypeId) : ''}
            onValueChange={(value) => onEntityTypeChange(value ? Number(value) : null)}
          >
            <SelectTrigger id="entity-type">
              <SelectValue placeholder="Select entity type..." />
            </SelectTrigger>
            <SelectContent>
              {entityTypes.map((entity) => (
                <SelectItem key={entity.id} value={String(entity.id)}>
                  {entity.name}
                  {formatPriceModifier(entity)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  )
}

export default EntityTypeSelector
