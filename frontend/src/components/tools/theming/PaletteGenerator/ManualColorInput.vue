<template>
  <div class="manual-color-input space-y-4">
    <div class="flex items-center gap-4">
      <input
        type="color"
        class="color-picker"
        v-model="currentColor"
        @change="updateCurrentColor"
      />
      <input
        type="text"
        class="hex-input"
        v-model="currentColor"
        @input="validateHexInput"
        placeholder="#FFFFFF"
      />
      <button @click="addColor" class="add-btn" :disabled="!isValidColor">
        Ajouter
      </button>
    </div>

    <div v-if="!isValidColor && currentColor" class="error-message">
      Couleur hexadécimale invalide
    </div>

    <div v-if="colors.length > 0" class="added-colors">
      <h4 class="text-sm font-medium text-white mb-2">Couleurs ajoutées:</h4>
      <div class="colors-grid">
        <div v-for="(color, index) in colors" :key="index" class="color-item">
          <div class="color-swatch" :style="{ backgroundColor: color }"></div>
          <span class="color-text">{{ color }}</span>
          <button @click="removeColor(index)" class="remove-btn">×</button>
        </div>
      </div>
    </div>

    <button v-if="colors.length > 0" @click="clearAll" class="clear-btn">
      Tout effacer
    </button>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const emit = defineEmits(["colors-updated"]);

const currentColor = ref("#3B82F6");
const colors = ref([]);

const isValidColor = computed(() => {
  const hexRegex = /^#[0-9A-F]{6}$/i;
  return hexRegex.test(currentColor.value);
});

const updateCurrentColor = () => {
  if (isValidColor.value) {
    emit("colors-updated", colors.value);
  }
};

const validateHexInput = (event) => {
  let value = event.target.value;
  if (!value.startsWith("#")) {
    value = "#" + value;
  }
  currentColor.value = value.toUpperCase();
};

const addColor = () => {
  if (isValidColor.value && !colors.value.includes(currentColor.value)) {
    colors.value.push(currentColor.value);
    emit("colors-updated", colors.value);
  }
};

const removeColor = (index) => {
  colors.value.splice(index, 1);
  emit("colors-updated", colors.value);
};

const clearAll = () => {
  colors.value = [];
  emit("colors-updated", colors.value);
};
</script>

<style scoped>
.color-picker {
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  padding: 0;
  transition: transform 0.2s ease;
  -webkit-appearance: none;
  appearance: none;
}

.color-picker:hover {
  transform: scale(1.05);
}

.color-picker::-webkit-color-swatch-wrapper {
  padding: 0;
}

.color-picker::-webkit-color-swatch {
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
}

.hex-input {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 10px 12px;
  border-radius: 6px;
  font-size: 14px;
  font-family: monospace;
  width: 120px;
}

.hex-input:focus {
  outline: none;
  border-color: rgba(255, 255, 255, 0.5);
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3);
}

.hex-input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.add-btn {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.add-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #059669 0%, #047857 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
}

.add-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.error-message {
  color: #f87171;
  font-size: 12px;
  padding: 8px;
  background: rgba(248, 113, 113, 0.1);
  border-radius: 4px;
  border: 1px solid rgba(248, 113, 113, 0.3);
}

.colors-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.color-item {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.1);
  padding: 6px 10px;
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.color-swatch {
  width: 20px;
  height: 20px;
  border-radius: 4px;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.color-text {
  font-family: monospace;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.9);
}

.remove-btn {
  background: none;
  border: none;
  color: #f87171;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  padding: 0 4px;
  border-radius: 2px;
  transition: all 0.2s ease;
}

.remove-btn:hover {
  background: rgba(248, 113, 113, 0.2);
  color: #fca5a5;
}

.clear-btn {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
}

.clear-btn:hover {
  background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
}
</style>
