import { useState, useEffect } from 'react';
import { initialData } from '../data/initialData';

export interface RateCard {
  rate_id: string;
  rate_name: string;
  unit_of_measurement: string;
  rate_per_unit: number;
  service_type: string;
  active: boolean;
}

export interface PricingConfiguration {
  config_id: string;
  service_type: string;
  factor_name: string;
  factor_options: string[];
  base_rate_id: string;
  add_on_rate_ids: string;
  multiplier: number;
  display_order: number;
  active: boolean;
}

export interface CalculationBreakdown {
  rate_id: string;
  rate_name: string;
  unit_price: number;
  quantity: number;
  total: number;
}

export interface CalculationHistory {
  id: string;
  timestamp: string;
  service_type: string;
  inputs: Record<string, any>;
  calculation_breakdown: CalculationBreakdown[];
  total_price: number;
  currency: string;
  accountant_name?: string;
  client_reference?: string;
}

interface Database {
  rateCards: RateCard[];
  pricingConfigurations: PricingConfiguration[];
  calculationHistory: CalculationHistory[];
}

const DB_KEY = 'equallto_pricing_db';
const DB_VERSION_KEY = 'equallto_db_version';
const CURRENT_DB_VERSION = '2.0'; // Increment this to force reload from db.json

export const useDatabase = () => {
  const [database, setDatabase] = useState<Database>({
    rateCards: [],
    pricingConfigurations: [],
    calculationHistory: []
  });
  const [isLoading, setIsLoading] = useState(true);

  // Load initial data
  useEffect(() => {
    const loadDatabase = () => {
      try {
        setIsLoading(true);
        
        // Check version to determine if we need to reload from initial data
        const storedVersion = localStorage.getItem(DB_VERSION_KEY);
        const needsReload = storedVersion !== CURRENT_DB_VERSION;
        
        if (needsReload) {
          console.log('Database version mismatch or first load. Loading from initial data...');
          // Clear old localStorage data
          localStorage.removeItem(DB_KEY);
        }
        
        // Load from initial data
        const data = initialData;
        
        console.log('Loaded initial data:', {
          rateCards: data.rateCards?.length || 0,
          pricingConfigurations: data.pricingConfigurations?.length || 0,
          calculationHistory: data.calculationHistory?.length || 0
        });
        
        setDatabase(data);
        localStorage.setItem(DB_KEY, JSON.stringify(data));
        localStorage.setItem(DB_VERSION_KEY, CURRENT_DB_VERSION);
        
      } catch (error) {
        console.error('Error loading database:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadDatabase();
  }, []);

  // Save to localStorage whenever database changes
  const saveDatabase = (newData: Database) => {
    setDatabase(newData);
    localStorage.setItem(DB_KEY, JSON.stringify(newData));
  };

  // Rate Card CRUD
  const addRateCard = (rateCard: RateCard) => {
    const newData = {
      ...database,
      rateCards: [...database.rateCards, rateCard]
    };
    saveDatabase(newData);
  };

  const updateRateCard = (rateId: string, updates: Partial<RateCard>) => {
    const newData = {
      ...database,
      rateCards: database.rateCards.map(rc =>
        rc.rate_id === rateId ? { ...rc, ...updates } : rc
      )
    };
    saveDatabase(newData);
  };

  const deleteRateCard = (rateId: string) => {
    const newData = {
      ...database,
      rateCards: database.rateCards.filter(rc => rc.rate_id !== rateId)
    };
    saveDatabase(newData);
  };

  // Pricing Configuration CRUD
  const addPricingConfig = (config: PricingConfiguration) => {
    const newData = {
      ...database,
      pricingConfigurations: [...database.pricingConfigurations, config]
    };
    saveDatabase(newData);
  };

  const updatePricingConfig = (configId: string, updates: Partial<PricingConfiguration>) => {
    const newData = {
      ...database,
      pricingConfigurations: database.pricingConfigurations.map(pc =>
        pc.config_id === configId ? { ...pc, ...updates } : pc
      )
    };
    saveDatabase(newData);
  };

  const deletePricingConfig = (configId: string) => {
    const newData = {
      ...database,
      pricingConfigurations: database.pricingConfigurations.filter(pc => pc.config_id !== configId)
    };
    saveDatabase(newData);
  };

  // Calculation History
  const addCalculation = (calculation: CalculationHistory) => {
    const newData = {
      ...database,
      calculationHistory: [...database.calculationHistory, calculation]
    };
    saveDatabase(newData);
  };

  // Reset database to initial state
  const resetDatabase = () => {
    try {
      const data = initialData;
      saveDatabase(data);
      console.log('Database reset to initial data');
    } catch (error) {
      console.error('Error resetting database:', error);
    }
  };

  return {
    database,
    rateCards: database.rateCards,
    pricingConfigurations: database.pricingConfigurations,
    calculationHistory: database.calculationHistory,
    isLoading,
    addRateCard,
    updateRateCard,
    deleteRateCard,
    addPricingConfig,
    updatePricingConfig,
    deletePricingConfig,
    addCalculation,
    resetDatabase
  };
};
