"use client";

import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import { EmissionData } from "../types";
import { getClientDynamicFormsData as getDynamicFormsData } from "../lib";

interface EmissionDataContextType {
  emissionData: EmissionData;
  isLoading: boolean;
  error: string | null;
  refreshForms: () => Promise<void>;
}

interface EmissionDataProviderProps {
  children: ReactNode;
}

const EmissionDataContext = createContext<EmissionDataContextType | undefined>(
  undefined
);

export const EmissionDataProvider: React.FC<EmissionDataProviderProps> = ({
  children,
}) => {
  const [emissionData, setEmissionData] = useState<EmissionData>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadFormsData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const dynamicData = await getDynamicFormsData();
      setEmissionData(dynamicData);
    } catch (err) {
      console.error("Failed to load dynamic forms:", err);
      setError(err instanceof Error ? err.message : "Failed to load forms");
      // No fallback - Firebase is required
      setEmissionData({});
    } finally {
      setIsLoading(false);
    }
  };

  const refreshForms = async () => {
    await loadFormsData();
  };

  useEffect(() => {
    loadFormsData();
  }, []);

  return (
    <EmissionDataContext.Provider
      value={{
        emissionData,
        isLoading,
        error,
        refreshForms,
      }}
    >
      {children}
    </EmissionDataContext.Provider>
  );
};

export const useEmissionData = (): EmissionDataContextType => {
  const context = useContext(EmissionDataContext);
  if (context === undefined) {
    throw new Error(
      "useEmissionData must be used within an EmissionDataProvider"
    );
  }
  return context;
};

export default EmissionDataContext;
