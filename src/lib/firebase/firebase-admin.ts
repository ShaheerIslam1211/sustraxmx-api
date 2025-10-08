import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";
import { getStorage } from "firebase-admin/storage";
import type { ServiceAccount } from "firebase-admin";

// Create service account object from environment variables
const createServiceAccount = (): ServiceAccount => {
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (
    !privateKey ||
    !process.env.FIREBASE_CLIENT_EMAIL ||
    !process.env.FIREBASE_PROJECT_ID
  ) {
    throw new Error(
      "Missing required Firebase environment variables. Please check your .env file."
    );
  }

  return {
    type: "service_account",
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: privateKey,
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri:
      process.env.FIREBASE_AUTH_URI ||
      "https://accounts.google.com/o/oauth2/auth",
    token_uri:
      process.env.FIREBASE_TOKEN_URI || "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url:
      process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL ||
      "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
    universe_domain: process.env.FIREBASE_UNIVERSE_DOMAIN || "googleapis.com",
  } as ServiceAccount;
};

// Initialize Firebase Admin SDK
let adminApp: any;

try {
  // Check if Firebase Admin is already initialized
  if (getApps().length === 0) {
    const serviceAccount = createServiceAccount();
    const projectId =
      process.env.FIREBASE_PROJECT_ID || "carboncalculator-bf757";

    adminApp = initializeApp({
      credential: cert(serviceAccount),
      projectId: projectId,
      storageBucket: `${projectId}.appspot.com`,
    });
  } else {
    adminApp = getApps()[0];
  }
} catch (error) {
  console.error("Error initializing Firebase Admin:", error);
  throw new Error("Failed to initialize Firebase Admin SDK");
}

// Initialize Firebase Admin services
const adminDb = getFirestore(adminApp);
const adminAuth = getAuth(adminApp);
const adminStorage = getStorage(adminApp);

/**
 * Firebase Admin Database Operations
 */
export class FirebaseAdmin {
  /**
   * Get a document from Firestore
   */
  static async getDocument(collection: string, docId: string) {
    try {
      const doc = await adminDb.collection(collection).doc(docId).get();
      if (doc.exists) {
        return { id: doc.id, ...doc.data() };
      }
      return null;
    } catch (error) {
      console.error(
        `Error getting document ${docId} from ${collection}:`,
        error
      );
      throw error;
    }
  }

  /**
   * Get multiple documents from a collection
   */
  static async getCollection(collection: string, limit?: number) {
    try {
      const collectionRef = adminDb.collection(collection);
      const query = limit ? collectionRef.limit(limit) : collectionRef;
      const snapshot = await query.get();
      return snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error(`Error getting collection ${collection}:`, error);
      throw error;
    }
  }

  /**
   * Create or update a document
   */
  static async setDocument(collection: string, docId: string, data: any) {
    try {
      await adminDb
        .collection(collection)
        .doc(docId)
        .set(data, { merge: true });
      return { success: true, id: docId };
    } catch (error) {
      console.error(`Error setting document ${docId} in ${collection}:`, error);
      throw error;
    }
  }

  /**
   * Delete a document
   */
  static async deleteDocument(collection: string, docId: string) {
    try {
      await adminDb.collection(collection).doc(docId).delete();
      return { success: true, id: docId };
    } catch (error) {
      console.error(
        `Error deleting document ${docId} from ${collection}:`,
        error
      );
      throw error;
    }
  }

  /**
   * Query documents with conditions
   */
  static async queryDocuments(
    collection: string,
    field: string,
    operator: any,
    value: any,
    limit?: number
  ) {
    try {
      const collectionRef = adminDb.collection(collection);
      const baseQuery = collectionRef.where(field, operator, value);
      const query = limit ? baseQuery.limit(limit) : baseQuery;
      const snapshot = await query.get();
      return snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error(`Error querying collection ${collection}:`, error);
      throw error;
    }
  }

  /**
   * Get app configuration from Firebase
   */
  static async getAppConfig() {
    try {
      const config = await this.getDocument("appconfig", "updates");
      return config;
    } catch (error) {
      console.error("Error getting app config:", error);
      throw error;
    }
  }

  /**
   * Get emission factors from Firebase
   */
  static async getEmissionFactors() {
    try {
      const factors = await this.getDocument("appconfig", "emission_factors");
      return factors;
    } catch (error) {
      console.error("Error getting emission factors:", error);
      throw error;
    }
  }

  /**
   * Verify user authentication token
   */
  static async verifyIdToken(idToken: string) {
    try {
      const decodedToken = await adminAuth.verifyIdToken(idToken);
      return decodedToken;
    } catch (error) {
      console.error("Error verifying ID token:", error);
      throw error;
    }
  }

  /**
   * Get user by UID
   */
  static async getUser(uid: string) {
    try {
      const userRecord = await adminAuth.getUser(uid);
      return userRecord;
    } catch (error) {
      console.error(`Error getting user ${uid}:`, error);
      throw error;
    }
  }
}

// Export the initialized services for direct use if needed
export { adminDb, adminAuth, adminStorage, adminApp };

// Export default
export default FirebaseAdmin;
