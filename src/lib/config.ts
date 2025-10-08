/**
 * Configuration utility for API URLs and environment settings
 */

// Check if we're in development mode
const isDevelopment = process.env.NODE_ENV === "development";

// API Base URLs
export const API_CONFIG = {
  // Local development URL (port 5173 as requested)
  LOCAL_BASE_URL: "http://localhost:5173",

  // Production URL
  PRODUCTION_BASE_URL: "https://sustraxmx-backend.onrender.com",

  // Get the appropriate base URL based on environment
  getBaseUrl: (): string => {
    return isDevelopment
      ? API_CONFIG.LOCAL_BASE_URL
      : API_CONFIG.PRODUCTION_BASE_URL;
  },

  // Get full API endpoint URL
  getApiUrl: (endpoint: string): string => {
    const baseUrl = API_CONFIG.getBaseUrl();
    // Ensure endpoint starts with /api/
    const formattedEndpoint = endpoint.startsWith("/api/")
      ? endpoint
      : `/api/${endpoint}`;
    return `${baseUrl}${formattedEndpoint}`;
  },

  // Get specific calculation endpoint
  getCalculationUrl: (category: string): string => {
    return API_CONFIG.getApiUrl(`${category}/calculate`);
  },
};

// API Endpoints mapping
export const API_ENDPOINTS = {
  fuel: "/api/fuel/calculate",
  naturalgas: "/api/naturalgas/calculate",
  electricity: "/api/electricity/calculate",
  cars: "/api/cars/calculate",
  flight: "/api/flight/calculate",
  freighting: "/api/freighting/calculate",
  waste: "/api/waste/calculate",
  heatandsteam: "/api/heatandsteam/calculate",
  commuting: "/api/commuting/calculate",
  othertravels: "/api/othertravels/calculate",
  "bulk-material": "/api/bulk-material/calculate",
  hotel: "/api/hotel/calculate",
  refrigerator: "/api/refrigerator/calculate",
  water: "/api/water/calculate",
  ingredients: "/api/ingredients/calculate",
  paper: "/api/paper/calculate",
  homeworkers: "/api/homeworkers/calculate",
  spendings: "/api/spendings/calculate",
  product: "/api/product/calculate",
};

// Get display URL for UI (what users see in the authorization block)
export const getDisplayUrl = (category: string): string => {
  const baseUrl = API_CONFIG.getBaseUrl();
  const endpoint =
    API_ENDPOINTS[category as keyof typeof API_ENDPOINTS] ||
    `/api/${category}/calculate`;
  return `${baseUrl}${endpoint}`;
};

export default API_CONFIG;
