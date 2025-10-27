<template>
  <div :class="fieldClasses">
    <!-- Label -->
    <label
      v-if="label || $slots.label"
      :for="selectId"
      class="select__label"
      :class="labelClasses"
    >
      <slot name="label">{{ label }}</slot>
      <span v-if="required" class="select__required" aria-label="required"
        >*</span
      >
    </label>

    <!-- Select wrapper -->
    <div class="select__wrapper" :class="wrapperClasses">
      <!-- Leading icon -->
      <IconSystem
        v-if="iconLeading"
        :name="iconLeading"
        :size="iconSize"
        class="select__icon select__icon--leading"
      />

      <!-- Main select -->
      <select
        :id="selectId"
        ref="selectRef"
        :class="selectClasses"
        :value="modelValue"
        :disabled="disabled"
        :required="required"
        :multiple="multiple"
        :aria-describedby="ariaDescribedby"
        :aria-invalid="hasError"
        @change="handleChange"
        @focus="handleFocus"
        @blur="handleBlur"
      >
        <!-- Placeholder option -->
        <option
          v-if="placeholder && !multiple"
          value=""
          disabled
          :selected="!modelValue"
        >
          {{ placeholder }}
        </option>

        <!-- Options from prop -->
        <template v-if="options">
          <optgroup
            v-for="group in normalizedOptions"
            :key="group.label || 'default'"
            :label="group.label"
          >
            <option
              v-for="option in group.options"
              :key="getOptionKey(option)"
              :value="getOptionValue(option)"
              :disabled="getOptionDisabled(option)"
              :selected="isOptionSelected(option)"
            >
              {{ getOptionLabel(option) }}
            </option>
          </optgroup>
        </template>

        <!-- Slot-based options -->
        <slot v-else />
      </select>

      <!-- Chevron icon -->
      <IconSystem
        name="chevron-down"
        :size="iconSize"
        class="select__chevron"
        aria-hidden="true"
      />
    </div>

    <!-- Helper text or error message -->
    <div
      v-if="helperText || error || $slots.helper"
      :id="helperId"
      class="select__helper"
      :class="helperClasses"
    >
      <slot name="helper">
        <span v-if="error" class="select__error">{{ error }}</span>
        <span v-else-if="helperText" class="select__help">{{
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
    type: [String, Number, Array],
    default: "",
  },

  // Options
  options: {
    type: Array,
    default: null,
  },
  valueKey: {
    type: String,
    default: "value",
  },
  labelKey: {
    type: String,
    default: "label",
  },
  disabledKey: {
    type: String,
    default: "disabled",
  },
  groupKey: {
    type: String,
    default: "group",
  },

  // Basic attributes
  placeholder: {
    type: String,
    default: "",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  required: {
    type: Boolean,
    default: false,
  },
  multiple: {
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
});

const emit = defineEmits(["update:modelValue", "change", "focus", "blur"]);

// Refs
const selectRef = ref(null);

// Unique IDs for accessibility
const selectId = useId();
const helperId = useId();

// Computed properties
const hasError = computed(() => !!props.error);

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

// Normalize options to support both simple arrays and grouped options
const normalizedOptions = computed(() => {
  if (!props.options) return [];

  const grouped = new Map();

  props.options.forEach((option) => {
    const groupName = getOptionGroup(option) || "default";
    if (!grouped.has(groupName)) {
      grouped.set(groupName, {
        label: groupName === "default" ? null : groupName,
        options: [],
      });
    }
    grouped.get(groupName).options.push(option);
  });

  return Array.from(grouped.values());
});

// Option helpers
const getOptionValue = (option) => {
  if (typeof option === "object" && option !== null) {
    return option[props.valueKey];
  }
  return option;
};

const getOptionLabel = (option) => {
  if (typeof option === "object" && option !== null) {
    return option[props.labelKey] || option[props.valueKey];
  }
  return option;
};

const getOptionDisabled = (option) => {
  if (typeof option === "object" && option !== null) {
    return !!option[props.disabledKey];
  }
  return false;
};

const getOptionGroup = (option) => {
  if (typeof option === "object" && option !== null) {
    return option[props.groupKey];
  }
  return null;
};

const getOptionKey = (option) => {
  return getOptionValue(option) + "_" + getOptionLabel(option);
};

const isOptionSelected = (option) => {
  const value = getOptionValue(option);
  if (props.multiple && Array.isArray(props.modelValue)) {
    return props.modelValue.includes(value);
  }
  return props.modelValue === value;
};

// Dynamic classes
const fieldClasses = computed(() => [
  "ui-select-field",
  `ui-select-field--${props.size}`,
  {
    "ui-select-field--error": hasError.value,
    "ui-select-field--disabled": props.disabled,
    "ui-select-field--multiple": props.multiple,
  },
]);

const wrapperClasses = computed(() => ({
  "select__wrapper--has-icon": props.iconLeading,
}));

const selectClasses = computed(() => [
  "select__field",
  `select__field--${props.variant}`,
  `select__field--${props.size}`,
  {
    "select__field--error": hasError.value,
    "select__field--with-leading-icon": props.iconLeading,
  },
]);

const labelClasses = computed(() => ({
  "select__label--required": props.required,
  "select__label--error": hasError.value,
}));

const helperClasses = computed(() => ({
  "select__helper--error": hasError.value,
}));

// Methods
const handleChange = (event) => {
  let value;
  if (props.multiple) {
    value = Array.from(event.target.selectedOptions, (option) => option.value);
  } else {
    value = event.target.value;
  }
  emit("update:modelValue", value);
  emit("change", value);
};

const handleFocus = (event) => {
  emit("focus", event);
};

const handleBlur = (event) => {
  emit("blur", event);
};

// Public methods
defineExpose({
  focus: () => selectRef.value?.focus(),
  blur: () => selectRef.value?.blur(),
});
</script>

<style scoped>
/* Field container */
.ui-select-field {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

/* Label styles */
.select__label {
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

.select__label--required {
  color: var(--text-primary);
}

.select__label--error {
  color: var(--color-error);
}

.select__required {
  color: var(--color-error);
  font-weight: var(--font-bold);
}

/* Select wrapper */
.select__wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

/* Select field base styles */
.select__field {
  width: 100%;
  border: none;
  outline: none;
  font-family: inherit;
  font-size: var(--text-base);
  line-height: var(--leading-normal);
  color: var(--text-primary);
  background: transparent;
  cursor: pointer;
  transition: var(--transition-default);

  /* Remove default appearance */
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}

.select__field::-ms-expand {
  display: none;
}

/* Select variants */
.select__field--default {
  background: var(--glass-bg-input);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-input);
}

.select__field--default:hover:not(:disabled) {
  border-color: var(--border-hover);
}

.select__field--default:focus {
  border-color: var(--border-focus);
  box-shadow: var(--shadow-focus);
}

.select__field--filled {
  background: var(--bg-secondary);
  border: 1px solid transparent;
  border-radius: var(--radius-input);
}

.select__field--filled:hover:not(:disabled) {
  background: var(--bg-tertiary);
}

.select__field--filled:focus {
  background: var(--bg-tertiary);
  border-color: var(--border-focus);
  box-shadow: var(--shadow-focus);
}

.select__field--outline {
  background: transparent;
  border: 2px solid var(--border-primary);
  border-radius: var(--radius-input);
}

.select__field--outline:hover:not(:disabled) {
  border-color: var(--border-hover);
}

.select__field--outline:focus {
  border-color: var(--border-focus);
}

.select__field--ghost {
  background: transparent;
  border: 1px solid transparent;
  border-radius: var(--radius-input);
}

.select__field--ghost:hover:not(:disabled) {
  background: var(--glass-bg-input);
  border-color: var(--border-primary);
}

.select__field--ghost:focus {
  background: var(--glass-bg-input);
  border-color: var(--border-focus);
  box-shadow: var(--shadow-focus);
}

/* Select sizes */
.select__field--sm {
  padding: var(--space-2) var(--space-3);
  padding-right: 1.75rem; /* Make room for chevron */
  font-size: var(--text-sm);
  min-height: 2rem;
}

.select__field--md {
  padding: var(--input-padding-y) var(--input-padding-x);
  padding-right: 2.25rem; /* Make room for chevron */
  font-size: var(--text-base);
  min-height: 2.5rem;
}

.select__field--lg {
  padding: var(--space-4) var(--space-5);
  padding-right: 2.75rem; /* Make room for chevron */
  font-size: var(--text-lg);
  min-height: 3rem;
}

/* Leading icon adjustments */
.select__field--with-leading-icon.select__field--sm {
  padding-left: 1.75rem;
}

.select__field--with-leading-icon.select__field--md {
  padding-left: 2.25rem;
}

.select__field--with-leading-icon.select__field--lg {
  padding-left: 2.75rem;
}

/* Multiple select adjustments */
.ui-select-field--multiple .select__field {
  cursor: default;
}

.ui-select-field--multiple .select__field--sm {
  min-height: 4rem;
}

.ui-select-field--multiple .select__field--md {
  min-height: 5rem;
}

.ui-select-field--multiple .select__field--lg {
  min-height: 6rem;
}

/* Icon styles */
.select__icon {
  position: absolute;
  color: var(--text-tertiary);
  pointer-events: none;
}

.select__icon--leading {
  left: var(--space-3);
}

.ui-select-field--sm .select__icon--leading {
  left: var(--space-2);
}

.ui-select-field--lg .select__icon--leading {
  left: var(--space-4);
}

/* Chevron icon */
.select__chevron {
  position: absolute;
  right: var(--space-3);
  color: var(--text-tertiary);
  pointer-events: none;
  transition: var(--transition-default);
}

.ui-select-field--sm .select__chevron {
  right: var(--space-2);
}

.ui-select-field--lg .select__chevron {
  right: var(--space-4);
}

.select__field:focus + .select__chevron {
  color: var(--text-accent);
}

/* Option styles (limited styling available) */
.select__field option {
  background: var(--bg-secondary);
  color: var(--text-primary);
  padding: var(--space-2);
}

.select__field option:hover,
.select__field option:focus {
  background: var(--electric-blue);
  color: var(--text-inverse);
}

.select__field option:disabled {
  opacity: 0.6;
  color: var(--text-tertiary);
}

.select__field optgroup {
  background: var(--bg-tertiary);
  color: var(--text-secondary);
  font-weight: var(--font-semibold);
  font-style: normal;
}

/* Error states */
.select__field--error {
  border-color: var(--color-error) !important;
}

.select__field--error:focus {
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.3);
}

.ui-select-field--error .select__icon {
  color: var(--color-error);
}

/* Disabled state */
.select__field:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  background: var(--color-disabled);
}

.ui-select-field--disabled .select__label {
  opacity: 0.6;
}

.ui-select-field--disabled .select__chevron {
  opacity: 0.6;
}

/* Helper text */
.select__helper {
  display: flex;
  align-items: flex-start;
  gap: var(--space-2);
  font-size: var(--text-xs);
  line-height: var(--leading-snug);
}

.select__help {
  color: var(--text-tertiary);
}

.select__error {
  color: var(--color-error);
  font-weight: var(--font-medium);
}

/* Focus styles for accessibility */
.ui-select-field:focus-within .select__label {
  color: var(--text-accent);
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .select__field {
    border-width: 2px;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .select__field,
  .select__chevron {
    transition: none;
  }
}
</style>
