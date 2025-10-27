<template>
  <button
    class="search-result"
    :class="{ 'is-selected': isSelected }"
    @click="$emit('select', result)"
  >
    <div class="result-content">
      <div class="result-main">
        <h4 class="result-title">{{ result.title }}</h4>
        <p class="result-context">{{ result.context }}</p>
      </div>

      <div class="result-snippet" v-if="result.content">
        {{ truncate(result.content, 120) }}
      </div>
    </div>

    <svg
      class="result-arrow"
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
      <polyline points="9 18 15 12 9 6"></polyline>
    </svg>
  </button>
</template>

<script setup>
const props = defineProps({
  result: {
    type: Object,
    required: true,
  },
  isSelected: {
    type: Boolean,
    default: false,
  },
});

defineEmits(["select"]);

const truncate = (text, length) => {
  if (!text) return "";
  if (text.length <= length) return text;

  const truncated = text.slice(0, length);
  const lastSpace = truncated.lastIndexOf(" ");

  return lastSpace > 0
    ? truncated.slice(0, lastSpace) + "..."
    : truncated + "...";
};
</script>

<style scoped>
.search-result {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid transparent;
  border-radius: 8px;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s;
  width: 100%;
}

.search-result:hover,
.search-result.is-selected {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(0, 212, 255, 0.3);
  transform: translateX(4px);
}

.search-result.is-selected {
  border-color: rgba(0, 212, 255, 0.5);
  box-shadow: 0 0 20px rgba(0, 212, 255, 0.1);
}

.result-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
}

.result-main {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.result-title {
  font-size: 14px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.result-context {
  font-size: 11px;
  color: rgba(0, 212, 255, 0.6);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.result-snippet {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
  line-height: 1.5;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.result-arrow {
  flex-shrink: 0;
  color: rgba(255, 255, 255, 0.3);
  transition: all 0.2s;
}

.search-result:hover .result-arrow,
.search-result.is-selected .result-arrow {
  color: rgba(0, 212, 255, 0.8);
  transform: translateX(4px);
}
</style>
