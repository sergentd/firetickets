<template>
  <div :class="cardClasses" :style="cardStyles">
    <!-- Header slot -->
    <header v-if="$slots.header || title" class="glass-card__header">
      <slot name="header">
        <h3 v-if="title" class="glass-card__title">{{ title }}</h3>
      </slot>
    </header>

    <!-- Main content -->
    <div class="glass-card__content" :class="contentClasses">
      <slot />
    </div>

    <!-- Footer slot -->
    <footer v-if="$slots.footer" class="glass-card__footer">
      <slot name="footer" />
    </footer>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  // Appearance variants
  variant: {
    type: String,
    default: "default",
    validator: (value) =>
      [
        "default",
        "light",
        "lighter",
        "dark",
        "card",
        "section",
        "input",
        "modal",
      ].includes(value),
  },

  // Size variants
  size: {
    type: String,
    default: "md",
    validator: (value) => ["sm", "md", "lg", "xl"].includes(value),
  },

  // Blur intensity
  blur: {
    type: String,
    default: "md",
    validator: (value) =>
      ["none", "sm", "md", "lg", "xl", "2xl", "3xl"].includes(value),
  },

  // Border radius
  rounded: {
    type: String,
    default: "card",
    validator: (value) =>
      [
        "none",
        "sm",
        "md",
        "lg",
        "xl",
        "2xl",
        "3xl",
        "card",
        "button",
        "input",
        "modal",
      ].includes(value),
  },

  // Padding
  padding: {
    type: String,
    default: "card",
    validator: (value) => ["none", "sm", "md", "lg", "card"].includes(value),
  },

  // Interactive states
  hover: {
    type: Boolean,
    default: false,
  },

  // Content layout
  title: {
    type: String,
    default: null,
  },

  // Custom styles
  customBackground: {
    type: String,
    default: null,
  },

  customBorder: {
    type: String,
    default: null,
  },
});

// Dynamic classes
const cardClasses = computed(() => [
  "glass-card",
  `glass-card--${props.variant}`,
  `glass-card--${props.size}`,
  `glass-card--blur-${props.blur}`,
  `glass-card--rounded-${props.rounded}`,
  `glass-card--padding-${props.padding}`,
  {
    "glass-card--hover": props.hover,
    "glass-card--has-header": props.$slots?.header || props.title,
    "glass-card--has-footer": props.$slots?.footer,
  },
]);

const contentClasses = computed(() => ({
  "glass-card__content--no-header": !(props.$slots?.header || props.title),
  "glass-card__content--no-footer": !props.$slots?.footer,
}));

// Custom styles for advanced customization
const cardStyles = computed(() => {
  const styles = {};

  if (props.customBackground) {
    styles.background = props.customBackground;
  }

  if (props.customBorder) {
    styles.border = props.customBorder;
  }

  return styles;
});
</script>

<style scoped>
/* Base glass card styles */
.glass-card {
  position: relative;
  display: flex;
  flex-direction: column;
  transition: var(--transition-default);
  overflow: hidden;
}

/* Glass effect variants */
.glass-card--default {
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
}

.glass-card--light {
  background: var(--glass-bg-light);
  border: 1px solid var(--glass-border-light);
}

.glass-card--lighter {
  background: var(--glass-bg-lighter);
  border: 1px solid var(--glass-border-lighter);
}

.glass-card--dark {
  background: var(--glass-bg-dark);
  border: 1px solid var(--glass-border-light);
}

.glass-card--card {
  background: var(--glass-bg-card);
  border: 1px solid var(--glass-border-light);
}

.glass-card--section {
  background: var(--glass-bg-section);
  border: 1px solid var(--glass-border-lighter);
}

.glass-card--input {
  background: var(--glass-bg-input);
  border: 1px solid var(--border-primary);
}

.glass-card--modal {
  background: var(--glass-bg-modal);
  border: 1px solid var(--glass-border);
}

/* Blur variants */
.glass-card--blur-none {
  backdrop-filter: none;
}

.glass-card--blur-sm {
  backdrop-filter: blur(var(--blur-sm));
}

.glass-card--blur-md {
  backdrop-filter: blur(var(--blur-md));
}

.glass-card--blur-lg {
  backdrop-filter: blur(var(--blur-lg));
}

.glass-card--blur-xl {
  backdrop-filter: blur(var(--blur-xl));
}

.glass-card--blur-2xl {
  backdrop-filter: blur(var(--blur-2xl));
}

.glass-card--blur-3xl {
  backdrop-filter: blur(var(--blur-3xl));
}

/* Size variants - affects shadow and transform */
.glass-card--sm {
  box-shadow: var(--shadow-sm);
}

.glass-card--md {
  box-shadow: var(--shadow-md);
}

.glass-card--lg {
  box-shadow: var(--shadow-lg);
}

.glass-card--xl {
  box-shadow: var(--shadow-xl);
}

/* Border radius variants */
.glass-card--rounded-none {
  border-radius: var(--radius-none);
}

.glass-card--rounded-sm {
  border-radius: var(--radius-sm);
}

.glass-card--rounded-md {
  border-radius: var(--radius-md);
}

.glass-card--rounded-lg {
  border-radius: var(--radius-lg);
}

.glass-card--rounded-xl {
  border-radius: var(--radius-xl);
}

.glass-card--rounded-2xl {
  border-radius: var(--radius-2xl);
}

.glass-card--rounded-3xl {
  border-radius: var(--radius-3xl);
}

.glass-card--rounded-card {
  border-radius: var(--radius-card);
}

.glass-card--rounded-button {
  border-radius: var(--radius-button);
}

.glass-card--rounded-input {
  border-radius: var(--radius-input);
}

.glass-card--rounded-modal {
  border-radius: var(--radius-modal);
}

/* Padding variants */
.glass-card--padding-none {
  padding: 0;
}

.glass-card--padding-sm {
  padding: var(--card-padding-sm);
}

.glass-card--padding-md {
  padding: var(--space-md);
}

.glass-card--padding-lg {
  padding: var(--card-padding-lg);
}

.glass-card--padding-card {
  padding: var(--card-padding);
}

/* Hover effects */
.glass-card--hover:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-hover);
  border-color: var(--border-hover);
}

.glass-card--hover.glass-card--default:hover {
  border-color: var(--glass-border-accent);
  box-shadow: var(--shadow-accent);
}

/* Header styling */
.glass-card__header {
  flex-shrink: 0;
  margin-bottom: var(--space-md);
}

.glass-card__title {
  margin: 0;
  color: var(--text-primary);
  font-size: var(--text-xl);
  font-weight: var(--font-semibold);
  line-height: var(--leading-tight);
}

/* Content styling */
.glass-card__content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

/* Footer styling */
.glass-card__footer {
  flex-shrink: 0;
  margin-top: var(--space-md);
  padding-top: var(--space-md);
  border-top: 1px solid var(--border-secondary);
}

/* Layout adjustments when no header/footer */
.glass-card--has-header .glass-card__content {
  margin-top: 0;
}

.glass-card--has-footer .glass-card__content {
  margin-bottom: 0;
}

/* Special variants for common use cases */
.glass-card--input:focus-within {
  border-color: var(--border-focus);
  box-shadow: var(--shadow-focus);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .glass-card--padding-card {
    padding: var(--card-padding-sm);
  }

  .glass-card--lg,
  .glass-card--xl {
    box-shadow: var(--shadow-md);
  }
}

/* Accessibility improvements */
.glass-card:focus-within {
  outline: none;
}

/* Print styles */
@media print {
  .glass-card {
    background: white !important;
    border: 1px solid #000 !important;
    backdrop-filter: none !important;
    box-shadow: none !important;
  }
}
</style>
