import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "./firebase";

// Firebase collection names
const FIRESTORE_COLLECTIONS = {
  config: "appconfig",
};

// Check if we're running on the server side
const isServerSide = typeof window === "undefined";

/**
 * Get a specific configuration document from Firebase
 * Uses Firebase Admin on server-side, client SDK on client-side
 */
async function getConfigDoc(type: string) {
  try {
    if (isServerSide) {
      // Use Firebase Admin on server-side with dynamic import
      const { default: FirebaseAdmin } = await import("./firebase-admin");
      const docData = await FirebaseAdmin.getDocument(
        FIRESTORE_COLLECTIONS.config,
        type
      );
      if (docData && (docData as any).data) {
        return JSON.parse((docData as any).data);
      }
      return null;
    } else {
      // Use client SDK on client-side
      const updateDoc = await getDoc(
        doc(db, FIRESTORE_COLLECTIONS.config, type)
      );
      if (updateDoc.exists()) {
        return JSON.parse(updateDoc.data().data);
      }
      return null;
    }
  } catch (error) {
    console.error(`Error fetching config doc ${type}:`, error);
    throw error;
  }
}

/**
 * Fetch app configuration from Firebase
 * This mirrors the functionality from sustraxmx frontend
 */
export async function fetchAppConfig() {
  try {
    const updates = await getConfigDoc("updates");
    if (!updates) {
      throw new Error("Updates configuration not found");
    }

    const docsToGet = [];
    const formsdata: Record<string, any> = {};

    // Check which documents need to be fetched
    for (const prop in updates) {
      if (prop === "emission_factors") continue;

      // For now, we'll fetch all documents since we don't have local storage logic
      docsToGet.push(prop);
    }

    if (docsToGet.length) {
      const collectionRef = collection(db, FIRESTORE_COLLECTIONS.config);
      const q = query(collectionRef, where("__name__", "in", docsToGet));
      const docs = await getDocs(q);

      docs.forEach(doc => {
        try {
          formsdata[doc.id] = JSON.parse(doc.data().data);
        } catch (error) {
          console.error(`Error parsing document ${doc.id}:`, error);
        }
      });
    }

    return { updates, formsdata };
  } catch (error) {
    console.error("Error fetching app config:", error);
    throw error;
  }
}

/**
 * Get forms configuration specifically
 */
export async function getFormsConfig() {
  try {
    const formsDoc = await getConfigDoc("forms");
    return formsDoc;
  } catch (error) {
    console.error("Error fetching forms config:", error);
    throw error;
  }
}

/**
 * Get emission factors configuration
 */
export async function getEmissionFactors() {
  try {
    const emissionFactorsDoc = await getConfigDoc("emission_factors");
    return emissionFactorsDoc;
  } catch (error) {
    console.error("Error fetching emission factors:", error);
    throw error;
  }
}
