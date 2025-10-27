<template>
  <div class="preset-selector">
    <h3 v-if="title" class="preset-title">{{ title }}</h3>

    <div :class="['preset-grid', gridClass]">
      <div v-for="preset in presets" :key="preset.id" class="preset-item">
        <UIButton
          :variant="activePreset === preset.id ? 'primary' : 'secondary'"
          size="md"
          block
          class="preset-btn"
          @click="selectPreset(preset)"
          :title="preset.description"
        >
          <div class="preset-content">
            <div v-if="preset.icon" class="preset-icon">{{ preset.icon }}</div>
            <span class="preset-name">{{ preset.name }}</span>
          </div>
        </UIButton>
      </div>
    </div>

    <!-- Custom preset option -->
    <div v-if="allowCustom" class="preset-custom-wrapper">
      <UIButton
        :variant="activePreset === 'custom' ? 'primary' : 'secondary'"
        size="md"
        block
        @click="selectCustom"
        title="Configuration personnalisée"
      >
        <div class="preset-content">
          <div class="preset-icon">⚙️</div>
          <span class="preset-name">Personnalisé</span>
        </div>
      </UIButton>
    </div>

    <!-- Preset details -->
    <div v-if="showDetails && selectedPresetDetails" class="preset-details">
      <div class="preset-details-description">
        {{ selectedPresetDetails.description }}
      </div>
      <div v-if="selectedPresetDetails.example" class="preset-details-example">
        {{ selectedPresetDetails.example }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import UIButton from "@/components/ui/base/UIButton.vue";

const props = defineProps({
  title: {
    type: String,
    default: "Modèles",
  },
  presets: {
    type: Array,
    required: true,
    validator: (presets) => {
      return presets.every(
        (preset) => preset.id && preset.name && preset.config,
      );
    },
  },
  activePreset: {
    type: String,
    default: null,
  },
  allowCustom: {
    type: Boolean,
    default: true,
  },
  showDetails: {
    type: Boolean,
    default: true,
  },
  columns: {
    type: Number,
    default: 2,
  },
});

const emit = defineEmits(["preset-selected", "custom-selected"]);

const gridClass = computed(() => {
  return `grid-cols-${props.columns}`;
});

const selectedPresetDetails = computed(() => {
  if (props.activePreset === "custom") return null;
  return props.presets.find((p) => p.id === props.activePreset) || null;
});

const selectPreset = (preset) => {
  emit("preset-selected", {
    id: preset.id,
    name: preset.name,
    config: preset.config,
    description: preset.description,
  });
};

const selectCustom = () => {
  emit("custom-selected");
};
</script>

<style scoped>
.preset-selector {
  width: 100%;
}

.preset-title {
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin-bottom: var(--space-3);
}

.preset-grid {
  display: grid;
  gap: var(--space-2);
}

.preset-item {
  width: 100%;
}

.preset-btn {
  min-height: 70px;
}

.preset-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2);
}

.preset-icon {
  font-size: var(--text-lg);
  line-height: 1;
}

.preset-name {
  font-size: var(--text-xs);
  text-align: center;
  line-height: var(--leading-tight);
}

.preset-custom-wrapper {
  margin-top: var(--space-3);
}

.preset-details {
  margin-top: var(--space-3);
  padding: var(--space-3);
  background: var(--glass-bg-light);
  border-radius: var(--radius-md);
  border: 1px solid var(--border-primary);
}

.preset-details-description {
  font-size: var(--text-xs);
  color: var(--text-tertiary);
  line-height: var(--leading-relaxed);
}

.preset-details-example {
  margin-top: var(--space-1);
  font-size: var(--text-xs);
  color: var(--text-muted);
  font-family: var(--font-mono, monospace);
  line-height: var(--leading-relaxed);
}

/* Grid column utilities */
.grid-cols-1 {
  grid-template-columns: repeat(1, minmax(0, 1fr));
}
.grid-cols-2 {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}
.grid-cols-3 {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}
.grid-cols-4 {
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

/* Responsive */
@media (max-width: 640px) {
  .preset-grid {
    gap: var(--space-2);
  }

  .grid-cols-2,
  .grid-cols-3,
  .grid-cols-4 {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }
}
</style>
