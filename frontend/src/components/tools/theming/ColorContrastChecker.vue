<template>
  <div class="min-h-screen bg-primary space-y-12">
    <!-- Tool Header -->
    <ToolHeader
      title="Vérificateur de Contraste"
      description="Vérifiez la conformité WCAG de vos combinaisons de couleurs pour l'accessibilité"
      icon="color-contrast-checker"
      category="theming"
      status="Migré vers Vue"
      :show-badges="true"
    />

    <!-- Main Content -->
    <div class="container mx-auto px-4 space-y-8">
      <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <!-- Controls Panel (1/3) -->
        <div class="xl:col-span-1 space-y-6">
          <UISection title="Couleurs" variant="glass" collapsible>
            <ControlPanel
              :text-color="colors.text"
              :background-color="colors.background"
              @update:textColor="updateTextColor"
              @update:backgroundColor="updateBackgroundColor"
              @swap-colors="swapColors"
              @random-colors="randomColors"
            />
          </UISection>

          <UISection title="Conformité WCAG" variant="glass" collapsible>
            <WCAGInfo :ratio="contrastRatio" />
          </UISection>
        </div>

        <!-- Preview Panel (2/3) -->
        <div class="xl:col-span-2 space-y-6">
          <UISection title="Aperçu" variant="glass" collapsible>
            <PreviewPanel
              :text-color="colors.text"
              :background-color="colors.background"
              :ratio="contrastRatio"
            />
          </UISection>

          <UISection title="Exemples de Texte" variant="glass" collapsible>
            <TextExamples
              :text-color="colors.text"
              :background-color="colors.background"
            />
          </UISection>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from "vue";
import { UISection } from "@/components/ui";
import ToolHeader from "@/components/ui/ToolHeader.vue";
import ControlPanel from "./ColorContrast/ControlPanel.vue";
import PreviewPanel from "./ColorContrast/PreviewPanel.vue";
import WCAGInfo from "./ColorContrast/WCAGInfo.vue";
import TextExamples from "./ColorContrast/TextExamples.vue";

const colors = reactive({
  text: "#000000",
  background: "#FFFFFF",
});

const contrastRatio = computed(() => {
  return getContrastRatio(colors.text, colors.background);
});

function updateTextColor(newColor) {
  colors.text = newColor;
}

function updateBackgroundColor(newColor) {
  colors.background = newColor;
}

function swapColors() {
  const temp = colors.text;
  colors.text = colors.background;
  colors.background = temp;
}

function randomColors() {
  colors.text = randomColor();
  colors.background = randomColor();
}

function getLuminance(hex) {
  const rgb = hexToRgb(hex);
  if (!rgb) return 0;

  const [r, g, b] = [rgb.r, rgb.g, rgb.b].map((c) => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function getContrastRatio(color1, color2) {
  const l1 = getLuminance(color1);
  const l2 = getLuminance(color2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

function randomColor() {
  return (
    "#" +
    Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, "0")
  );
}
</script>
