<template>
  <div
    class="color-stop"
    :class="{ selected: selected }"
    @click="$emit('select', stop.id)"
  >
    <div class="stop-header">
      <div class="stop-title">Couleur {{ stop.id }}</div>
      <div class="stop-controls">
        <button
          v-if="canRemove"
          class="btn btn-small btn-danger"
          @click.stop="$emit('remove', stop.id)"
          title="Supprimer"
        >
          🗑️
        </button>
      </div>
    </div>

    <div class="control-row">
      <input
        type="color"
        class="color-picker"
        :value="stop.color"
        @input="updateProperty('color', $event.target.value)"
        @click.stop
      />
      <input
        type="range"
        class="range-input"
        min="0"
        max="100"
        :value="stop.position"
        @input="updateProperty('position', parseInt($event.target.value))"
        @click.stop
      />
      <input
        type="number"
        class="control-input"
        min="0"
        max="100"
        :value="stop.position"
        @input="updateProperty('position', parseInt($event.target.value) || 0)"
        @click.stop
        style="width: 60px"
      />
      <span class="unit-label">%</span>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  stop: {
    type: Object,
    required: true,
  },
  selected: {
    type: Boolean,
    default: false,
  },
  canRemove: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(["update", "remove", "select"]);

const updateProperty = (property, value) => {
  emit("update", {
    id: props.stop.id,
    property,
    value,
  });
};
</script>

<style scoped>
.color-stop {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.color-stop:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.3);
}

.color-stop.selected {
  border-color: rgba(102, 126, 234, 0.5);
  background: rgba(102, 126, 234, 0.1);
  box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2);
}

.stop-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.stop-title {
  font-weight: 600;
  color: white;
  flex-grow: 1;
}

.stop-controls {
  display: flex;
  gap: 8px;
}

.control-row {
  display: flex;
  align-items: center;
  gap: 12px;
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

.control-input {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 14px;
  text-align: center;
}

.control-input:focus {
  outline: none;
  border-color: rgba(255, 255, 255, 0.5);
  box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.3);
}

.unit-label {
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  font-weight: 500;
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

.btn-danger {
  background: rgba(239, 68, 68, 0.8);
  color: white;
}

.btn-danger:hover {
  background: rgba(239, 68, 68, 1);
  transform: translateY(-1px);
}
</style>
