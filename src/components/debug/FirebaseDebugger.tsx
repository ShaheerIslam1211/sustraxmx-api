"use client";

// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import { Button, Card, Typography, Space, Divider } from "antd";
import { BugOutlined, ReloadOutlined } from "@ant-design/icons";

// Import all Firebase objects
import { app, db, storage, auth, database } from "../../lib/firebase/firebase";
import { collection, getDocs } from "firebase/firestore";
import { getDynamicFormsData } from "../../lib/firebase/client-forms-service";
// Note: Removed server-side imports to avoid module resolution errors in browser
// import { getFormsConfig, getEmissionFactors, fetchAppConfig } from "../../lib/firebase/firebase-service";
// import { getAllEmissionFactors } from "../../lib/firebase/emission-factors-service";

const { Title, Text, Paragraph } = Typography;

const FirebaseDebugger: React.FC = () => {
  const [isLogging, setIsLogging] = useState(false);

  const logFirebaseObjects = async () => {
    setIsLogging(true);

    console.clear();
    console.log("🔥 FIREBASE COMPLETE OBJECT DUMP 🔥");
    console.log("=====================================");

    // 1. Client Firebase Objects
    console.log("\n📱 CLIENT FIREBASE OBJECTS:");
    console.log("----------------------------");

    console.log("🔥 Firebase App:", app);
    console.log("📊 Firestore DB:", db);
    console.log("🔐 Auth:", auth);
    console.log("💾 Storage:", storage);
    console.log("🗄️ Realtime Database:", database);

    // Log Firebase App Config
    console.log("\n🔧 Firebase App Config:");
    console.log("App Name:", app.name);
    console.log("App Options:", app.options);

    // Log Auth State
    console.log("\n🔐 Auth State:");
    console.log("Current User:", auth.currentUser);
    console.log("Auth Config:", auth.config);

    // Log Firestore Info
    console.log("\n📊 Firestore Info:");
    console.log("Firestore App:", db.app);
    console.log("Firestore Type:", db.type);

    // 2. Firebase Services and Methods
    console.log("\n🛠️ FIREBASE SERVICES:");
    console.log("----------------------");

    console.log(
      "Note: Admin Firebase objects are not available in client-side components"
    );

    // 3. Test Firebase Data Retrieval
    console.log("\n📋 DATA RETRIEVAL TESTS:");
    console.log("-------------------------");

    // Test client-side data retrieval
    try {
      console.log("🔄 Testing client-side getDynamicFormsData...");
      const formsData = await getDynamicFormsData();
      console.log("✅ Client Forms Data:", formsData);
      console.log("📊 Forms Data Keys:", Object.keys(formsData));

      // Log each category in detail
      Object.entries(formsData).forEach(([key, category]) => {
        console.log(`📁 Category "${key}":`, category);
        console.log(
          `📝 Fields in "${key}":`,
          (category as any).texts?.map((field: any) => field.name)
        );
      });
    } catch (error) {
      console.log("❌ Error getting forms data:", error);
    }

    // Note: Server-side functions removed to avoid module resolution errors
    console.log(
      "⚠️ Server-side functions (getFormsConfig, getEmissionFactors, getAllEmissionFactors, fetchAppConfig) are not available in client-side components"
    );
    console.log(
      "💡 To test these functions, use the server-side API endpoint: /api/debug/firebase"
    );

    // 5. Environment Variables
    console.log("\n🌍 ENVIRONMENT VARIABLES:");
    console.log("-------------------------");
    console.log("NODE_ENV:", process.env.NODE_ENV);
    console.log(
      "NEXT_PUBLIC_FIREBASE_API_KEY:",
      process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? "✅ Set" : "❌ Not Set"
    );
    console.log(
      "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN:",
      process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ? "✅ Set" : "❌ Not Set"
    );
    console.log(
      "NEXT_PUBLIC_FIREBASE_PROJECT_ID:",
      process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? "✅ Set" : "❌ Not Set"
    );

    // 6. Firebase Collections Structure
    console.log("\n📚 FIREBASE COLLECTIONS STRUCTURE:");
    console.log("-----------------------------------");

    try {
      // Try to get collection info
      const collections = [
        "appconfig",
        "contact_messages",
        "contacts",
        "emission_factors",
      ];
      console.log("🗂️ Expected Collections:", collections);

      // Test if we can access appconfig
      console.log("\n🔄 Testing appconfig collection access...");
      const appConfigDocs = ["forms", "emission_factors", "updates"];

      for (const docId of appConfigDocs) {
        try {
          console.log(`🔍 Checking appconfig/${docId}...`);
          // This will be handled by the service functions above
        } catch (error) {
          console.log(`❌ Error accessing appconfig/${docId}:`, error);
        }
      }
    } catch (error) {
      console.log("❌ Error checking collections:", error);
    }

    console.log("\n🎉 FIREBASE OBJECT DUMP COMPLETE!");
    console.log("==================================");
    console.log(
      "Check the console above for all Firebase objects and their properties."
    );

    setIsLogging(false);
  };

  const logFirebaseAuth = async () => {
    console.log("\n🔐 DETAILED AUTH INFORMATION:");
    console.log("-----------------------------");

    console.log("Auth Object:", auth);
    console.log("Current User:", auth.currentUser);
    console.log("Auth State Ready:", auth.authStateReady);

    // Listen to auth state changes
    const unsubscribe = auth.onAuthStateChanged(user => {
      console.log("🔄 Auth State Changed:", user);
      if (user) {
        console.log("✅ User is signed in:");
        console.log("  - UID:", user.uid);
        console.log("  - Email:", user.email);
        console.log("  - Display Name:", user.displayName);
        console.log("  - Email Verified:", user.emailVerified);
        console.log("  - Provider Data:", user.providerData);
      } else {
        console.log("❌ User is signed out");
      }
    });

    // Cleanup after 5 seconds
    setTimeout(() => {
      unsubscribe();
      console.log("🔇 Auth state listener removed");
    }, 5000);
  };

  const logServerSideFirebase = async () => {
    console.log("\n🖥️ CALLING SERVER-SIDE FIREBASE DEBUG API:");
    console.log("--------------------------------------------");

    try {
      const response = await fetch("/api/debug/firebase");
      const data = await response.json();
      console.log("✅ Server-side Firebase debug response:", data);
    } catch (error) {
      console.log("❌ Error calling server-side Firebase debug API:", error);
    }
  };

  // Helper function to download JSON data
  const downloadJSON = (data: any, filename: string) => {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const downloadClientFirebaseData = async () => {
    try {
      console.log("📥 Preparing client-side Firebase data for download...");

      const firebaseData = {
        timestamp: new Date().toISOString(),
        type: "client-side-firebase-debug",
        firebase: {
          app: {
            name: app?.name,
            options: app?.options,
            automaticDataCollectionEnabled: app?.automaticDataCollectionEnabled,
          },
          database: {
            app: database?.app?.name,
            available: database ? "Available" : "Not Available",
          },
          firestore: {
            app: db?.app?.name,
            type: db?.type,
            settings: "Available",
          },
          auth: {
            app: auth?.app?.name,
            currentUser: auth?.currentUser
              ? {
                  uid: auth.currentUser.uid,
                  email: auth.currentUser.email,
                  displayName: auth.currentUser.displayName,
                  emailVerified: auth.currentUser.emailVerified,
                  isAnonymous: auth.currentUser.isAnonymous,
                  providerData: auth.currentUser.providerData,
                }
              : null,
            settings: "Available",
          },
          storage: {
            app: storage?.app?.name,
            maxOperationRetryTime: storage?.maxOperationRetryTime,
            maxUploadRetryTime: storage?.maxUploadRetryTime,
          },
        },
        environment: {
          NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY
            ? "***SET***"
            : "Not Set",
          NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN:
            process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "Not Set",
          NEXT_PUBLIC_FIREBASE_PROJECT_ID:
            process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "Not Set",
          NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET:
            process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "Not Set",
          NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID:
            process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "Not Set",
          NEXT_PUBLIC_FIREBASE_APP_ID:
            process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "Not Set",
          NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID:
            process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "Not Set",
          NEXT_PUBLIC_FIREBASE_DATABASE_URL:
            process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL || "Not Set",
        },
        collections: {} as Record<string, any>,
        dataTests: {} as Record<string, any>,
      };

      // Test data retrieval
      try {
        const dynamicFormsData = await getDynamicFormsData();
        firebaseData.dataTests.dynamicForms = {
          success: true,
          data: dynamicFormsData,
          categoriesCount: Object.keys(dynamicFormsData || {}).length,
        };
      } catch (error) {
        firebaseData.dataTests.dynamicForms = {
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        };
      }

      // Try to get collection info
      try {
        const collectionNames = [
          "dynamic-forms",
          "forms-config",
          "emission-factors",
          "app-config",
        ];
        for (const collectionName of collectionNames) {
          try {
            const collectionRef = collection(db, collectionName);
            const snapshot = await getDocs(collectionRef);
            firebaseData.collections[collectionName] = {
              exists: true,
              documentCount: snapshot.size,
              documents: snapshot.docs.map((doc: any) => ({
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
      } catch (error) {
        firebaseData.collections = {
          error:
            error instanceof Error
              ? error.message
              : "Failed to check collections",
        };
      }

      const filename = `firebase-client-debug-${new Date().toISOString().split("T")[0]}-${Date.now()}.json`;
      downloadJSON(firebaseData, filename);
      console.log("✅ Client-side Firebase data downloaded successfully!");
    } catch (error) {
      console.error(
        "❌ Error preparing client-side Firebase data for download:",
        error
      );
    }
  };

  const downloadServerFirebaseData = async () => {
    try {
      console.log("📥 Downloading server-side Firebase data...");
      const response = await fetch("/api/debug/firebase?download=true");

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const filename = `firebase-server-debug-${new Date().toISOString().split("T")[0]}-${Date.now()}.json`;
      downloadJSON(data, filename);
      console.log("✅ Server-side Firebase data downloaded successfully!");
    } catch (error) {
      console.error("❌ Error downloading server-side Firebase data:", error);
    }
  };

  return (
    <Card
      title={
        <Space>
          <BugOutlined />
          <Title level={4} style={{ margin: 0 }}>
            Firebase Debugger
          </Title>
        </Space>
      }
      style={{ margin: "20px 0" }}
    >
      <Space direction="vertical" style={{ width: "100%" }}>
        <Paragraph>
          This component will log all Firebase objects, configurations, and data
          to the browser console. Open your browser's developer tools (F12) and
          check the Console tab.
        </Paragraph>

        <Divider />

        <Space direction="vertical" style={{ width: "100%" }}>
          <Space wrap>
            <Button
              type="primary"
              icon={<BugOutlined />}
              loading={isLogging}
              onClick={logFirebaseObjects}
            >
              Log Client Firebase Objects
            </Button>

            <Button type="default" onClick={downloadClientFirebaseData}>
              📥 Download Client Data (JSON)
            </Button>
          </Space>

          <Space wrap>
            <Button icon={<ReloadOutlined />} onClick={logFirebaseAuth}>
              Log Auth Details
            </Button>

            <Button type="default" onClick={logServerSideFirebase}>
              Log Server Firebase Objects
            </Button>
          </Space>

          <Button
            type="default"
            onClick={downloadServerFirebaseData}
            style={{ width: "100%" }}
          >
            📥 Download Server Data (JSON)
          </Button>
        </Space>

        <Divider />

        <div
          style={{
            background: "var(--background-secondary)",
            padding: "16px",
            borderRadius: "6px",
          }}
        >
          <Text strong>What this will log:</Text>
          <ul style={{ marginTop: "8px", marginBottom: 0 }}>
            <li>
              🔥 Client Firebase objects (app, db, auth, storage, database)
            </li>
            <li>📋 Live data from Firebase collections (client-side only)</li>
            <li>🌍 Environment variables</li>
            <li>📚 Collection structure and accessibility</li>
            <li>🔐 Authentication state and user info</li>
            <li>⚠️ Server-side functions available via /api/debug/firebase</li>
          </ul>
        </div>
      </Space>
    </Card>
  );
};

export default FirebaseDebugger;
