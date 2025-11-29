import * as React from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/Dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select'
import { Pencil, Trash2, Plus } from 'lucide-react'
import api from '@/services/api'

export function EntityTypesTable({ entityTypes, onRefresh }) {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [editingEntity, setEditingEntity] = React.useState(null)
  const [formData, setFormData] = React.useState({
    name: '',
    price_modifier: '1.0',
    modifier_type: 'multiplier',
  })
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const handleAdd = () => {
    setEditingEntity(null)
    setFormData({ name: '', price_modifier: '1.0', modifier_type: 'multiplier' })
    setIsDialogOpen(true)
  }

  const handleEdit = (entity) => {
    setEditingEntity(entity)
    setFormData({
      name: entity.name,
      price_modifier: String(entity.price_modifier),
      modifier_type: entity.modifier_type || 'multiplier',
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (entity) => {
    if (!confirm(`Are you sure you want to delete "${entity.name}"?`)) return
    try {
      await api.entityTypes.delete(entity.id)
      onRefresh()
    } catch (err) {
      alert('Failed to delete entity type: ' + err.message)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const data = {
        ...formData,
        price_modifier: Number(formData.price_modifier),
      }
      if (editingEntity) {
        await api.entityTypes.update(editingEntity.id, data)
      } else {
        await api.entityTypes.create(data)
      }
      setIsDialogOpen(false)
      onRefresh()
    } catch (err) {
      alert('Failed to save entity type: ' + err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatModifier = (entity) => {
    if (entity.modifier_type === 'multiplier') {
      return `×${entity.price_modifier}`
    }
    return `+$${entity.price_modifier}`
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Entity Types ({entityTypes.length})</h3>
        <Button onClick={handleAdd} size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          Add Entity Type
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Modifier Type</TableHead>
            <TableHead className="text-right">Price Modifier</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entityTypes.map((entity) => (
            <TableRow key={entity.id}>
              <TableCell className="font-medium">{entity.name}</TableCell>
              <TableCell className="capitalize">{entity.modifier_type || 'multiplier'}</TableCell>
              <TableCell className="text-right">{formatModifier(entity)}</TableCell>
              <TableCell>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(entity)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(entity)}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {entityTypes.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                No entity types found. Add your first entity type.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingEntity ? 'Edit Entity Type' : 'Add Entity Type'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., LLC, S-Corporation"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="modifier_type">Modifier Type</Label>
              <Select
                value={formData.modifier_type}
                onValueChange={(value) => setFormData({ ...formData, modifier_type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="multiplier">Multiplier (×)</SelectItem>
                  <SelectItem value="fixed">Fixed Amount (+$)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="price_modifier">
                {formData.modifier_type === 'multiplier' ? 'Multiplier Value' : 'Fixed Amount ($)'}
              </Label>
              <Input
                id="price_modifier"
                type="number"
                min="0"
                step="0.01"
                value={formData.price_modifier}
                onChange={(e) => setFormData({ ...formData, price_modifier: e.target.value })}
                required
              />
              {formData.modifier_type === 'multiplier' && (
                <p className="text-sm text-muted-foreground">
                  1.0 = no change, 1.1 = 10% increase, 1.2 = 20% increase
                </p>
              )}
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

export default EntityTypesTable
