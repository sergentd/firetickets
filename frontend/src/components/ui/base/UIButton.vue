<template>
  <component
    :is="tag"
    :class="buttonClasses"
    :disabled="disabled || loading"
    :type="tag === 'button' ? type : undefined"
    :to="tag === 'router-link' ? to : undefined"
    :href="tag === 'a' ? href : undefined"
    :target="tag === 'a' ? target : undefined"
    @click="handleClick"
  >
    <span v-if="loading" class="btn-spinner">
      <svg class="animate-spin" viewBox="0 0 24 24" fill="none">
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
          opacity="0.25"
        />
        <path
          fill="currentColor"
          opacity="0.75"
          d="m4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 0 1 4 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </span>

    <IconSystem
      v-if="icon && !loading"
      :name="icon"
      :size="iconSize"
      class="btn-icon"
      :class="{ 'btn-icon-only': !slots.default }"
    />

    <span v-if="slots.default && !loading" class="btn-content">
      <slot />
    </span>
  </component>
</template>

<script setup>
import { computed, useSlots } from "vue";
import IconSystem from "@/components/ui/IconSystem.vue";

const slots = useSlots();

const props = defineProps({
  // Appearance
  variant: {
    type: String,
    default: "primary",
    validator: (value) =>
      [
        "primary",
        "secondary",
        "ghost",
        "danger",
        "success",
        "warning",
        "filter",
      ].includes(value),
  },
  size: {
    type: String,
    default: "md",
    validator: (value) => ["xs", "sm", "md", "lg", "xl"].includes(value),
  },

  // Behavior
  disabled: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  block: {
    type: Boolean,
    default: false,
  },
  active: {
    type: Boolean,
    default: false,
  },

  // Icon
  icon: {
    type: String,
    default: null,
  },
  iconOnly: {
    type: Boolean,
    default: false,
  },

  // HTML attributes
  type: {
    type: String,
    default: "button",
    validator: (value) => ["button", "submit", "reset"].includes(value),
  },

  // Navigation (when used as link)
  to: {
    type: [String, Object],
    default: null,
  },
  href: {
    type: String,
    default: null,
  },
  target: {
    type: String,
    default: null,
  },
});

const emit = defineEmits(["click"]);

// Determine which HTML tag to use
const tag = computed(() => {
  if (props.to) return "router-link";
  if (props.href) return "a";
  return "button";
});

// Calculate icon size based on button size
const iconSize = computed(() => {
  const sizeMap = {
    xs: "xs",
    sm: "sm",
    md: "sm",
    lg: "md",
    xl: "lg",
  };
  return sizeMap[props.size] || "sm";
});

// Dynamic classes
const buttonClasses = computed(() => [
  "ui-button",
  `ui-button--${props.variant}`,
  `ui-button--${props.size}`,
  {
    "ui-button--block": props.block,
    "ui-button--icon-only": props.iconOnly || (props.icon && !slots.default),
    "ui-button--loading": props.loading,
    "ui-button--disabled": props.disabled,
    "ui-button--active": props.active,
  },
]);

const handleClick = (event) => {
  if (!props.disabled && !props.loading) {
    emit("click", event);
  }
};
</script>

<style scoped>
/* Base button styles */
.ui-button {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-sm);
  border: none;
  border-radius: var(--radius-button);
  font-family: inherit;
  font-weight: var(--font-medium);
  text-decoration: none;
  cursor: pointer;
  user-select: none;
  transition: var(--transition-default);
  white-space: nowrap;

  /* Prevent text selection */
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}

.ui-button:focus {
  outline: none;
  box-shadow: none;
}

/* Button variants */
.ui-button--primary {
  background: var(--electric-blue);
  color: var(--text-inverse);
  box-shadow: var(--shadow-button);
}

.ui-button--primary:hover:not(:disabled) {
  background: var(--electric-blue-light);
  box-shadow: var(--shadow-glow);
  transform: translateY(-1px);
}

.ui-button--primary:active {
  background: var(--electric-blue-dark);
  transform: translateY(0);
}

.ui-button--secondary {
  background: var(--glass-bg-light);
  color: var(--text-primary);
  border: 1px solid var(--border-primary);
  backdrop-filter: blur(var(--blur-md));
}

.ui-button--secondary:hover:not(:disabled) {
  background: var(--glass-bg-lighter);
  border-color: var(--border-hover);
  transform: translateY(-1px);
  box-shadow: var(--shadow-hover);
}

.ui-button--secondary:active {
  background: var(--glass-bg-dark);
  transform: translateY(0);
}

.ui-button--ghost {
  background: transparent;
  color: var(--text-secondary);
}

.ui-button--ghost:hover:not(:disabled) {
  background: var(--color-hover);
  color: var(--text-primary);
}

.ui-button--ghost:active {
  background: var(--color-active);
}

.ui-button--danger {
  background: var(--color-error);
  color: var(--text-inverse);
  box-shadow: var(--shadow-button);
}

.ui-button--danger:hover:not(:disabled) {
  background: var(--color-error-light);
  transform: translateY(-1px);
  box-shadow: var(--shadow-hover);
}

.ui-button--success {
  background: var(--color-success);
  color: var(--text-inverse);
  box-shadow: var(--shadow-button);
}

.ui-button--success:hover:not(:disabled) {
  background: var(--color-success-light);
  transform: translateY(-1px);
  box-shadow: var(--shadow-hover);
}

.ui-button--warning {
  background: var(--color-warning);
  color: var(--text-inverse);
  box-shadow: var(--shadow-button);
}

.ui-button--warning:hover:not(:disabled) {
  background: var(--color-warning-light);
  transform: translateY(-1px);
  box-shadow: var(--shadow-hover);
}

.ui-button--filter {
  background: transparent;
  color: var(--text-secondary);
  border: 1px solid var(--border-primary);
}

.ui-button--filter:hover:not(:disabled) {
  background: var(--glass-bg-light);
  color: var(--text-primary);
  border-color: var(--border-hover);
}

.ui-button--filter.ui-button--active {
  background: var(--electric-blue-alpha);
  border-color: var(--electric-blue-darker);
}

/* Button sizes */
.ui-button--xs {
  padding: var(--space-1) var(--space-3);
  font-size: var(--text-xs);
  min-height: 1.75rem;
}

.ui-button--sm {
  padding: var(--button-padding-sm-y) var(--button-padding-sm-x);
  font-size: var(--text-sm);
  min-height: 2rem;
}

.ui-button--md {
  padding: var(--button-padding-y) var(--button-padding-x);
  font-size: var(--text-base);
  min-height: 2.5rem;
}

.ui-button--lg {
  padding: var(--button-padding-lg-y) var(--button-padding-lg-x);
  font-size: var(--text-lg);
  min-height: 3rem;
}

.ui-button--xl {
  padding: var(--space-5) var(--space-8);
  font-size: var(--text-xl);
  min-height: 3.5rem;
}

/* Icon-only buttons */
.ui-button--icon-only {
  gap: 0;
}

.ui-button--icon-only.ui-button--xs {
  padding: var(--space-1);
  width: 1.75rem;
}

.ui-button--icon-only.ui-button--sm {
  padding: var(--space-2);
  width: 2rem;
}

.ui-button--icon-only.ui-button--md {
  padding: var(--space-3);
  width: 2.5rem;
}

.ui-button--icon-only.ui-button--lg {
  padding: var(--space-4);
  width: 3rem;
}

.ui-button--icon-only.ui-button--xl {
  padding: var(--space-5);
  width: 3.5rem;
}

/* Block button */
.ui-button--block {
  width: 100%;
}

/* Loading and disabled states */
.ui-button--disabled,
.ui-button--loading {
  opacity: 0.6;
  cursor: not-allowed;
  pointer-events: none;
}

.ui-button--loading {
  opacity: 0.8;
}

/* Loading spinner */
.btn-spinner {
  display: inline-flex;
  width: 1em;
  height: 1em;
}

.btn-spinner svg {
  width: 100%;
  height: 100%;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

/* Icon styling */
.btn-icon {
  flex-shrink: 0;
}

.btn-icon-only {
  margin: 0;
}

/* Content wrapper */
.btn-content {
  display: inline-flex;
  align-items: center;
}
</style>
