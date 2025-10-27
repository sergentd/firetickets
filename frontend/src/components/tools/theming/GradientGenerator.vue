<template>
  <div class="min-h-screen bg-primary space-y-12">
    <!-- Tool Header -->
    <ToolHeader
      title="Générateur de Dégradés"
      description="Créez des dégradés CSS magnifiques avec contrôles visuels pour tous types de gradients"
      icon="gradient-generator"
      category="theming"
      :show-badges="true"
    />

    <!-- Main Content -->
    <div class="container mx-auto px-4 space-y-8">
      <div class="grid grid-cols-1 xl:grid-cols-4 gap-6">
        <!-- Controls Panel -->
        <div class="xl:col-span-1 space-y-6">
          <!-- Gradient Type Controls -->
          <UISection title="Type de Dégradé" variant="glass" collapsible>
            <div class="space-y-4">
              <!-- Type Selection -->
              <div>
                <label class="text-sm font-medium text-secondary mb-2 block"
                  >Type</label
                >
                <div class="grid grid-cols-3 gap-2">
                  <button
                    v-for="type in gradientTypes"
                    :key="type.id"
                    @click="updateGradientProperty('type', type.id)"
                    class="p-2 text-xs rounded-lg transition-default text-center"
                    :class="
                      gradientState.type === type.id
                        ? 'glass-accent text-electric'
                        : 'glass-light text-secondary hover-lift-sm'
                    "
                  >
                    <div class="text-lg mb-1">{{ type.icon }}</div>
                    {{ type.name }}
                  </button>
                </div>
              </div>

              <!-- Angle Control for Linear -->
              <div v-if="gradientState.type === 'linear'" class="space-y-2">
                <label class="text-sm font-medium text-secondary"
                  >Angle: {{ gradientState.angle }}°</label
                >
                <input
                  type="range"
                  :value="gradientState.angle"
                  @input="
                    updateGradientProperty(
                      'angle',
                      parseInt($event.target.value),
                    )
                  "
                  min="0"
                  max="360"
                  class="w-full slider"
                />
                <div class="flex justify-between text-xs text-tertiary">
                  <span>0°</span>
                  <span>180°</span>
                  <span>360°</span>
                </div>
              </div>

              <!-- Radial Controls -->
              <div v-if="gradientState.type === 'radial'" class="space-y-3">
                <div>
                  <label class="text-sm font-medium text-secondary mb-2 block"
                    >Position</label
                  >
                  <UISelect
                    :model-value="gradientState.radialPosition"
                    @update:model-value="
                      updateGradientProperty('radialPosition', $event)
                    "
                    :options="radialPositions"
                    size="sm"
                    variant="control"
                  />
                </div>
                <div>
                  <label class="text-sm font-medium text-secondary mb-2 block"
                    >Forme</label
                  >
                  <UISelect
                    :model-value="gradientState.radialShape"
                    @update:model-value="
                      updateGradientProperty('radialShape', $event)
                    "
                    :options="radialShapes"
                    size="sm"
                    variant="control"
                  />
                </div>
              </div>

              <!-- Conic Controls -->
              <div v-if="gradientState.type === 'conic'" class="space-y-2">
                <label class="text-sm font-medium text-secondary"
                  >Rotation: {{ gradientState.conicAngle }}°</label
                >
                <input
                  type="range"
                  :value="gradientState.conicAngle"
                  @input="
                    updateGradientProperty(
                      'conicAngle',
                      parseInt($event.target.value),
                    )
                  "
                  min="0"
                  max="360"
                  class="w-full slider"
                />
              </div>
            </div>
          </UISection>

          <!-- Color Stops -->
          <UISection title="Couleurs" variant="glass" collapsible>
            <template #actions>
              <UIButton
                @click="addColorStop"
                variant="secondary"
                size="sm"
                icon="plus"
              >
                Ajouter
              </UIButton>
            </template>

            <div class="space-y-3">
              <div
                v-for="stop in gradientState.colorStops"
                :key="stop.id"
                class="flex items-center gap-3 p-3 rounded-lg transition-default"
                :class="
                  gradientState.selectedStopId === stop.id
                    ? 'glass-accent border border-electric'
                    : 'glass-light'
                "
              >
                <!-- Color Picker -->
                <input
                  type="color"
                  :value="stop.color"
                  @input="
                    updateColorStop({
                      id: stop.id,
                      property: 'color',
                      value: $event.target.value,
                    })
                  "
                  @click="selectColorStop(stop.id)"
                  class="w-12 h-12 rounded-full border-2 border-primary cursor-pointer hover-lift-sm"
                />

                <!-- Position Control -->
                <div class="flex-1">
                  <div class="flex justify-between text-xs text-tertiary mb-1">
                    <span>Position</span>
                    <span>{{ stop.position }}%</span>
                  </div>
                  <input
                    type="range"
                    :value="stop.position"
                    @input="
                      updateColorStop({
                        id: stop.id,
                        property: 'position',
                        value: parseInt($event.target.value),
                      })
                    "
                    min="0"
                    max="100"
                    class="w-full slider-sm"
                  />
                </div>

                <!-- Remove Button -->
                <UIButton
                  v-if="gradientState.colorStops.length > 2"
                  @click="removeColorStop(stop.id)"
                  variant="ghost"
                  size="sm"
                  icon="x"
                  class="text-accent-red hover:text-accent-red"
                />
              </div>
            </div>
          </UISection>

          <!-- Presets -->
          <UISection title="Préréglages" variant="glass" collapsible>
            <div class="grid grid-cols-2 gap-2">
              <button
                v-for="preset in gradientPresets"
                :key="preset.id"
                @click="applyPreset(preset)"
                class="p-3 rounded-lg text-left transition-default hover-lift-sm"
                :class="
                  activePreset === preset.id
                    ? 'glass-accent border border-electric'
                    : 'glass-light hover:glass-hover'
                "
              >
                <div class="text-lg mb-1">{{ preset.icon }}</div>
                <div class="text-sm font-medium text-primary">
                  {{ preset.name }}
                </div>
                <div class="text-xs text-tertiary">
                  {{ preset.description }}
                </div>
                <div
                  class="w-full h-4 rounded mt-2"
                  :style="{ background: preset.example }"
                ></div>
              </button>
            </div>
          </UISection>
        </div>

        <!-- Preview and Output -->
        <div class="xl:col-span-3 space-y-6">
          <!-- Visual Preview -->
          <UISection title="Aperçu" variant="glass" collapsible>
            <div class="space-y-4">
              <!-- Main Preview -->
              <div class="relative">
                <div
                  class="w-full h-64 rounded-lg border-2 border-primary relative overflow-hidden"
                  :style="{ background: generatedGradient }"
                >
                  <!-- Pattern Overlay for Better Visibility -->
                  <div class="absolute inset-0 opacity-10">
                    <div
                      class="w-full h-full"
                      style="
                        background-image: repeating-linear-gradient(
                          45deg,
                          transparent,
                          transparent 10px,
                          rgba(0, 0, 0, 0.1) 10px,
                          rgba(0, 0, 0, 0.1) 20px
                        );
                      "
                    ></div>
                  </div>

                  <!-- Gradient Info Overlay -->
                  <div
                    class="absolute top-4 left-4 glass-dark px-3 py-2 rounded-lg"
                  >
                    <div class="text-xs text-primary font-mono">
                      {{ gradientState.type.toUpperCase() }}
                    </div>
                    <div class="text-xs text-secondary">
                      {{ gradientState.colorStops.length }} couleur{{
                        gradientState.colorStops.length > 1 ? "s" : ""
                      }}
                    </div>
                  </div>
                </div>
              </div>

              <!-- Mini Previews with Different Applications -->
              <div class="grid grid-cols-4 gap-3">
                <div class="text-center space-y-2">
                  <div
                    class="h-12 rounded-lg border border-primary shadow-sm"
                    :style="{ background: generatedGradient }"
                  ></div>
                  <div class="text-xs text-tertiary">Standard</div>
                </div>
                <div class="text-center space-y-2">
                  <div
                    class="h-12 w-12 mx-auto rounded-full border border-primary shadow-sm"
                    :style="{ background: generatedGradient }"
                  ></div>
                  <div class="text-xs text-tertiary">Bouton</div>
                </div>
                <div class="text-center space-y-2">
                  <div
                    class="h-12 rounded-lg border border-primary shadow-sm relative overflow-hidden glass-light"
                  >
                    <div
                      class="w-full h-2 absolute bottom-0 rounded-b-lg"
                      :style="{ background: generatedGradient }"
                    ></div>
                    <div class="p-2 flex items-center justify-center h-full">
                      <div class="text-xs text-tertiary">Card</div>
                    </div>
                  </div>
                  <div class="text-xs text-tertiary">Accent</div>
                </div>
                <div class="text-center space-y-2">
                  <div
                    class="h-12 rounded-lg border border-primary shadow-sm relative overflow-hidden glass-light"
                  >
                    <div
                      class="w-full h-full opacity-60"
                      :style="{ background: generatedGradient }"
                    ></div>
                  </div>
                  <div class="text-xs text-tertiary">Arrière-plan</div>
                </div>
              </div>
            </div>
          </UISection>

          <!-- CSS Output -->
          <UISection title="Code CSS" variant="glass" collapsible>
            <template #actions>
              <div class="flex gap-2">
                <UIButton
                  @click="randomGradient"
                  variant="secondary"
                  size="sm"
                  icon="shuffle"
                >
                  Aléatoire
                </UIButton>
                <UIButton
                  @click="copyCSS"
                  :variant="copied ? 'success' : 'secondary'"
                  size="sm"
                  :icon="copied ? 'check' : 'clipboard'"
                >
                  {{ copied ? "Copié!" : "Copier" }}
                </UIButton>
              </div>
            </template>

            <div class="space-y-4">
              <!-- Format Selection -->
              <div class="flex gap-1 glass-dark p-1 rounded-lg">
                <button
                  v-for="format in outputFormats"
                  :key="format.id"
                  @click="currentFormat = format.id"
                  class="flex-1 py-2 px-3 text-sm font-medium rounded-md transition-default"
                  :class="
                    currentFormat === format.id
                      ? 'bg-electric text-electric shadow-sm'
                      : 'text-white hover:text-electric-blue'
                  "
                >
                  {{ format.name }}
                </button>
              </div>

              <!-- Code Display -->
              <CodeBlock
                :code="formattedCSS"
                language="css"
                :show-line-numbers="false"
              />

              <!-- Quick Actions -->
              <div
                class="flex justify-between items-center text-xs text-tertiary"
              >
                <span>{{ generatedGradient.length }} caractères</span>
                <div class="flex gap-4">
                  <span>Compatibilité: Tous navigateurs modernes</span>
                  <span>Format: CSS3</span>
                </div>
              </div>
            </div>
          </UISection>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <footer class="mt-16 border-t border-primary glass-light">
      <div class="container mx-auto py-6 px-4 text-center text-tertiary">
        <p>
          &copy; 2025 - Générateur de dégradés CSS. Créez des designs
          magnifiques avec facilité.
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from "vue";
import { UISection, UIButton, UISelect } from "@/components/ui";
import ToolHeader from "@/components/ui/ToolHeader.vue";
import CodeBlock from "@/components/ui/CodeBlock.vue";

// Gradient types
const gradientTypes = [
  { id: "linear", name: "Linéaire", icon: "📐" },
  { id: "radial", name: "Radial", icon: "🎯" },
  { id: "conic", name: "Conique", icon: "🌀" },
];

// Select options
const radialPositions = [
  { label: "Centre", value: "center" },
  { label: "Haut", value: "top" },
  { label: "Bas", value: "bottom" },
  { label: "Gauche", value: "left" },
  { label: "Droite", value: "right" },
  { label: "Haut gauche", value: "top left" },
  { label: "Haut droite", value: "top right" },
  { label: "Bas gauche", value: "bottom left" },
  { label: "Bas droite", value: "bottom right" },
];

const radialShapes = [
  { label: "Ellipse", value: "ellipse" },
  { label: "Cercle", value: "circle" },
];

// Output formats
const outputFormats = [
  { id: "css", name: "CSS" },
  { id: "background", name: "Background" },
  { id: "webkit", name: "Préfixes" },
];

// State management
const gradientState = reactive({
  type: "linear",
  angle: 90,
  radialPosition: "center",
  radialShape: "ellipse",
  conicAngle: 0,
  colorStops: [
    { id: 1, color: "#00D4FF", position: 0 },
    { id: 2, color: "#0099CC", position: 100 },
  ],
  selectedStopId: null,
});

const nextStopId = ref(3);
const activePreset = ref("custom");
const copied = ref(false);
const currentFormat = ref("css");

// Gradient presets with our color scheme
const gradientPresets = [
  {
    id: "electric",
    name: "Electric",
    icon: "⚡",
    description: "Bleu électrique",
    example: "linear-gradient(135deg, #00D4FF 0%, #0099CC 100%)",
    config: {
      type: "linear",
      angle: 135,
      colorStops: [
        { id: 1, color: "#00D4FF", position: 0 },
        { id: 2, color: "#0099CC", position: 100 },
      ],
    },
  },
  {
    id: "sunset",
    name: "Coucher",
    icon: "🌅",
    description: "Chaleur douce",
    example: "linear-gradient(45deg, #FF6B6B 0%, #FFE66D 100%)",
    config: {
      type: "linear",
      angle: 45,
      colorStops: [
        { id: 1, color: "#FF6B6B", position: 0 },
        { id: 2, color: "#FFE66D", position: 100 },
      ],
    },
  },
  {
    id: "ocean",
    name: "Océan",
    icon: "🌊",
    description: "Profondeur marine",
    example: "linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%)",
    config: {
      type: "linear",
      angle: 135,
      colorStops: [
        { id: 1, color: "#4ECDC4", position: 0 },
        { id: 2, color: "#44A08D", position: 100 },
      ],
    },
  },
  {
    id: "neon",
    name: "Néon",
    icon: "🎨",
    description: "Vibrante nuit",
    example: "linear-gradient(135deg, #daa8e6 0%, #00D4FF 100%)",
    config: {
      type: "linear",
      angle: 135,
      colorStops: [
        { id: 1, color: "#daa8e6", position: 0 },
        { id: 2, color: "#00D4FF", position: 100 },
      ],
    },
  },
  {
    id: "fire",
    name: "Feu",
    icon: "🔥",
    description: "Rouge intense",
    example: "linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)",
    config: {
      type: "linear",
      angle: 135,
      colorStops: [
        { id: 1, color: "#FF6B6B", position: 0 },
        { id: 2, color: "#FF8E53", position: 100 },
      ],
    },
  },
  {
    id: "forest",
    name: "Forêt",
    icon: "🌲",
    description: "Vert naturel",
    example: "linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%)",
    config: {
      type: "linear",
      angle: 135,
      colorStops: [
        { id: 1, color: "#4ECDC4", position: 0 },
        { id: 2, color: "#44A08D", position: 100 },
      ],
    },
  },
];

// Computed properties
const generatedGradient = computed(() => {
  const stops = gradientState.colorStops
    .sort((a, b) => a.position - b.position)
    .map((stop) => `${stop.color} ${stop.position}%`)
    .join(", ");

  switch (gradientState.type) {
    case "linear":
      return `linear-gradient(${gradientState.angle}deg, ${stops})`;
    case "radial":
      return `radial-gradient(${gradientState.radialShape} at ${gradientState.radialPosition}, ${stops})`;
    case "conic":
      return `conic-gradient(from ${gradientState.conicAngle}deg, ${stops})`;
    default:
      return `linear-gradient(${gradientState.angle}deg, ${stops})`;
  }
});

const formattedCSS = computed(() => {
  const gradient = generatedGradient.value;

  switch (currentFormat.value) {
    case "css":
      return `.gradient {\n  background: ${gradient};\n}`;
    case "background":
      return `background: ${gradient};`;
    case "webkit":
      return `background: -webkit-${gradient};\nbackground: -moz-${gradient};\nbackground: ${gradient};`;
    default:
      return `.gradient {\n  background: ${gradient};\n}`;
  }
});

// Methods
const updateGradientProperty = (property, value) => {
  gradientState[property] = value;
  if (activePreset.value !== "custom") {
    activePreset.value = "custom";
  }
};

const addColorStop = () => {
  const newPosition =
    gradientState.colorStops.length > 0
      ? Math.max(...gradientState.colorStops.map((s) => s.position)) + 10
      : 50;

  gradientState.colorStops.push({
    id: nextStopId.value++,
    color: "#00D4FF",
    position: Math.min(newPosition, 100),
  });

  if (activePreset.value !== "custom") {
    activePreset.value = "custom";
  }
};

const removeColorStop = (id) => {
  if (gradientState.colorStops.length > 2) {
    gradientState.colorStops = gradientState.colorStops.filter(
      (stop) => stop.id !== id,
    );
    if (gradientState.selectedStopId === id) {
      gradientState.selectedStopId = null;
    }
    if (activePreset.value !== "custom") {
      activePreset.value = "custom";
    }
  }
};

const selectColorStop = (id) => {
  gradientState.selectedStopId = id;
};

const updateColorStop = ({ id, property, value }) => {
  const stop = gradientState.colorStops.find((s) => s.id === id);
  if (stop) {
    stop[property] = value;
    if (activePreset.value !== "custom") {
      activePreset.value = "custom";
    }
  }
};

const applyPreset = (preset) => {
  activePreset.value = preset.id;
  gradientState.type = preset.config.type;
  gradientState.angle = preset.config.angle || 90;
  gradientState.colorStops = preset.config.colorStops.map((stop) => ({
    ...stop,
  }));
  nextStopId.value = Math.max(...gradientState.colorStops.map((s) => s.id)) + 1;
  gradientState.selectedStopId = null;
};

const randomGradient = () => {
  const colors = [
    "#00D4FF",
    "#0099CC",
    "#FF6B6B",
    "#4ECDC4",
    "#FFE66D",
    "#daa8e6",
    "#FF8E53",
  ];
  const numStops = Math.floor(Math.random() * 3) + 2;

  gradientState.colorStops = [];
  for (let i = 0; i < numStops; i++) {
    gradientState.colorStops.push({
      id: i + 1,
      color: colors[Math.floor(Math.random() * colors.length)],
      position: (i / (numStops - 1)) * 100,
    });
  }

  gradientState.angle = Math.floor(Math.random() * 360);
  gradientState.type = ["linear", "radial", "conic"][
    Math.floor(Math.random() * 3)
  ];

  nextStopId.value = numStops + 1;
  activePreset.value = "custom";
  gradientState.selectedStopId = null;
};

const copyCSS = async () => {
  try {
    await navigator.clipboard.writeText(formattedCSS.value);
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 2000);
  } catch (error) {
    console.error("Failed to copy CSS:", error);
  }
};
</script>

<style scoped>
/* Color input styling */
input[type="color"] {
  -webkit-appearance: none;
  border: none;
  cursor: pointer;
}

input[type="color"]::-webkit-color-swatch-wrapper {
  padding: 0;
}

input[type="color"]::-webkit-color-swatch {
  border: none;
  border-radius: 50%;
}

/* Range sliders */
.slider,
.slider-sm {
  -webkit-appearance: none;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  height: 8px;
  outline: none;
  cursor: pointer;
}

.slider-sm {
  height: 6px;
}

.slider::-webkit-slider-thumb,
.slider-sm::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--gradient-electric);
  cursor: pointer;
  border: 2px solid white;
  box-shadow: var(--shadow-sm);
}

.slider-sm::-webkit-slider-thumb {
  width: 16px;
  height: 16px;
}

.slider::-moz-range-thumb,
.slider-sm::-moz-range-thumb {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--gradient-electric);
  cursor: pointer;
  border: 2px solid white;
  box-shadow: var(--shadow-sm);
}
</style>
