<template>
  <div class="login-page">
    <div class="login-container">
      <!-- Logo/Header -->
      <div class="login-header">
        <IconSystem
          icon="lifebuoy"
          name="lifebuoy"
          size="2xl"
          variant="electric"
        />
      </div>

      <!-- Login Form -->
      <UIGlassCard variant="default" class="login-card">
        <form @submit.prevent="handleLogin" class="login-form">
          <h2 class="form-title">Connexion</h2>

          <!-- Error Message -->
          <div v-if="authStore.error" class="error-message">
            <svg
              class="error-icon"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {{ authStore.error }}
          </div>

          <!-- Email Input -->
          <UIInput
            v-model="email"
            type="email"
            label="Email"
            placeholder="votre-email@example.com"
            required
            autocomplete="email"
            :disabled="authStore.loading"
          />

          <!-- Password Input -->
          <UIInput
            v-model="password"
            type="password"
            label="Mot de passe"
            placeholder="••••••••"
            required
            autocomplete="current-password"
            :disabled="authStore.loading"
          />

          <!-- Login Button -->
          <UIButton
            type="submit"
            variant="primary"
            size="lg"
            block
            :disabled="authStore.loading || !email || !password"
          >
            <span v-if="!authStore.loading">Se connecter</span>
            <span v-else class="loading-spinner">
              <svg class="spinner" viewBox="0 0 24 24">
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                  fill="none"
                />
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Connexion en cours...
            </span>
          </UIButton>
        </form>
      </UIGlassCard>

      <!-- Footer Info -->
      <p class="login-footer">
        Accès réservé. Outil personnel de gestion de tickets.
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { UIGlassCard, UIInput, UIButton } from "@/components/ui";
import IconSystem from "@/components/ui/IconSystem.vue";

const router = useRouter();
const authStore = useAuthStore();

// Form state
const email = ref("");
const password = ref("");

const handleLogin = async () => {
  authStore.clearError();

  try {
    await authStore.login(email.value, password.value);
    // Redirect to ticketing system after successful login
    router.push("/tools/organization/ticketing-system");
  } catch (error) {
    // Error is already set in the store
    console.error("Login failed:", error);
  }
};
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--bg-primary) 0%, #0a0f1a 100%);
  padding: var(--space-6);
}

.login-container {
  width: 100%;
  max-width: 420px;
  animation: fadeIn 0.6s ease-out;
}

.login-header {
  text-align: center;
  margin-bottom: var(--space-8);
}

.login-header svg {
  margin: 0 auto var(--space-4);
}

.login-title {
  font-size: var(--text-3xl);
  font-weight: var(--font-bold);
  color: var(--text-primary);
  margin-bottom: var(--space-2);
  background: linear-gradient(135deg, var(--electric-blue), var(--accent-cyan));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.login-subtitle {
  font-size: var(--text-lg);
  color: var(--text-secondary);
}

.login-card {
  margin-bottom: var(--space-6);
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
}

.form-title {
  font-size: var(--text-2xl);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  text-align: center;
  margin-bottom: var(--space-2);
}

.error-message {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-4);
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: var(--radius-lg);
  color: var(--accent-red);
  font-size: var(--text-sm);
  animation: shake 0.4s ease-in-out;
}

.error-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.login-footer {
  text-align: center;
  font-size: var(--text-sm);
  color: var(--text-tertiary);
}

.loading-spinner {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
}

.spinner {
  width: 20px;
  height: 20px;
  animation: spin 1s linear infinite;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  10%,
  30%,
  50%,
  70%,
  90% {
    transform: translateX(-4px);
  }
  20%,
  40%,
  60%,
  80% {
    transform: translateX(4px);
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
