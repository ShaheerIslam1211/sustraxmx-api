import { NextRequest, NextResponse } from "next/server";
import {
  getDynamicFormsData,
  validateFormData,
  mapBackendResponseToFormData,
} from "../../../../lib/firebase/server-forms-service";

// Backend API configuration
const BACKEND_API_URL =
  process.env.REACT_APP_BE ||
  process.env.SUSTRAX_API_URL ||
  "https://sustrax-node.vercel.app";

interface FuelCalculationRequest {
  type: string;
  amount: number;
  date: string;
  category?: string;
  uom?: string;
  [key: string]: any;
}

interface BackendResponse {
  success: boolean;
  data?: any;
  error?: string;
  message?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: FuelCalculationRequest = await request.json();

    // Get dynamic forms data for validation
    const formsData = await getDynamicFormsData();

    // Validate the form data against the fuel category
    const validation = validateFormData("fuel", body, formsData);

    if (!validation.isValid) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          message: "Please check the required fields",
          validationErrors: validation.errors,
        },
        { status: 400 }
      );
    }

    // Prepare data for backend API call
    const backendPayload = {
      type: body.type,
      amount: body.amount,
      date: body.date,
      category: body.category,
      uom: body.uom,
      // Include any additional fields
      ...Object.keys(body).reduce(
        (acc, key) => {
          if (!["type", "amount", "date", "category", "uom"].includes(key)) {
            acc[key] = body[key];
          }
          return acc;
        },
        {} as Record<string, any>
      ),
    };

    // Call the backend API
    const backendResponse = await fetch(
      `${BACKEND_API_URL}/api/fuel/calculate`,
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
      throw new Error(
        errorData.message || `Backend API error: ${backendResponse.status}`
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
        },
        { status: 500 }
      );
    }

    // Map backend response to form structure for consistent field naming
    const mappedResponse = mapBackendResponseToFormData(
      backendData.data || backendData,
      "fuel"
    );

    return NextResponse.json({
      success: true,
      data: {
        calculation: mappedResponse,
        originalRequest: body,
        formStructure: formsData.fuel,
      },
      message: "Fuel emissions calculated successfully",
    });
  } catch (error) {
    console.error("Error calculating fuel emissions:", error);

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
    // Return the fuel form structure for reference
    const formsData = await getDynamicFormsData();

    return NextResponse.json({
      success: true,
      data: {
        formStructure: formsData.fuel,
        endpoint: "/api/fuel/calculate",
        method: "POST",
        requiredFields:
          formsData.fuel?.texts
            ?.filter(field => field.s_r)
            .map(field => field.name) || [],
        sampleRequest: {
          type: "Diesel",
          amount: 100,
          date: "2024-01-31",
          category: "Transport",
          uom: "litres",
        },
      },
      message: "Fuel calculation endpoint information",
    });
  } catch (error) {
    console.error("Error getting fuel endpoint info:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to get endpoint information",
        message:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}
