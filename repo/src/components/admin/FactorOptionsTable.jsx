import * as React from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/Dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select'
import { Pencil, Trash2, Plus, ArrowLeft } from 'lucide-react'
import api from '@/services'

export function FactorOptionsTable({ factor, options, onRefresh, onBack }) {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [editingOption, setEditingOption] = React.useState(null)
  const [formData, setFormData] = React.useState({
    label: '',
    price_impact: '0',
    price_impact_type: 'fixed',
    display_order: '1',
  })
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const handleAdd = () => {
    setEditingOption(null)
    const maxOrder = options.reduce((max, o) => Math.max(max, o.display_order || 0), 0)
    setFormData({
      label: '',
      price_impact: '0',
      price_impact_type: 'fixed',
      display_order: String(maxOrder + 1),
    })
    setIsDialogOpen(true)
  }

  const handleEdit = (option) => {
    setEditingOption(option)
    setFormData({
      label: option.label,
      price_impact: String(option.price_impact),
      price_impact_type: option.price_impact_type || 'fixed',
      display_order: String(option.display_order || 1),
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (option) => {
    if (!confirm(`Are you sure you want to delete "${option.label}"?`)) return
    try {
      await api.factorOptions.delete(option.id)
      onRefresh()
    } catch (err) {
      alert('Failed to delete option: ' + err.message)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const data = {
        factor_id: factor.id,
        label: formData.label,
        price_impact: Number(formData.price_impact),
        price_impact_type: formData.price_impact_type,
        display_order: Number(formData.display_order),
      }
      if (editingOption) {
        await api.factorOptions.update(editingOption.id, data)
      } else {
        await api.factorOptions.create(data)
      }
      setIsDialogOpen(false)
      onRefresh()
    } catch (err) {
      alert('Failed to save option: ' + err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatPriceImpact = (option) => {
    if (option.price_impact_type === 'multiplier') {
      return `×${option.price_impact}`
    }
    if (option.price_impact_type === 'percentage') {
      return `${option.price_impact * 100}%`
    }
    return option.price_impact >= 0 ? `+$${option.price_impact}` : `-$${Math.abs(option.price_impact)}`
  }

  const sortedOptions = [...options].sort((a, b) => (a.display_order || 0) - (b.display_order || 0))

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onBack} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <div>
          <h3 className="text-lg font-medium">Options for: {factor.name}</h3>
          <p className="text-sm text-muted-foreground">{factor.description}</p>
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleAdd} size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          Add Option
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order</TableHead>
            <TableHead>Label</TableHead>
            <TableHead>Impact Type</TableHead>
            <TableHead className="text-right">Price Impact</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedOptions.map((option) => (
            <TableRow key={option.id}>
              <TableCell>{option.display_order}</TableCell>
              <TableCell className="font-medium">{option.label}</TableCell>
              <TableCell className="capitalize">{option.price_impact_type}</TableCell>
              <TableCell className="text-right">{formatPriceImpact(option)}</TableCell>
              <TableCell>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(option)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(option)}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {options.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                No options found. Add your first option.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingOption ? 'Edit Option' : 'Add Option'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="label">Label</Label>
              <Input
                id="label"
                value={formData.label}
                onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                placeholder="e.g., 0-50 transactions, Standard"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price_impact_type">Price Impact Type</Label>
              <Select
                value={formData.price_impact_type}
                onValueChange={(value) => setFormData({ ...formData, price_impact_type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fixed">Fixed Amount (+$)</SelectItem>
                  <SelectItem value="multiplier">Multiplier (×)</SelectItem>
                  <SelectItem value="percentage">Percentage (%)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="price_impact">
                {formData.price_impact_type === 'fixed' && 'Price Impact ($)'}
                {formData.price_impact_type === 'multiplier' && 'Multiplier Value'}
                {formData.price_impact_type === 'percentage' && 'Percentage (as decimal, e.g., 0.1 = 10%)'}
              </Label>
              <Input
                id="price_impact"
                type="number"
                step="0.01"
                value={formData.price_impact}
                onChange={(e) => setFormData({ ...formData, price_impact: e.target.value })}
                required
              />
              {formData.price_impact_type === 'multiplier' && (
                <p className="text-sm text-muted-foreground">
                  1.0 = no change, 1.2 = 20% increase, 0.9 = 10% discount
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="display_order">Display Order</Label>
              <Input
                id="display_order"
                type="number"
                min="1"
                value={formData.display_order}
                onChange={(e) => setFormData({ ...formData, display_order: e.target.value })}
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default FactorOptionsTable
