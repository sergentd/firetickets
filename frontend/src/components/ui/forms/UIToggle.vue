<template>
  <div :class="fieldClasses">
    <!-- Toggle control -->
    <label :class="toggleClasses" :for="toggleId">
      <!-- Hidden checkbox -->
      <input
        :id="toggleId"
        ref="toggleRef"
        type="checkbox"
        class="toggle__input"
        :checked="modelValue"
        :disabled="disabled"
        :required="required"
        :aria-describedby="ariaDescribedby"
        :aria-checked="modelValue"
        @change="handleChange"
      />

      <!-- Visual toggle switch -->
      <span class="toggle__switch">
        <span class="toggle__thumb" />

        <!-- Icons (optional) -->
        <IconSystem
          v-if="checkedIcon"
          :name="checkedIcon"
          size="xs"
          class="toggle__icon toggle__icon--checked"
        />
        <IconSystem
          v-if="uncheckedIcon"
          :name="uncheckedIcon"
          size="xs"
          class="toggle__icon toggle__icon--unchecked"
        />
      </span>

      <!-- Label text -->
      <span v-if="label || $slots.label" class="toggle__label-text">
        <slot name="label">{{ label }}</slot>
        <span v-if="required" class="toggle__required" aria-label="required"
          >*</span
        >
      </span>
    </label>

    <!-- Description text -->
    <p v-if="description" class="toggle__description">
      {{ description }}
    </p>

    <!-- Helper text or error message -->
    <div
      v-if="helperText || error || $slots.helper"
      :id="helperId"
      class="toggle__helper"
      :class="helperClasses"
    >
      <slot name="helper">
        <span v-if="error" class="toggle__error">{{ error }}</span>
        <span v-else-if="helperText" class="toggle__help">{{
          helperText
        }}</span>
      </slot>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, useId } from "vue";
import IconSystem from "../IconSystem.vue";

const props = defineProps({
  // Value
  modelValue: {
    type: Boolean,
    default: false,
  },

  // Basic attributes
  disabled: {
    type: Boolean,
    default: false,
  },
  required: {
    type: Boolean,
    default: false,
  },

  // Validation
  error: {
    type: String,
    default: null,
  },

  // Appearance
  size: {
    type: String,
    default: "md",
    validator: (value) => ["sm", "md", "lg"].includes(value),
  },
  variant: {
    type: String,
    default: "default",
    validator: (value) => ["default", "electric"].includes(value),
  },

  // Label and help
  label: {
    type: String,
    default: null,
  },
  description: {
    type: String,
    default: null,
  },
  helperText: {
    type: String,
    default: null,
  },

  // Icons
  checkedIcon: {
    type: String,
    default: null,
  },
  uncheckedIcon: {
    type: String,
    default: null,
  },

  // Layout
  labelPosition: {
    type: String,
    default: "right",
    validator: (value) => ["left", "right"].includes(value),
  },
});

const emit = defineEmits(["update:modelValue", "change"]);

// Refs
const toggleRef = ref(null);

// Unique IDs for accessibility
const toggleId = useId();
const helperId = useId();

// Computed properties
const hasError = computed(() => !!props.error);

const ariaDescribedby = computed(() => {
  const ids = [];
  if (props.helperText || props.error) ids.push(helperId);
  return ids.length ? ids.join(" ") : undefined;
});

// Dynamic classes
const fieldClasses = computed(() => [
  "ui-toggle-field",
  `ui-toggle-field--${props.size}`,
  {
    "ui-toggle-field--error": hasError.value,
    "ui-toggle-field--disabled": props.disabled,
  },
]);

const toggleClasses = computed(() => [
  "toggle",
  `toggle--${props.variant}`,
  `toggle--${props.size}`,
  `toggle--label-${props.labelPosition}`,
  {
    "toggle--checked": props.modelValue,
    "toggle--error": hasError.value,
    "toggle--disabled": props.disabled,
  },
]);

const helperClasses = computed(() => ({
  "toggle__helper--error": hasError.value,
}));

// Methods
const handleChange = (event) => {
  const value = event.target.checked;
  emit("update:modelValue", value);
  emit("change", value);
};

// Public methods
defineExpose({
  focus: () => toggleRef.value?.focus(),
  blur: () => toggleRef.value?.blur(),
});
</script>

<style scoped>
/* Field container */
.ui-toggle-field {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

/* Toggle control */
.toggle {
  display: inline-flex;
  align-items: center;
  gap: var(--space-3);
  cursor: pointer;
  user-select: none;
}

.toggle--label-left {
  flex-direction: row-reverse;
}

.toggle--disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Hidden checkbox */
.toggle__input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

/* Visual switch */
.toggle__switch {
  position: relative;
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
  background: var(--glass-bg-light);
  border: 2px solid var(--border-primary);
  border-radius: var(--radius-full);
  transition: var(--transition-default);
}

/* Switch sizes */
.toggle--sm .toggle__switch {
  width: 2.25rem;
  height: 1.25rem;
  padding: 0.125rem;
}

.toggle--md .toggle__switch {
  width: 2.75rem;
  height: 1.5rem;
  padding: 0.125rem;
}

.toggle--lg .toggle__switch {
  width: 3.5rem;
  height: 2rem;
  padding: 0.1875rem;
}

/* Thumb */
.toggle__thumb {
  position: absolute;
  background: var(--bg-primary);
  border-radius: var(--radius-full);
  box-shadow: var(--shadow-button);
  transition: var(--transition-default);
}

/* Thumb sizes */
.toggle--sm .toggle__thumb {
  width: 0.875rem;
  height: 0.875rem;
  left: 0.125rem;
}

.toggle--md .toggle__thumb {
  width: 1.125rem;
  height: 1.125rem;
  left: 0.125rem;
}

.toggle--lg .toggle__thumb {
  width: 1.5rem;
  height: 1.5rem;
  left: 0.1875rem;
}

/* Checked state - thumb position */
.toggle--checked.toggle--sm .toggle__thumb {
  transform: translateX(1rem);
}

.toggle--checked.toggle--md .toggle__thumb {
  transform: translateX(1.25rem);
}

.toggle--checked.toggle--lg .toggle__thumb {
  transform: translateX(1.5rem);
}

/* Default variant - checked state */
.toggle--default .toggle__input:checked + .toggle__switch {
  background: var(--electric-blue);
  border-color: var(--electric-blue);
}

.toggle--default:hover:not(.toggle--disabled) .toggle__switch {
  border-color: var(--border-hover);
}

.toggle--default:hover:not(.toggle--disabled)
  .toggle__input:checked
  + .toggle__switch {
  background: var(--electric-blue-light);
  border-color: var(--electric-blue-light);
}

/* Electric variant */
.toggle--electric .toggle__switch {
  background: linear-gradient(
    135deg,
    var(--glass-bg-light) 0%,
    var(--glass-bg-lighter) 100%
  );
}

.toggle--electric .toggle__input:checked + .toggle__switch {
  background: linear-gradient(
    135deg,
    var(--electric-blue-dark) 0%,
    var(--electric-blue-light) 100%
  );
  border-color: transparent;
  box-shadow: var(--shadow-glow);
}

.toggle--electric .toggle__input:checked + .toggle__switch .toggle__thumb {
  background: var(--bg-primary);
  box-shadow: var(--shadow-hover);
}

/* Icons */
.toggle__icon {
  position: absolute;
  color: var(--text-tertiary);
  pointer-events: none;
  transition: var(--transition-default);
}

.toggle__icon--checked {
  left: 0.375rem;
  opacity: 0;
}

.toggle__icon--unchecked {
  right: 0.375rem;
  opacity: 1;
}

.toggle--checked .toggle__icon--checked {
  opacity: 1;
  color: var(--text-inverse);
}

.toggle--checked .toggle__icon--unchecked {
  opacity: 0;
}

/* Label text */
.toggle__label-text {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  color: var(--text-primary);
  font-size: var(--text-base);
  font-weight: var(--font-medium);
  line-height: var(--leading-tight);
}

.toggle--sm .toggle__label-text {
  font-size: var(--text-sm);
}

.toggle--lg .toggle__label-text {
  font-size: var(--text-lg);
}

.toggle__required {
  color: var(--color-error);
  font-weight: var(--font-bold);
}

/* Description */
.toggle__description {
  margin: 0;
  margin-left: calc(
    2.75rem + var(--space-3)
  ); /* Offset by switch width + gap */
  font-size: var(--text-sm);
  color: var(--text-secondary);
  line-height: var(--leading-snug);
}

.toggle--label-left .toggle__description {
  margin-left: 0;
  margin-right: calc(2.75rem + var(--space-3));
}

.toggle--sm .toggle__description {
  margin-left: calc(2.25rem + var(--space-3));
}

.toggle--lg .toggle__description {
  margin-left: calc(3.5rem + var(--space-3));
}

/* Focus state */
.toggle__input:focus-visible + .toggle__switch {
  box-shadow: var(--shadow-focus);
  outline: 2px solid var(--border-focus);
  outline-offset: 2px;
}

/* Error state */
.toggle--error .toggle__switch {
  border-color: var(--color-error);
}

.toggle--error .toggle__input:checked + .toggle__switch {
  background: var(--color-error);
  border-color: var(--color-error);
}

.toggle--error .toggle__label-text {
  color: var(--color-error);
}

/* Disabled state */
.toggle--disabled .toggle__switch {
  background: var(--color-disabled);
  cursor: not-allowed;
}

.toggle--disabled .toggle__thumb {
  background: var(--text-tertiary);
}

/* Helper text */
.toggle__helper {
  display: flex;
  align-items: flex-start;
  gap: var(--space-2);
  font-size: var(--text-xs);
  line-height: var(--leading-snug);
  margin-left: calc(2.75rem + var(--space-3)); /* Match description offset */
}

.toggle--label-left .toggle__helper {
  margin-left: 0;
  margin-right: calc(2.75rem + var(--space-3));
}

.toggle--sm .toggle__helper {
  margin-left: calc(2.25rem + var(--space-3));
}

.toggle--lg .toggle__helper {
  margin-left: calc(3.5rem + var(--space-3));
}

.toggle__help {
  color: var(--text-tertiary);
}

.toggle__error {
  color: var(--color-error);
  font-weight: var(--font-medium);
}

.toggle__helper--error {
  color: var(--color-error);
}

/* Focus styles for accessibility */
.ui-toggle-field:focus-within .toggle__label-text {
  color: var(--text-accent);
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .toggle__switch {
    border-width: 3px;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .toggle__switch,
  .toggle__thumb,
  .toggle__icon {
    transition: none;
  }
}
</style>
