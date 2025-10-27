<template>
  <div class="min-h-screen bg-primary">
    <!-- Tool Header -->
    <ToolHeader
      title="Générateur d'Ombres"
      description="Créez des effets d'ombre CSS personnalisés avec support multi-couches et aperçu en temps réel"
      icon="shadow-generator"
      category="theming"
      :show-badges="true"
    />

    <!-- Main Content -->
    <div class="container mx-auto px-4 space-y-8">
      <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <!-- Controls Panel -->
        <div class="xl:col-span-1 space-y-6">
          <!-- Shadow Layers -->
          <UISection title="Couches d'Ombre" variant="glass" collapsible>
            <template #actions>
              <UIButton
                variant="secondary"
                size="sm"
                icon="plus"
                @click="addShadowLayer"
              >
                Ajouter
              </UIButton>
            </template>

            <div class="space-y-4">
              <ShadowLayer
                v-for="layer in shadowLayers"
                :key="layer.id"
                :layer="layer"
                :active="layer.active"
                :can-remove="shadowLayers.length > 1"
                @update="updateLayerProperty"
                @activate="setActiveLayer"
                @duplicate="duplicateShadowLayer"
                @remove="removeShadowLayer"
              />
            </div>
          </UISection>

          <!-- Presets -->
          <PresetSelector
            title="Préréglages"
            :presets="shadowPresets"
            :active-preset="activePreset"
            :columns="2"
            @preset-selected="applyPreset"
            @custom-selected="setCustomPreset"
          />
        </div>

        <!-- Preview and Output -->
        <div class="xl:col-span-2 space-y-6">
          <!-- Visual Preview -->
          <UISection title="Aperçu" variant="glass" collapsible>
            <div class="preview-area">
              <div
                class="shadow-preview"
                :style="{ boxShadow: generatedShadow }"
              >
                Élément avec ombre
              </div>
            </div>
          </UISection>

          <!-- CSS Output -->
          <UISection title="Code CSS" variant="glass" collapsible>
            <template #actions>
              <UIButton
                :variant="copied ? 'success' : 'primary'"
                size="sm"
                @click="copyCSS"
              >
                {{ copied ? "✅ Copié!" : "📋 Copier" }}
              </UIButton>
            </template>

            <CodeOutput :code="generatedCSS" language="css" />
          </UISection>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, nextTick } from "vue";
import { UISection, UIButton } from "@/components/ui";
import ToolHeader from "@/components/ui/ToolHeader.vue";
import PresetSelector from "@/components/ui/PresetSelector.vue";
import CodeOutput from "@/components/ui/CodeOutput.vue";
import ShadowLayer from "./ShadowGenerator/ShadowLayer.vue";

// State management
const shadowLayers = ref([
  {
    id: 1,
    offsetX: 0,
    offsetY: 4,
    blur: 6,
    spread: 0,
    color: "#000000",
    opacity: 10,
    inset: false,
    active: true,
  },
]);

const nextLayerId = ref(2);
const activePreset = ref("custom");
const copied = ref(false);

// Shadow presets configuration
const shadowPresets = [
  {
    id: "subtle",
    name: "Subtil",
    icon: "🪶",
    description: "Ombre légère et discrète",
    example: "0 1px 3px rgba(0,0,0,0.12)",
    config: [
      {
        id: 1,
        offsetX: 0,
        offsetY: 1,
        blur: 3,
        spread: 0,
        color: "#000000",
        opacity: 12,
        inset: false,
        active: true,
      },
    ],
  },
  {
    id: "soft",
    name: "Doux",
    icon: "☁️",
    description: "Ombre douce et naturelle",
    example: "0 4px 6px rgba(0,0,0,0.1)",
    config: [
      {
        id: 1,
        offsetX: 0,
        offsetY: 4,
        blur: 6,
        spread: 0,
        color: "#000000",
        opacity: 10,
        inset: false,
        active: true,
      },
    ],
  },
  {
    id: "medium",
    name: "Moyen",
    icon: "⚪",
    description: "Ombre prononcée",
    example: "0 10px 15px rgba(0,0,0,0.1)",
    config: [
      {
        id: 1,
        offsetX: 0,
        offsetY: 10,
        blur: 15,
        spread: 0,
        color: "#000000",
        opacity: 10,
        inset: false,
        active: true,
      },
    ],
  },
  {
    id: "large",
    name: "Grand",
    icon: "⭕",
    description: "Ombre large et marquée",
    example: "0 20px 25px rgba(0,0,0,0.15)",
    config: [
      {
        id: 1,
        offsetX: 0,
        offsetY: 20,
        blur: 25,
        spread: 0,
        color: "#000000",
        opacity: 15,
        inset: false,
        active: true,
      },
    ],
  },
  {
    id: "inner",
    name: "Interne",
    icon: "🔘",
    description: "Ombre interne",
    example: "inset 0 2px 4px rgba(0,0,0,0.1)",
    config: [
      {
        id: 1,
        offsetX: 0,
        offsetY: 2,
        blur: 4,
        spread: 0,
        color: "#000000",
        opacity: 10,
        inset: true,
        active: true,
      },
    ],
  },
  {
    id: "glow",
    name: "Lueur",
    icon: "✨",
    description: "Effet de lueur électrique",
    example: "0 0 20px rgba(0,212,255,0.5)",
    config: [
      {
        id: 1,
        offsetX: 0,
        offsetY: 0,
        blur: 20,
        spread: 0,
        color: "#00D4FF",
        opacity: 50,
        inset: false,
        active: true,
      },
    ],
  },
];

// Computed properties
const generatedShadow = computed(() => {
  return shadowLayers.value
    .map((layer) => {
      const rgba = hexToRgba(layer.color, layer.opacity / 100);
      const insetPrefix = layer.inset ? "inset " : "";
      return `${insetPrefix}${layer.offsetX}px ${layer.offsetY}px ${layer.blur}px ${layer.spread}px ${rgba}`;
    })
    .join(", ");
});

const generatedCSS = computed(() => {
  return `.element {
  box-shadow: ${generatedShadow.value};
}`;
});

// Methods
const addShadowLayer = () => {
  shadowLayers.value.push({
    id: nextLayerId.value++,
    offsetX: 0,
    offsetY: 2,
    blur: 4,
    spread: 0,
    color: "#000000",
    opacity: 20,
    inset: false,
    active: false,
  });
  if (activePreset.value !== "custom") {
    activePreset.value = "custom";
  }
};

const removeShadowLayer = (id) => {
  if (shadowLayers.value.length > 1) {
    shadowLayers.value = shadowLayers.value.filter((layer) => layer.id !== id);
    if (activePreset.value !== "custom") {
      activePreset.value = "custom";
    }
  }
};

const duplicateShadowLayer = (id) => {
  const layer = shadowLayers.value.find((l) => l.id === id);
  if (layer) {
    const newLayer = { ...layer, id: nextLayerId.value++, active: false };
    shadowLayers.value.push(newLayer);
    if (activePreset.value !== "custom") {
      activePreset.value = "custom";
    }
  }
};

const setActiveLayer = (id) => {
  shadowLayers.value.forEach((layer) => (layer.active = layer.id === id));
};

const updateLayerProperty = ({ id, property, value }) => {
  const layer = shadowLayers.value.find((l) => l.id === id);
  if (layer) {
    if (property === "opacity") {
      layer[property] = parseInt(value);
    } else if (["offsetX", "offsetY", "blur", "spread"].includes(property)) {
      layer[property] = parseInt(value);
    } else {
      layer[property] = value;
    }

    if (activePreset.value !== "custom") {
      activePreset.value = "custom";
    }
  }
};

const applyPreset = (preset) => {
  activePreset.value = preset.id;
  shadowLayers.value = preset.config.map((layer) => ({ ...layer }));
  nextLayerId.value = Math.max(...shadowLayers.value.map((l) => l.id)) + 1;
};

const setCustomPreset = () => {
  activePreset.value = "custom";
};

const copyCSS = async () => {
  try {
    await navigator.clipboard.writeText(generatedCSS.value);
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 2000);
  } catch (error) {
    console.error("Failed to copy CSS:", error);
  }
};

// Utility functions
const hexToRgba = (hex, alpha) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};
</script>

<style scoped>
.preview-area {
  background:
    linear-gradient(45deg, #f0f2f5 25%, transparent 25%),
    linear-gradient(-45deg, #f0f2f5 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, #f0f2f5 75%),
    linear-gradient(-45deg, transparent 75%, #f0f2f5 75%);
  background-size: 20px 20px;
  background-position:
    0 0,
    0 10px,
    10px -10px,
    -10px 0px;
  background-color: #ffffff;
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-lg);
  padding: var(--space-10);
}

.shadow-preview {
  background: #ffffff;
  width: 200px;
  height: 120px;
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  transition: var(--duration-normal) var(--easing-ease);
}
</style>
