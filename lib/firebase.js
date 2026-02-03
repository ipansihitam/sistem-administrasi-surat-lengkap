
import admin from 'firebase-admin';

// Check if the service account is already loaded
const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
  : null;

if (!admin.apps.length) {
  if (serviceAccount) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
  } else {
    // This is for local development without service account
    // It will use the default credentials of the environment
    console.warn("Firebase service account not found. Initializing with default credentials. This is expected for local development.");
    admin.initializeApp();
  }
}

const db = admin.firestore();

export { db };
