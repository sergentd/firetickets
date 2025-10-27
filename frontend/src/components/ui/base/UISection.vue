<template>
  <section :id="sectionId" :class="sectionClasses">
    <!-- Section Header -->
    <header v-if="hasHeader" class="section__header">
      <slot name="header">
        <!-- Title and Description -->
        <div v-if="title || description" class="section__title-group">
          <h2 v-if="title" class="section__title">
            <IconSystem
              v-if="icon"
              :name="icon"
              :size="iconSize"
              class="section__title-icon"
            />
            {{ title }}
          </h2>
          <p v-if="description" class="section__description">
            {{ description }}
          </p>
        </div>

        <!-- Actions slot -->
        <div v-if="$slots.actions" class="section__actions">
          <slot name="actions" />
        </div>
      </slot>

      <!-- Collapsible toggle -->
      <UIButton
        v-if="collapsible"
        variant="ghost"
        size="sm"
        :icon="isCollapsed ? 'chevron-right' : 'chevron-down'"
        @click="toggleCollapsed"
        class="section__toggle"
        :aria-label="isCollapsed ? 'Expand section' : 'Collapse section'"
        :aria-expanded="!isCollapsed"
      />
    </header>

    <!-- Section Content -->
    <div v-show="!isCollapsed" class="section__content" :class="contentClasses">
      <slot />
    </div>

    <!-- Section Footer -->
    <footer v-if="$slots.footer" class="section__footer">
      <slot name="footer" />
    </footer>
  </section>
</template>

<script setup>
import { computed, ref, onMounted } from "vue";
import IconSystem from "@/components/ui/IconSystem.vue";
import UIButton from "./UIButton.vue";

const props = defineProps({
  // Content
  title: {
    type: String,
    default: null,
  },
  description: {
    type: String,
    default: null,
  },
  icon: {
    type: String,
    default: null,
  },
  id: {
    type: String,
    default: null,
  },

  // Appearance
  variant: {
    type: String,
    default: "default",
    validator: (value) =>
      ["default", "glass", "solid", "outline", "minimal"].includes(value),
  },
  size: {
    type: String,
    default: "md",
    validator: (value) => ["sm", "md", "lg", "xl"].includes(value),
  },

  // Layout
  spacing: {
    type: String,
    default: "normal",
    validator: (value) => ["tight", "normal", "loose"].includes(value),
  },
  fullWidth: {
    type: Boolean,
    default: false,
  },

  // Behavior
  collapsible: {
    type: Boolean,
    default: false,
  },
  defaultCollapsed: {
    type: Boolean,
    default: false,
  },
});

// Reactive state for collapsible sections
const isCollapsed = ref(props.defaultCollapsed);

const toggleCollapsed = () => {
  isCollapsed.value = !isCollapsed.value;
};

/**
 * Generate slug from text for IDs
 */
const slugify = (text) => {
  if (!text) return null;
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
    .replace(/[^\w\s-]/g, "") // Remove special chars
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Remove consecutive hyphens
    .trim();
};

// Computed properties
const sectionId = computed(() => {
  // Use explicit ID if provided, otherwise generate from title
  return props.id || (props.title ? slugify(props.title) : null);
});

const hasHeader = computed(() => {
  return (
    props.title ||
    props.description ||
    props.icon ||
    props.$slots?.header ||
    props.$slots?.actions ||
    props.collapsible
  );
});

const iconSize = computed(() => {
  const sizeMap = {
    sm: "sm",
    md: "md",
    lg: "lg",
    xl: "xl",
  };
  return sizeMap[props.size] || "md";
});

const sectionClasses = computed(() => [
  "ui-section",
  `ui-section--${props.variant}`,
  `ui-section--${props.size}`,
  `ui-section--spacing-${props.spacing}`,
  {
    "ui-section--full-width": props.fullWidth,
    "ui-section--collapsible": props.collapsible,
    "ui-section--collapsed": props.collapsible && isCollapsed.value,
    "ui-section--has-header": hasHeader.value,
  },
]);

const contentClasses = computed(() => ({
  "section__content--no-header": !hasHeader.value,
}));
</script>

<style scoped>
/* Base section styles */
.ui-section {
  display: flex;
  flex-direction: column;
  transition: var(--transition-default);
}

/* Section variants */
.ui-section--default {
  background: transparent;
}

.ui-section--glass {
  background: var(--glass-bg-section);
  border: 1px solid var(--glass-border-lighter);
  border-radius: var(--radius-card);
  backdrop-filter: blur(var(--blur-md));
  padding: var(--card-padding);
}

.ui-section--solid {
  background: var(--bg-secondary);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-card);
  padding: var(--card-padding);
}

.ui-section--outline {
  background: transparent;
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-card);
  padding: var(--card-padding);
}

.ui-section--minimal {
  background: transparent;
  border: none;
  padding: 0;
}

/* Size variants */
.ui-section--sm {
  font-size: var(--text-sm);
}

.ui-section--md {
  font-size: var(--text-base);
}

.ui-section--lg {
  font-size: var(--text-lg);
}

.ui-section--xl {
  font-size: var(--text-xl);
}

/* Spacing variants */
.ui-section--spacing-tight .section__content {
  gap: var(--section-gap-sm);
}

.ui-section--spacing-normal .section__content {
  gap: var(--section-gap);
}

.ui-section--spacing-loose .section__content {
  gap: var(--section-gap-lg);
}

/* Full width */
.ui-section--full-width {
  width: 100%;
}

/* Header styles */
.section__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: var(--space-lg);
  position: relative;
}

.section__title-group {
  flex: 1;
}

.section__title {
  margin: 0 0 var(--space-sm) 0;
  color: var(--text-primary);
  font-weight: var(--font-semibold);
  line-height: var(--leading-tight);
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

.ui-section--sm .section__title {
  font-size: var(--text-lg);
}

.ui-section--md .section__title {
  font-size: var(--text-xl);
}

.ui-section--lg .section__title {
  font-size: var(--text-2xl);
}

.ui-section--xl .section__title {
  font-size: var(--text-3xl);
}

.section__title-icon {
  color: var(--text-accent);
}

.section__description {
  margin: 0;
  color: var(--text-secondary);
  line-height: var(--leading-relaxed);
}

.section__actions {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  margin-left: var(--space-lg);
}

.section__toggle {
  margin-left: var(--space-sm);
  flex-shrink: 0;
}

/* Content styles */
.section__content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}

.section__content--no-header {
  margin-top: 0;
}

/* Footer styles */
.section__footer {
  margin-top: var(--space-lg);
  padding-top: var(--space-lg);
  border-top: 1px solid var(--border-secondary);
}

/* Collapsible behavior */
.ui-section--collapsible .section__header {
  cursor: pointer;
  user-select: none;
}

.ui-section--collapsible:not(.ui-section--collapsed) .section__header:hover {
  opacity: 0.8;
}

.ui-section--collapsed .section__content {
  display: none;
}

/* Minimal variant adjustments */
.ui-section--minimal .section__header {
  margin-bottom: var(--space-md);
}

.ui-section--minimal .section__footer {
  margin-top: var(--space-md);
  padding-top: var(--space-md);
}

/* Glass variant hover effects */
.ui-section--glass:hover {
  background: var(--glass-bg-lighter);
  border-color: var(--glass-border-light);
}

/* Outline variant hover effects */
.ui-section--outline:hover {
  border-color: var(--border-hover);
  background: var(--glass-bg-section);
}

/* Focus styles removed - cleaner appearance */
.ui-section--collapsible:focus-within .section__header {
  outline: none;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .section__header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-sm);
  }

  .section__actions {
    margin-left: 0;
    width: 100%;
    justify-content: flex-end;
  }

  .ui-section--glass,
  .ui-section--solid,
  .ui-section--outline {
    padding: var(--card-padding-sm);
  }
}

/* Animation for collapsible content */
@media (prefers-reduced-motion: no-preference) {
  .section__content {
    transition: all var(--duration-normal) var(--easing-smooth);
  }
}
</style>
