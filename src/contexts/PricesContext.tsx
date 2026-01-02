import React, { createContext, useContext, ReactNode } from 'react';
import { usePrices, PricesData, formatPricePersian, formatPriceNumber } from '@/hooks/usePrices';

interface PricesContextType {
  prices: PricesData;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  getPrice: (key: string) => number;
  getPriceName: (key: string) => string;
  formatPrice: (price: number) => string;
  formatPriceNumber: (price: number) => string;
}

const PricesContext = createContext<PricesContextType | undefined>(undefined);

export const PricesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const pricesData = usePrices();

  return (
    <PricesContext.Provider value={pricesData}>
      {children}
    </PricesContext.Provider>
  );
};

export const usePricesContext = (): PricesContextType => {
  const context = useContext(PricesContext);
  if (context === undefined) {
    throw new Error('usePricesContext must be used within a PricesProvider');
  }
  return context;
};

// Re-export utility functions for direct use
export { formatPricePersian, formatPriceNumber };
