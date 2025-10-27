<template>
  <UIGlassCard variant="light" padding="lg">
    <div class="preview-header">
      <h2 class="preview-title">{{ title }}</h2>
      <div v-if="showDimensions" class="preview-dimensions">
        {{ dimensions.width }} × {{ dimensions.height }}
      </div>
    </div>

    <div
      ref="previewContainer"
      :class="['preview-container rounded-lg', containerClass]"
      :style="containerStyle"
    >
      <slot name="content">
        <!-- Default grid items if no slot content provided -->
        <div v-if="gridConfig" class="grid-preview" :style="gridStyle">
          <div
            v-for="item in gridItems"
            :key="item.id"
            :class="['grid-item', itemClass]"
            :style="itemStyle"
            @click="onItemClick(item)"
          >
            <slot name="item" :item="item" :index="item.id">
              {{ item.content || item.id }}
            </slot>
          </div>
        </div>

        <!-- Custom content -->
        <div v-else :style="customStyle">
          <slot />
        </div>
      </slot>
    </div>

    <!-- Info footer -->
    <div v-if="showInfo" class="preview-info">
      <slot name="info">
        {{ infoText }}
      </slot>
    </div>
  </UIGlassCard>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from "vue";
import UIGlassCard from "@/components/ui/base/UIGlassCard.vue";

const props = defineProps({
  title: {
    type: String,
    default: "Aperçu",
  },
  // Grid-specific props
  gridConfig: {
    type: Object,
    default: null,
  },
  // Custom styling
  containerClass: {
    type: String,
    default: "",
  },
  itemClass: {
    type: String,
    default: "",
  },
  containerStyle: {
    type: Object,
    default: () => ({}),
  },
  itemStyle: {
    type: Object,
    default: () => ({}),
  },
  customStyle: {
    type: Object,
    default: () => ({}),
  },
  // Display options
  showDimensions: {
    type: Boolean,
    default: false,
  },
  showInfo: {
    type: Boolean,
    default: false,
  },
  infoText: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["item-click", "resize"]);

const previewContainer = ref(null);
const dimensions = ref({ width: "0px", height: "0px" });

// Computed grid style for CSS Grid
const gridStyle = computed(() => {
  if (!props.gridConfig) return {};

  return {
    display: "grid",
    gridTemplateColumns: props.gridConfig.templateCols || "repeat(3, 1fr)",
    gridTemplateRows: props.gridConfig.templateRows || "repeat(3, 1fr)",
    gap: props.gridConfig.gap || "10px",
    padding: props.gridConfig.padding || "20px",
    minHeight: "300px",
    ...props.containerStyle,
  };
});

// Generate grid items based on grid config
const gridItems = computed(() => {
  if (!props.gridConfig) return [];

  const totalItems =
    (props.gridConfig.columns || 3) * (props.gridConfig.rows || 3);
  return Array.from({ length: totalItems }, (_, index) => ({
    id: index + 1,
    content: index + 1,
  }));
});

const onItemClick = (item) => {
  emit("item-click", item);
};

// Update dimensions when container resizes
const updateDimensions = () => {
  if (previewContainer.value) {
    const rect = previewContainer.value.getBoundingClientRect();
    dimensions.value = {
      width: `${Math.round(rect.width)}px`,
      height: `${Math.round(rect.height)}px`,
    };
    emit("resize", dimensions.value);
  }
};

onMounted(() => {
  nextTick(() => {
    updateDimensions();

    // Observe resize changes
    if (window.ResizeObserver) {
      const resizeObserver = new ResizeObserver(() => {
        updateDimensions();
      });
      resizeObserver.observe(previewContainer.value);
    }
  });
});
</script>

<style scoped>
/* Header */
.preview-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-4);
}

.preview-title {
  font-size: var(--text-xl);
  font-weight: var(--font-bold);
  color: var(--text-primary);
}

.preview-dimensions {
  font-size: var(--text-sm);
  color: var(--text-tertiary);
}

/* Preview Container */
.preview-container {
  background: rgba(255, 255, 255, 0.9);
  border: 2px dashed var(--border-primary);
  border-radius: var(--radius-lg);
  min-height: 300px;
  overflow: auto;
}

.grid-preview {
  width: 100%;
  height: 100%;
}

/* Grid Items - Using electric blue theme */
.grid-item {
  background: linear-gradient(
    135deg,
    var(--electric-blue-dark) 0%,
    var(--electric-blue-light) 100%
  );
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-inverse);
  font-weight: var(--font-medium);
  transition: var(--transition-default);
  min-height: 60px;
  cursor: pointer;
  box-shadow: var(--shadow-sm);
}

.grid-item:hover {
  transform: scale(1.05);
  box-shadow: var(--shadow-glow);
}

/* Info Footer */
.preview-info {
  margin-top: var(--space-4);
  font-size: var(--text-sm);
  color: var(--text-tertiary);
}

/* Custom scrollbar for preview container */
.preview-container::-webkit-scrollbar {
  width: var(--space-2);
  height: var(--space-2);
}

.preview-container::-webkit-scrollbar-track {
  background: var(--glass-bg-dark);
  border-radius: var(--radius-sm);
}

.preview-container::-webkit-scrollbar-thumb {
  background: var(--electric-blue);
  border-radius: var(--radius-sm);
}

.preview-container::-webkit-scrollbar-thumb:hover {
  background: var(--electric-blue-light);
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .grid-item {
    transition: none;
  }

  .grid-item:hover {
    transform: none;
  }
}
</style>
