<template>
  <div class="result-group">
    <div class="group-header">
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
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
      </svg>
      <h3 class="group-title">{{ group.toolTitle }}</h3>
      <span class="group-count">{{ group.results.length }}</span>
    </div>

    <div class="group-results">
      <SearchResult
        v-for="(result, index) in group.results"
        :key="result.id"
        :result="result"
        :is-selected="groupStartIndex + index === selectedIndex"
        @select="$emit('select', result)"
      />
    </div>
  </div>
</template>

<script setup>
import SearchResult from "./SearchResult.vue";

defineProps({
  group: {
    type: Object,
    required: true,
  },
  selectedIndex: {
    type: Number,
    required: true,
  },
  groupStartIndex: {
    type: Number,
    required: true,
  },
});

defineEmits(["select"]);
</script>

<style scoped>
.result-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.group-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  color: rgba(255, 255, 255, 0.5);
  font-size: 12px;
}

.group-header svg {
  flex-shrink: 0;
}

.group-title {
  flex: 1;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.group-count {
  padding: 2px 8px;
  background: rgba(0, 212, 255, 0.1);
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  color: rgba(0, 212, 255, 0.8);
}

.group-results {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
</style>
