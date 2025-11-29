import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { RateCardManager } from './RateCardManager';
import { PricingConfigManager } from './PricingConfigManager';
import { CalculationHistory } from './CalculationHistory';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { useDatabase } from '../hooks/useDatabase';
import { Settings, CreditCard, Sliders, History, BarChart3, RefreshCw } from 'lucide-react@0.487.0';
import { Button } from './ui/button';
import { toast } from 'sonner@2.0.3';

export const AdminDashboard = () => {
  const { rateCards, pricingConfigurations, calculationHistory, resetDatabase, isLoading } = useDatabase();

  const handleReset = async () => {
    if (confirm('Are you sure you want to reset the database? This will restore all data to the initial state from db.json and cannot be undone.')) {
      await resetDatabase();
      toast.success('Database reset successfully! The page will reload.');
      setTimeout(() => window.location.reload(), 1000);
    }
  };

  const stats = {
    totalRates: rateCards.length,
    activeRates: rateCards.filter(r => r.active).length,
    totalConfigs: pricingConfigurations.length,
    activeConfigs: pricingConfigurations.filter(c => c.active).length,
    totalCalculations: calculationHistory.length,
    serviceTypes: [...new Set(pricingConfigurations.map(c => c.service_type))].length
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading database...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-2">
            <Settings className="w-8 h-8" />
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground">
            Manage pricing rates, configurations, and view analytics
          </p>
        </div>
        <Button variant="outline" onClick={handleReset}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Reset Database
        </Button>
      </div>

      {/* Debug Info */}
      {(stats.totalRates === 0 || stats.totalConfigs === 0) && (
        <Card className="border-yellow-500 bg-yellow-50 dark:bg-yellow-950">
          <CardContent className="pt-6">
            <p className="text-sm">
              ⚠️ No data loaded. Please check browser console for errors or click "Reset Database" button above.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              Rate Cards
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div>
                <span className="text-2xl">{stats.activeRates}</span>
                <span className="text-muted-foreground"> / {stats.totalRates}</span>
              </div>
              <p className="text-sm text-muted-foreground">Active rate cards</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Sliders className="w-4 h-4" />
              Configurations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div>
                <span className="text-2xl">{stats.activeConfigs}</span>
                <span className="text-muted-foreground"> / {stats.totalConfigs}</span>
              </div>
              <p className="text-sm text-muted-foreground">Active configurations</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div>
                <span className="text-2xl">{stats.totalCalculations}</span>
              </div>
              <p className="text-sm text-muted-foreground">Total calculations</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="rates" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="rates" className="flex items-center gap-2">
            <CreditCard className="w-4 h-4" />
            Rate Cards
          </TabsTrigger>
          <TabsTrigger value="configs" className="flex items-center gap-2">
            <Sliders className="w-4 h-4" />
            Configurations
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <History className="w-4 h-4" />
            History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="rates">
          <RateCardManager />
        </TabsContent>

        <TabsContent value="configs">
          <PricingConfigManager />
        </TabsContent>

        <TabsContent value="history">
          <CalculationHistory />
        </TabsContent>
      </Tabs>
    </div>
  );
};
