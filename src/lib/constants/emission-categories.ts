/**
 * Emission Categories Configuration
 * Centralized configuration for emission calculation categories
 */

export interface EmissionCategory {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  fields: string[];
  calculationType: "direct" | "indirect" | "other";
}

export const EMISSION_CATEGORIES: Record<string, EmissionCategory> = {
  fuel: {
    id: "fuel",
    title: "Fuel Consumption",
    description: "Calculate emissions from fuel consumption",
    icon: "fuel-img.png",
    color: "#ff6b35",
    fields: ["amount", "fuel_type", "date", "uom"],
    calculationType: "direct",
  },
  electricity: {
    id: "electricity",
    title: "Electricity Usage",
    description: "Calculate emissions from electricity consumption",
    icon: "electrcity.png",
    color: "#4ecdc4",
    fields: ["amount", "date", "location", "uom"],
    calculationType: "indirect",
  },
  travel: {
    id: "travel",
    title: "Business Travel",
    description: "Calculate emissions from business travel",
    icon: "travel.png",
    color: "#45b7d1",
    fields: ["distance", "transport_type", "date", "passengers"],
    calculationType: "direct",
  },
  flight: {
    id: "flight",
    title: "Flight Emissions",
    description: "Calculate emissions from flights",
    icon: "flight.png",
    color: "#96ceb4",
    fields: ["departure", "arrival", "class", "passengers", "date"],
    calculationType: "direct",
  },
  waste: {
    id: "waste",
    title: "Waste Management",
    description: "Calculate emissions from waste disposal",
    icon: "waste.png",
    color: "#feca57",
    fields: ["amount", "waste_type", "date", "uom"],
    calculationType: "other",
  },
  water: {
    id: "water",
    title: "Water Usage",
    description: "Calculate emissions from water consumption",
    icon: "water.png",
    color: "#48dbfb",
    fields: ["amount", "date", "uom"],
    calculationType: "indirect",
  },
  paper: {
    id: "paper",
    title: "Paper Consumption",
    description: "Calculate emissions from paper usage",
    icon: "paper.png",
    color: "#ff9ff3",
    fields: ["amount", "paper_type", "date", "uom"],
    calculationType: "indirect",
  },
  refrigerants: {
    id: "refrigerants",
    title: "Refrigerants",
    description: "Calculate emissions from refrigerant usage",
    icon: "refrigerants.png",
    color: "#54a0ff",
    fields: ["amount", "refrigerant_type", "date", "uom"],
    calculationType: "direct",
  },
  commuting: {
    id: "commuting",
    title: "Employee Commuting",
    description: "Calculate emissions from employee commuting",
    icon: "commuting.png",
    color: "#5f27cd",
    fields: ["distance", "transport_type", "employees", "date"],
    calculationType: "direct",
  },
  home_worker: {
    id: "home_worker",
    title: "Remote Work",
    description: "Calculate emissions from remote work",
    icon: "home worker.png",
    color: "#00d2d3",
    fields: ["hours", "energy_source", "date"],
    calculationType: "indirect",
  },
  hotel: {
    id: "hotel",
    title: "Hotel Stays",
    description: "Calculate emissions from hotel accommodations",
    icon: "hotel.png",
    color: "#ff6348",
    fields: ["nights", "hotel_type", "date", "guests"],
    calculationType: "indirect",
  },
  product: {
    id: "product",
    title: "Product Lifecycle",
    description: "Calculate emissions from product lifecycle",
    icon: "product.png",
    color: "#2ed573",
    fields: ["amount", "product_type", "date", "uom"],
    calculationType: "other",
  },
  spend: {
    id: "spend",
    title: "Spend-Based",
    description: "Calculate emissions from financial spending",
    icon: "spend.png",
    color: "#ffa502",
    fields: ["amount", "category", "date", "currency"],
    calculationType: "other",
  },
  bulk: {
    id: "bulk",
    title: "Bulk Upload",
    description: "Calculate emissions from bulk data upload",
    icon: "bulk.png",
    color: "#3742fa",
    fields: ["file", "format", "date"],
    calculationType: "other",
  },
  custom: {
    id: "custom",
    title: "Custom Calculation",
    description: "Custom emission calculation",
    icon: "custom.png",
    color: "#2f3542",
    fields: ["formula", "variables", "date"],
    calculationType: "other",
  },
} as const;

export const getCategoryById = (id: string): EmissionCategory | undefined => {
  return EMISSION_CATEGORIES[id];
};

export const getAllCategories = (): EmissionCategory[] => {
  return Object.values(EMISSION_CATEGORIES);
};

export const getCategoriesByType = (
  type: EmissionCategory["calculationType"]
): EmissionCategory[] => {
  return Object.values(EMISSION_CATEGORIES).filter(
    category => category.calculationType === type
  );
};
