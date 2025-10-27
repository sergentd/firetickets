<template>
  <UISection :title="title" class="space-y-6">
    <UISection
      v-for="section in sections"
      :key="section.title"
      :title="section.title"
      variant="nested"
      class="control-group"
    >
      <div
        v-for="control in section.controls"
        :key="control.id"
        class="flex-between gap-3"
      >
        <label class="text-secondary text-sm font-medium min-w-[120px]"
          >{{ control.label }}:</label
        >

        <!-- Number input -->
        <input
          v-if="control.type === 'number'"
          :id="control.id"
          :value="control.value"
          @input="handleInput(control.id, $event.target.value)"
          type="number"
          :min="control.min"
          :max="control.max"
          class="control-input"
        />

        <!-- Text input -->
        <input
          v-else-if="control.type === 'text'"
          :id="control.id"
          :value="control.value"
          @input="handleInput(control.id, $event.target.value)"
          type="text"
          :placeholder="control.placeholder"
          class="control-input"
        />

        <!-- Select dropdown -->
        <select
          v-else-if="control.type === 'select'"
          :id="control.id"
          :value="control.value"
          @change="handleInput(control.id, $event.target.value)"
          class="control-input"
        >
          <option
            v-for="option in control.options"
            :key="option.value"
            :value="option.value"
          >
            {{ option.label }}
          </option>
        </select>

        <!-- Range slider -->
        <div
          v-else-if="control.type === 'range'"
          class="flex items-center gap-2 flex-1 max-w-[200px]"
        >
          <input
            :id="control.id"
            :value="control.value"
            @input="handleInput(control.id, $event.target.value)"
            type="range"
            :min="control.min"
            :max="control.max"
            :step="control.step"
            class="flex-1 h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
          />
          <span class="text-secondary text-sm min-w-[40px]"
            >{{ control.value }}{{ control.unit || "" }}</span
          >
        </div>
      </div>
    </UISection>
  </UISection>
</template>

<script setup>
import { computed } from "vue";
import { UISection } from "@/components/ui";

const props = defineProps({
  title: {
    type: String,
    default: "Paramètres",
  },
  sections: {
    type: Array,
    required: true,
    validator: (sections) => {
      return sections.every(
        (section) =>
          section.title &&
          Array.isArray(section.controls) &&
          section.controls.every(
            (control) => control.id && control.label && control.type,
          ),
      );
    },
  },
});

const emit = defineEmits(["update"]);

const handleInput = (controlId, value) => {
  emit("update", { id: controlId, value });
};
</script>

<style scoped>
.control-group {
  @apply flex flex-col items-start space-y-2;
}

.control-input {
  background: var(--glass-bg-input);
  border: 1px solid var(--border-primary);
  color: var(--text-primary);
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-input);
  font-size: 14px;
  min-width: 80px;
  flex: 1;
  max-width: 200px;
  transition: var(--transition-default);
}

.control-input::placeholder {
  color: var(--text-tertiary);
}

.control-input:focus {
  outline: none;
  border-color: var(--border-focus);
  box-shadow: var(--shadow-focus);
}

/* Custom slider styling */
.slider::-webkit-slider-thumb {
  appearance: none;
  height: 18px;
  width: 18px;
  border-radius: 50%;
  background: var(--gradient-electric);
  cursor: pointer;
  border: 2px solid white;
  box-shadow: var(--shadow-sm);
}

.slider::-moz-range-thumb {
  height: 18px;
  width: 18px;
  border-radius: 50%;
  background: var(--gradient-electric);
  cursor: pointer;
  border: 2px solid white;
  box-shadow: var(--shadow-sm);
}
</style>
