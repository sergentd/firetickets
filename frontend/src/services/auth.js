import { app } from "./firebase";
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

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
    console.log("🔐 AUTH: Attempting sign in...");
    console.log("🔐 AUTH: Email:", email);
    console.log("🔐 AUTH: Auth instance:", auth ? "✓ Ready" : "✗ Not initialized");

    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );
    console.log("🔐 AUTH: ✓ Sign in successful", userCredential.user.email);
    console.log("🔐 AUTH: ✓ User ID (UID):", userCredential.user.uid);
    console.log("🔐 AUTH: Expected userId in tickets:", "g8EsL5xBoYR1p1uWASqzLcLQMRq2");
    console.log("🔐 AUTH: UIDs match:", userCredential.user.uid === "g8EsL5xBoYR1p1uWASqzLcLQMRq2" ? "✓ YES" : "✗ NO - THIS IS THE PROBLEM!");
    return userCredential.user;
  } catch (error) {
    console.error("🔐 AUTH: ✗ Sign in failed");
    console.error("🔐 AUTH: Error code:", error.code);
    console.error("🔐 AUTH: Error message:", error.message);
    console.error("🔐 AUTH: Full error:", error);
    throw error;
  }
};

/**
 * Sign out current user
 */
export const logout = async () => {
  try {
    console.log("🔐 AUTH: Signing out...");
    await signOut(auth);
    console.log("🔐 AUTH: Sign out successful");
  } catch (error) {
    console.error("🔐 AUTH: Sign out failed:", error);
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
    console.log("🔐 AUTH: Auth state changed:", user ? user.email : "No user");
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
