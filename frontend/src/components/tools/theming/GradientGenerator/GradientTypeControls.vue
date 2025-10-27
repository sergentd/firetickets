<template>
  <div class="space-y-6">
    <!-- Gradient Type Selection -->
    <div class="control-group">
      <div class="control-row">
        <label class="control-label">Type:</label>
        <select
          class="control-select"
          :value="gradientState.type"
          @change="updateProperty('type', $event.target.value)"
        >
          <option value="linear">Linéaire</option>
          <option value="radial">Radial</option>
          <option value="conic">Conique</option>
        </select>
      </div>
    </div>

    <!-- Linear Gradient Controls -->
    <div v-if="gradientState.type === 'linear'" class="control-group">
      <div class="control-title">🧭 Direction</div>

      <!-- Angle Indicator -->
      <div class="angle-indicator">
        <div
          class="angle-line"
          :style="{ transform: `rotate(${gradientState.angle}deg)` }"
        ></div>
        <div class="angle-center"></div>
      </div>

      <div class="control-row">
        <label class="control-label">Angle:</label>
        <input
          type="range"
          class="range-input"
          min="0"
          max="360"
          :value="gradientState.angle"
          @input="updateProperty('angle', parseInt($event.target.value))"
        />
        <input
          type="number"
          class="control-input"
          min="0"
          max="360"
          :value="gradientState.angle"
          @input="updateProperty('angle', parseInt($event.target.value) || 0)"
          style="width: 70px"
        />
        <span class="unit-label">°</span>
      </div>
    </div>

    <!-- Radial Gradient Controls -->
    <div v-if="gradientState.type === 'radial'" class="control-group">
      <div class="control-title">⭕ Position & Forme</div>

      <div class="control-row">
        <label class="control-label">Position:</label>
        <select
          class="control-select"
          :value="gradientState.radialPosition"
          @change="updateProperty('radialPosition', $event.target.value)"
        >
          <option value="center">center</option>
          <option value="top">top</option>
          <option value="bottom">bottom</option>
          <option value="left">left</option>
          <option value="right">right</option>
          <option value="top left">top left</option>
          <option value="top right">top right</option>
          <option value="bottom left">bottom left</option>
          <option value="bottom right">bottom right</option>
        </select>
      </div>

      <div class="control-row">
        <label class="control-label">Forme:</label>
        <select
          class="control-select"
          :value="gradientState.radialShape"
          @change="updateProperty('radialShape', $event.target.value)"
        >
          <option value="ellipse">ellipse</option>
          <option value="circle">circle</option>
        </select>
      </div>
    </div>

    <!-- Conic Gradient Controls -->
    <div v-if="gradientState.type === 'conic'" class="control-group">
      <div class="control-title">🌀 Angle & Position</div>

      <div class="control-row">
        <label class="control-label">Angle:</label>
        <input
          type="range"
          class="range-input"
          min="0"
          max="360"
          :value="gradientState.conicAngle"
          @input="updateProperty('conicAngle', parseInt($event.target.value))"
        />
        <input
          type="number"
          class="control-input"
          min="0"
          max="360"
          :value="gradientState.conicAngle"
          @input="
            updateProperty('conicAngle', parseInt($event.target.value) || 0)
          "
          style="width: 70px"
        />
        <span class="unit-label">°</span>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  gradientState: {
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
  min-width: 80px;
  color: rgba(255, 255, 255, 0.9);
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

.unit-label {
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  font-weight: 500;
}

.angle-indicator {
  position: relative;
  width: 80px;
  height: 80px;
  margin: 12px auto;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
}

.angle-line {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 35px;
  height: 2px;
  background: linear-gradient(90deg, #667eea, #764ba2);
  transform-origin: 0 50%;
  transition: transform 0.2s ease;
  border-radius: 1px;
  box-shadow: 0 0 4px rgba(102, 126, 234, 0.5);
}

.angle-center {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 6px;
  height: 6px;
  background: white;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.3);
}
</style>
