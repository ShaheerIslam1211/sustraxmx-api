"use client";

import React, { createContext, useState, useContext, ReactNode } from "react";
import { apiData } from "../mockData/mockData";
import { ApiData } from "../types";

interface ApiDataContextType {
  currentApiDetails: ApiData | undefined;
  setApiDetails: (_endpoint: string) => void;
  apis: ApiData[];
  selectedApiEndpoint: string;
}

const ApiDataContext = createContext<ApiDataContextType | undefined>(undefined);

interface ApiDataProviderProps {
  children: ReactNode;
}

export const useApiData = (): ApiDataContextType => {
  const context = useContext(ApiDataContext);
  if (context === undefined) {
    throw new Error("useApiData must be used within an ApiDataProvider");
  }
  return context;
};

export const ApiDataProvider: React.FC<ApiDataProviderProps> = ({
  children,
}) => {
  const [currentApiDetails, setCurrentApiDetails] = useState<
    ApiData | undefined
  >();
  const [selectedApiEndpoint, setSelectedApiEndpoint] = useState<string>("");
  const [apis, _setApis] = useState<ApiData[]>(apiData as ApiData[]);

  const setApiDetails = (endpoint: string): void => {
    const details = apiData.find(api => api.endpoint === endpoint) as
      | ApiData
      | undefined;
    setCurrentApiDetails(details);
    setSelectedApiEndpoint(endpoint);
  };

  const value: ApiDataContextType = {
    currentApiDetails,
    setApiDetails,
    apis,
    selectedApiEndpoint,
  };

  return (
    <ApiDataContext.Provider value={value}>{children}</ApiDataContext.Provider>
  );
};

export default ApiDataContext;
