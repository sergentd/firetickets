<template>
  <div :class="fieldClasses">
    <!-- Label -->
    <label
      v-if="label || $slots.label"
      :for="inputId"
      class="input__label"
      :class="labelClasses"
    >
      <slot name="label">{{ label }}</slot>
      <span v-if="required" class="input__required" aria-label="required"
        >*</span
      >
    </label>

    <!-- Input wrapper for icons and addons -->
    <div class="input__wrapper" :class="wrapperClasses">
      <!-- Leading icon -->
      <IconSystem
        v-if="iconLeading"
        :name="iconLeading"
        :size="iconSize"
        class="input__icon input__icon--leading"
      />

      <!-- Main input -->
      <input
        :id="inputId"
        ref="inputRef"
        :class="inputClasses"
        :type="inputType"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :required="required"
        :min="min"
        :max="max"
        :step="step"
        :pattern="pattern"
        :autocomplete="autocomplete"
        :aria-describedby="ariaDescribedby"
        :aria-invalid="hasError"
        @input="handleInput"
        @change="handleChange"
        @focus="handleFocus"
        @blur="handleBlur"
        @keydown="handleKeydown"
      />

      <!-- Trailing icon or toggle for password -->
      <button
        v-if="type === 'password'"
        type="button"
        class="input__toggle"
        @click="togglePasswordVisibility"
        :aria-label="showPassword ? 'Hide password' : 'Show password'"
      >
        <IconSystem
          :name="showPassword ? 'eye-slash' : 'eye'"
          :size="iconSize"
        />
      </button>

      <IconSystem
        v-else-if="iconTrailing"
        :name="iconTrailing"
        :size="iconSize"
        class="input__icon input__icon--trailing"
      />

      <!-- Clear button -->
      <button
        v-if="clearable && modelValue && !disabled && !readonly"
        type="button"
        class="input__clear"
        @click="clearInput"
        aria-label="Clear input"
      >
        <IconSystem name="x" :size="iconSize" />
      </button>
    </div>

    <!-- Helper text or error message -->
    <div
      v-if="helperText || error || $slots.helper"
      :id="helperId"
      class="input__helper"
      :class="helperClasses"
    >
      <slot name="helper">
        <span v-if="error" class="input__error">{{ error }}</span>
        <span v-else-if="helperText" class="input__help">{{ helperText }}</span>
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
    type: [String, Number],
    default: "",
  },

  // Basic attributes
  type: {
    type: String,
    default: "text",
    validator: (value) =>
      ["text", "email", "password", "url", "tel", "search", "number"].includes(
        value,
      ),
  },
  placeholder: {
    type: String,
    default: "",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  readonly: {
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
    validator: (value) =>
      ["default", "filled", "outline", "ghost"].includes(value),
  },

  // Label and help
  label: {
    type: String,
    default: null,
  },
  helperText: {
    type: String,
    default: null,
  },

  // Icons
  iconLeading: {
    type: String,
    default: null,
  },
  iconTrailing: {
    type: String,
    default: null,
  },

  // Features
  clearable: {
    type: Boolean,
    default: false,
  },

  // Number input specific
  min: {
    type: Number,
    default: null,
  },
  max: {
    type: Number,
    default: null,
  },
  step: {
    type: Number,
    default: null,
  },

  // HTML attributes
  pattern: {
    type: String,
    default: null,
  },
  autocomplete: {
    type: String,
    default: null,
  },
});

const emit = defineEmits([
  "update:modelValue",
  "change",
  "focus",
  "blur",
  "keydown",
  "clear",
]);

// Refs
const inputRef = ref(null);
const showPassword = ref(false);

// Unique IDs for accessibility
const inputId = useId();
const helperId = useId();

// Computed properties
const hasError = computed(() => !!props.error);
const hasIcons = computed(
  () =>
    props.iconLeading ||
    props.iconTrailing ||
    props.type === "password" ||
    props.clearable,
);

const inputType = computed(() => {
  if (props.type === "password") {
    return showPassword.value ? "text" : "password";
  }
  return props.type;
});

const iconSize = computed(() => {
  const sizeMap = {
    sm: "xs",
    md: "sm",
    lg: "md",
  };
  return sizeMap[props.size] || "sm";
});

const ariaDescribedby = computed(() => {
  const ids = [];
  if (props.helperText || props.error) ids.push(helperId);
  return ids.length ? ids.join(" ") : undefined;
});

// Dynamic classes
const fieldClasses = computed(() => [
  "ui-input-field",
  `ui-input-field--${props.size}`,
  {
    "ui-input-field--error": hasError.value,
    "ui-input-field--disabled": props.disabled,
    "ui-input-field--readonly": props.readonly,
  },
]);

const wrapperClasses = computed(() => ({
  "input__wrapper--has-icons": hasIcons.value,
  "input__wrapper--leading": props.iconLeading,
  "input__wrapper--trailing":
    props.iconTrailing || props.type === "password" || props.clearable,
}));

const inputClasses = computed(() => [
  "input__field",
  `input__field--${props.variant}`,
  `input__field--${props.size}`,
  {
    "input__field--error": hasError.value,
    "input__field--with-leading-icon": props.iconLeading,
    "input__field--with-trailing-icon":
      props.iconTrailing ||
      props.type === "password" ||
      (props.clearable && props.modelValue),
  },
]);

const labelClasses = computed(() => ({
  "input__label--required": props.required,
  "input__label--error": hasError.value,
}));

const helperClasses = computed(() => ({
  "input__helper--error": hasError.value,
}));

// Methods
const handleInput = (event) => {
  emit("update:modelValue", event.target.value);
};

const handleChange = (event) => {
  emit("change", event.target.value);
};

const handleFocus = (event) => {
  emit("focus", event);
};

const handleBlur = (event) => {
  emit("blur", event);
};

const handleKeydown = (event) => {
  emit("keydown", event);
};

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

const clearInput = () => {
  emit("update:modelValue", "");
  emit("clear");
  inputRef.value?.focus();
};

// Public methods (for parent components)
defineExpose({
  focus: () => inputRef.value?.focus(),
  blur: () => inputRef.value?.blur(),
  select: () => inputRef.value?.select(),
});
</script>

<style scoped>
/* Field container */
.ui-input-field {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

/* Label styles */
.input__label {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  color: var(--text-primary);
  font-family: var(--font-labels);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  line-height: var(--leading-tight);
  letter-spacing: -0.01em;
}

.input__label--required {
  color: var(--text-primary);
}

.input__label--error {
  color: var(--color-error);
}

.input__required {
  color: var(--color-error);
  font-weight: var(--font-bold);
}

/* Input wrapper */
.input__wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

/* Input field base styles */
.input__field {
  width: 100%;
  border: none;
  outline: none;
  font-family: inherit;
  font-size: var(--text-base);
  line-height: var(--leading-normal);
  color: var(--text-primary);
  background: transparent;
  transition: var(--transition-default);
}

/* Hide browser's native password reveal button */
.input__field::-ms-reveal,
.input__field::-ms-clear {
  display: none;
}

.input__field::-webkit-credentials-auto-fill-button,
.input__field::-webkit-textfield-decoration-container {
  visibility: hidden;
  pointer-events: none;
  position: absolute;
  right: 0;
}

.input__field::placeholder {
  color: var(--text-tertiary);
}

/* Input variants */
.input__field--default {
  background: var(--glass-bg-input);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-input);
}

.input__field--default:hover:not(:disabled) {
  border-color: var(--border-hover);
}

.input__field--default:focus {
  border-color: var(--border-focus);
  box-shadow: var(--shadow-focus);
}

.input__field--filled {
  background: var(--bg-secondary);
  border: 1px solid transparent;
  border-radius: var(--radius-input);
}

.input__field--filled:hover:not(:disabled) {
  background: var(--bg-tertiary);
}

.input__field--filled:focus {
  background: var(--bg-tertiary);
  border-color: var(--border-focus);
  box-shadow: var(--shadow-focus);
}

.input__field--outline {
  background: transparent;
  border: 2px solid var(--border-primary);
  border-radius: var(--radius-input);
}

.input__field--outline:hover:not(:disabled) {
  border-color: var(--border-hover);
}

.input__field--outline:focus {
  border-color: var(--border-focus);
}

.input__field--ghost {
  background: transparent;
  border: 1px solid transparent;
  border-radius: var(--radius-input);
}

.input__field--ghost:hover:not(:disabled) {
  background: var(--glass-bg-input);
  border-color: var(--border-primary);
}

.input__field--ghost:focus {
  background: var(--glass-bg-input);
  border-color: var(--border-focus);
  box-shadow: var(--shadow-focus);
}

/* Input sizes */
.input__field--sm {
  padding: var(--space-2) var(--space-3);
  font-size: var(--text-sm);
  min-height: 2rem;
}

.input__field--md {
  padding: var(--input-padding-y) var(--input-padding-x);
  font-size: var(--text-base);
  min-height: 2.5rem;
}

.input__field--lg {
  padding: var(--space-4) var(--space-5);
  font-size: var(--text-lg);
  min-height: 3rem;
}

/* Icon adjustments */
.input__field--with-leading-icon.input__field--sm {
  padding-left: 2rem;
}

.input__field--with-leading-icon.input__field--md {
  padding-left: 2.5rem;
}

.input__field--with-leading-icon.input__field--lg {
  padding-left: 3rem;
}

.input__field--with-trailing-icon.input__field--sm {
  padding-right: 2rem;
}

.input__field--with-trailing-icon.input__field--md {
  padding-right: 2.5rem;
}

.input__field--with-trailing-icon.input__field--lg {
  padding-right: 3rem;
}

/* Icon styles */
.input__icon {
  position: absolute;
  color: var(--text-tertiary);
  pointer-events: none;
  transition: var(--transition-default);
}

.input__icon--leading {
  left: var(--space-3);
}

.input__icon--trailing {
  right: var(--space-3);
}

.ui-input-field--sm .input__icon--leading {
  left: var(--space-2);
}

.ui-input-field--sm .input__icon--trailing {
  right: var(--space-2);
}

.ui-input-field--lg .input__icon--leading {
  left: var(--space-4);
}

.ui-input-field--lg .input__icon--trailing {
  right: var(--space-4);
}

/* Interactive buttons */
.input__toggle,
.input__clear {
  position: absolute;
  right: var(--space-3);
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  color: var(--text-tertiary);
  cursor: pointer;
  transition: var(--transition-default);
  padding: var(--space-1);
  border-radius: var(--radius-sm);
}

.input__toggle:hover,
.input__clear:hover {
  color: var(--text-secondary);
  background: var(--color-hover);
}

.ui-input-field--sm .input__toggle,
.ui-input-field--sm .input__clear {
  right: var(--space-2);
}

.ui-input-field--lg .input__toggle,
.ui-input-field--lg .input__clear {
  right: var(--space-4);
}

/* Error states */
.input__field--error {
  border-color: var(--color-error) !important;
}

.input__field--error:focus {
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.3);
}

.ui-input-field--error .input__icon {
  color: var(--color-error);
}

/* Disabled state */
.input__field:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  background: var(--color-disabled);
}

.ui-input-field--disabled .input__label {
  opacity: 0.6;
}

/* Readonly state */
.input__field:read-only {
  background: var(--bg-tertiary);
  cursor: default;
}

/* Helper text */
.input__helper {
  display: flex;
  align-items: flex-start;
  gap: var(--space-2);
  font-size: var(--text-xs);
  line-height: var(--leading-snug);
}

.input__help {
  color: var(--text-tertiary);
}

.input__error {
  color: var(--color-error);
  font-weight: var(--font-medium);
}

/* Focus styles for accessibility */
.ui-input-field:focus-within .input__label {
  color: var(--text-accent);
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .input__field {
    border-width: 2px;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .input__field,
  .input__icon,
  .input__toggle,
  .input__clear {
    transition: none;
  }
}
</style>
