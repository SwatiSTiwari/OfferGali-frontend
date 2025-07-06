import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface SavedDeal {
  id: string;
  title: string;
  description: string;
  category: string;
  expiration_date: string;
  redemption_instructions?: string;
  retailer_id: string;
  price?: string;
  original_price?: string;
  image?: string;
  savedAt: string; // When the deal was saved
}

interface SavedDealsContextType {
  savedDeals: SavedDeal[];
  saveDeals: (deal: SavedDeal) => Promise<void>;
  removeDeal: (dealId: string) => Promise<void>;
  clearAllDeals: () => Promise<void>;
  isDealSaved: (dealId: string) => boolean;
  loading: boolean;
}

const SavedDealsContext = createContext<SavedDealsContextType | undefined>(undefined);

export const SavedDealsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [savedDeals, setSavedDeals] = useState<SavedDeal[]>([]);
  const [loading, setLoading] = useState(true);

  const STORAGE_KEY = '@saved_deals';

  // Load saved deals from storage
  useEffect(() => {
    loadSavedDeals();
  }, []);

  const loadSavedDeals = async () => {
    try {
      setLoading(true);
      const savedDealsJson = await AsyncStorage.getItem(STORAGE_KEY);
      if (savedDealsJson) {
        const deals = JSON.parse(savedDealsJson);
        setSavedDeals(deals);
      }
    } catch (error) {
      console.error('Error loading saved deals:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveDeals = async (deal: SavedDeal) => {
    try {
      const newDeal = {
        ...deal,
        savedAt: new Date().toISOString(),
      };

      // Check if deal is already saved
      const existingIndex = savedDeals.findIndex(d => d.id === deal.id);
      let updatedDeals;

      if (existingIndex !== -1) {
        // Update existing deal
        updatedDeals = [...savedDeals];
        updatedDeals[existingIndex] = newDeal;
      } else {
        // Add new deal
        updatedDeals = [newDeal, ...savedDeals];
      }

      setSavedDeals(updatedDeals);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedDeals));
      console.log('Deal saved successfully:', deal.title);
    } catch (error) {
      console.error('Error saving deal:', error);
    }
  };

  const removeDeal = async (dealId: string) => {
    try {
      const updatedDeals = savedDeals.filter(deal => deal.id !== dealId);
      setSavedDeals(updatedDeals);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedDeals));
      console.log('Deal removed successfully:', dealId);
    } catch (error) {
      console.error('Error removing deal:', error);
    }
  };

  const clearAllDeals = async () => {
    try {
      setSavedDeals([]);
      await AsyncStorage.removeItem(STORAGE_KEY);
      console.log('All deals cleared');
    } catch (error) {
      console.error('Error clearing deals:', error);
    }
  };

  const isDealSaved = (dealId: string) => {
    return savedDeals.some(deal => deal.id === dealId);
  };

  return (
    <SavedDealsContext.Provider
      value={{
        savedDeals,
        saveDeals,
        removeDeal,
        clearAllDeals,
        isDealSaved,
        loading,
      }}
    >
      {children}
    </SavedDealsContext.Provider>
  );
};

export const useSavedDeals = () => {
  const context = useContext(SavedDealsContext);
  if (context === undefined) {
    throw new Error('useSavedDeals must be used within a SavedDealsProvider');
  }
  return context;
};
