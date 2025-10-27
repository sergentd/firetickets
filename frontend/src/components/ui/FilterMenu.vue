<template>
  <div class="filter-menu">
    <!-- All button -->
    <UIButton
      variant="filter"
      size="sm"
      icon="all"
      :active="activeFilter === 'all'"
      @click="handleFilterChange('all')"
    >
      Tous
    </UIButton>

    <!-- Favorites Button (always visible) -->
    <UIButton
      variant="filter"
      size="sm"
      icon="favorites"
      :active="activeFilter === 'favorites'"
      @click="handleFilterChange('favorites')"
    >
      Favoris ({{ favoritesCount }})
    </UIButton>

    <!-- Category buttons -->
    <UIButton
      v-for="[key, category] in availableCategories"
      :key="key"
      variant="filter"
      size="sm"
      :icon="category.icon"
      :active="activeFilter === key"
      @click="handleFilterChange(key)"
    >
      {{ category.name }}
    </UIButton>
  </div>
</template>

<script setup>
import UIButton from "@/components/ui/base/UIButton.vue";

const props = defineProps({
  categories: {
    type: Object,
    required: true,
  },
  activeFilter: {
    type: String,
    default: "all",
  },
  availableCategories: {
    type: Array,
    required: true,
  },
  favoritesCount: {
    type: Number,
    default: 0,
  },
});

const emit = defineEmits(["filter-change"]);

const handleFilterChange = (filter) => {
  emit("filter-change", filter);
};
</script>

<style scoped>
.filter-menu {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--space-3);
  margin-bottom: var(--space-8);
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .filter-menu {
    gap: var(--space-2);
  }
}
</style>
