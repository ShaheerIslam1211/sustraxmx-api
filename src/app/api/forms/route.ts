import { NextRequest, NextResponse } from "next/server";
import { getDynamicFormsData } from "../../../lib/firebase/dynamic-forms-service";

export async function GET(request: NextRequest) {
  try {
    const formsData = await getDynamicFormsData();

    return NextResponse.json({
      success: true,
      data: formsData,
      message: "Forms data retrieved successfully",
    });
  } catch (error) {
    console.error("Error fetching forms data:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch forms data",
        message:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { refresh } = body;

    if (refresh) {
      // Force refresh forms data from Firebase
      const formsData = await getDynamicFormsData();

      return NextResponse.json({
        success: true,
        data: formsData,
        message: "Forms data refreshed successfully",
      });
    }

    return NextResponse.json(
      {
        success: false,
        error: "Invalid request",
        message: "Missing refresh parameter",
      },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error refreshing forms data:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to refresh forms data",
        message:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}
