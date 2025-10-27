<template>
  <div class="quick-colors-wrapper">
    <label class="quick-colors-label">Couleurs rapides</label>
    <div class="quick-colors">
      <div
        v-for="color in colors"
        :key="color"
        class="quick-color"
        :style="{ background: color }"
        :title="`Utiliser ${color}`"
        @click="$emit('select-color', color)"
      >
        <span class="color-value">{{ color }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  colors: Array,
});

defineEmits(["select-color"]);
</script>

<style scoped>
.quick-colors-wrapper {
  margin-top: var(--space-3);
}

.quick-colors-label {
  display: block;
  font-size: var(--text-xs);
  color: var(--text-tertiary);
  margin-bottom: var(--space-2);
  font-weight: var(--font-medium);
}

.quick-colors {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(40px, 1fr));
  gap: var(--space-2);
}

.quick-color {
  position: relative;
  width: 40px;
  height: 40px;
  border-radius: var(--radius-md);
  cursor: pointer;
  border: 2px solid var(--border-primary);
  transition: var(--duration-fast) var(--easing-ease);
  overflow: hidden;
}

.quick-color:hover {
  transform: scale(1.1);
  border-color: var(--electric-blue);
  box-shadow: 0 0 0 3px rgba(0, 212, 255, 0.2);
}

.quick-color:active {
  transform: scale(0.95);
}

.color-value {
  position: absolute;
  bottom: -20px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 9px;
  color: var(--text-tertiary);
  white-space: nowrap;
  opacity: 0;
  transition: var(--duration-fast) var(--easing-ease);
  pointer-events: none;
  background: var(--bg-secondary);
  padding: 2px 4px;
  border-radius: var(--radius-sm);
}

.quick-color:hover .color-value {
  bottom: -22px;
  opacity: 1;
}
</style>
