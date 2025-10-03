"use client";

import React, { createContext, useContext, ReactNode } from "react";
import emissionData from "../emissionData/emissionData.json";
import { EmissionData } from "../types";

interface EmissionDataContextType {
  emissionData: EmissionData;
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
  return (
    <EmissionDataContext.Provider value={{ emissionData }}>
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
