<template>
  <div class="space-y-4">
    <div class="info-grid">
      <div class="info-item glass-light">
        <div class="info-item-title">Ratio de Contraste</div>
        <div class="info-item-value">{{ ratio.toFixed(2) }}:1</div>
      </div>
      <div class="info-item glass-light">
        <div class="info-item-title">Niveau AA Normal</div>
        <div class="info-item-value">
          {{ ratio >= 4.5 ? "✅ Conforme" : "❌ Non conforme" }}
        </div>
      </div>
      <div class="info-item glass-light">
        <div class="info-item-title">Niveau AA Large</div>
        <div class="info-item-value">
          {{ ratio >= 3 ? "✅ Conforme" : "❌ Non conforme" }}
        </div>
      </div>
      <div class="info-item glass-light">
        <div class="info-item-title">Niveau AAA</div>
        <div class="info-item-value">
          {{ ratio >= 7 ? "✅ Conforme" : "❌ Non conforme" }}
        </div>
      </div>
    </div>
    <div class="wcag-info glass-light">
      <p class="text-sm text-secondary">
        <strong class="text-primary">WCAG 2.1 :</strong><br />
        • AA Normal : ≥ 4.5:1 (texte standard)<br />
        • AA Large : ≥ 3:1 (texte ≥ 18pt ou gras ≥ 14pt)<br />
        • AAA : ≥ 7:1 (niveau d'excellence)
      </p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  ratio: Number,
});
</script>

<style scoped>
.wcag-info {
  border-radius: var(--radius-md);
  padding: var(--space-4);
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--space-3);
}

.info-item {
  padding: var(--space-3);
  border-radius: var(--radius-md);
  text-align: center;
}

.info-item-title {
  font-size: var(--text-xs);
  color: var(--text-secondary);
  margin-bottom: var(--space-1);
}

.info-item-value {
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  font-size: var(--text-sm);
}
</style>
