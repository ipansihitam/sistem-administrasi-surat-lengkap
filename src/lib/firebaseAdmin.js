import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';

// This will be our cached singleton instance
let db = null;

/**
 * A resilient, standard-compliant, singleton function to get the Firestore database instance.
 * It relies on Google Application Default Credentials, which is the standard for managed environments like IDX.
 * 
 * @returns {FirebaseFirestore.Firestore | null} The initialized Firestore instance or null if initialization fails.
 */
export function getDb() {
  // If the instance already exists, return it immediately.
  if (db) {
    return db;
  }

  try {
    // Check if the SDK has already been initialized elsewhere.
    if (!admin.apps.length) {
      // CRITICAL: Initialize without any arguments. 
      // The SDK will automatically find the credentials injected by the MCP/IDX environment.
      admin.initializeApp();
      console.log("Firebase Admin SDK Initialized using Application Default Credentials.");
    } else {
      console.log("Firebase Admin SDK was already initialized. Reusing existing app.");
    }

    // Get the Firestore instance and cache it.
    db = getFirestore();
    return db;

  } catch (error) {
    // If initialization fails for any reason, log a detailed error and return null.
    console.error("FATAL: Firebase Admin SDK Initialization failed. This is a critical error.", error);
    console.warn("This might be due to a misconfigured environment or missing permissions.");
    
    // Ensure we don't return a partially initialized instance.
    db = null;
    return null;
  }
}
