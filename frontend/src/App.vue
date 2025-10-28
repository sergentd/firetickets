<template>
  <div id="app" class="min-h-screen flex flex-col">
    <!-- Global Search Modal -->
    <GlobalSearch v-if="isAuthenticated" ref="globalSearch" />

    <!-- Global Header (only show when authenticated) -->
    <AppHeader
      v-if="isAuthenticated"
      @toggle-favorites="handleToggleFavorites"
      @toggle-theme="handleToggleTheme"
      @open-search="openSearch"
    />

    <!-- Main Content Area -->
    <main class="flex-1">
      <router-view />
    </main>

    <!-- Global Footer (only show when authenticated) -->
    <AppFooter
      v-if="isAuthenticated"
      :tools-count="catalogStore?.toolCount || 0"
      :categories-count="Object.keys(catalogStore?.categories || {}).length"
      :version="appVersion"
      @toggle-theme="handleToggleTheme"
      @show-about="handleShowAbout"
      @show-help="handleShowHelp"
      @show-changelog="handleShowChangelog"
    />

    <!-- Global Modals/Overlays -->
    <div
      v-if="showAboutModal"
      class="modal-overlay"
      @click="showAboutModal = false"
    >
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3 class="text-xl font-bold text-white">À propos</h3>
          <button @click="showAboutModal = false" class="modal-close-btn">
            <svg
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div class="modal-body">
          <p class="text-gray-300 mb-4">
            UI Tools Atelier est une collection d'outils interactifs pour le
            développement web, conçue pour simplifier et accélérer votre
            workflow de développement.
          </p>
          <p class="text-gray-400 text-sm">
            Développé avec Vue 3, Tailwind CSS et beaucoup d'amour pour la
            communauté des développeurs.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useCatalogStore } from "@/stores/catalog";
import { onAuthChange } from "@/services/auth";

// Components
import AppHeader from "@/components/ui/AppHeader.vue";
import AppFooter from "@/components/ui/AppFooter.vue";
import GlobalSearch from "@/components/search/GlobalSearch.vue";

// Store
const catalogStore = useCatalogStore();

// App state
const appVersion = ref("1.0.0");
const showAboutModal = ref(false);
const globalSearch = ref(null);
const isAuthenticated = ref(false);
let unsubscribeAuth = null;

// Listen to authentication state changes
onMounted(() => {
  unsubscribeAuth = onAuthChange((user) => {
    isAuthenticated.value = !!user;
  });
});

onUnmounted(() => {
  if (unsubscribeAuth) {
    unsubscribeAuth();
  }
});

// Event handlers
const handleToggleFavorites = () => {
  // TODO: Implement favorites toggle
  console.log("Toggle favorites");
};

const handleToggleTheme = () => {
  // TODO: Implement theme toggle
  console.log("Toggle theme");
};

const openSearch = () => {
  globalSearch.value?.open();
};

const handleShowAbout = () => {
  showAboutModal.value = true;
};

const handleShowHelp = () => {
  // TODO: Implement help modal or navigate to help page
  console.log("Show help");
};

const handleShowChangelog = () => {
  // TODO: Implement changelog modal or navigate to changelog page
  console.log("Show changelog");
};
</script>

<style scoped>
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Modal styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(4px);
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.modal-content {
  background: var(--bg-card);
  border: 1px solid var(--border-primary);
  border-radius: 1rem;
  max-width: 500px;
  width: 100%;
  box-shadow: var(--shadow-primary);
  backdrop-filter: blur(20px);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: between;
  padding: 1.5rem 1.5rem 0 1.5rem;
}

.modal-close-btn {
  color: var(--text-secondary);
  padding: 0.5rem;
  border-radius: 0.5rem;
  transition: all 0.2s;
}

.modal-close-btn:hover {
  color: var(--text-primary);
  background: var(--bg-secondary);
}

.modal-body {
  padding: 1.5rem;
}
</style>
