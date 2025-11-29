import { useState } from 'react';
import { useDatabase, RateCard } from '../hooks/useDatabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Switch } from './ui/switch';
import { Pencil, Trash2, Plus } from 'lucide-react@0.487.0';
import { Badge } from './ui/badge';
import { toast } from 'sonner@2.0.3';

export const RateCardManager = () => {
  const { rateCards, addRateCard, updateRateCard, deleteRateCard } = useDatabase();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRate, setEditingRate] = useState<RateCard | null>(null);
  const [formData, setFormData] = useState<Partial<RateCard>>({
    rate_id: '',
    rate_name: '',
    unit_of_measurement: 'Per File',
    rate_per_unit: 0,
    service_type: 'Year-End',
    active: true
  });

  const serviceTypes = ['Year-End', 'Bookkeeping', 'Payroll', 'Tax'];
  const unitTypes = ['Per File', 'Per Transaction', 'Per Employee', 'Per Return', 'Per Month'];

  const handleOpenDialog = (rate?: RateCard) => {
    if (rate) {
      setEditingRate(rate);
      setFormData(rate);
    } else {
      setEditingRate(null);
      setFormData({
        rate_id: `RC${String(rateCards.length + 1).padStart(3, '0')}`,
        rate_name: '',
        unit_of_measurement: 'Per File',
        rate_per_unit: 0,
        service_type: 'Year-End',
        active: true
      });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.rate_name || !formData.rate_id) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (editingRate) {
      updateRateCard(editingRate.rate_id, formData);
      toast.success('Rate card updated successfully');
    } else {
      addRateCard(formData as RateCard);
      toast.success('Rate card created successfully');
    }
    
    setIsDialogOpen(false);
    setEditingRate(null);
  };

  const handleDelete = (rateId: string) => {
    if (confirm('Are you sure you want to delete this rate card?')) {
      deleteRateCard(rateId);
      toast.success('Rate card deleted successfully');
    }
  };

  const handleToggleActive = (rateId: string, currentActive: boolean) => {
    updateRateCard(rateId, { active: !currentActive });
    toast.success(`Rate card ${!currentActive ? 'activated' : 'deactivated'}`);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Rate Card Management</CardTitle>
            <CardDescription>
              Manage pricing rates for all services
            </CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => handleOpenDialog()}>
                <Plus className="w-4 h-4 mr-2" />
                Add Rate
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingRate ? 'Edit Rate Card' : 'Add New Rate Card'}</DialogTitle>
                <DialogDescription>
                  Configure the pricing rate details
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>Rate ID</Label>
                  <Input
                    value={formData.rate_id}
                    onChange={(e) => setFormData({ ...formData, rate_id: e.target.value })}
                    placeholder="RC001"
                    disabled={!!editingRate}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Rate Name</Label>
                  <Input
                    value={formData.rate_name}
                    onChange={(e) => setFormData({ ...formData, rate_name: e.target.value })}
                    placeholder="Enter rate name"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Service Type</Label>
                  <Select
                    value={formData.service_type}
                    onValueChange={(value) => setFormData({ ...formData, service_type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {serviceTypes.map(type => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Unit of Measurement</Label>
                  <Select
                    value={formData.unit_of_measurement}
                    onValueChange={(value) => setFormData({ ...formData, unit_of_measurement: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {unitTypes.map(unit => (
                        <SelectItem key={unit} value={unit}>
                          {unit}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Rate Per Unit (£)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.rate_per_unit}
                    onChange={(e) => setFormData({ ...formData, rate_per_unit: parseFloat(e.target.value) })}
                    placeholder="0.00"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    checked={formData.active}
                    onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
                  />
                  <Label>Active</Label>
                </div>

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingRate ? 'Update' : 'Create'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Rate ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Unit</TableHead>
              <TableHead className="text-right">Rate</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rateCards.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground">
                  No rate cards found. Add your first rate card to get started.
                </TableCell>
              </TableRow>
            ) : (
              rateCards.map((rate) => (
                <TableRow key={rate.rate_id}>
                  <TableCell>{rate.rate_id}</TableCell>
                  <TableCell>{rate.rate_name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{rate.service_type}</Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {rate.unit_of_measurement}
                  </TableCell>
                  <TableCell className="text-right">
                    £{rate.rate_per_unit.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={rate.active}
                      onCheckedChange={() => handleToggleActive(rate.rate_id, rate.active)}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenDialog(rate)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(rate.rate_id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
