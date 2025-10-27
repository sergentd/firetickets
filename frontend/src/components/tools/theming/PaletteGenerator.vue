<template>
  <div class="min-h-screen bg-primary">
    <!-- Tool Header -->
    <ToolHeader
      title="Générateur de Palette"
      description="Créez, ajustez et exportez vos palettes de couleurs avec l'accessibilité à l'esprit"
      icon="palette-generator"
      category="theming"
      :show-badges="true"
    />

    <!-- Main Content -->
    <div class="container mx-auto px-4 space-y-8">
      <div class="grid grid-cols-1 xl:grid-cols-4 gap-6">
        <!-- Generation Controls -->
        <div class="xl:col-span-1 space-y-6">
          <!-- Generation Methods with Tabs -->
          <UISection title="Méthodes de Génération" variant="glass">
            <UITabs
              v-model="activeTab"
              :tabs="generationTabs"
              variant="soft"
              size="sm"
              value-key="id"
              label-key="label"
            >
              <!-- Color Generation Tab -->
              <template #tab-color>
                <ColorGeneration
                  :base-color="paletteState.baseColor"
                  :generation-mode="paletteState.generationMode"
                  @update:base-color="paletteState.baseColor = $event"
                  @update:generation-mode="paletteState.generationMode = $event"
                  @generate="generatePalette"
                />
              </template>

              <!-- Image Extraction Tab -->
              <template #tab-image>
                <ImageExtraction @colors-extracted="handleImageExtraction" />
              </template>

              <!-- Manual Addition Tab -->
              <template #tab-manual>
                <ManualColorInput @colors-updated="handleManualColors" />
              </template>
            </UITabs>
          </UISection>
        </div>

        <!-- Main Palette Area -->
        <div class="xl:col-span-2 space-y-6">
          <UISection title="Palette" variant="glass">
            <template #actions>
              <div class="flex gap-2">
                <UIButton variant="secondary" size="sm" @click="savePalette">
                  Sauvegarder
                </UIButton>
                <UIButton
                  ref="exportButtonRef"
                  variant="secondary"
                  size="sm"
                  @click="toggleExportMenu"
                >
                  Exporter
                </UIButton>
              </div>
            </template>

            <div class="space-y-4">
              <UIInput
                v-model="paletteState.paletteName"
                placeholder="Nom de la palette"
              />
              <PaletteDisplay
                :colors="paletteState.colors"
                :palette-name="paletteState.paletteName"
                @colors-updated="paletteState.colors = $event"
                @palette-name-updated="paletteState.paletteName = $event"
              />
            </div>
          </UISection>
        </div>

        <!-- Saved Palettes -->
        <div class="xl:col-span-1 space-y-6">
          <UISection title="Palettes sauvegardées" variant="glass">
            <SavedPalettes
              ref="savedPalettesRef"
              @palette-loaded="handlePaletteLoad"
            />
          </UISection>
        </div>
      </div>
    </div>

    <!-- Export menu - teleported to body to avoid nesting issues -->
    <Teleport to="body">
      <div
        v-if="showExportMenu"
        class="fixed inset-0 z-10"
        @click="showExportMenu = false"
      >
        <div
          class="export-menu-floating"
          :style="exportMenuPosition"
          @click.stop
        >
          <button @click="exportPalette('json')">en JSON</button>
          <button @click="exportPalette('css')">en CSS</button>
          <button @click="exportPalette('scss')">en SCSS</button>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { UISection, UIButton, UIInput, UITabs } from "@/components/ui";
import ToolHeader from "@/components/ui/ToolHeader.vue";
import ColorGeneration from "./PaletteGenerator/ColorGeneration.vue";
import ImageExtraction from "./PaletteGenerator/ImageExtraction.vue";
import ManualColorInput from "./PaletteGenerator/ManualColorInput.vue";
import PaletteDisplay from "./PaletteGenerator/PaletteDisplay.vue";
import SavedPalettes from "./PaletteGenerator/SavedPalettes.vue";

// State management
const paletteState = reactive({
  paletteName: "",
  baseColor: "#3D5A80",
  generationMode: "monochromatic",
  colors: [],
});

const activeTab = ref("color");
const generationTabs = [
  { id: "color", label: "Couleur" },
  { id: "image", label: "Image" },
  { id: "manual", label: "Manuel" },
];

const savedPalettesRef = ref(null);
const showExportMenu = ref(false);
const exportButtonRef = ref(null);
const exportMenuPosition = ref({});

// Color generation functions
const generatePalette = () => {
  const mode = paletteState.generationMode;
  const base = paletteState.baseColor;

  switch (mode) {
    case "monochromatic":
      paletteState.colors = generateMonochromatic(base);
      break;
    case "analogous":
      paletteState.colors = generateAnalogous(base);
      break;
    case "complementary":
      paletteState.colors = generateComplementary(base);
      break;
    case "triadic":
      paletteState.colors = generateTriadic(base);
      break;
    case "tetradic":
      paletteState.colors = generateTetradic(base);
      break;
    default:
      paletteState.colors = generateMonochromatic(base);
  }
};

const generateMonochromatic = (base) => {
  return [
    adjustBrightness(base, -40),
    adjustBrightness(base, -20),
    base,
    adjustBrightness(base, 20),
    adjustBrightness(base, 40),
  ];
};

const generateAnalogous = (base) => {
  return [
    shiftHue(base, -30),
    shiftHue(base, -15),
    base,
    shiftHue(base, 15),
    shiftHue(base, 30),
  ];
};

const generateComplementary = (base) => {
  const complement = shiftHue(base, 180);
  return [
    adjustBrightness(base, -20),
    base,
    adjustBrightness(base, 20),
    adjustBrightness(complement, -20),
    complement,
  ];
};

const generateTriadic = (base) => {
  return [
    base,
    shiftHue(base, 120),
    shiftHue(base, 240),
    adjustBrightness(base, 20),
    adjustBrightness(shiftHue(base, 120), 20),
  ];
};

const generateTetradic = (base) => {
  return [
    base,
    shiftHue(base, 90),
    shiftHue(base, 180),
    shiftHue(base, 270),
    adjustBrightness(base, 20),
  ];
};

// Event handlers
const handleImageExtraction = (colors) => {
  paletteState.colors = colors;
};

const handleManualColors = (colors) => {
  paletteState.colors = colors;
};

const handlePaletteLoad = (colors) => {
  paletteState.colors = colors;
};

const toggleExportMenu = () => {
  if (!showExportMenu.value && exportButtonRef.value) {
    const button = exportButtonRef.value.$el || exportButtonRef.value;
    const rect = button.getBoundingClientRect();
    exportMenuPosition.value = {
      position: "fixed",
      top: `${rect.bottom + 8}px`,
      right: `${window.innerWidth - rect.right}px`,
      zIndex: 30,
    };
  }
  showExportMenu.value = !showExportMenu.value;
};

// Save/Export functions
const savePalette = () => {
  if (!paletteState.paletteName || paletteState.colors.length === 0) {
    alert("Veuillez nommer la palette et ajouter au moins une couleur");
    return;
  }

  const paletteData = {
    name: paletteState.paletteName,
    colors: paletteState.colors,
  };

  // Add palette via the SavedPalettes component
  savedPalettesRef.value?.addPalette(paletteData);

  // Clear the current palette name for next creation
  paletteState.paletteName = "";
};

const exportPalette = (format) => {
  if (paletteState.colors.length === 0) {
    alert("Aucune couleur à exporter");
    return;
  }

  const paletteData = {
    name: paletteState.paletteName || "Palette",
    colors: paletteState.colors,
  };

  if (format === "json") {
    const json = JSON.stringify(paletteData, null, 2);
    const filename = sanitizeForFilename(paletteData.name) + ".json";
    downloadFile(filename, json, "application/json");
  } else if (format === "css") {
    let css = `:root {\n`;
    paletteData.colors.forEach((color, index) => {
      const varName = sanitizeForCss(paletteData.name) + "-" + (index + 1);
      css += `  --color-${varName}: ${color};\n`;
    });
    css += "}";
    const filename = sanitizeForFilename(paletteData.name) + ".css";
    downloadFile(filename, css, "text/css");
  } else if (format === "scss") {
    let scss = paletteData.colors
      .map((color, index) => `$color-${index + 1}: ${color};`)
      .join("\n");
    const filename = sanitizeForFilename(paletteData.name) + ".scss";
    downloadFile(filename, scss, "text/scss");
  }

  showExportMenu.value = false;
};

// Utility functions
const downloadFile = (filename, content, mimeType) => {
  const a = document.createElement("a");
  const blob = new Blob([content], { type: mimeType });
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

const sanitizeForFilename = (name) => {
  if (!name) return "palette";
  return name
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+\+\s*/g, "_plus_")
    .replace(/\s+-\s*/g, "_minus_")
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_]/g, "")
    .replace(/__+/g, "_")
    .replace(/^_+|_+$/g, "");
};

const sanitizeForCss = (name) => {
  if (!name) return "";
  return name
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+\+\s*/g, "-plus-")
    .replace(/\s+-\s*/g, "-minus-")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
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

  return [h * 360, s * 100, l * 100];
};

const hslToHex = (h, s, l) => {
  l /= 100;
  const a = (s * Math.min(l, 1 - l)) / 100;
  const f = (n) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
};

const adjustBrightness = (hex, percent) => {
  const [h, s, l] = hexToHsl(hex);
  const newL = Math.max(0, Math.min(100, l + percent));
  return hslToHex(h, s, newL);
};

const shiftHue = (hex, degrees) => {
  const [h, s, l] = hexToHsl(hex);
  const newH = (h + degrees + 360) % 360;
  return hslToHex(newH, s, l);
};
</script>

<style scoped>
.export-menu-floating {
  background: var(--bg-secondary);
  border: 2px solid var(--electric-blue);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-xl);
  min-width: 140px;
  overflow: hidden;
}

.export-menu-floating button {
  display: block;
  width: 100%;
  padding: var(--space-3) var(--space-4);
  background: none;
  border: none;
  color: var(--text-primary);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  text-align: left;
  cursor: pointer;
  transition: var(--duration-fast) var(--easing-ease);
}

.export-menu-floating button:hover {
  background: var(--electric-blue);
  color: var(--text-inverse);
}
</style>
