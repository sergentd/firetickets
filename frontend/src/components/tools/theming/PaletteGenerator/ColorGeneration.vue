<template>
  <div class="color-generation space-y-4">
    <div class="flex items-center gap-4">
      <input
        type="color"
        class="color-picker"
        :value="baseColor"
        @input="$emit('update:base-color', $event.target.value)"
      />
      <label class="font-medium text-white">Couleur de base</label>
    </div>

    <div class="flex items-center gap-2">
      <select
        class="generation-select"
        :value="generationMode"
        @change="$emit('update:generation-mode', $event.target.value)"
      >
        <option value="monochromatic">Monochrome</option>
        <option value="analogous">Analogue</option>
        <option value="complementary">Complémentaire</option>
        <option value="triadic">Triadique</option>
      </select>
      <button @click="$emit('generate')" class="generate-btn">Générer</button>
    </div>

    <!-- Mode explanations -->
    <div class="mode-info">
      <div v-if="generationMode === 'monochromatic'" class="info-text">
        <strong>Monochrome:</strong> Variations de luminosité de la même couleur
      </div>
      <div v-if="generationMode === 'analogous'" class="info-text">
        <strong>Analogue:</strong> Couleurs adjacentes sur le cercle chromatique
      </div>
      <div v-if="generationMode === 'complementary'" class="info-text">
        <strong>Complémentaire:</strong> Couleurs opposées sur le cercle
        chromatique
      </div>
      <div v-if="generationMode === 'triadic'" class="info-text">
        <strong>Triadique:</strong> Trois couleurs équidistantes sur le cercle
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  baseColor: {
    type: String,
    required: true,
  },
  generationMode: {
    type: String,
    required: true,
  },
});

const emit = defineEmits([
  "update:base-color",
  "update:generation-mode",
  "generate",
]);
</script>

<style scoped>
.color-picker {
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  padding: 0;
  transition: transform 0.2s ease;
  -webkit-appearance: none;
  appearance: none;
}

.color-picker:hover {
  transform: scale(1.1);
}

.color-picker::-webkit-color-swatch-wrapper {
  padding: 0;
}

.color-picker::-webkit-color-swatch {
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
}

.generation-select {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 14px;
  flex: 1;
  cursor: pointer;
}

.generation-select:focus {
  outline: none;
  border-color: rgba(255, 255, 255, 0.5);
  box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.3);
}

.generation-select option {
  background: #374151;
  color: white;
}

.generate-btn {
  background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.generate-btn:hover {
  background: linear-gradient(135deg, #0891b2 0%, #0e7490 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(6, 182, 212, 0.4);
}

.mode-info {
  margin-top: 12px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
}

.info-text {
  color: rgba(255, 255, 255, 0.8);
  font-size: 12px;
  line-height: 1.4;
}

.info-text strong {
  color: rgba(255, 255, 255, 0.95);
}
</style>
