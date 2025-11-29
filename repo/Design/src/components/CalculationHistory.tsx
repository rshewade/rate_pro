import { useState } from 'react';
import { useDatabase } from '../hooks/useDatabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Eye } from 'lucide-react@0.487.0';

export const CalculationHistory = () => {
  const { calculationHistory } = useDatabase();
  const [selectedCalculation, setSelectedCalculation] = useState<any>(null);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Calculation History</CardTitle>
          <CardDescription>
            Recent pricing calculations and quotes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date/Time</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Accountant</TableHead>
                  <TableHead>Client Ref</TableHead>
                  <TableHead className="text-right">Total Price</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {calculationHistory.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground">
                      No calculations yet. Use the calculator to generate quotes.
                    </TableCell>
                  </TableRow>
                ) : (
                  [...calculationHistory]
                    .reverse()
                    .map((calc) => (
                      <TableRow key={calc.id}>
                        <TableCell className="text-sm">
                          {new Date(calc.timestamp).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{calc.service_type}</Badge>
                        </TableCell>
                        <TableCell className="text-sm">
                          {calc.accountant_name || '-'}
                        </TableCell>
                        <TableCell className="text-sm">
                          {calc.client_reference || '-'}
                        </TableCell>
                        <TableCell className="text-right">
                          {calc.currency === 'GBP' ? '£' : '$'}{calc.total_price.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedCalculation(calc)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>

      <Dialog open={!!selectedCalculation} onOpenChange={() => setSelectedCalculation(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Calculation Details</DialogTitle>
            <DialogDescription>
              {selectedCalculation?.service_type} - {new Date(selectedCalculation?.timestamp || '').toLocaleString()}
            </DialogDescription>
          </DialogHeader>
          
          {selectedCalculation && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Accountant</p>
                  <p>{selectedCalculation.accountant_name || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Client Reference</p>
                  <p>{selectedCalculation.client_reference || '-'}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-2">Configuration</p>
                <div className="bg-muted/50 p-3 rounded-md space-y-1">
                  {Object.entries(selectedCalculation.inputs).map(([key, value]) => (
                    <div key={key} className="flex justify-between text-sm">
                      <span>{key}:</span>
                      <span>{value as string}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-2">Price Breakdown</p>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead className="text-right">Unit Price</TableHead>
                      <TableHead className="text-right">Quantity</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedCalculation.calculation_breakdown.map((item: any) => (
                      <TableRow key={item.rate_id}>
                        <TableCell>{item.rate_name}</TableCell>
                        <TableCell className="text-right">
                          {selectedCalculation.currency === 'GBP' ? '£' : '$'}{item.unit_price.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right">{item.quantity}</TableCell>
                        <TableCell className="text-right">
                          {selectedCalculation.currency === 'GBP' ? '£' : '$'}{item.total.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell colSpan={3} className="text-right">
                        <strong>Total:</strong>
                      </TableCell>
                      <TableCell className="text-right">
                        <strong>
                          {selectedCalculation.currency === 'GBP' ? '£' : '$'}{selectedCalculation.total_price.toFixed(2)}
                        </strong>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
