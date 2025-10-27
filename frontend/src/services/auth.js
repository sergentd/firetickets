import { app } from "./firebase";
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import logger from "@/utils/logger";

const auth = getAuth(app);

/**
 * Firebase Authentication Service
 * Single-user authentication for personal ticketing system
 */

/**
 * Sign in with email and password
 */
export const loginWithEmail = async (email, password) => {
  try {
    logger.log("🔐 AUTH: Attempting sign in...");
    logger.log("🔐 AUTH: Email:", email);
    logger.log("🔐 AUTH: Auth instance:", auth ? "✓ Ready" : "✗ Not initialized");

    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );
    logger.log("🔐 AUTH: ✓ Sign in successful", userCredential.user.email);
    logger.log("🔐 AUTH: ✓ User ID (UID):", userCredential.user.uid);
    logger.log("🔐 AUTH: Expected userId in tickets:", "g8EsL5xBoYR1p1uWASqzLcLQMRq2");
    logger.log("🔐 AUTH: UIDs match:", userCredential.user.uid === "g8EsL5xBoYR1p1uWASqzLcLQMRq2" ? "✓ YES" : "✗ NO - THIS IS THE PROBLEM!");
    return userCredential.user;
  } catch (error) {
    logger.error("🔐 AUTH: ✗ Sign in failed");
    logger.error("🔐 AUTH: Error code:", error.code);
    logger.error("🔐 AUTH: Error message:", error.message);
    logger.error("🔐 AUTH: Full error:", error);
    throw error;
  }
};

/**
 * Sign out current user
 */
export const logout = async () => {
  try {
    logger.log("🔐 AUTH: Signing out...");
    await signOut(auth);
    logger.log("🔐 AUTH: Sign out successful");
  } catch (error) {
    logger.error("🔐 AUTH: Sign out failed:", error);
    throw error;
  }
};

/**
 * Get current authenticated user
 */
export const getCurrentUser = () => {
  return auth.currentUser;
};

/**
 * Listen to auth state changes
 * Returns unsubscribe function
 */
export const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, (user) => {
    logger.log("🔐 AUTH: Auth state changed:", user ? user.email : "No user");
    callback(user);
  });
};

/**
 * DO NOT CREATE USERS VIA CODE!
 *
 * Security: User creation must be done in Firebase Console only.
 *
 * To create your account:
 * 1. Go to: https://console.firebase.google.com/project/ui-tools-vue/authentication/users
 * 2. Click "Add user"
 * 3. Enter your email and password
 * 4. Disable public signups in: Authentication → Settings → User actions
 */

export { auth };
