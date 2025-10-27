<template>
  <div
    class="preview-card"
    :style="{ color: textColor, background: backgroundColor }"
  >
    <div class="ratio-display">{{ ratio.toFixed(2) }}:1</div>
    <div class="ratio-label">Ratio de Contraste</div>
    <div class="status-badges">
      <span v-if="ratio >= 4.5" class="status-badge status-aa">AA ✓</span>
      <span v-if="ratio >= 7" class="status-badge status-aaa">AAA ✓</span>
      <span v-if="ratio < 4.5" class="status-badge status-fail"
        >Non conforme</span
      >
    </div>
  </div>
</template>

<script setup>
defineProps({
  textColor: String,
  backgroundColor: String,
  ratio: Number,
});
</script>

<style scoped>
.preview-card {
  border-radius: var(--radius-lg);
  padding: var(--space-8);
  min-height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  transition: var(--duration-normal) var(--easing-ease);
  border: 2px solid rgba(255, 255, 255, 0.2);
}

.ratio-display {
  font-size: 3rem;
  font-weight: var(--font-bold);
  margin-bottom: var(--space-2);
}

.ratio-label {
  font-size: var(--text-lg);
  opacity: 0.8;
  margin-bottom: var(--space-4);
}

.status-badges {
  display: flex;
  gap: var(--space-2);
  flex-wrap: wrap;
  justify-content: center;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-full);
  font-weight: var(--font-semibold);
  font-size: var(--text-sm);
}

.status-fail {
  background: var(--color-danger);
  color: var(--text-inverse);
}

.status-aa {
  background: var(--electric-blue);
  color: var(--text-inverse);
}

.status-aaa {
  background: var(--color-success);
  color: var(--text-inverse);
}
</style>
