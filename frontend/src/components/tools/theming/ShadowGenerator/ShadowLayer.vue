<template>
  <div
    class="shadow-layer"
    :class="{ active: active }"
    @click="$emit('activate', layer.id)"
  >
    <div class="layer-header">
      <div class="layer-title">Ombre {{ layer.id }}</div>
      <div class="layer-controls">
        <button
          class="btn btn-small btn-secondary"
          @click.stop="$emit('duplicate', layer.id)"
          title="Dupliquer"
        >
          📋
        </button>
        <button
          v-if="canRemove"
          class="btn btn-small btn-danger"
          @click.stop="$emit('remove', layer.id)"
          title="Supprimer"
        >
          🗑️
        </button>
      </div>
    </div>

    <div class="control-group">
      <!-- Offset X -->
      <div class="control-row">
        <label class="control-label">Offset X:</label>
        <input
          type="range"
          class="range-input"
          min="-50"
          max="50"
          :value="layer.offsetX"
          @input="updateProperty('offsetX', $event.target.value)"
        />
        <input
          type="number"
          class="control-input"
          :value="layer.offsetX"
          @input="updateProperty('offsetX', $event.target.value)"
          style="width: 60px"
        />
      </div>

      <!-- Offset Y -->
      <div class="control-row">
        <label class="control-label">Offset Y:</label>
        <input
          type="range"
          class="range-input"
          min="-50"
          max="50"
          :value="layer.offsetY"
          @input="updateProperty('offsetY', $event.target.value)"
        />
        <input
          type="number"
          class="control-input"
          :value="layer.offsetY"
          @input="updateProperty('offsetY', $event.target.value)"
          style="width: 60px"
        />
      </div>

      <!-- Blur -->
      <div class="control-row">
        <label class="control-label">Flou:</label>
        <input
          type="range"
          class="range-input"
          min="0"
          max="100"
          :value="layer.blur"
          @input="updateProperty('blur', $event.target.value)"
        />
        <input
          type="number"
          class="control-input"
          :value="layer.blur"
          @input="updateProperty('blur', $event.target.value)"
          style="width: 60px"
        />
      </div>

      <!-- Spread -->
      <div class="control-row">
        <label class="control-label">Étendue:</label>
        <input
          type="range"
          class="range-input"
          min="-20"
          max="20"
          :value="layer.spread"
          @input="updateProperty('spread', $event.target.value)"
        />
        <input
          type="number"
          class="control-input"
          :value="layer.spread"
          @input="updateProperty('spread', $event.target.value)"
          style="width: 60px"
        />
      </div>

      <!-- Color and Opacity -->
      <div class="control-row">
        <label class="control-label">Couleur:</label>
        <input
          type="color"
          class="color-picker"
          :value="layer.color"
          @input="updateProperty('color', $event.target.value)"
        />
        <input
          type="range"
          class="range-input"
          min="0"
          max="100"
          :value="layer.opacity"
          @input="updateProperty('opacity', $event.target.value)"
          title="Opacité"
        />
        <span class="control-input opacity-display">{{ layer.opacity }}%</span>
      </div>

      <!-- Inset -->
      <div class="control-row">
        <label class="control-label checkbox-label">
          <input
            type="checkbox"
            :checked="layer.inset"
            @change="updateProperty('inset', $event.target.checked)"
            @click.stop
            class="checkbox-input"
          />
          Ombre interne
        </label>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  layer: {
    type: Object,
    required: true,
  },
  active: {
    type: Boolean,
    default: false,
  },
  canRemove: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(["update", "activate", "duplicate", "remove"]);

const updateProperty = (property, value) => {
  emit("update", {
    id: props.layer.id,
    property,
    value,
  });
};
</script>

<style scoped>
.shadow-layer {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.shadow-layer:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.3);
}

.shadow-layer.active {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(102, 126, 234, 0.5);
  box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2);
}

.layer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.layer-title {
  font-weight: 600;
  color: white;
  font-size: 16px;
}

.layer-controls {
  display: flex;
  gap: 8px;
}

.control-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.control-row {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.control-label {
  font-size: 14px;
  font-weight: 500;
  min-width: 100px;
  color: rgba(255, 255, 255, 0.9);
}

.checkbox-label {
  display: flex;
  align-items: center;
  cursor: pointer;
  min-width: auto;
}

.checkbox-input {
  margin-right: 8px;
  cursor: pointer;
}

.control-input {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 14px;
  min-width: 80px;
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

.opacity-display {
  background: rgba(255, 255, 255, 0.1);
  cursor: default;
  user-select: none;
}

.range-input {
  flex: 1;
  min-width: 120px;
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

.color-picker {
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  background: none;
  overflow: hidden;
}

.color-picker::-webkit-color-swatch-wrapper {
  padding: 0;
}

.color-picker::-webkit-color-swatch {
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 6px;
}

.btn {
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 12px;
}

.btn-small {
  padding: 6px 8px;
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-1px);
}

.btn-danger {
  background: rgba(239, 68, 68, 0.8);
  color: white;
}

.btn-danger:hover {
  background: rgba(239, 68, 68, 1);
  transform: translateY(-1px);
}
</style>
