import { useState } from 'react';
import { useDatabase, PricingConfiguration } from '../hooks/useDatabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Switch } from './ui/switch';
import { Textarea } from './ui/textarea';
import { Pencil, Trash2, Plus } from 'lucide-react@0.487.0';
import { Badge } from './ui/badge';
import { toast } from 'sonner@2.0.3';

export const PricingConfigManager = () => {
  const { pricingConfigurations, rateCards, addPricingConfig, updatePricingConfig, deletePricingConfig } = useDatabase();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingConfig, setEditingConfig] = useState<PricingConfiguration | null>(null);
  const [formData, setFormData] = useState<Partial<PricingConfiguration>>({
    config_id: '',
    service_type: 'Year-End',
    factor_name: '',
    factor_options: [],
    base_rate_id: '',
    add_on_rate_ids: '',
    multiplier: 1.0,
    display_order: 1,
    active: true
  });
  const [optionsText, setOptionsText] = useState('');

  const serviceTypes = ['Year-End', 'Bookkeeping', 'Payroll', 'Tax'];

  const handleOpenDialog = (config?: PricingConfiguration) => {
    if (config) {
      setEditingConfig(config);
      setFormData(config);
      setOptionsText(config.factor_options.join('\n'));
    } else {
      setEditingConfig(null);
      const maxOrder = Math.max(...pricingConfigurations.map(c => c.display_order), 0);
      setFormData({
        config_id: `CF${String(pricingConfigurations.length + 1).padStart(3, '0')}`,
        service_type: 'Year-End',
        factor_name: '',
        factor_options: [],
        base_rate_id: '',
        add_on_rate_ids: '',
        multiplier: 1.0,
        display_order: maxOrder + 1,
        active: true
      });
      setOptionsText('');
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.config_id || !formData.factor_name) {
      toast.error('Please fill in all required fields');
      return;
    }

    const options = optionsText.split('\n').filter(opt => opt.trim() !== '');
    if (options.length === 0) {
      toast.error('Please add at least one factor option');
      return;
    }

    const configData = {
      ...formData,
      factor_options: options
    } as PricingConfiguration;

    if (editingConfig) {
      updatePricingConfig(editingConfig.config_id, configData);
      toast.success('Configuration updated successfully');
    } else {
      addPricingConfig(configData);
      toast.success('Configuration created successfully');
    }
    
    setIsDialogOpen(false);
    setEditingConfig(null);
  };

  const handleDelete = (configId: string) => {
    if (confirm('Are you sure you want to delete this configuration?')) {
      deletePricingConfig(configId);
      toast.success('Configuration deleted successfully');
    }
  };

  const handleToggleActive = (configId: string, currentActive: boolean) => {
    updatePricingConfig(configId, { active: !currentActive });
    toast.success(`Configuration ${!currentActive ? 'activated' : 'deactivated'}`);
  };

  const getRateName = (rateId: string) => {
    const rate = rateCards.find(r => r.rate_id === rateId);
    return rate ? rate.rate_name : rateId;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Pricing Configuration</CardTitle>
            <CardDescription>
              Define pricing rules and factors for each service
            </CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => handleOpenDialog()}>
                <Plus className="w-4 h-4 mr-2" />
                Add Configuration
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingConfig ? 'Edit Configuration' : 'Add New Configuration'}
                </DialogTitle>
                <DialogDescription>
                  Configure the pricing factors and rates
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Config ID</Label>
                    <Input
                      value={formData.config_id}
                      onChange={(e) => setFormData({ ...formData, config_id: e.target.value })}
                      placeholder="CF001"
                      disabled={!!editingConfig}
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
                </div>

                <div className="space-y-2">
                  <Label>Factor Name</Label>
                  <Input
                    value={formData.factor_name}
                    onChange={(e) => setFormData({ ...formData, factor_name: e.target.value })}
                    placeholder="e.g., Business Structure"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Factor Options (one per line)</Label>
                  <Textarea
                    value={optionsText}
                    onChange={(e) => setOptionsText(e.target.value)}
                    placeholder="Sole Trader&#10;Partnership&#10;Ltd Co (FRS 105)"
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Base Rate ID</Label>
                  <Select
                    value={formData.base_rate_id}
                    onValueChange={(value) => setFormData({ ...formData, base_rate_id: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select base rate (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">None</SelectItem>
                      {rateCards
                        .filter(r => r.active && r.service_type === formData.service_type)
                        .map(rate => (
                          <SelectItem key={rate.rate_id} value={rate.rate_id}>
                            {rate.rate_id} - {rate.rate_name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Add-on Rate IDs (comma separated)</Label>
                  <Input
                    value={formData.add_on_rate_ids}
                    onChange={(e) => setFormData({ ...formData, add_on_rate_ids: e.target.value })}
                    placeholder="RC002, RC005"
                  />
                  <p className="text-sm text-muted-foreground">
                    Available rates: {rateCards
                      .filter(r => r.active && r.service_type === formData.service_type)
                      .map(r => r.rate_id)
                      .join(', ')}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Multiplier</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={formData.multiplier}
                      onChange={(e) => setFormData({ ...formData, multiplier: parseFloat(e.target.value) })}
                      placeholder="1.0"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Display Order</Label>
                    <Input
                      type="number"
                      value={formData.display_order}
                      onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })}
                      placeholder="1"
                    />
                  </div>
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
                    {editingConfig ? 'Update' : 'Create'}
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
              <TableHead>Config ID</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Factor Name</TableHead>
              <TableHead>Base Rate</TableHead>
              <TableHead>Order</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pricingConfigurations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground">
                  No configurations found. Add your first configuration to get started.
                </TableCell>
              </TableRow>
            ) : (
              pricingConfigurations
                .sort((a, b) => a.service_type.localeCompare(b.service_type) || a.display_order - b.display_order)
                .map((config) => (
                  <TableRow key={config.config_id}>
                    <TableCell>{config.config_id}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{config.service_type}</Badge>
                    </TableCell>
                    <TableCell>{config.factor_name}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {config.base_rate_id ? getRateName(config.base_rate_id) : '-'}
                    </TableCell>
                    <TableCell>{config.display_order}</TableCell>
                    <TableCell>
                      <Switch
                        checked={config.active}
                        onCheckedChange={() => handleToggleActive(config.config_id, config.active)}
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenDialog(config)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(config.config_id)}
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
