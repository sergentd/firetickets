/**
 * Authentication Store
 * Manages user authentication state with Firebase
 */
import { defineStore } from "pinia";
import { ref, computed } from "vue";
import * as authService from "@/services/auth";

export const useAuthStore = defineStore("auth", () => {
  // State
  const user = ref(null);
  const loading = ref(true);
  const error = ref(null);

  // Getters
  const isAuthenticated = computed(() => !!user.value);
  const userEmail = computed(() => user.value?.email || null);
  const userId = computed(() => user.value?.uid || null);

  // Actions
  const login = async (email, password) => {
    try {
      error.value = null;
      loading.value = true;
      const currentUser = await authService.loginWithEmail(email, password);
      user.value = currentUser;
      return true;
    } catch (err) {
      error.value = getErrorMessage(err.code);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const logout = async () => {
    try {
      error.value = null;
      await authService.logout();
      user.value = null;
    } catch (err) {
      error.value = "Erreur lors de la déconnexion";
      throw err;
    }
  };

  const initAuth = () => {
    return new Promise((resolve) => {
      authService.onAuthChange((currentUser) => {
        user.value = currentUser;
        loading.value = false;
        resolve(currentUser);
      });
    });
  };

  const clearError = () => {
    error.value = null;
  };

  // Helper to get user-friendly error messages
  const getErrorMessage = (errorCode) => {
    switch (errorCode) {
      case "auth/invalid-email":
        return "Adresse email invalide";
      case "auth/user-disabled":
        return "Ce compte a été désactivé";
      case "auth/user-not-found":
        return "Aucun compte trouvé avec cet email";
      case "auth/wrong-password":
        return "Mot de passe incorrect";
      case "auth/invalid-credential":
        return "Email ou mot de passe incorrect";
      case "auth/too-many-requests":
        return "Trop de tentatives. Réessayez plus tard";
      case "auth/network-request-failed":
        return "Erreur réseau. Vérifiez votre connexion";
      default:
        return "Erreur de connexion. Réessayez";
    }
  };

  return {
    // State
    user,
    loading,
    error,
    // Getters
    isAuthenticated,
    userEmail,
    userId,
    // Actions
    login,
    logout,
    initAuth,
    clearError,
  };
});
