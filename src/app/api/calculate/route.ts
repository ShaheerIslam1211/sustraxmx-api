import { NextRequest, NextResponse } from "next/server";
import {
  getDynamicFormsData,
  validateFormData,
  mapBackendResponseToFormData,
} from "../../../lib/firebase/server-forms-service";

// Backend API configuration
const BACKEND_API_URL =
  process.env.REACT_APP_BE ||
  process.env.SUSTRAX_API_URL ||
  "https://sustraxmx-backend.onrender.com";

interface CalculationRequest {
  category: string;
  data: Record<string, any>;
}

interface BackendResponse {
  success: boolean;
  data?: any;
  error?: string;
  message?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: CalculationRequest = await request.json();
    const { category, data } = body;

    if (!category || !data) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields",
          message: "Both category and data are required",
        },
        { status: 400 }
      );
    }

    // Get dynamic forms data for validation
    const formsData = await getDynamicFormsData();

    // Check if category exists
    if (!formsData[category]) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid category",
          message: `Category '${category}' not found`,
          availableCategories: Object.keys(formsData),
        },
        { status: 400 }
      );
    }

    // Validate the form data against the specified category
    const validation = validateFormData(category, data, formsData);

    if (!validation.isValid) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          message: "Please check the required fields",
          validationErrors: validation.errors,
          requiredFields:
            formsData[category]?.texts
              ?.filter(field => field.s_r)
              .map(field => field.name) || [],
        },
        { status: 400 }
      );
    }

    // Prepare data for backend API call
    const backendPayload = {
      category,
      ...data,
    };

    // Determine the appropriate backend endpoint based on category
    const endpointMap: Record<string, string> = {
      fuel: "/api/fuel/calculate",
      cars: "/api/cars/calculate",
      freighting: "/api/freighting/calculate",
      waste: "/api/waste/calculate",
      flight: "/api/flight/calculate",
      other_travels: "/api/othertravels/calculate",
      electricity: "/api/electricity/calculate",
      home_workers: "/api/homeworkers/calculate",
      hotel: "/api/hotel/calculate",
      refrigerator: "/api/refrigerator/calculate",
      water: "/api/water/calculate",
      ingredients: "/api/ingredients/calculate",
      paper: "/api/paper/calculate",
      spendings: "/api/spendings/calculate",
      product: "/api/product/calculate",
      bulk_material: "/api/bulkMaterial/calculate",
      commuting: "/api/commuting/calculate",
      natural_gas: "/api/naturalgas/calculate",
      heat_and_steam: "/api/heatandsteam/calculate",
    };

    const backendEndpoint =
      endpointMap[category] || `/api/${category}/calculate`;

    // Call the backend API
    const backendResponse = await fetch(
      `${BACKEND_API_URL}${backendEndpoint}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(backendPayload),
      }
    );

    if (!backendResponse.ok) {
      const errorData = await backendResponse.json().catch(() => ({}));

      // Return detailed error information from backend
      return NextResponse.json(
        {
          success: false,
          error: "Backend calculation failed",
          message:
            errorData.message || `Backend API error: ${backendResponse.status}`,
          backendError: errorData,
          status: backendResponse.status,
          statusText: backendResponse.statusText,
        },
        { status: backendResponse.status }
      );
    }

    const backendData: BackendResponse = await backendResponse.json();

    if (!backendData.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Backend calculation failed",
          message: backendData.message || "Unknown backend error",
          backendError: backendData.error,
          status: 500,
        },
        { status: 500 }
      );
    }

    // Map backend response to form structure for consistent field naming
    const mappedResponse = mapBackendResponseToFormData(
      backendData.data || backendData,
      category
    );

    return NextResponse.json({
      success: true,
      result: mappedResponse,
      data: {
        category,
        calculation: mappedResponse,
        originalRequest: data,
        formStructure: formsData[category],
      },
      message: `${category} emissions calculated successfully`,
    });
  } catch (error) {
    console.error("Error calculating emissions:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Calculation failed",
        message:
          error instanceof Error ? error.message : "Unknown error occurred",
        details: process.env.NODE_ENV === "development" ? error : undefined,
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Return all available categories and their form structures
    const formsData = await getDynamicFormsData();

    const categories = Object.keys(formsData).map(category => ({
      name: category,
      title: formsData[category]?.title || category,
      description:
        formsData[category]?.ins || `Calculate ${category} emissions`,
      requiredFields:
        formsData[category]?.texts
          ?.filter(field => field.s_r)
          .map(field => field.name) || [],
      allFields:
        formsData[category]?.texts?.map(field => ({
          name: field.name,
          title: field.title,
          required: field.s_r,
          type: field.s_t,
          description: field.desc,
        })) || [],
    }));

    return NextResponse.json({
      success: true,
      data: {
        categories,
        endpoint: "/api/calculate",
        method: "POST",
        sampleRequest: {
          category: "fuel",
          data: {
            type: "Diesel",
            amount: 100,
            date: "2024-01-31",
            category: "Transport",
            uom: "litres",
          },
        },
      },
      message: "Available emission calculation categories",
    });
  } catch (error) {
    console.error("Error getting calculation info:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to get calculation information",
        message:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}
