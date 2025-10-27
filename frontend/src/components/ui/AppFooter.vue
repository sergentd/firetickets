<template>
  <footer class="app-footer">
    <UIContainer>
      <div class="footer-content">
        <!-- Main Footer Content -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
          <!-- Brand Section -->
          <div class="space-y-4">
            <div class="flex items-center space-x-3">
              <div class="relative">
                <svg
                  class="w-8 h-8"
                  viewBox="0 0 40 40"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <!-- Background circle -->
                  <circle cx="20" cy="20" r="20" fill="#1e293b" />

                  <!-- Concentric circles target -->
                  <circle
                    cx="20"
                    cy="20"
                    r="15"
                    fill="none"
                    stroke="#ff5370"
                    stroke-width="2"
                  />
                  <circle
                    cx="20"
                    cy="20"
                    r="10"
                    fill="none"
                    stroke="#0EA5E9"
                    stroke-width="2"
                  />

                  <!-- UI Text -->
                  <text
                    x="20"
                    y="26"
                    text-anchor="middle"
                    class="fill-white font-bold"
                    style="
                      font-size: 14px;
                      font-family:
                        system-ui,
                        -apple-system,
                        sans-serif;
                    "
                  >
                    UI
                  </text>
                </svg>
              </div>
              <div>
                <h3 class="text-lg font-bold text-white">UI Tools</h3>
                <p class="text-xs text-gray-400">Atelier de développement</p>
              </div>
            </div>
            <p class="text-gray-400 text-sm leading-relaxed">
              Collection d'outils interactifs pour simplifier et accélérer votre
              workflow de développement web.
            </p>
          </div>

          <!-- Navigation Links -->
          <div class="space-y-4">
            <h4
              class="text-white font-semibold text-sm uppercase tracking-wider"
            >
              Navigation
            </h4>
            <nav class="flex flex-col space-y-2">
              <router-link to="/" class="footer-link">
                Catalogue des outils
              </router-link>
              <router-link to="/components" class="footer-link">
                Bibliothèque de composants
              </router-link>
            </nav>
          </div>

          <!-- Quick Stats -->
          <div class="space-y-4">
            <h4
              class="text-white font-semibold text-sm uppercase tracking-wider"
            >
              Statistiques
            </h4>
            <div class="grid grid-cols-2 gap-4">
              <div class="stat-card">
                <div class="text-electric-blue text-lg font-bold">
                  {{ toolsCount }}
                </div>
                <div class="text-gray-400 text-xs">Outils disponibles</div>
              </div>
              <div class="stat-card">
                <div class="text-electric-blue text-lg font-bold">
                  {{ categoriesCount }}
                </div>
                <div class="text-gray-400 text-xs">Catégories</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Bottom Bar -->
        <div
          class="pt-6 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0"
        >
          <div class="text-gray-400 text-sm">
            &copy; {{ currentYear }} UI Tools Atelier. Développé avec ❤️ pour la
            communauté.
          </div>

          <div class="flex items-center space-x-6">
            <!-- GitHub Link -->
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              class="footer-icon-btn"
              title="Voir sur GitHub"
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
                />
              </svg>
            </a>

            <!-- Version Info -->
            <div class="text-xs text-gray-500">v{{ version }}</div>
          </div>
        </div>
      </div>
    </UIContainer>
  </footer>
</template>

<script setup>
import { computed } from "vue";
import { UIContainer } from "@/components/ui";

// Props
const props = defineProps({
  toolsCount: {
    type: Number,
    default: 0,
  },
  categoriesCount: {
    type: Number,
    default: 0,
  },
  version: {
    type: String,
    default: "1.0.0",
  },
});

// No events needed anymore

// Computed
const currentYear = computed(() => new Date().getFullYear());
</script>

<style scoped>
.app-footer {
  background: var(--glass-dark);
  backdrop-filter: blur(var(--blur-md));
  border-top: 1px solid var(--border-primary);
  margin-top: var(--space-xl);
}

.footer-content {
  padding: var(--space-2xl) 0;
}

.footer-link {
  color: var(--text-secondary);
  font-size: var(--text-sm);
  transition: all var(--duration-normal) var(--easing-ease);
}

.footer-link:hover {
  color: var(--electric-blue);
  transform: translateX(var(--space-xs));
}

.stat-card {
  padding: var(--space-md);
  border-radius: var(--radius-md);
  border: 1px solid var(--border-secondary);
  background: var(--glass-light);
}

.footer-icon-btn {
  padding: var(--space-sm);
  border-radius: var(--radius-md);
  color: var(--text-secondary);
  transition: all var(--duration-normal) var(--easing-ease);
}

.footer-icon-btn:hover {
  color: var(--electric-blue);
  background: var(--glass-light);
}
</style>
