import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { Label } from '@/components/ui/Label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select'

/**
 * ServiceSelector - Select a service to get pricing
 * @param {Object} props
 * @param {Array} props.services - Array of service objects
 * @param {number|null} props.selectedServiceId - Currently selected service ID
 * @param {Function} props.onServiceSelect - Callback when service is selected
 * @param {boolean} props.isLoading - Loading state
 */
export function ServiceSelector({ services = [], selectedServiceId, onServiceSelect, isLoading }) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="h-5 bg-gray-100 rounded w-1/3 animate-pulse"></div>
          <div className="h-4 bg-gray-100 rounded w-2/3 animate-pulse mt-2"></div>
        </CardHeader>
        <CardContent>
          <div className="h-9 bg-gray-100 rounded-md animate-pulse"></div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Select a Service</CardTitle>
        <CardDescription>Choose the service you need pricing for</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Label htmlFor="service-select">Service Type</Label>
          <Select
            value={selectedServiceId ? String(selectedServiceId) : ''}
            onValueChange={(value) => onServiceSelect(value ? Number(value) : null)}
          >
            <SelectTrigger id="service-select">
              <SelectValue placeholder="Choose a service..." />
            </SelectTrigger>
            <SelectContent>
              {services.map((service) => (
                <SelectItem key={service.id} value={String(service.id)}>
                  {service.name} - Starting at ${service.base_price.toLocaleString()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedServiceId && (
            <p className="text-sm text-muted-foreground pt-2">
              {services.find((s) => s.id === selectedServiceId)?.description}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default ServiceSelector
