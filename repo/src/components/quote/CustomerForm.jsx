import * as React from 'react'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select'

/**
 * CustomerForm - Capture customer information for a quote
 * @param {Object} props
 * @param {Object} props.customer - Customer data object
 * @param {Function} props.onChange - Callback when customer data changes
 * @param {Array} props.entityTypes - Available business entity types
 * @param {Object} props.errors - Validation errors by field name
 */
export function CustomerForm({ customer, onChange, entityTypes = [], errors = {} }) {
  const handleChange = (field, value) => {
    onChange({ ...customer, [field]: value })
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Company Name */}
        <div className="space-y-2">
          <Label htmlFor="company_name">
            Company Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="company_name"
            value={customer.company_name || ''}
            onChange={(e) => handleChange('company_name', e.target.value)}
            placeholder="Enter company name"
            className={errors.company_name ? 'border-red-500' : ''}
          />
          {errors.company_name && (
            <p className="text-sm text-red-500">{errors.company_name}</p>
          )}
        </div>

        {/* Contact Name */}
        <div className="space-y-2">
          <Label htmlFor="contact_name">
            Contact Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="contact_name"
            value={customer.contact_name || ''}
            onChange={(e) => handleChange('contact_name', e.target.value)}
            placeholder="Enter contact name"
            className={errors.contact_name ? 'border-red-500' : ''}
          />
          {errors.contact_name && (
            <p className="text-sm text-red-500">{errors.contact_name}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">
            Email <span className="text-red-500">*</span>
          </Label>
          <Input
            id="email"
            type="email"
            value={customer.email || ''}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="email@example.com"
            className={errors.email ? 'border-red-500' : ''}
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email}</p>
          )}
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            type="tel"
            value={customer.phone || ''}
            onChange={(e) => handleChange('phone', e.target.value)}
            placeholder="(555) 123-4567"
          />
        </div>
      </div>

      {/* Entity Type */}
      {entityTypes.length > 0 && (
        <div className="space-y-2">
          <Label htmlFor="entity_type">Business Entity Type</Label>
          <Select
            value={customer.entity_type_id ? String(customer.entity_type_id) : ''}
            onValueChange={(value) => handleChange('entity_type_id', value ? Number(value) : null)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select entity type (optional)" />
            </SelectTrigger>
            <SelectContent>
              {entityTypes.map((entity) => (
                <SelectItem key={entity.id} value={String(entity.id)}>
                  {entity.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Notes */}
      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <textarea
          id="notes"
          value={customer.notes || ''}
          onChange={(e) => handleChange('notes', e.target.value)}
          placeholder="Additional notes or requirements..."
          className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>
    </div>
  )
}

export default CustomerForm
