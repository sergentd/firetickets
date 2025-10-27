<template>
  <header class="tool-header">
    <!-- Full-width dark header with background image support -->
    <div class="header-container">
      <!-- Background overlay for future images -->
      <div class="header-background">
        <!-- Future: background image will go here -->
        <div class="background-overlay"></div>
      </div>

      <!-- Header content -->
      <UIContainer class="header-content">
        <!-- Top navigation bar -->
        <div class="nav-bar">
          <!-- Left side: Return button -->
          <div class="nav-start">
            <router-link to="/" class="return-button">
              <div class="button-background">
                <IconSystem name="arrow-left" size="sm" />
              </div>
              <span class="button-text">{{ backButtonText }}</span>
            </router-link>
          </div>

          <!-- Center: Tool icon -->
          <div v-if="icon" class="nav-center">
            <div class="tool-icon">
              <IconSystem :name="icon" size="xl" variant="electric" />
            </div>
          </div>

          <!-- Right side: Category badge -->
          <div v-if="category" class="nav-end">
            <span class="category-badge">
              {{ categoryDisplayName }}
            </span>
          </div>
        </div>

        <!-- Main title section -->
        <div class="title-section">
          <!-- Title -->
          <h1 class="tool-title">{{ title }}</h1>

          <!-- Description -->
          <p v-if="description" class="tool-description">
            {{ description }}
          </p>

          <!-- Additional content slot -->
          <div v-if="$slots.content" class="additional-content">
            <slot name="content" />
          </div>
        </div>

        <!-- Optional actions at bottom -->
        <div v-if="$slots.actions" class="actions-section">
          <slot name="actions" />
        </div>
      </UIContainer>
    </div>
  </header>
</template>

<script setup>
import { computed } from "vue";
import IconSystem from "@/components/ui/IconSystem.vue";
import UIContainer from "@/components/ui/base/UIContainer.vue";

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: "",
  },
  icon: {
    type: String,
    default: "",
  },
  category: {
    type: String,
    default: "",
  },
  status: {
    type: String,
    default: "",
  },
  backButtonText: {
    type: String,
    default: "Retour aux outils",
  },
  showBadges: {
    type: Boolean,
    default: false,
  },
});

// Category display names mapping
const categoryNames = {
  theming: "Théming & Couleurs",
  reference: "Références & Documentation",
  dashboard: "Tableaux de Bord",
  evaluation: "Évaluation & Profils",
  visualization: "Visualisation",
};

const categoryDisplayName = computed(() => {
  return categoryNames[props.category] || props.category;
});
</script>

<style scoped>
.tool-header {
  position: relative;
  width: 100vw;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;
  animation: slideDown var(--duration-slow) var(--easing-default);
}

.header-container {
  min-height: 140px;
  position: relative;
  overflow: hidden;
  margin-bottom: var(--space-6);
}

.header-background {
  position: absolute;
  inset: 0;
  background: var(--bg-primary);
  background-size: 400% 400%;
  animation: gradientShift var(--duration-ultra-slow) var(--easing-default)
    infinite;
}

.background-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgba(0, 0, 0, 0.3) 0%,
    rgba(0, 0, 0, 0.1) 100%
  );
}

.header-content {
  position: relative;
  z-index: var(--z-modal-content);
  padding: var(--space-8) var(--space-6);
}

/* Navigation bar */
.nav-bar {
  display: flex;
  align-items: center;
  margin-bottom: var(--space-4);
}

.nav-start {
  flex: 1;
  display: flex;
  align-items: center;
}

.nav-center {
  flex: 1;
  display: flex;
  justify-content: center;
}

.nav-end {
  flex: 1;
  display: flex;
  justify-content: flex-end;
}

.return-button {
  display: inline-flex;
  align-items: center;
  gap: var(--space-3);
  color: var(--text-primary);
  text-decoration: none;
  transition: var(--transition-default);
}

.return-button:hover {
  transform: translateX(calc(-1 * var(--space-1)));
}

.button-background {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-3);
  background: var(--glass-bg-lighter);
  backdrop-filter: blur(var(--blur-md));
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  transition: var(--transition-default);
}

.return-button:hover .button-background {
  background: var(--glass-bg-light);
  box-shadow: var(--shadow-hover);
  transform: scale(1.05);
}

.button-text {
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
}

/* Title section */
.title-section {
  margin-top: var(--space-8);
  text-align: center;
}

.tool-icon {
  text-shadow: 0 0 var(--space-4) var(--electric-blue);
  filter: drop-shadow(var(--shadow-md));
  animation: float var(--duration-ultra-slow) var(--easing-smooth) infinite;
}

.tool-title {
  font-size: var(--text-5xl);
  font-weight: var(--font-bold);
  color: var(--text-primary);
  margin-bottom: var(--space-4);
  letter-spacing: -0.025em;
  text-shadow: var(--shadow-lg);
  background: linear-gradient(
    135deg,
    var(--text-primary) 0%,
    var(--text-secondary) 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.tool-description {
  font-size: var(--text-xl);
  font-weight: var(--font-medium);
  color: rgba(255, 255, 255, 0.9);
  line-height: var(--leading-relaxed);
  margin-bottom: var(--space-6);
  max-width: 48rem;
  margin-left: auto;
  margin-right: auto;
  text-shadow: var(--shadow-md);
}

.additional-content {
  margin-top: var(--space-6);
}

.actions-section {
  margin-top: var(--space-8);
  display: flex;
  justify-content: center;
}

.category-badge {
  background: var(--electric-blue);
  color: var(--bg-primary);
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-full);
  font-weight: var(--font-semibold);
  font-size: var(--text-sm);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* Animations */
@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(calc(-1 * var(--space-8)));
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes gradientShift {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(calc(-1 * var(--space-2)));
  }
}

/* Mobile responsive */
@media (max-width: 768px) {
  .header-content {
    padding: var(--space-6) var(--space-4);
  }

  .nav-bar {
    margin-bottom: var(--space-6);
    flex-direction: column;
    gap: var(--space-4);
  }

  .nav-start,
  .nav-center,
  .nav-end {
    flex: none;
    width: 100%;
    justify-content: center;
  }

  .return-button {
    justify-content: center;
  }

  .button-text {
    font-size: var(--text-base);
  }

  .category-badge {
    padding: var(--space-2) var(--space-6);
    font-size: var(--text-base);
  }

  .tool-title {
    font-size: var(--text-4xl);
    margin-bottom: var(--space-4);
  }

  .tool-description {
    font-size: var(--text-lg);
    margin-bottom: var(--space-6);
  }
}

@media (max-width: 480px) {
  .header-container {
    min-height: 120px;
  }

  .header-content {
    padding: var(--space-4) var(--space-3);
  }

  .nav-bar {
    gap: var(--space-3);
  }

  .tool-title {
    font-size: var(--text-3xl);
  }

  .tool-description {
    font-size: var(--text-base);
  }
}

/* Future: Background image support */
.header-background.with-image {
  background-image: var(--header-bg-image);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.header-background.with-image .background-overlay {
  background: linear-gradient(
    135deg,
    rgba(0, 0, 0, 0.6) 0%,
    rgba(0, 0, 0, 0.3) 100%
  );
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .tool-header,
  .header-background,
  .return-button,
  .button-background,
  .tool-icon {
    animation: none;
    transition: none;
  }
}
</style>
