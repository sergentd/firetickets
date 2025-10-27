<template>
  <div class="space-y-4">
    <!-- Flex Grow -->
    <div class="control-row">
      <label class="control-label">Flex Grow:</label>
      <input
        type="range"
        class="range-input"
        min="0"
        max="5"
        step="1"
        :value="item.flexGrow"
        @input="updateProperty('flexGrow', parseInt($event.target.value))"
      />
      <input
        type="number"
        class="control-input"
        min="0"
        max="10"
        :value="item.flexGrow"
        @input="updateProperty('flexGrow', parseInt($event.target.value) || 0)"
        style="width: 60px"
      />
    </div>

    <!-- Flex Shrink -->
    <div class="control-row">
      <label class="control-label">Flex Shrink:</label>
      <input
        type="range"
        class="range-input"
        min="0"
        max="5"
        step="1"
        :value="item.flexShrink"
        @input="updateProperty('flexShrink', parseInt($event.target.value))"
      />
      <input
        type="number"
        class="control-input"
        min="0"
        max="10"
        :value="item.flexShrink"
        @input="
          updateProperty('flexShrink', parseInt($event.target.value) || 1)
        "
        style="width: 60px"
      />
    </div>

    <!-- Flex Basis -->
    <div class="control-row">
      <label class="control-label">Flex Basis:</label>
      <select
        class="control-select"
        :value="item.flexBasis"
        @change="updateProperty('flexBasis', $event.target.value)"
      >
        <option value="auto">auto</option>
        <option value="0">0</option>
        <option value="50px">50px</option>
        <option value="100px">100px</option>
        <option value="150px">150px</option>
        <option value="200px">200px</option>
        <option value="20%">20%</option>
        <option value="50%">50%</option>
      </select>
    </div>

    <!-- Custom Flex Basis Input -->
    <div
      class="control-row"
      v-if="
        ![
          'auto',
          '0',
          '50px',
          '100px',
          '150px',
          '200px',
          '20%',
          '50%',
        ].includes(item.flexBasis)
      "
    >
      <label class="control-label">Valeur Personnalisée:</label>
      <input
        type="text"
        class="control-input"
        :value="item.flexBasis"
        @input="updateProperty('flexBasis', $event.target.value)"
        placeholder="ex: 250px, 30%"
        style="width: 120px"
      />
    </div>

    <!-- Align Self -->
    <div class="control-row">
      <label class="control-label">Align Self:</label>
      <select
        class="control-select"
        :value="item.alignSelf"
        @change="updateProperty('alignSelf', $event.target.value)"
      >
        <option value="auto">auto</option>
        <option value="flex-start">flex-start</option>
        <option value="flex-end">flex-end</option>
        <option value="center">center</option>
        <option value="baseline">baseline</option>
        <option value="stretch">stretch</option>
      </select>
    </div>

    <!-- Property Explanations -->
    <div class="explanation-section">
      <h4 class="explanation-title">💡 Propriétés des Éléments</h4>
      <div class="explanation-item">
        <strong>Flex Grow:</strong> Comment l'élément grandit pour occuper
        l'espace disponible
      </div>
      <div class="explanation-item">
        <strong>Flex Shrink:</strong> Comment l'élément rétrécit quand l'espace
        manque
      </div>
      <div class="explanation-item">
        <strong>Flex Basis:</strong> Taille initiale avant distribution de
        l'espace
      </div>
      <div class="explanation-item">
        <strong>Align Self:</strong> Alignement individuel sur l'axe transversal
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["update"]);

const updateProperty = (property, value) => {
  emit("update", { property, value });
};
</script>

<style scoped>
.control-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.control-label {
  font-size: 14px;
  font-weight: 500;
  min-width: 100px;
  color: rgba(255, 255, 255, 0.9);
}

.control-input {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 14px;
  text-align: center;
}

.control-input::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

.control-input:focus {
  outline: none;
  border-color: rgba(255, 255, 255, 0.5);
  box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.3);
}

.control-select {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 14px;
  min-width: 120px;
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

.range-input {
  flex: 1;
  min-width: 100px;
  height: 6px;
  border-radius: 3px;
  background: rgba(255, 255, 255, 0.2);
  outline: none;
  -webkit-appearance: none;
  appearance: none;
}

.range-input::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #667eea;
  cursor: pointer;
  border: 2px solid white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.range-input::-moz-range-thumb {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #667eea;
  cursor: pointer;
  border: 2px solid white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.explanation-section {
  margin-top: 24px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
}

.explanation-title {
  font-size: 14px;
  font-weight: 600;
  color: white;
  margin-bottom: 12px;
}

.explanation-item {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 8px;
  line-height: 1.4;
}

.explanation-item strong {
  color: rgba(255, 255, 255, 0.95);
}
</style>
