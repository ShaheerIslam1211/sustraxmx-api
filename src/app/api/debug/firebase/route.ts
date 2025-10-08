import { NextRequest, NextResponse } from "next/server";
import FirebaseAdmin, {
  adminDb,
  adminAuth,
  adminStorage,
  adminApp,
} from "../../../../lib/firebase/firebase-admin";
import { getDynamicFormsData } from "../../../../lib/firebase/server-forms-service";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const isDownload = searchParams.get("download") === "true";

    console.log("🔥 SERVER-SIDE FIREBASE DEBUG 🔥");
    console.log("=================================");

    // Prepare comprehensive Firebase data
    const firebaseData = {
      timestamp: new Date().toISOString(),
      type: "server-side-firebase-debug",
      firebase: {
        adminApp: {
          available: adminApp ? true : false,
          name: adminApp?.name,
          projectId: adminApp?.options?.projectId,
          options: adminApp?.options,
        },
        adminDb: {
          available: adminDb ? true : false,
          methods: adminDb
            ? Object.getOwnPropertyNames(Object.getPrototypeOf(adminDb))
            : [],
        },
        adminAuth: {
          available: adminAuth ? true : false,
          methods: adminAuth
            ? Object.getOwnPropertyNames(Object.getPrototypeOf(adminAuth))
            : [],
        },
        adminStorage: {
          available: adminStorage ? true : false,
          methods: adminStorage
            ? Object.getOwnPropertyNames(Object.getPrototypeOf(adminStorage))
            : [],
        },
      },
      environment: {
        NODE_ENV: process.env.NODE_ENV,
        hasFirebaseProjectId: !!process.env.FIREBASE_PROJECT_ID,
        hasNextPublicFirebaseProjectId:
          !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        hasServiceAccount: true,
      },
      collections: {} as Record<string, any>,
      dataTests: {} as Record<string, any>,
      errors: [] as any[],
    };

    // Test forms data retrieval
    try {
      console.log("🔄 Testing server-side getDynamicFormsData...");
      const formsData = await getDynamicFormsData();
      console.log("✅ Server Forms Data:", formsData);

      firebaseData.dataTests.formsData = {
        success: true,
        categoriesCount: Object.keys(formsData).length,
        categories: Object.keys(formsData),
        sampleCategory: Object.keys(formsData)[0]
          ? {
              key: Object.keys(formsData)[0],
              title: formsData[Object.keys(formsData)[0]]?.title,
              fieldsCount: formsData[Object.keys(formsData)[0]]?.texts?.length,
            }
          : null,
      };
    } catch (error) {
      console.log("❌ Error getting server forms data:", error);
      firebaseData.errors.push({
        type: "formsData",
        error: error instanceof Error ? error.message : String(error),
      });
    }

    // Test Firebase Admin methods
    try {
      console.log("🔄 Testing FirebaseAdmin.getDocument...");
      const testDoc = await FirebaseAdmin.getDocument("appconfig", "forms");
      console.log("✅ Test Document:", testDoc ? "Found" : "Not Found");

      firebaseData.dataTests.adminDocument = {
        success: testDoc !== null,
        hasData: !!testDoc,
      };
    } catch (error) {
      console.log("❌ Error testing admin document:", error);
      firebaseData.errors.push({
        type: "adminDocument",
        error: error instanceof Error ? error.message : String(error),
      });
    }

    // Test data retrieval from various collections
    const collectionNames = [
      "dynamic-forms",
      "forms-config",
      "emission-factors",
      "app-config",
    ];

    for (const collectionName of collectionNames) {
      try {
        const snapshot = await adminDb
          .collection(collectionName)
          .limit(5)
          .get();
        firebaseData.collections[collectionName] = {
          exists: true,
          documentCount: snapshot.size,
          hasData: !snapshot.empty,
          documents: snapshot.docs.map(doc => ({
            id: doc.id,
            data: doc.data(),
          })),
        };
      } catch (error) {
        firebaseData.collections[collectionName] = {
          exists: false,
          error: error instanceof Error ? error.message : "Unknown error",
        };
      }
    }

    // Test authentication methods
    try {
      const userRecords = await adminAuth.listUsers(5);
      firebaseData.dataTests.authentication = {
        success: true,
        userCount: userRecords.users.length,
        hasUsers: userRecords.users.length > 0,
        sampleUsers: userRecords.users.map(user => ({
          uid: user.uid,
          email: user.email,
          emailVerified: user.emailVerified,
          disabled: user.disabled,
          creationTime: user.metadata.creationTime,
        })),
      };
    } catch (error) {
      firebaseData.dataTests.authentication = {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }

    // Log to console if not download request
    if (!isDownload) {
      console.log("📦 Firebase Admin Objects:", firebaseData.firebase);
      console.log("🌍 Environment Variables:", firebaseData.environment);
      console.log("📊 Data Tests:", firebaseData.dataTests);
      console.log("📁 Collections:", firebaseData.collections);
    }

    console.log("\n🎉 SERVER-SIDE FIREBASE DEBUG COMPLETE!");
    console.log("========================================");

    return NextResponse.json({
      success: true,
      message: isDownload
        ? "Server-side Firebase data prepared for download"
        : "Firebase debug information logged to server console",
      ...firebaseData,
      instructions: [
        "Check the server console/terminal for detailed Firebase object logs",
        "This endpoint provides a summary of Firebase objects and their accessibility",
        "Use the client-side debugger for more detailed browser console logs",
      ],
    });
  } catch (error) {
    console.error("❌ Error in Firebase debug endpoint:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Firebase debug failed",
        message:
          error instanceof Error ? error.message : "Unknown error occurred",
        details: process.env.NODE_ENV === "development" ? error : undefined,
        timestamp: new Date().toISOString(),
        type: "server-side-firebase-debug-error",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    console.log(`🔥 FIREBASE DEBUG ACTION: ${action}`);
    console.log("=====================================");

    const result: any = {
      action,
      timestamp: new Date().toISOString(),
      result: null,
      error: null,
    };

    switch (action) {
      case "testAdminAuth":
        try {
          // Test admin auth functionality
          console.log("🔄 Testing Admin Auth...");
          const authMethods = Object.getOwnPropertyNames(adminAuth);
          console.log("✅ Admin Auth Methods:", authMethods);
          result.result = { methods: authMethods };
        } catch (error) {
          result.error = error instanceof Error ? error.message : String(error);
        }
        break;

      case "testAdminDb":
        try {
          // Test admin database functionality
          console.log("🔄 Testing Admin Database...");
          const collections = await adminDb.listCollections();
          console.log(
            "✅ Available Collections:",
            collections.map(c => c.id)
          );
          result.result = { collections: collections.map(c => c.id) };
        } catch (error) {
          result.error = error instanceof Error ? error.message : String(error);
        }
        break;

      case "getAppConfig":
        try {
          console.log("🔄 Getting App Config...");
          const appConfig = await FirebaseAdmin.getAppConfig();
          console.log("✅ App Config:", appConfig);
          result.result = appConfig;
        } catch (error) {
          result.error = error instanceof Error ? error.message : String(error);
        }
        break;

      case "getEmissionFactors":
        try {
          console.log("🔄 Getting Emission Factors...");
          const emissionFactors = await FirebaseAdmin.getEmissionFactors();
          console.log("✅ Emission Factors:", emissionFactors);
          result.result = emissionFactors;
        } catch (error) {
          result.error = error instanceof Error ? error.message : String(error);
        }
        break;

      default:
        result.error = `Unknown action: ${action}`;
    }

    return NextResponse.json({
      success: !result.error,
      data: result,
      message: result.error ? "Action failed" : "Action completed successfully",
    });
  } catch (error) {
    console.error("❌ Error in Firebase debug POST:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Firebase debug action failed",
        message:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}
