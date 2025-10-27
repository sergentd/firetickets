<template>
  <div class="flex-container-wrapper">
    <div class="flex-container" :style="containerStyles">
      <!-- Axis indicators -->
      <div
        v-if="container.flexDirection === 'row'"
        class="axis-indicator main-axis"
      >
        Main Axis →
      </div>
      <div
        v-if="container.flexDirection === 'column'"
        class="axis-indicator main-axis column"
      >
        Main Axis ↓
      </div>
      <div
        v-if="container.flexDirection === 'row'"
        class="axis-indicator cross-axis"
      >
        Cross Axis
      </div>
      <div
        v-if="container.flexDirection === 'column'"
        class="axis-indicator cross-axis column"
      >
        Cross Axis →
      </div>

      <!-- Flex items -->
      <div
        v-for="item in items"
        :key="item.id"
        class="flex-item"
        :class="{ selected: selectedItemId === item.id }"
        :style="getItemStyles(item)"
        @click="$emit('item-click', item.id)"
      >
        {{ item.id }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  container: {
    type: Object,
    required: true,
  },
  items: {
    type: Array,
    required: true,
  },
  selectedItemId: {
    type: [Number, String],
    default: null,
  },
});

const emit = defineEmits(["item-click"]);

const containerStyles = computed(() => {
  return {
    display: "flex",
    flexDirection: props.container.flexDirection,
    flexWrap: props.container.flexWrap,
    justifyContent: props.container.justifyContent,
    alignItems: props.container.alignItems,
    alignContent: props.container.alignContent,
  };
});

const getItemStyles = (item) => {
  const styles = {};

  if (item.flexGrow !== 0) styles.flexGrow = item.flexGrow;
  if (item.flexShrink !== 1) styles.flexShrink = item.flexShrink;
  if (item.flexBasis !== "auto") styles.flexBasis = item.flexBasis;
  if (item.alignSelf !== "auto") styles.alignSelf = item.alignSelf;

  return styles;
};
</script>

<style scoped>
.flex-container-wrapper {
  position: relative;
  padding: 20px;
}

.flex-container {
  background: rgba(255, 255, 255, 0.95);
  border: 2px dashed #667eea;
  border-radius: 12px;
  padding: 20px;
  min-height: 300px;
  transition: all 0.3s ease;
  position: relative;
}

.flex-item {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 16px;
  margin: 4px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
  min-width: 60px;
  min-height: 60px;
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
}

.flex-item.selected {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  transform: scale(1.05);
}

.flex-item:hover {
  transform: scale(1.02);
}

.flex-item.selected:hover {
  transform: scale(1.05);
}

.axis-indicator {
  position: absolute;
  font-size: 10px;
  color: rgba(102, 126, 234, 0.8);
  font-weight: 600;
  z-index: 10;
  background: rgba(255, 255, 255, 0.9);
  padding: 2px 6px;
  border-radius: 4px;
}

.main-axis {
  top: -20px;
  left: 50%;
  transform: translateX(-50%);
}

.main-axis.column {
  top: 50%;
  left: -60px;
  transform: translateY(-50%) rotate(-90deg);
}

.cross-axis {
  right: -35px;
  top: 50%;
  transform: translateY(-50%) rotate(90deg);
}

.cross-axis.column {
  top: -20px;
  right: 50%;
  transform: translateX(50%);
}
</style>
