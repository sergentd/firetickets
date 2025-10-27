<template>
  <div :class="fieldClasses">
    <!-- Label -->
    <div v-if="label || $slots.label" class="slider__header">
      <label :for="sliderId" class="slider__label" :class="labelClasses">
        <slot name="label">{{ label }}</slot>
        <span v-if="required" class="slider__required" aria-label="required"
          >*</span
        >
      </label>

      <!-- Value display -->
      <span v-if="showValue" class="slider__value">
        {{ displayValue }}
      </span>
    </div>

    <!-- Slider wrapper -->
    <div class="slider__wrapper">
      <!-- Range input -->
      <input
        :id="sliderId"
        ref="sliderRef"
        type="range"
        :class="sliderClasses"
        :value="modelValue"
        :min="min"
        :max="max"
        :step="step"
        :disabled="disabled"
        :required="required"
        :aria-describedby="ariaDescribedby"
        :aria-valuemin="min"
        :aria-valuemax="max"
        :aria-valuenow="modelValue"
        :aria-valuetext="displayValue"
        @input="handleInput"
        @change="handleChange"
      />

      <!-- Track fill (visual indicator) -->
      <div class="slider__track" :style="trackStyle" />
    </div>

    <!-- Min/Max labels -->
    <div v-if="showMinMax" class="slider__minmax">
      <span class="slider__min">{{ formatValue(min) }}</span>
      <span class="slider__max">{{ formatValue(max) }}</span>
    </div>

    <!-- Helper text or error message -->
    <div
      v-if="helperText || error || $slots.helper"
      :id="helperId"
      class="slider__helper"
      :class="helperClasses"
    >
      <slot name="helper">
        <span v-if="error" class="slider__error">{{ error }}</span>
        <span v-else-if="helperText" class="slider__help">{{
          helperText
        }}</span>
      </slot>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, useId } from "vue";

const props = defineProps({
  // Value
  modelValue: {
    type: Number,
    default: 0,
  },

  // Range
  min: {
    type: Number,
    default: 0,
  },
  max: {
    type: Number,
    default: 100,
  },
  step: {
    type: Number,
    default: 1,
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
  helperText: {
    type: String,
    default: null,
  },

  // Display options
  showValue: {
    type: Boolean,
    default: true,
  },
  showMinMax: {
    type: Boolean,
    default: false,
  },
  valueFormatter: {
    type: Function,
    default: null,
  },
  valueUnit: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["update:modelValue", "change"]);

// Refs
const sliderRef = ref(null);

// Unique IDs for accessibility
const sliderId = useId();
const helperId = useId();

// Computed properties
const hasError = computed(() => !!props.error);

const displayValue = computed(() => {
  return formatValue(props.modelValue);
});

const percentage = computed(() => {
  return ((props.modelValue - props.min) / (props.max - props.min)) * 100;
});

const trackStyle = computed(() => ({
  width: `${percentage.value}%`,
}));

const ariaDescribedby = computed(() => {
  const ids = [];
  if (props.helperText || props.error) ids.push(helperId);
  return ids.length ? ids.join(" ") : undefined;
});

// Dynamic classes
const fieldClasses = computed(() => [
  "ui-slider-field",
  `ui-slider-field--${props.size}`,
  {
    "ui-slider-field--error": hasError.value,
    "ui-slider-field--disabled": props.disabled,
  },
]);

const sliderClasses = computed(() => [
  "slider__input",
  `slider__input--${props.variant}`,
  `slider__input--${props.size}`,
  {
    "slider__input--error": hasError.value,
  },
]);

const labelClasses = computed(() => ({
  "slider__label--required": props.required,
  "slider__label--error": hasError.value,
}));

const helperClasses = computed(() => ({
  "slider__helper--error": hasError.value,
}));

// Methods
const formatValue = (value) => {
  if (props.valueFormatter) {
    return props.valueFormatter(value);
  }
  return props.valueUnit ? `${value}${props.valueUnit}` : String(value);
};

const handleInput = (event) => {
  const value = parseFloat(event.target.value);
  emit("update:modelValue", value);
};

const handleChange = (event) => {
  const value = parseFloat(event.target.value);
  emit("change", value);
};

// Public methods
defineExpose({
  focus: () => sliderRef.value?.focus(),
  blur: () => sliderRef.value?.blur(),
});
</script>

<style scoped>
/* Field container */
.ui-slider-field {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

/* Header with label and value */
.slider__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
}

/* Label styles */
.slider__label {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  color: var(--text-primary);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  line-height: var(--leading-tight);
}

.slider__label--required {
  color: var(--text-primary);
}

.slider__label--error {
  color: var(--color-error);
}

.slider__required {
  color: var(--color-error);
  font-weight: var(--font-bold);
}

/* Value display */
.slider__value {
  color: var(--text-accent);
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  font-variant-numeric: tabular-nums;
  min-width: 3rem;
  text-align: right;
}

/* Slider wrapper */
.slider__wrapper {
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
}

/* Range input base styles */
.slider__input {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  width: 100%;
  background: transparent;
  cursor: pointer;
  position: relative;
  z-index: 2;
}

.slider__input:focus {
  outline: none;
}

/* Track styles (behind the input) */
.slider__track {
  position: absolute;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  height: 100%;
  background: var(--electric-blue);
  border-radius: var(--radius-full);
  pointer-events: none;
  z-index: 1;
  transition: var(--transition-default);
}

/* WebKit/Blink browsers (Chrome, Safari, Edge) */
.slider__input::-webkit-slider-runnable-track {
  width: 100%;
  height: 0.375rem;
  background: var(--glass-bg-light);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-full);
  transition: var(--transition-default);
}

.slider__input::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 1.25rem;
  height: 1.25rem;
  background: var(--electric-blue);
  border: 2px solid var(--bg-primary);
  border-radius: var(--radius-full);
  cursor: pointer;
  box-shadow: var(--shadow-button);
  transition: var(--transition-default);
  margin-top: -0.4375rem; /* Center the thumb: (thumb-height - track-height) / 2 */
}

.slider__input::-webkit-slider-thumb:hover {
  background: var(--electric-blue-light);
  transform: scale(1.1);
  box-shadow: var(--shadow-glow);
}

.slider__input::-webkit-slider-thumb:active {
  background: var(--electric-blue-dark);
  transform: scale(1.05);
}

/* Firefox */
.slider__input::-moz-range-track {
  width: 100%;
  height: 0.375rem;
  background: var(--glass-bg-light);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-full);
  transition: var(--transition-default);
}

.slider__input::-moz-range-thumb {
  width: 1.25rem;
  height: 1.25rem;
  background: var(--electric-blue);
  border: 2px solid var(--bg-primary);
  border-radius: var(--radius-full);
  cursor: pointer;
  box-shadow: var(--shadow-button);
  transition: var(--transition-default);
}

.slider__input::-moz-range-thumb:hover {
  background: var(--electric-blue-light);
  transform: scale(1.1);
  box-shadow: var(--shadow-glow);
}

.slider__input::-moz-range-thumb:active {
  background: var(--electric-blue-dark);
  transform: scale(1.05);
}

/* Electric variant */
.slider__input--electric::-webkit-slider-runnable-track {
  background: linear-gradient(
    90deg,
    var(--electric-blue-dark) 0%,
    var(--electric-blue) 50%,
    var(--electric-blue-light) 100%
  );
  border: none;
}

.slider__input--electric::-moz-range-track {
  background: linear-gradient(
    90deg,
    var(--electric-blue-dark) 0%,
    var(--electric-blue) 50%,
    var(--electric-blue-light) 100%
  );
  border: none;
}

.slider__input--electric + .slider__track {
  background: transparent;
}

/* Sizes */
.ui-slider-field--sm .slider__input::-webkit-slider-runnable-track {
  height: 0.25rem;
}

.ui-slider-field--sm .slider__input::-webkit-slider-thumb {
  width: 1rem;
  height: 1rem;
  margin-top: -0.375rem;
}

.ui-slider-field--sm .slider__input::-moz-range-track {
  height: 0.25rem;
}

.ui-slider-field--sm .slider__input::-moz-range-thumb {
  width: 1rem;
  height: 1rem;
}

.ui-slider-field--sm .slider__track {
  height: 0.25rem;
}

.ui-slider-field--lg .slider__input::-webkit-slider-runnable-track {
  height: 0.5rem;
}

.ui-slider-field--lg .slider__input::-webkit-slider-thumb {
  width: 1.5rem;
  height: 1.5rem;
  margin-top: -0.5rem;
}

.ui-slider-field--lg .slider__input::-moz-range-track {
  height: 0.5rem;
}

.ui-slider-field--lg .slider__input::-moz-range-thumb {
  width: 1.5rem;
  height: 1.5rem;
}

.ui-slider-field--lg .slider__track {
  height: 0.5rem;
}

/* Min/Max labels */
.slider__minmax {
  display: flex;
  justify-content: space-between;
  font-size: var(--text-xs);
  color: var(--text-tertiary);
  margin-top: calc(var(--space-2) * -1);
}

/* Focus state */
.slider__input:focus-visible::-webkit-slider-thumb {
  box-shadow: var(--shadow-focus);
  outline: 2px solid var(--border-focus);
  outline-offset: 2px;
}

.slider__input:focus-visible::-moz-range-thumb {
  box-shadow: var(--shadow-focus);
  outline: 2px solid var(--border-focus);
  outline-offset: 2px;
}

/* Error states */
.slider__input--error::-webkit-slider-runnable-track {
  border-color: var(--color-error);
}

.slider__input--error::-moz-range-track {
  border-color: var(--color-error);
}

.slider__input--error::-webkit-slider-thumb {
  background: var(--color-error);
}

.slider__input--error::-moz-range-thumb {
  background: var(--color-error);
}

.ui-slider-field--error .slider__track {
  background: var(--color-error);
}

/* Disabled state */
.slider__input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.slider__input:disabled::-webkit-slider-thumb {
  cursor: not-allowed;
  background: var(--text-tertiary);
}

.slider__input:disabled::-moz-range-thumb {
  cursor: not-allowed;
  background: var(--text-tertiary);
}

.ui-slider-field--disabled .slider__label,
.ui-slider-field--disabled .slider__value {
  opacity: 0.6;
}

.ui-slider-field--disabled .slider__track {
  background: var(--text-tertiary);
}

/* Helper text */
.slider__helper {
  display: flex;
  align-items: flex-start;
  gap: var(--space-2);
  font-size: var(--text-xs);
  line-height: var(--leading-snug);
}

.slider__help {
  color: var(--text-tertiary);
}

.slider__error {
  color: var(--color-error);
  font-weight: var(--font-medium);
}

/* Focus styles for accessibility */
.ui-slider-field:focus-within .slider__label {
  color: var(--text-accent);
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .slider__input::-webkit-slider-thumb,
  .slider__input::-moz-range-thumb,
  .slider__track {
    transition: none;
  }
}
</style>
