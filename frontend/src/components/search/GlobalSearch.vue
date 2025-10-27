<template>
  <Teleport to="body">
    <Transition name="search-fade">
      <div v-if="isOpen" class="search-overlay" @click.self="close">
        <div class="search-modal glass-modal">
          <!-- Search Header -->
          <div class="search-header">
            <svg
              class="search-icon"
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
            <input
              ref="searchInput"
              v-model="query"
              type="text"
              placeholder="Rechercher dans la documentation..."
              class="search-input"
              @keydown.esc="close"
              @keydown.down.prevent="selectNext"
              @keydown.up.prevent="selectPrevious"
              @keydown.enter.prevent="navigateToSelected"
            />
            <kbd class="search-shortcut">Esc</kbd>
          </div>

          <!-- Search Results -->
          <div v-if="query" class="search-results">
            <div v-if="isSearching" class="search-loading">
              <div class="spinner"></div>
              Recherche en cours...
            </div>

            <div v-else-if="groupedResults.length === 0" class="search-empty">
              <svg
                class="empty-icon"
                xmlns="http://www.w3.org/2000/svg"
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
              <h3>Aucun résultat pour "{{ query }}"</h3>
              <p>Essayez des termes plus généraux ou vérifiez l'orthographe</p>
            </div>

            <div v-else class="search-results-list">
              <SearchResultGroup
                v-for="(group, index) in groupedResults"
                :key="group.toolId"
                :group="group"
                :selected-index="selectedIndex"
                :group-start-index="getGroupStartIndex(index)"
                @select="navigateToResult"
              />
            </div>
          </div>

          <!-- Recent Searches (when no query) -->
          <div v-else class="search-recent">
            <h4 class="recent-title">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              Recherches récentes
            </h4>
            <div v-if="recentSearches.length > 0" class="recent-list">
              <button
                v-for="recent in recentSearches"
                :key="recent"
                class="recent-item"
                @click="query = recent"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.35-4.35"></path>
                </svg>
                {{ recent }}
              </button>
            </div>
            <div v-else class="recent-empty">
              <p>Aucune recherche récente</p>
            </div>
          </div>

          <!-- Footer -->
          <div class="search-footer">
            <div class="search-hints">
              <kbd>↑↓</kbd> Navigation <kbd>Enter</kbd> Ouvrir
              <kbd>Esc</kbd> Fermer
            </div>
            <div class="search-stats">{{ totalResults }} résultat(s)</div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch, nextTick } from "vue";
import { useRouter } from "vue-router";
import { useSearchIndexStore } from "@/stores/searchIndex";
import { useMagicKeys, useLocalStorage, refDebounced } from "@vueuse/core";
import SearchResultGroup from "./SearchResultGroup.vue";

const router = useRouter();
const searchStore = useSearchIndexStore();

// State
const isOpen = ref(false);
const query = ref("");
const selectedIndex = ref(0);
const isSearching = ref(false);
const searchInput = ref(null);
const recentSearches = useLocalStorage("search-history", []);

// Keyboard shortcuts
const keys = useMagicKeys();
const cmdK = keys["Meta+K"];
const ctrlK = keys["Ctrl+K"];

watch([cmdK, ctrlK], ([cmd, ctrl]) => {
  if (cmd || ctrl) {
    open();
  }
});

// Debounced search query
const debouncedQuery = refDebounced(query, 300);

// Search with debouncing
const groupedResults = computed(() => {
  if (!debouncedQuery.value) return [];
  return searchStore.search(debouncedQuery.value, { groupByTool: true });
});

const totalResults = computed(() => {
  return groupedResults.value.reduce((total, group) => {
    return total + group.results.length;
  }, 0);
});

// Methods
const open = () => {
  isOpen.value = true;
  nextTick(() => {
    searchInput.value?.focus();
  });
};

const close = () => {
  isOpen.value = false;
  query.value = "";
  selectedIndex.value = 0;
};

const selectNext = () => {
  if (selectedIndex.value < totalResults.value - 1) {
    selectedIndex.value++;
  }
};

const selectPrevious = () => {
  if (selectedIndex.value > 0) {
    selectedIndex.value--;
  }
};

const navigateToResult = async (result) => {
  try {
    console.log("[Search] Navigating to result:", result);

    // Add to recent searches
    const searches = recentSearches.value;
    const filtered = searches.filter((s) => s !== query.value);
    recentSearches.value = [query.value, ...filtered].slice(0, 10);

    // Close modal first for better UX
    close();

    // Navigate to tool route
    const needsNavigation = router.currentRoute.value.path !== result.route;
    console.log(
      "[Search] Needs navigation:",
      needsNavigation,
      "Current:",
      router.currentRoute.value.path,
      "Target:",
      result.route,
    );

    if (needsNavigation) {
      await router.push(result.route);
      // Give more time for new component to mount and render
      await nextTick();
      await new Promise((resolve) => setTimeout(resolve, 500));
    } else {
      // Same page, just need to scroll
      await nextTick();
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    // Find target element with retry logic
    console.log("[Search] Looking for element with ID:", result.id);
    let element = document.getElementById(result.id);
    let retries = 0;
    const maxRetries = 5;

    while (!element && retries < maxRetries) {
      console.log(
        `[Search] Element not found, retry ${retries + 1}/${maxRetries}`,
      );
      await new Promise((resolve) => setTimeout(resolve, 200));
      element = document.getElementById(result.id);
      retries++;
    }

    if (element) {
      console.log("[Search] Element found! Scrolling and highlighting...");
      // Scroll to element
      element.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "nearest",
      });

      // Highlight element after scroll
      setTimeout(() => {
        highlightElement(element);
      }, 300);
    } else {
      console.warn(`[Search] Could not find element with id: ${result.id}`);
      console.log(
        "[Search] Available IDs on page:",
        Array.from(document.querySelectorAll("[id]")).map((el) => el.id),
      );
    }
  } catch (error) {
    console.error("[Search] Navigation error:", error);
  }
};

const navigateToSelected = () => {
  const flatResults = groupedResults.value.flatMap((g) => g.results);
  const result = flatResults[selectedIndex.value];
  if (result) {
    navigateToResult(result);
  }
};

const highlightElement = (element) => {
  element.classList.add("search-highlight");

  const pulseAnimation = element.animate(
    [
      {
        backgroundColor: "rgba(0, 212, 255, 0.3)",
        outline: "2px solid rgba(0, 212, 255, 0.6)",
      },
      {
        backgroundColor: "rgba(0, 212, 255, 0.1)",
        outline: "2px solid rgba(0, 212, 255, 0.3)",
      },
      {
        backgroundColor: "rgba(0, 212, 255, 0.3)",
        outline: "2px solid rgba(0, 212, 255, 0.6)",
      },
      { backgroundColor: "transparent", outline: "2px solid transparent" },
    ],
    {
      duration: 2000,
      easing: "ease-in-out",
    },
  );

  pulseAnimation.onfinish = () => {
    element.classList.remove("search-highlight");
  };
};

const getGroupStartIndex = (groupIndex) => {
  return groupedResults.value
    .slice(0, groupIndex)
    .reduce((sum, group) => sum + group.results.length, 0);
};

// Expose open/close for external control
defineExpose({ open, close });
</script>

<style scoped>
.search-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  z-index: 9999;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 10vh;
}

.search-modal {
  width: 90%;
  max-width: 640px;
  max-height: 70vh;
  background: rgba(17, 24, 39, 0.95);
  backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
}

.search-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.search-icon {
  color: rgba(255, 255, 255, 0.4);
  flex-shrink: 0;
}

.search-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: #fff;
  font-size: 16px;
}

.search-input::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

.search-shortcut {
  padding: 4px 8px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
  font-family: monospace;
}

.search-results {
  flex: 1;
  overflow-y: auto;
  padding: 12px;
}

.search-results-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.search-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 40px;
  color: rgba(255, 255, 255, 0.6);
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(0, 212, 255, 0.2);
  border-top-color: rgba(0, 212, 255, 1);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.search-empty {
  padding: 60px 40px;
  text-align: center;
  color: rgba(255, 255, 255, 0.4);
}

.empty-icon {
  margin: 0 auto 16px;
  opacity: 0.3;
}

.search-empty h3 {
  font-size: 18px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 8px;
}

.search-empty p {
  font-size: 14px;
}

.search-recent {
  padding: 20px;
  min-height: 200px;
}

.recent-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: rgba(255, 255, 255, 0.4);
  margin-bottom: 12px;
}

.recent-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.recent-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid transparent;
  border-radius: 8px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s;
}

.recent-item:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(0, 212, 255, 0.3);
  color: #fff;
}

.recent-empty {
  padding: 40px;
  text-align: center;
  color: rgba(255, 255, 255, 0.3);
}

.search-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 12px;
  color: rgba(255, 255, 255, 0.4);
}

.search-hints {
  display: flex;
  gap: 12px;
}

.search-hints kbd {
  padding: 2px 6px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  font-family: monospace;
}

.search-fade-enter-active,
.search-fade-leave-active {
  transition: opacity 0.2s ease-out;
}

.search-fade-enter-from,
.search-fade-leave-to {
  opacity: 0;
}

.search-fade-enter-active .search-modal {
  animation: slideDown 0.3s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
