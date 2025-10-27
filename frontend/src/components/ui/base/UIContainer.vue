<template>
  <div :class="containerClasses">
    <slot />
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  // Container size variants
  size: {
    type: String,
    default: "default",
    validator: (value) =>
      [
        "xs",
        "sm",
        "md",
        "lg",
        "xl",
        "2xl",
        "full",
        "default",
        "tool",
        "content",
      ].includes(value),
  },

  // Padding variants
  padding: {
    type: String,
    default: "default",
    validator: (value) =>
      ["none", "sm", "md", "lg", "xl", "default", "section"].includes(value),
  },

  // Centering options
  center: {
    type: Boolean,
    default: true,
  },

  // Responsive behavior
  fluid: {
    type: Boolean,
    default: false,
  },

  // Background patterns
  background: {
    type: String,
    default: "none",
    validator: (value) =>
      ["none", "primary", "secondary", "glass", "gradient"].includes(value),
  },

  // Semantic variants for specific use cases
  as: {
    type: String,
    default: "div",
    validator: (value) =>
      ["div", "main", "section", "article", "header", "footer", "nav"].includes(
        value,
      ),
  },
});

// Dynamic classes
const containerClasses = computed(() => [
  "ui-container",
  `ui-container--${props.size}`,
  `ui-container--padding-${props.padding}`,
  `ui-container--bg-${props.background}`,
  {
    "ui-container--center": props.center && !props.fluid,
    "ui-container--fluid": props.fluid,
  },
]);
</script>

<style scoped>
/* Base container styles */
.ui-container {
  width: 100%;
  position: relative;
}

/* Centering */
.ui-container--center {
  margin-left: auto;
  margin-right: auto;
}

/* Size variants - max-width based */
.ui-container--xs {
  max-width: 20rem; /* 320px */
}

.ui-container--sm {
  max-width: 24rem; /* 384px */
}

.ui-container--md {
  max-width: 28rem; /* 448px */
}

.ui-container--lg {
  max-width: 32rem; /* 512px */
}

.ui-container--xl {
  max-width: 36rem; /* 576px */
}

.ui-container--2xl {
  max-width: 42rem; /* 672px */
}

.ui-container--full {
  max-width: none;
}

/* Semantic size variants */
.ui-container--default {
  max-width: 80rem; /* 1280px - default container */
}

.ui-container--tool {
  max-width: 75rem; /* 1200px - optimal for tool interfaces */
}

.ui-container--content {
  max-width: 65rem; /* 1040px - optimal for reading content */
}

/* Padding variants */
.ui-container--padding-none {
  padding: 0;
}

.ui-container--padding-sm {
  padding: 0 var(--space-4);
}

.ui-container--padding-md {
  padding: 0 var(--space-6);
}

.ui-container--padding-lg {
  padding: 0 var(--space-8);
}

.ui-container--padding-xl {
  padding: 0 var(--space-12);
}

.ui-container--padding-default {
  padding: 0 var(--space-6);
}

.ui-container--padding-section {
  padding: var(--section-gap) var(--space-6);
}

/* Background variants */
.ui-container--bg-none {
  background: transparent;
}

.ui-container--bg-primary {
  background: var(--bg-primary);
}

.ui-container--bg-secondary {
  background: var(--bg-secondary);
}

.ui-container--bg-glass {
  background: var(--glass-bg-section);
  backdrop-filter: blur(var(--blur-lg));
}

.ui-container--bg-gradient {
  background:
    radial-gradient(
      circle at 20% 20%,
      rgba(0, 212, 255, 0.1) 0%,
      transparent 50%
    ),
    radial-gradient(
      circle at 80% 80%,
      rgba(0, 212, 255, 0.05) 0%,
      transparent 50%
    ),
    radial-gradient(
      circle at 40% 60%,
      rgba(0, 212, 255, 0.03) 0%,
      transparent 50%
    );
}

/* Fluid behavior */
.ui-container--fluid {
  max-width: none;
  width: 100%;
}

/* Responsive behavior for all containers */
@media (max-width: 1536px) {
  .ui-container--default {
    max-width: 72rem; /* 1152px */
  }

  .ui-container--tool {
    max-width: 68rem; /* 1088px */
  }
}

@media (max-width: 1280px) {
  .ui-container--default {
    max-width: 64rem; /* 1024px */
  }

  .ui-container--tool {
    max-width: 60rem; /* 960px */
  }

  .ui-container--content {
    max-width: 56rem; /* 896px */
  }
}

@media (max-width: 1024px) {
  .ui-container--default,
  .ui-container--tool {
    max-width: 48rem; /* 768px */
  }

  .ui-container--content {
    max-width: 44rem; /* 704px */
  }

  /* Reduce padding on medium screens */
  .ui-container--padding-default,
  .ui-container--padding-md {
    padding: 0 var(--space-4);
  }

  .ui-container--padding-lg {
    padding: 0 var(--space-6);
  }

  .ui-container--padding-section {
    padding: var(--space-6) var(--space-4);
  }
}

@media (max-width: 768px) {
  /* All containers become more compact on mobile */
  .ui-container--default,
  .ui-container--tool,
  .ui-container--content {
    max-width: none;
    margin: 0;
  }

  /* Mobile-first padding */
  .ui-container--padding-default,
  .ui-container--padding-sm,
  .ui-container--padding-md {
    padding: 0 var(--space-4);
  }

  .ui-container--padding-lg,
  .ui-container--padding-xl {
    padding: 0 var(--space-4);
  }

  .ui-container--padding-section {
    padding: var(--space-4);
  }
}

@media (max-width: 480px) {
  /* Extra small screens - minimal padding */
  .ui-container--padding-default,
  .ui-container--padding-sm,
  .ui-container--padding-md,
  .ui-container--padding-lg,
  .ui-container--padding-xl {
    padding: 0 var(--space-3);
  }

  .ui-container--padding-section {
    padding: var(--space-3);
  }
}

/* Common layout patterns using containers */

/* Header/Navigation container */
.ui-container[role="banner"],
.ui-container:has(nav) {
  border-bottom: 1px solid var(--border-secondary);
}

/* Main content container */
.ui-container[role="main"] {
  min-height: 50vh;
}

/* Footer container */
.ui-container[role="contentinfo"] {
  border-top: 1px solid var(--border-secondary);
  margin-top: auto;
}

/* Tool-specific optimizations */
.ui-container--tool {
  position: relative;
}

.ui-container--tool.ui-container--bg-gradient {
  border-radius: var(--radius-2xl);
  overflow: hidden;
}

/* Content reading optimizations */
.ui-container--content {
  line-height: var(--leading-relaxed);
}

/* Glass container enhancements */
.ui-container--bg-glass {
  border: 1px solid var(--glass-border-lighter);
  border-radius: var(--radius-xl);
}

/* Print styles */
@media print {
  .ui-container {
    max-width: none !important;
    padding: 0 !important;
    background: transparent !important;
    border: none !important;
    box-shadow: none !important;
  }
}
</style>
