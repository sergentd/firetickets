<template>
  <div :class="tabsClasses">
    <!-- Tab Navigation -->
    <div class="tabs__header" :class="headerClasses">
      <nav class="tabs__nav" role="tablist" :aria-label="ariaLabel">
        <button
          v-for="tab in tabs"
          :key="getTabId(tab)"
          :class="getTabButtonClasses(tab)"
          role="tab"
          :aria-selected="isTabActive(tab)"
          :aria-controls="getPanelId(tab)"
          :disabled="isTabDisabled(tab)"
          @click="selectTab(tab)"
        >
          <!-- Icon (optional) -->
          <IconSystem
            v-if="getTabIcon(tab)"
            :name="getTabIcon(tab)"
            :size="iconSize"
            class="tab__icon"
          />

          <!-- Label -->
          <span class="tab__label">{{ getTabLabel(tab) }}</span>

          <!-- Badge (optional) -->
          <span
            v-if="getTabBadge(tab) !== undefined"
            :class="getTabBadgeClasses(tab)"
          >
            {{ getTabBadge(tab) }}
          </span>
        </button>
      </nav>
    </div>

    <!-- Tab Panels -->
    <div class="tabs__content">
      <div
        v-for="tab in tabs"
        :key="getTabId(tab)"
        v-show="isTabActive(tab)"
        :id="getPanelId(tab)"
        class="tabs__panel"
        role="tabpanel"
        :aria-labelledby="getTabId(tab)"
      >
        <slot :name="getTabSlotName(tab)" :tab="tab">
          <div v-if="getTabContent(tab)" v-html="getTabContent(tab)" />
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch, useId } from "vue";
import IconSystem from "../IconSystem.vue";

const props = defineProps({
  // Tabs configuration
  tabs: {
    type: Array,
    required: true,
    validator: (tabs) => tabs.length > 0,
  },

  // Active tab (v-model)
  modelValue: {
    type: [String, Number],
    default: null,
  },

  // Keys for tab object properties
  valueKey: {
    type: String,
    default: "value",
  },
  labelKey: {
    type: String,
    default: "label",
  },
  iconKey: {
    type: String,
    default: "icon",
  },
  badgeKey: {
    type: String,
    default: "badge",
  },
  disabledKey: {
    type: String,
    default: "disabled",
  },
  contentKey: {
    type: String,
    default: "content",
  },

  // Appearance
  variant: {
    type: String,
    default: "underline",
    validator: (value) =>
      ["underline", "pills", "enclosed", "soft"].includes(value),
  },
  size: {
    type: String,
    default: "md",
    validator: (value) => ["sm", "md", "lg"].includes(value),
  },
  align: {
    type: String,
    default: "left",
    validator: (value) =>
      ["left", "center", "right", "stretch"].includes(value),
  },

  // Accessibility
  ariaLabel: {
    type: String,
    default: "Tabs",
  },

  // Content
  lazy: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:modelValue", "change"]);

// Internal state
const internalActiveTab = ref(null);
const loadedTabs = ref(new Set());

// Unique ID prefix for accessibility
const idPrefix = useId();

// Computed properties
const activeTab = computed({
  get: () => props.modelValue ?? internalActiveTab.value,
  set: (value) => {
    internalActiveTab.value = value;
    emit("update:modelValue", value);
  },
});

const iconSize = computed(() => {
  const sizeMap = {
    sm: "xs",
    md: "sm",
    lg: "md",
  };
  return sizeMap[props.size] || "sm";
});

// Initialize active tab
watch(
  () => props.tabs,
  (newTabs) => {
    if (newTabs.length > 0 && !activeTab.value) {
      const firstTab = newTabs[0];
      activeTab.value = getTabValue(firstTab);
      if (props.lazy) {
        loadedTabs.value.add(getTabValue(firstTab));
      }
    }
  },
  { immediate: true },
);

// Tab helpers
const getTabValue = (tab) => {
  return typeof tab === "object" ? tab[props.valueKey] : tab;
};

const getTabLabel = (tab) => {
  if (typeof tab === "object") {
    return tab[props.labelKey] || tab[props.valueKey];
  }
  return tab;
};

const getTabIcon = (tab) => {
  return typeof tab === "object" ? tab[props.iconKey] : null;
};

const getTabBadge = (tab) => {
  return typeof tab === "object" ? tab[props.badgeKey] : undefined;
};

const isTabDisabled = (tab) => {
  return typeof tab === "object" ? !!tab[props.disabledKey] : false;
};

const getTabContent = (tab) => {
  return typeof tab === "object" ? tab[props.contentKey] : null;
};

const getTabId = (tab) => {
  return `${idPrefix}-tab-${getTabValue(tab)}`;
};

const getPanelId = (tab) => {
  return `${idPrefix}-panel-${getTabValue(tab)}`;
};

const getTabSlotName = (tab) => {
  return `tab-${getTabValue(tab)}`;
};

const isTabActive = (tab) => {
  return activeTab.value === getTabValue(tab);
};

// Dynamic classes
const tabsClasses = computed(() => [
  "ui-tabs",
  `ui-tabs--${props.variant}`,
  `ui-tabs--${props.size}`,
  `ui-tabs--align-${props.align}`,
]);

const headerClasses = computed(() => [
  "tabs__header--border",
  {
    "tabs__header--no-border":
      props.variant === "pills" || props.variant === "soft",
  },
]);

const getTabButtonClasses = (tab) => {
  const active = isTabActive(tab);
  const disabled = isTabDisabled(tab);

  return [
    "tab",
    `tab--${props.variant}`,
    `tab--${props.size}`,
    {
      "tab--active": active,
      "tab--disabled": disabled,
      "tab--has-icon": getTabIcon(tab),
      "tab--has-badge": getTabBadge(tab) !== undefined,
    },
  ];
};

const getTabBadgeClasses = (tab) => {
  const active = isTabActive(tab);

  return [
    "tab__badge",
    {
      "tab__badge--active": active,
    },
  ];
};

// Methods
const selectTab = (tab) => {
  if (isTabDisabled(tab)) return;

  const value = getTabValue(tab);
  activeTab.value = value;

  if (props.lazy) {
    loadedTabs.value.add(value);
  }

  emit("change", value, tab);
};

// Keyboard navigation
const handleKeydown = (event, currentIndex) => {
  let newIndex = currentIndex;

  switch (event.key) {
    case "ArrowLeft":
      event.preventDefault();
      newIndex = currentIndex > 0 ? currentIndex - 1 : props.tabs.length - 1;
      break;
    case "ArrowRight":
      event.preventDefault();
      newIndex = currentIndex < props.tabs.length - 1 ? currentIndex + 1 : 0;
      break;
    case "Home":
      event.preventDefault();
      newIndex = 0;
      break;
    case "End":
      event.preventDefault();
      newIndex = props.tabs.length - 1;
      break;
    default:
      return;
  }

  // Skip disabled tabs
  while (isTabDisabled(props.tabs[newIndex]) && newIndex !== currentIndex) {
    if (event.key === "ArrowLeft" || event.key === "End") {
      newIndex = newIndex > 0 ? newIndex - 1 : props.tabs.length - 1;
    } else {
      newIndex = newIndex < props.tabs.length - 1 ? newIndex + 1 : 0;
    }
  }

  selectTab(props.tabs[newIndex]);
};

// Public methods
defineExpose({
  selectTab: (value) => {
    const tab = props.tabs.find((t) => getTabValue(t) === value);
    if (tab) selectTab(tab);
  },
  activeTab,
});
</script>

<style scoped>
/* Tabs container */
.ui-tabs {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

/* Header */
.tabs__header {
  position: relative;
}

.tabs__header--border {
  border-bottom: 1px solid var(--border-primary);
}

.tabs__header--no-border {
  border-bottom: none;
}

/* Navigation */
.tabs__nav {
  display: flex;
  gap: var(--space-2);
}

.ui-tabs--align-left .tabs__nav {
  justify-content: flex-start;
}

.ui-tabs--align-center .tabs__nav {
  justify-content: center;
}

.ui-tabs--align-right .tabs__nav {
  justify-content: flex-end;
}

.ui-tabs--align-stretch .tabs__nav {
  justify-content: stretch;
}

.ui-tabs--align-stretch .tab {
  flex: 1;
}

/* Tab button base */
.tab {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  white-space: nowrap;
  font-weight: var(--font-medium);
  cursor: pointer;
  transition: var(--transition-default);
  border: none;
  background: transparent;
  user-select: none;
}

.tab:focus {
  outline: none;
}

.tab:focus-visible {
  outline: 2px solid var(--border-focus);
  outline-offset: 2px;
  border-radius: var(--radius-sm);
}

/* Tab sizes */
.tab--sm {
  padding: var(--space-2) var(--space-3);
  font-size: var(--text-sm);
  gap: var(--space-1);
}

.tab--md {
  padding: var(--space-3) var(--space-4);
  font-size: var(--text-base);
}

.tab--lg {
  padding: var(--space-4) var(--space-5);
  font-size: var(--text-lg);
}

/* Underline variant */
.ui-tabs--underline .tab--underline {
  color: var(--text-primary);
  border-bottom: 2px solid transparent;
  margin-bottom: -1px;
}

.ui-tabs--underline .tab--underline:hover:not(.tab--disabled) {
  color: var(--text-secondary);
  border-bottom-color: var(--border-hover);
}

.ui-tabs--underline .tab--underline.tab--active {
  color: var(--electric-blue);
  border-bottom-color: var(--electric-blue);
}

/* Pills variant */
.ui-tabs--pills .tab--pills {
  color: var(--text-tertiary);
  border-radius: var(--radius-button);
  padding: var(--space-2) var(--space-4);
}

.ui-tabs--pills .tab--pills:hover:not(.tab--disabled) {
  color: var(--text-secondary);
  background: var(--color-hover);
}

.ui-tabs--pills .tab--pills.tab--active {
  color: var(--text-inverse);
  background: var(--electric-blue);
  box-shadow: var(--shadow-button);
}

/* Enclosed variant */
.ui-tabs--enclosed .tab--enclosed {
  color: var(--text-tertiary);
  border: 1px solid var(--border-primary);
  border-bottom: none;
  border-radius: var(--radius-md) var(--radius-md) 0 0;
  margin-bottom: -1px;
  background: var(--glass-bg-dark);
}

.ui-tabs--enclosed .tab--enclosed:hover:not(.tab--disabled) {
  color: var(--text-secondary);
  background: var(--glass-bg-light);
}

.ui-tabs--enclosed .tab--enclosed.tab--active {
  color: var(--text-primary);
  background: var(--glass-bg-lighter);
  border-bottom: 1px solid var(--glass-bg-lighter);
}

/* Soft variant */
.ui-tabs--soft .tab--soft {
  color: var(--text-tertiary);
  border-radius: var(--radius-md);
  background: transparent;
}

.ui-tabs--soft .tab--soft:hover:not(.tab--disabled) {
  color: var(--text-secondary);
  background: var(--glass-bg-light);
}

.ui-tabs--soft .tab--soft.tab--active {
  color: var(--text-accent);
  background: var(--glass-bg-lighter);
  border: 1px solid var(--border-primary);
}

/* Tab icon */
.tab__icon {
  flex-shrink: 0;
  color: inherit;
}

/* Tab label */
.tab__label {
  line-height: var(--leading-tight);
}

/* Tab badge */
.tab__badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.125rem var(--space-2);
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: var(--font-semibold);
  line-height: 1;
  background: transparent;
  color: var(--text-tertiary);
  border: 1px solid var(--border-primary);
  transition: var(--transition-default);
}

.tab__badge--active {
  background: rgba(var(--electric-blue-rgb), 0.2);
  color: var(--electric-blue);
  border-color: var(--electric-blue);
}

.ui-tabs--pills .tab--active .tab__badge,
.ui-tabs--pills .tab--active .tab__badge--active {
  background: rgba(255, 255, 255, 0.2);
  color: var(--text-inverse);
  border-color: rgba(255, 255, 255, 0.3);
}

/* Disabled state */
.tab--disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}

/* Content area */
.tabs__content {
  position: relative;
}

.tabs__panel {
  animation: fadeIn var(--duration-default) var(--easing-default);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(var(--space-2));
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .ui-tabs--align-left .tabs__nav,
  .ui-tabs--align-center .tabs__nav,
  .ui-tabs--align-right .tabs__nav {
    overflow-x: auto;
    overflow-y: hidden;
    -webkit-overflow-scrolling: touch;
  }

  .tab {
    flex-shrink: 0;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .tab,
  .tab__badge,
  .tabs__panel {
    transition: none;
    animation: none;
  }
}
</style>
