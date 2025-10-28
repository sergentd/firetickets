import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import logger from "@/utils/logger";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Debug: Log configuration status (without exposing sensitive data)
logger.log("🔥 FIREBASE: Initializing Firebase...");
logger.log("🔥 FIREBASE: Config loaded:", {
  hasApiKey: !!firebaseConfig.apiKey,
  authDomain: firebaseConfig.authDomain,
  projectId: firebaseConfig.projectId,
  hasAppId: !!firebaseConfig.appId,
});

// Check if all required config values are present
const missingConfig = Object.entries(firebaseConfig)
  .filter(([, value]) => !value)
  .map(([key]) => key);

if (missingConfig.length > 0) {
  logger.error("🔥 FIREBASE: Missing configuration values:", missingConfig);
  logger.error("🔥 FIREBASE: Check your .env.local file");
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);
logger.log("🔥 FIREBASE: App initialized successfully");

// Initialize Firestore
const db = getFirestore(app);
logger.log("🔥 FIRESTORE: Database initialized successfully");

// Initialize Storage
const storage = getStorage(app);
logger.log("🔥 STORAGE: Storage initialized successfully");

export { app, db, storage };
