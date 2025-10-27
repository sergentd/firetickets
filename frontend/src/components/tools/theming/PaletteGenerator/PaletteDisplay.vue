<template>
  <div class="palette-display space-y-4">
    <div v-if="colors.length === 0" class="no-palette">
      <p class="text-gray-400 text-center">
        Générez ou ajoutez des couleurs pour voir votre palette
      </p>
    </div>

    <div v-else class="palette-container">
      <div class="colors-grid">
        <div v-for="(color, index) in colors" :key="index" class="color-card">
          <div class="color-card-header">
            <div class="color-swatch-container">
              <input
                type="color"
                :value="color"
                @input="updateColor(index, $event.target.value)"
                class="color-swatch-picker"
                :title="`Modifier la couleur ${index + 1}`"
              />
            </div>
            <div class="color-actions">
              <button
                @click="removeColor(index)"
                class="action-btn remove-btn"
                title="Supprimer cette couleur"
                :disabled="colors.length === 1"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path
                    d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z"
                  />
                </svg>
              </button>
              <button
                @click="copyToClipboard(color, index)"
                class="action-btn copy-btn"
                :title="`Copier ${color}`"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path
                    d="M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z"
                  />
                </svg>
              </button>
            </div>
          </div>
          <div class="color-info">
            <input
              type="text"
              :value="color"
              @input="updateColorFromHex(index, $event.target.value)"
              @blur="validateHexInput(index, $event.target.value)"
              class="color-hex-input"
              placeholder="#FFFFFF"
            />
            <span class="color-rgb">{{ hexToRgb(color) }}</span>
            <span class="color-hsl">{{ hexToHsl(color) }}</span>
          </div>
          <div v-if="copiedIndex === index" class="copy-indicator active">
            Copié!
          </div>
        </div>
      </div>

      <div class="palette-actions">
        <button @click="exportPalette('json')" class="export-btn json">
          Export JSON
        </button>
        <button @click="exportPalette('css')" class="export-btn css">
          Export CSS
        </button>
        <button @click="exportPalette('scss')" class="export-btn scss">
          Export SCSS
        </button>
        <button
          @click="savePalette"
          class="save-btn"
          :disabled="!localPaletteName.trim()"
        >
          Sauvegarder
        </button>
      </div>

      <div class="save-section">
        <input
          v-model="localPaletteName"
          type="text"
          placeholder="Nom de la palette..."
          class="palette-name-input"
          @keyup.enter="savePalette"
        />
      </div>

      <!-- Accessibility Check -->
      <div v-if="colors.length >= 2" class="accessibility-check">
        <h4 class="text-sm font-medium text-white mb-3">
          Test d'accessibilité :
        </h4>

        <!-- Simplified contrast analysis -->
        <div class="simplified-analysis">
          <div class="contrast-grid">
            <div
              v-for="combination in contrastCombinations.slice(0, 6)"
              :key="combination.label"
              class="contrast-test-item"
              :class="combination.rating"
            >
              <div class="test-visual">
                <div
                  class="test-bg"
                  :style="{ backgroundColor: combination.bg }"
                >
                  <span class="test-text" :style="{ color: combination.fg }"
                    >Aa</span
                  >
                </div>
              </div>
              <div class="test-info">
                <span class="test-label">{{ combination.label }}</span>
                <span class="test-ratio">{{ combination.ratio }}:1</span>
                <span class="test-level">{{ combination.level }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const props = defineProps({
  colors: {
    type: Array,
    default: () => [],
  },
  paletteName: {
    type: String,
    default: "",
  },
});

const emit = defineEmits([
  "palette-saved",
  "colors-updated",
  "palette-name-updated",
]);

const localPaletteName = computed({
  get: () => props.paletteName,
  set: (value) => emit("palette-name-updated", value),
});
const copiedIndex = ref(-1);
const expandedAnalysis = ref({});

const contrastCombinations = computed(() => {
  if (props.colors.length === 0) return [];

  const combinations = [];

  // For each color, test with both black and white text
  props.colors.forEach((color, index) => {
    const blackRatio = calculateContrastRatio(color, "#000000");
    const whiteRatio = calculateContrastRatio(color, "#FFFFFF");

    // Determine optimal text color
    const optimalText = blackRatio > whiteRatio ? "#000000" : "#FFFFFF";
    const optimalRatio = Math.max(blackRatio, whiteRatio);

    combinations.push({
      bg: color,
      fg: optimalText,
      ratio: optimalRatio.toFixed(2),
      level: getWCAGLevel(optimalRatio),
      rating: getContrastRating(optimalRatio),
      isOptimal: true,
      label: `Couleur ${index + 1} + ${optimalText === "#000000" ? "Noir" : "Blanc"}`,
    });
  });

  // Also add color-to-color combinations if there are multiple colors
  if (props.colors.length > 1) {
    for (let i = 0; i < props.colors.length; i++) {
      for (let j = i + 1; j < props.colors.length; j++) {
        const bg = props.colors[i];
        const fg = props.colors[j];
        const ratio = calculateContrastRatio(bg, fg);

        combinations.push({
          bg,
          fg,
          ratio: ratio.toFixed(2),
          level: getWCAGLevel(ratio),
          rating: getContrastRating(ratio),
          isOptimal: false,
          label: `Couleur ${i + 1} + Couleur ${j + 1}`,
        });
      }
    }
  }

  return combinations.sort((a, b) => {
    // Sort optimal combinations first, then by ratio
    if (a.isOptimal && !b.isOptimal) return -1;
    if (!a.isOptimal && b.isOptimal) return 1;
    return parseFloat(b.ratio) - parseFloat(a.ratio);
  });
});

const hexToRgb = (hex) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgb(${r}, ${g}, ${b})`;
};

const hexToHsl = (hex) => {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h,
    s,
    l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
};

const getLuminance = (hex) => {
  const rgb = [
    parseInt(hex.slice(1, 3), 16),
    parseInt(hex.slice(3, 5), 16),
    parseInt(hex.slice(5, 7), 16),
  ].map((c) => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
};

const calculateContrastRatio = (color1, color2) => {
  const lum1 = getLuminance(color1);
  const lum2 = getLuminance(color2);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);

  return (brightest + 0.05) / (darkest + 0.05);
};

const getWCAGLevel = (ratio) => {
  if (ratio >= 7) return "AAA";
  if (ratio >= 4.5) return "AA";
  if (ratio >= 3) return "AA Large";
  return "Fail";
};

const getContrastRating = (ratio) => {
  if (ratio >= 7) return "excellent";
  if (ratio >= 4.5) return "good";
  if (ratio >= 3) return "fair";
  return "poor";
};

const copyToClipboard = async (color, index) => {
  try {
    await navigator.clipboard.writeText(color);
    copiedIndex.value = index;
    setTimeout(() => {
      copiedIndex.value = -1;
    }, 2000);
  } catch (error) {
    console.error("Failed to copy color:", error);
  }
};

const exportPalette = (format) => {
  const paletteName = localPaletteName.value || "palette";
  const sanitizedName =
    paletteName
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "_")
      .replace(/[^a-z0-9_]/g, "")
      .replace(/__+/g, "_")
      .replace(/^_+|_+$/g, "") || "palette";

  let content = "";

  switch (format) {
    case "json":
      content = JSON.stringify(
        {
          name: paletteName,
          colors: props.colors,
          timestamp: new Date().toISOString(),
        },
        null,
        2,
      );
      break;
    case "css":
      content =
        ":root {\n" +
        props.colors
          .map((color, index) => `  --color-${index + 1}: ${color};`)
          .join("\n") +
        "\n}";
      break;
    case "scss":
      content = props.colors
        .map((color, index) => `$color-${index + 1}: ${color};`)
        .join("\n");
      break;
  }

  const blob = new Blob([content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${sanitizedName}.${format}`;
  a.click();
  URL.revokeObjectURL(url);
};

const isValidHex = (hex) => {
  return /^#[0-9A-F]{6}$/i.test(hex);
};

const updateColor = (index, newColor) => {
  if (isValidHex(newColor)) {
    const updatedColors = [...props.colors];
    updatedColors[index] = newColor.toUpperCase();
    emit("colors-updated", updatedColors);
  }
};

const updateColorFromHex = (index, value) => {
  // Allow typing without validation on input
  let hexValue = value;
  if (!hexValue.startsWith("#")) {
    hexValue = "#" + hexValue;
  }

  if (isValidHex(hexValue)) {
    updateColor(index, hexValue);
  }
};

const validateHexInput = (index, value) => {
  // On blur, validate and fix if needed
  let hexValue = value.trim().toUpperCase();

  if (!hexValue.startsWith("#")) {
    hexValue = "#" + hexValue;
  }

  // If invalid, revert to original color
  if (!isValidHex(hexValue)) {
    // Force re-render with original value
    const input = event.target;
    setTimeout(() => {
      input.value = props.colors[index];
    }, 0);
  }
};

const removeColor = (index) => {
  if (props.colors.length > 1) {
    const updatedColors = [...props.colors];
    updatedColors.splice(index, 1);
    emit("colors-updated", updatedColors);
  }
};

const toggleColorAnalysis = (colorIndex) => {
  expandedAnalysis.value[colorIndex] = !expandedAnalysis.value[colorIndex];
};

const savePalette = () => {
  if (!localPaletteName.value.trim()) return;

  const palette = {
    name: localPaletteName.value.trim(),
    colors: [...props.colors],
    timestamp: new Date().toISOString(),
  };

  emit("palette-saved", palette);
  localPaletteName.value = "";
};
</script>

<style scoped>
.no-palette {
  padding: 40px 20px;
  text-align: center;
}

.colors-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.color-card {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 16px;
  transition: all 0.3s ease;
}

.color-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
  border-color: rgba(255, 255, 255, 0.4);
}

.color-card-header {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 12px;
}

.color-swatch-container {
  flex: 1;
}

.color-swatch-picker {
  width: 100%;
  height: 80px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  -webkit-appearance: none;
  appearance: none;
  background: none;
  padding: 0;
}

.color-swatch-picker::-webkit-color-swatch-wrapper {
  padding: 0;
  border-radius: 6px;
}

.color-swatch-picker::-webkit-color-swatch {
  border: none;
  border-radius: 6px;
}

.color-swatch-picker:hover {
  border-color: rgba(255, 255, 255, 0.5);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.color-actions {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.action-btn {
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  opacity: 1;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.action-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.action-btn:active {
  transform: scale(0.95);
}

.action-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  box-shadow: none;
}

.action-btn:disabled:hover {
  transform: none;
  box-shadow: none;
}

.remove-btn {
  background: var(--glass-bg-light);
  color: var(--text-secondary);
  border: 1px solid var(--border-primary);
}

.remove-btn:hover:not(:disabled) {
  background: var(--glass-bg-medium);
  color: #ff6b6b;
  border-color: #ff6b6b;
}

.copy-btn {
  background: var(--glass-bg-light);
  color: var(--text-secondary);
  border: 1px solid var(--border-primary);
}

.copy-btn:hover:not(:disabled) {
  background: var(--glass-bg-medium);
  color: var(--electric-blue);
  border-color: var(--electric-blue);
}

.color-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.color-hex-input {
  font-family: monospace;
  font-size: 14px;
  font-weight: 600;
  color: white;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  padding: 4px 8px;
  width: 100%;
  margin-bottom: 4px;
  transition: all 0.2s ease;
}

.color-hex-input:focus {
  outline: none;
  border-color: rgba(255, 255, 255, 0.4);
  background: rgba(255, 255, 255, 0.15);
}

.color-hex-input::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

.color-rgb,
.color-hsl {
  font-family: monospace;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
}

.copy-indicator {
  margin-top: 8px;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.5);
  transition: all 0.3s ease;
}

.copy-indicator.active {
  color: #10b981;
  font-weight: 500;
}

.palette-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}

.export-btn,
.save-btn {
  padding: 10px 16px;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.export-btn,
.save-btn {
  background: var(--glass-bg-light);
  border: 1px solid var(--border-primary);
  color: var(--text-secondary);
  font-size: 13px;
}

.export-btn:hover,
.save-btn:hover:not(:disabled) {
  background: var(--glass-bg-medium);
  color: var(--text-primary);
  border-color: var(--electric-blue);
}

.save-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.export-btn:hover,
.save-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.palette-name-input {
  width: 100%;
  background: var(--glass-bg-light);
  border: 1px solid var(--border-primary);
  color: var(--text-primary);
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.3s ease;
}

.palette-name-input:focus {
  outline: none;
  border-color: var(--electric-blue);
  box-shadow: 0 0 0 2px rgba(var(--electric-blue-rgb), 0.3);
  background: var(--glass-bg-medium);
}

.palette-name-input::placeholder {
  color: var(--text-secondary);
}

.accessibility-check {
  margin-top: 24px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
}

.contrast-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 12px;
}

.contrast-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  border-radius: 6px;
  border: 1px solid transparent;
}

.contrast-item.excellent {
  border-color: #10b981;
  background: rgba(16, 185, 129, 0.1);
}

.contrast-item.good {
  border-color: #f59e0b;
  background: rgba(245, 158, 11, 0.1);
}

.contrast-item.fair {
  border-color: #f97316;
  background: rgba(249, 115, 22, 0.1);
}

.contrast-item.poor {
  border-color: #ef4444;
  background: rgba(239, 68, 68, 0.1);
}

.contrast-swatches {
  display: flex;
  position: relative;
}

.contrast-swatch {
  width: 20px;
  height: 20px;
  border-radius: 4px;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.contrast-swatch.fg {
  margin-left: -8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
}

.contrast-info {
  display: flex;
  flex-direction: column;
  font-size: 11px;
  flex: 1;
}

.contrast-label {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 2px;
}

.contrast-ratio {
  font-weight: 600;
  color: white;
}

.contrast-level {
  color: rgba(255, 255, 255, 0.7);
}

.contrast-item.optimal {
  border-width: 2px;
}

.contrast-item.optimal.excellent {
  border-color: #10b981;
  background: rgba(16, 185, 129, 0.15);
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.2);
}

.contrast-item.optimal.good {
  border-color: #f59e0b;
  background: rgba(245, 158, 11, 0.15);
  box-shadow: 0 2px 8px rgba(245, 158, 11, 0.2);
}

.text-contrast-group {
  display: contents;
}

.contrast-item.text-test {
  min-width: 180px;
}

.text-display {
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  text-shadow: none;
}

.contrast-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 12px;
}

@media (min-width: 768px) {
  .contrast-grid {
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  }
}

/* Exhaustive Analysis Styles */
.exhaustive-analysis {
  space-y: 8px;
}

.color-analysis-dropdown {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  margin-bottom: 8px;
  overflow: hidden;
}

.color-dropdown-header {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
}

.color-dropdown-header:hover {
  background: rgba(255, 255, 255, 0.05);
}

.color-dropdown-header.expanded {
  background: rgba(255, 255, 255, 0.1);
}

.color-preview-small {
  width: 24px;
  height: 24px;
  border-radius: 6px;
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.color-name {
  font-weight: 500;
  font-size: 14px;
}

.color-hex {
  font-family: monospace;
  font-size: 12px;
  opacity: 0.7;
  margin-left: auto;
}

.dropdown-arrow {
  transition: transform 0.3s ease;
  font-size: 12px;
  opacity: 0.7;
}

.dropdown-arrow.rotated {
  transform: rotate(180deg);
}

.color-analysis-content {
  padding: 16px;
  background: rgba(0, 0, 0, 0.2);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.simplified-analysis .contrast-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 12px;
  max-height: 400px;
  overflow-y: auto;
}

.contrast-test-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  transition: all 0.3s ease;
}

.contrast-test-item.excellent {
  border-color: var(--electric-blue);
  background: rgba(var(--electric-blue-rgb), 0.1);
}

.contrast-test-item.good {
  border-color: var(--border-secondary);
  background: var(--glass-bg-light);
}

.contrast-test-item.fair {
  border-color: var(--border-primary);
  background: var(--glass-bg-light);
}

.contrast-test-item.poor {
  border-color: #ff6b6b;
  background: rgba(255, 107, 107, 0.05);
}

.test-visual {
  flex-shrink: 0;
}

.test-bg {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.test-text {
  font-size: 16px;
  font-weight: 600;
  text-shadow: none;
}

.test-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
}

.test-label {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 500;
}

.test-ratio {
  font-size: 13px;
  font-weight: 600;
  color: white;
  font-family: monospace;
}

.test-level {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.6);
  text-transform: uppercase;
  font-weight: 500;
}

@media (max-width: 640px) {
  .analysis-grid {
    grid-template-columns: 1fr;
  }

  .color-dropdown-header {
    padding: 10px 12px;
  }

  .color-analysis-content {
    padding: 12px;
  }
}
</style>
