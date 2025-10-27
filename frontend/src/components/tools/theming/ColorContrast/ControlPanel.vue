<template>
  <div class="space-y-4">
    <!-- Text Color -->
    <div>
      <label class="text-sm font-medium text-secondary mb-2 block"
        >Couleur du Texte</label
      >
      <div class="color-input-group">
        <input
          type="color"
          :value="textColor"
          @input="$emit('update:textColor', $event.target.value)"
          class="color-picker"
        />
        <UIInput
          :model-value="textColor"
          @update:model-value="$emit('update:textColor', $event)"
          placeholder="#000000"
          class="flex-1"
        />
      </div>
      <QuickColors
        :colors="[
          '#000000',
          '#333333',
          '#666666',
          '#999999',
          '#CCCCCC',
          '#FFFFFF',
        ]"
        @select-color="$emit('update:textColor', $event)"
      />
    </div>

    <!-- Background Color -->
    <div>
      <label class="text-sm font-medium text-secondary mb-2 block"
        >Couleur de Fond</label
      >
      <div class="color-input-group">
        <input
          type="color"
          :value="backgroundColor"
          @input="$emit('update:backgroundColor', $event.target.value)"
          class="color-picker"
        />
        <UIInput
          :model-value="backgroundColor"
          @update:model-value="$emit('update:backgroundColor', $event)"
          placeholder="#FFFFFF"
          class="flex-1"
        />
      </div>
      <QuickColors
        :colors="[
          '#000000',
          '#333333',
          '#666666',
          '#999999',
          '#CCCCCC',
          '#FFFFFF',
        ]"
        @select-color="$emit('update:backgroundColor', $event)"
      />
    </div>

    <!-- Actions -->
    <div class="flex gap-2">
      <UIButton
        variant="secondary"
        size="md"
        class="flex-1"
        @click="$emit('swap-colors')"
      >
        🔄 Inverser
      </UIButton>
      <UIButton
        variant="secondary"
        size="md"
        class="flex-1"
        @click="$emit('random-colors')"
      >
        🎲 Aléatoire
      </UIButton>
    </div>
  </div>
</template>

<script setup>
import { UIButton, UIInput } from "@/components/ui";
import QuickColors from "./QuickColors.vue";

defineProps({
  textColor: String,
  backgroundColor: String,
});

defineEmits([
  "update:textColor",
  "update:backgroundColor",
  "swap-colors",
  "random-colors",
]);
</script>

<style scoped>
.color-input-group {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  margin-bottom: var(--space-2);
}

.color-picker {
  width: 60px;
  height: 40px;
  border: 2px solid var(--border-primary);
  border-radius: var(--radius-md);
  cursor: pointer;
  appearance: none;
  background: none;
}

.color-picker::-webkit-color-swatch-wrapper {
  padding: 0;
}

.color-picker::-webkit-color-swatch {
  border: none;
  border-radius: calc(var(--radius-md) - 2px);
}

.color-picker:hover {
  border-color: var(--electric-blue);
}
</style>
