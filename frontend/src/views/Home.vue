<template>
  <div class="min-h-screen py-8">
    <div class="container mx-auto px-4 max-w-7xl">
      <!-- Header Section -->
      <div class="text-center mb-6">
        <h1 class="text-3xl md:text-4xl font-bold text-white mb-2">
          <span class="text-electric-blue">UI</span> Tools
        </h1>
        <p class="text-base text-gray-300">
          Collection d'outils interactifs pour le développement web
        </p>
      </div>

      <!-- Filter Menu -->
      <FilterMenu
        :categories="categories"
        :active-filter="activeFilter"
        :available-categories="availableCategories"
        @filter-change="handleFilterChange"
        :favorites-count="favoritesCount"
      />

      <!-- Search Bar -->
      <div class="max-w-md mx-auto mb-8">
        <UIInput
          v-model="searchQuery"
          type="text"
          placeholder="Rechercher un outil..."
          class="search-input"
        >
          <template #prefix>
            <svg
              class="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </template>
        </UIInput>
      </div>

      <!-- Tools Grid -->
      <div
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto"
      >
        <ToolCard
          v-for="tool in filteredTools"
          :key="`${getCategoryForTool(tool)}-${tool.id}`"
          :tool="tool"
          :category="getCategoryForTool(tool)"
          :use-router="false"
          class="w-full"
        />
      </div>

      <!-- Empty State -->
      <div v-if="filteredTools.length === 0" class="text-center py-12">
        <UISection variant="glass" class="max-w-md mx-auto">
          <div class="mb-4 flex justify-center">
            <IconSystem name="search" size="2xl" variant="electric" />
          </div>
          <h3 class="text-xl font-semibold text-white mb-2">
            Aucun outil trouvé
          </h3>
          <p class="text-gray-300 mb-4">
            {{
              searchQuery
                ? "Essayez avec d'autres mots-clés"
                : "Sélectionnez une catégorie différente"
            }}
          </p>
          <UIButton
            v-if="activeFilter !== 'all' || searchQuery"
            @click="clearFilters"
            variant="primary"
            size="md"
          >
            Réinitialiser les filtres
          </UIButton>
        </UISection>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, watch } from "vue";
import { useCatalogStore } from "@/stores/catalog";
import { UISection, UIButton, UIInput } from "@/components/ui";

// Components
import ToolCard from "@/components/ui/ToolCard.vue";
import FilterMenu from "@/components/ui/FilterMenu.vue";
import IconSystem from "@/components/ui/IconSystem.vue";

// Store
const catalogStore = useCatalogStore();

// Computed properties
const filteredTools = computed(() => catalogStore.filteredTools);
const toolCount = computed(() => catalogStore.toolCount);
const categories = computed(() => catalogStore.categories);
const availableCategories = computed(() => catalogStore.availableCategories);
const activeFilter = computed(() => catalogStore.activeFilter);
const favoritesCount = computed(() => catalogStore.favorites.length);
const searchQuery = computed({
  get: () => catalogStore.searchQuery,
  set: (value) => catalogStore.searchTools(value),
});

// Methods
const handleFilterChange = (filter) => {
  catalogStore.setFilter(filter);
};

const clearFilters = () => {
  catalogStore.setFilter("all");
  catalogStore.searchTools("");
};

// Helper to get category for a tool (needed for display)
const getCategoryForTool = (tool) => {
  for (const [categoryKey, tools] of Object.entries(catalogStore.tools)) {
    if (tools.some((t) => t.id === tool.id)) {
      return categoryKey;
    }
  }
  return "unknown";
};

// Watch for search changes to provide better UX
watch(
  searchQuery,
  (newQuery) => {
    // Could add debouncing here if needed for performance
  },
  { immediate: false },
);
</script>

<style scoped>
.search-input {
  border-radius: var(--radius-full, 9999px);
}

/* Smooth transitions for filter changes */
.tool-card {
  animation: fadeIn var(--duration-normal) ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
