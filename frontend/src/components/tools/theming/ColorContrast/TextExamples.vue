<template>
  <div class="space-y-3">
    <div
      v-for="(example, index) in examples"
      :key="index"
      :style="{
        color: textColor,
        background: backgroundColor,
        fontSize: example.size,
        fontWeight: example.weight,
      }"
      class="example-item"
    >
      {{ example.text }}
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

defineProps({
  textColor: String,
  backgroundColor: String,
});

const examples = ref([
  { text: "Titre principal de la page", size: "24px", weight: "bold" },
  { text: "Sous-titre ou texte important", size: "18px", weight: "600" },
  {
    text: "Texte de contenu standard pour la lecture",
    size: "16px",
    weight: "normal",
  },
  { text: "Texte plus petit pour les détails", size: "14px", weight: "normal" },
  { text: "Texte de lien ou d'action", size: "16px", weight: "500" },
]);
</script>

<style scoped>
.example-item {
  padding: var(--space-3);
  border-radius: var(--radius-md);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: var(--duration-fast) var(--easing-ease);
}

.example-item:hover {
  border-color: var(--electric-blue);
}
</style>
