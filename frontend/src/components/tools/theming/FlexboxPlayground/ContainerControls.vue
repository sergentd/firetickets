<template>
  <div class="space-y-6">
    <!-- Direction & Wrapping -->
    <div class="control-group">
      <div class="control-title">📐 Direction & Wrapping</div>
      <div class="control-row">
        <label class="control-label">Direction:</label>
        <select
          class="control-select"
          :value="container.flexDirection"
          @change="updateProperty('flexDirection', $event.target.value)"
        >
          <option value="row">row</option>
          <option value="row-reverse">row-reverse</option>
          <option value="column">column</option>
          <option value="column-reverse">column-reverse</option>
        </select>
      </div>
      <div class="control-row">
        <label class="control-label">Wrap:</label>
        <select
          class="control-select"
          :value="container.flexWrap"
          @change="updateProperty('flexWrap', $event.target.value)"
        >
          <option value="nowrap">nowrap</option>
          <option value="wrap">wrap</option>
          <option value="wrap-reverse">wrap-reverse</option>
        </select>
      </div>
    </div>

    <!-- Justification & Alignment -->
    <div class="control-group">
      <div class="control-title">⚖️ Justification & Alignement</div>
      <div class="control-row">
        <label class="control-label">Justify Content:</label>
        <select
          class="control-select"
          :value="container.justifyContent"
          @change="updateProperty('justifyContent', $event.target.value)"
        >
          <option value="flex-start">flex-start</option>
          <option value="flex-end">flex-end</option>
          <option value="center">center</option>
          <option value="space-between">space-between</option>
          <option value="space-around">space-around</option>
          <option value="space-evenly">space-evenly</option>
        </select>
      </div>
      <div class="control-row">
        <label class="control-label">Align Items:</label>
        <select
          class="control-select"
          :value="container.alignItems"
          @change="updateProperty('alignItems', $event.target.value)"
        >
          <option value="stretch">stretch</option>
          <option value="flex-start">flex-start</option>
          <option value="flex-end">flex-end</option>
          <option value="center">center</option>
          <option value="baseline">baseline</option>
        </select>
      </div>
      <div class="control-row">
        <label class="control-label">Align Content:</label>
        <select
          class="control-select"
          :value="container.alignContent"
          @change="updateProperty('alignContent', $event.target.value)"
        >
          <option value="stretch">stretch</option>
          <option value="flex-start">flex-start</option>
          <option value="flex-end">flex-end</option>
          <option value="center">center</option>
          <option value="space-between">space-between</option>
          <option value="space-around">space-around</option>
        </select>
      </div>
    </div>

    <!-- Presets -->
    <div class="control-group">
      <div class="control-title">🎯 Préréglages</div>
      <div class="presets-grid">
        <button
          v-for="preset in presets"
          :key="preset.id"
          class="preset-btn"
          @click="$emit('preset', preset.id)"
          :title="preset.description"
        >
          {{ preset.name }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  container: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["update", "preset"]);

const presets = [
  { id: "center", name: "Centre", description: "Centrer tous les éléments" },
  { id: "space-between", name: "Écartés", description: "Espacer les éléments" },
  { id: "sidebar", name: "Sidebar", description: "Layout avec sidebar" },
  { id: "navbar", name: "Navbar", description: "Barre de navigation" },
  { id: "card-grid", name: "Grille", description: "Grille de cartes" },
  { id: "column-center", name: "Colonne", description: "Colonne centrée" },
];

const updateProperty = (property, value) => {
  emit("update", { property, value });
};
</script>

<style scoped>
.control-group {
  margin-bottom: 24px;
}

.control-title {
  font-size: 16px;
  font-weight: 600;
  color: white;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.control-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
  flex-wrap: wrap;
}

.control-label {
  font-size: 14px;
  font-weight: 500;
  min-width: 120px;
  color: rgba(255, 255, 255, 0.9);
}

.control-select {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 14px;
  min-width: 140px;
  cursor: pointer;
}

.control-select:focus {
  outline: none;
  border-color: rgba(255, 255, 255, 0.5);
  box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.3);
}

.control-select option {
  background: #374151;
  color: white;
}

.presets-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  margin-top: 16px;
}

.preset-btn {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.preset-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.4);
  transform: translateY(-1px);
}

.preset-btn:active {
  transform: translateY(0);
}
</style>
