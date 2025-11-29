import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useDatabase, RateCard, PricingConfiguration } from '../hooks/useDatabase';
import { Calculator as CalculatorIcon, Download } from 'lucide-react@0.487.0';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';

export const Calculator = () => {
  const { rateCards, pricingConfigurations, addCalculation, isLoading } = useDatabase();
  const [selectedService, setSelectedService] = useState<string>('');
  const [userInputs, setUserInputs] = useState<Record<string, string>>({});
  const [calculationResult, setCalculationResult] = useState<any>(null);

  const serviceTypes = useMemo(() => {
    return [...new Set(pricingConfigurations.filter(pc => pc.active).map(pc => pc.service_type))];
  }, [pricingConfigurations]);

  const activeConfigs = useMemo(() => {
    return pricingConfigurations
      .filter(pc => pc.service_type === selectedService && pc.active)
      .sort((a, b) => a.display_order - b.display_order);
  }, [selectedService, pricingConfigurations]);

  const calculatePrice = () => {
    let basePrice = 0;
    let adjustments: string[] = [];
    const breakdown: any[] = [];

    activeConfigs.forEach(config => {
      const selectedOption = userInputs[config.factor_name];
      if (!selectedOption) return;

      // Handle base rate
      if (config.base_rate_id) {
        const baseRate = rateCards.find(rc => rc.rate_id === config.base_rate_id);
        if (baseRate) {
          // Special handling for transaction-based pricing
          if (config.factor_name === "Monthly Transactions" && baseRate.unit_of_measurement === "Per Transaction") {
            const transactionRange = selectedOption;
            let transactionCount = 0;
            
            if (transactionRange === "0-100") transactionCount = 50;
            else if (transactionRange === "101-200") transactionCount = 150;
            else if (transactionRange === "201-500") transactionCount = 350;
            else if (transactionRange === "500+") transactionCount = 600;

            const amount = transactionCount * baseRate.rate_per_unit * config.multiplier;
            basePrice += amount;
            breakdown.push({
              description: `${baseRate.rate_name} (${transactionCount} transactions × £${baseRate.rate_per_unit})`,
              amount: amount
            });
          } 
          // Handle employee-based pricing
          else if (config.factor_name === "Number of Employees" && baseRate.unit_of_measurement === "Per Month") {
            const amount = baseRate.rate_per_unit * config.multiplier;
            basePrice += amount;
            breakdown.push({
              description: baseRate.rate_name,
              amount: amount
            });
          }
          // Handle business structure mapping
          else if (config.factor_name === "Business Structure") {
            let mappedRate = baseRate;
            if (selectedOption === "Sole Trader") {
              mappedRate = rateCards.find(rc => rc.rate_id === "RC002") || baseRate;
            } else if (selectedOption === "Partnership") {
              mappedRate = rateCards.find(rc => rc.rate_id === "RC003") || baseRate;
            } else if (selectedOption.includes("FRS 105")) {
              mappedRate = rateCards.find(rc => rc.rate_id === "RC001") || baseRate;
            } else if (selectedOption.includes("FRS 102")) {
              mappedRate = rateCards.find(rc => rc.rate_id === "RC001") || baseRate;
            }
            
            const amount = mappedRate.rate_per_unit * config.multiplier;
            basePrice += amount;
            breakdown.push({
              description: `${mappedRate.rate_name} (${selectedOption})`,
              amount: amount
            });
          }
          // Handle tax return type
          else if (config.factor_name === "Return Type") {
            let mappedRate = baseRate;
            if (selectedOption.includes("Complex")) {
              mappedRate = rateCards.find(rc => rc.rate_id === "RC012") || baseRate;
            } else if (selectedOption === "Personal") {
              mappedRate = rateCards.find(rc => rc.rate_id === "RC011") || baseRate;
            }
            
            const amount = mappedRate.rate_per_unit * config.multiplier;
            basePrice += amount;
            breakdown.push({
              description: `${mappedRate.rate_name} (${selectedOption})`,
              amount: amount
            });
          }
          else {
            const amount = baseRate.rate_per_unit * config.multiplier;
            basePrice += amount;
            breakdown.push({
              description: baseRate.rate_name,
              amount: amount
            });
          }
        }
      }

      // Handle add-on rates
      if (config.add_on_rate_ids) {
        const addOnIds = config.add_on_rate_ids.split(',').map(id => id.trim());
        
        addOnIds.forEach(addOnId => {
          const addOnRate = rateCards.find(rc => rc.rate_id === addOnId);
          if (!addOnRate) return;

          // VAT Add-on
          if (config.factor_name === "VAT Registered" && selectedOption === "Yes" && addOnRate.rate_id === "RC004") {
            const amount = addOnRate.rate_per_unit * config.multiplier;
            basePrice += amount;
            adjustments.push(`${addOnRate.rate_name}: +£${amount.toFixed(2)}`);
            breakdown.push({
              description: addOnRate.rate_name,
              amount: amount
            });
          }
          
          // Record Type handling
          if (config.factor_name === "Record Type") {
            if (selectedOption === "Spreadsheet" && addOnRate.rate_id === "RC005") {
              const amount = addOnRate.rate_per_unit * config.multiplier;
              basePrice += amount;
              adjustments.push(`${addOnRate.rate_name}: +£${amount.toFixed(2)}`);
              breakdown.push({
                description: addOnRate.rate_name,
                amount: amount
              });
            } else if (selectedOption.includes("Cloud Accounting") && addOnRate.rate_id === "RC006") {
              const amount = addOnRate.rate_per_unit * config.multiplier;
              basePrice += amount;
              adjustments.push(`${addOnRate.rate_name}: £${amount.toFixed(2)}`);
              breakdown.push({
                description: addOnRate.rate_name,
                amount: amount
              });
            }
          }

          // High volume bookkeeping
          if (config.factor_name === "High Volume" && selectedOption === "Yes" && addOnRate.rate_id === "RC013") {
            const amount = addOnRate.rate_per_unit * config.multiplier;
            basePrice += amount;
            adjustments.push(`${addOnRate.rate_name}: +£${amount.toFixed(2)}`);
            breakdown.push({
              description: addOnRate.rate_name,
              amount: amount
            });
          }

          // Bookkeeping minimum
          if (config.factor_name === "Monthly Transactions" && addOnRate.rate_id === "RC008") {
            const currentBase = breakdown.reduce((sum, item) => sum + item.amount, 0);
            if (currentBase < addOnRate.rate_per_unit) {
              const difference = addOnRate.rate_per_unit - currentBase;
              basePrice += difference;
              adjustments.push(`Minimum monthly fee applied: +£${difference.toFixed(2)}`);
              breakdown.push({
                description: "Monthly Minimum Adjustment",
                amount: difference
              });
            }
          }

          // Payroll per employee
          if (config.factor_name === "Number of Employees" && addOnRate.rate_id === "RC009") {
            const employeeRange = selectedOption;
            let employeeCount = 0;
            
            if (employeeRange === "1-5") employeeCount = 3;
            else if (employeeRange === "6-10") employeeCount = 8;
            else if (employeeRange === "11-20") employeeCount = 15;
            else if (employeeRange === "20+") employeeCount = 25;

            const amount = employeeCount * addOnRate.rate_per_unit * config.multiplier;
            basePrice += amount;
            adjustments.push(`${addOnRate.rate_name} (${employeeCount} employees × £${addOnRate.rate_per_unit}): +£${amount.toFixed(2)}`);
            breakdown.push({
              description: `${addOnRate.rate_name} (${employeeCount} employees)`,
              amount: amount
            });
          }
        });
      }
    });

    const result = {
      service_type: selectedService,
      inputs: userInputs,
      base_price: basePrice,
      adjustments,
      final_price: basePrice,
      breakdown,
      timestamp: new Date().toISOString()
    };

    setCalculationResult(result);

    // Save to history
    addCalculation({
      id: `CALC_${Date.now()}`,
      ...result
    });
  };

  const handleServiceChange = (value: string) => {
    setSelectedService(value);
    setUserInputs({});
    setCalculationResult(null);
  };

  const handleInputChange = (factorName: string, value: string) => {
    setUserInputs(prev => ({
      ...prev,
      [factorName]: value
    }));
  };

  const exportQuote = () => {
    if (!calculationResult) return;

    const content = `
EQUALLTO PRICING QUOTE
======================

Service: ${calculationResult.service_type}
Date: ${new Date(calculationResult.timestamp).toLocaleDateString()}

Configuration:
${Object.entries(calculationResult.inputs).map(([key, value]) => `  ${key}: ${value}`).join('\n')}

Price Breakdown:
${calculationResult.breakdown.map((item: any) => `  ${item.description}: £${item.amount.toFixed(2)}`).join('\n')}

TOTAL PRICE: £${calculationResult.final_price.toFixed(2)}

---
This is an estimate only. Final pricing may vary based on specific requirements.
    `.trim();

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `equallto-quote-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="flex items-center justify-center gap-2">
            <CalculatorIcon className="w-8 h-8" />
            Equallto Pricing Calculator
          </h1>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="flex items-center justify-center gap-2">
          <CalculatorIcon className="w-8 h-8" />
          Equallto Pricing Calculator
        </h1>
        <p className="text-muted-foreground">
          Get instant, transparent pricing for accounting services
        </p>
      </div>

      {serviceTypes.length === 0 && (
        <Card className="border-yellow-500 bg-yellow-50 dark:bg-yellow-950">
          <CardContent className="pt-6">
            <p className="text-sm text-center">
              ⚠️ No services configured. Please go to Admin Dashboard to set up pricing configurations.
            </p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Calculate Your Price</CardTitle>
          <CardDescription>
            Select a service and configure your requirements to get an instant quote
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Select Service Type</Label>
            <Select value={selectedService} onValueChange={handleServiceChange}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a service..." />
              </SelectTrigger>
              <SelectContent>
                {serviceTypes.map(service => (
                  <SelectItem key={service} value={service}>
                    {service}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedService && activeConfigs.length > 0 && (
            <>
              <Separator />
              <div className="space-y-4">
                <h3>Service Configuration</h3>
                {activeConfigs.map(config => (
                  <div key={config.config_id} className="space-y-2">
                    <Label>{config.factor_name}</Label>
                    <Select
                      value={userInputs[config.factor_name] || ''}
                      onValueChange={(value) => handleInputChange(config.factor_name, value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={`Select ${config.factor_name.toLowerCase()}...`} />
                      </SelectTrigger>
                      <SelectContent>
                        {config.factor_options.map(option => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>

              <Button 
                onClick={calculatePrice} 
                className="w-full"
                disabled={activeConfigs.some(config => !userInputs[config.factor_name])}
              >
                Calculate Price
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      {calculationResult && (
        <Card className="border-primary">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Your Quote</span>
              <Button variant="outline" size="sm" onClick={exportQuote}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </CardTitle>
            <CardDescription>
              {new Date(calculationResult.timestamp).toLocaleString()}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Service</Label>
              <p>{calculationResult.service_type}</p>
            </div>

            <Separator />

            <div>
              <Label>Configuration</Label>
              <div className="mt-2 space-y-1">
                {Object.entries(calculationResult.inputs).map(([key, value]) => (
                  <div key={key} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{key}:</span>
                    <span>{value as string}</span>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            <div>
              <Label>Price Breakdown</Label>
              <div className="mt-2 space-y-2">
                {calculationResult.breakdown.map((item: any, index: number) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span>{item.description}</span>
                    <span className={item.amount < 0 ? 'text-green-600' : ''}>
                      £{item.amount.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            <div className="flex items-center justify-between pt-2">
              <span className="text-lg">Total Price</span>
              <Badge className="text-lg px-4 py-2">
                £{calculationResult.final_price.toFixed(2)}
              </Badge>
            </div>

            <div className="text-sm text-muted-foreground text-center pt-2">
              This is an estimate only. Final pricing may vary based on specific requirements.
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
