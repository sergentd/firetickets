import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Debug: Log configuration status (without exposing sensitive data)
console.log("🔥 FIREBASE: Initializing Firebase...");
console.log("🔥 FIREBASE: Config loaded:", {
  hasApiKey: !!firebaseConfig.apiKey,
  apiKeyFirst20: firebaseConfig.apiKey?.substring(0, 20) + "...",
  authDomain: firebaseConfig.authDomain,
  projectId: firebaseConfig.projectId,
  hasAppId: !!firebaseConfig.appId,
  appIdFirst20: firebaseConfig.appId?.substring(0, 20) + "...",
});

// DEBUGGING: Show full API key (REMOVE AFTER DEBUGGING)
console.warn("🔥 FIREBASE DEBUG: Full API Key:", firebaseConfig.apiKey);
console.warn("🔥 FIREBASE DEBUG: Full App ID:", firebaseConfig.appId);

// Check if all required config values are present
const missingConfig = Object.entries(firebaseConfig)
  .filter(([, value]) => !value)
  .map(([key]) => key);

if (missingConfig.length > 0) {
  console.error("🔥 FIREBASE: Missing configuration values:", missingConfig);
  console.error("🔥 FIREBASE: Check your .env.local file");
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);
console.log("🔥 FIREBASE: App initialized successfully");

// Initialize Firestore
const db = getFirestore(app);
console.log("🔥 FIRESTORE: Database initialized successfully");

export { app, db };
