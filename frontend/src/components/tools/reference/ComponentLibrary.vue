<template>
  <div class="min-h-screen bg-primary space-y-12">
    <!-- Tool Header -->
    <ToolHeader
      title="Bibliothèque de Composants"
      description="Collection de composants réutilisables de l'application UI Tools Vue"
      icon="component-library"
      category="reference"
      :show-badges="true"
    />

    <!-- Main Content -->
    <div class="container mx-auto px-4 space-y-8">
      <!-- Navigation -->
      <div class="flex flex-wrap justify-center gap-2">
        <UIButton
          v-for="category in categories"
          :key="category.id"
          :variant="activeCategory === category.id ? 'primary' : 'secondary'"
          size="md"
          @click="activeCategory = category.id"
        >
          {{ category.name }}
        </UIButton>
      </div>

      <!-- Components Grid -->
      <div class="grid gap-8">
        <UISection
          v-for="component in filteredComponents"
          :key="component.id"
          :title="component.name"
          variant="glass"
          collapsible
        >
          <template #actions>
            <span class="text-xs text-gray-400">{{ component.path }}</span>
          </template>
          <div class="mb-6">
            <p class="text-gray-300 mb-3">{{ component.description }}</p>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="tag in component.tags"
                :key="tag"
                class="px-2 py-1 bg-electric-blue/20 text-electric-blue text-xs rounded-full"
              >
                {{ tag }}
              </span>
            </div>
          </div>

          <!-- 3-Column Layout: Preview | Code | Props -->
          <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <!-- Left Column: Preview -->
            <div class="lg:col-span-1">
              <h4 class="text-lg font-semibold text-white mb-3">
                Aperçu en direct
              </h4>
              <div
                class="p-4 bg-glass-bg-dark rounded-lg border border-border-primary min-h-[200px] flex items-center justify-center"
              >
                <!-- GlassCard Preview -->
                <GlassCard
                  v-if="component.id === 'glass-card'"
                  title="Générateur de Palette"
                  subtitle="Outil de création de couleurs"
                  class="max-w-sm"
                >
                  <div class="space-y-3">
                    <div class="flex items-center gap-3">
                      <div class="w-6 h-6 rounded-full bg-electric-blue"></div>
                      <span class="text-gray-300 text-sm">#00D4FF</span>
                    </div>
                    <div class="flex items-center gap-3">
                      <div class="w-6 h-6 rounded-full bg-emerald-500"></div>
                      <span class="text-gray-300 text-sm">#10B981</span>
                    </div>
                  </div>
                  <template #footer>
                    <div class="flex gap-2">
                      <button
                        class="px-3 py-1.5 bg-electric-blue text-dark-slate rounded-md text-sm"
                      >
                        Générer
                      </button>
                    </div>
                  </template>
                </GlassCard>

                <!-- CodeBlock Preview -->
                <CodeBlock
                  v-else-if="component.id === 'code-block'"
                  :code="'def hello():\n    print(&quot;Hello World&quot;)'"
                  language="python"
                />

                <!-- ToolCard Preview -->
                <ToolCard
                  v-else-if="component.id === 'tool-card'"
                  :tool="{
                    id: 'palette-generator',
                    titre: 'Générateur de Palette',
                    description:
                      'Créez des palettes de couleurs harmonieuses pour vos projets.',
                    icon: 'palette-generator',
                    migrated: true,
                  }"
                  category="theming"
                  class="max-w-sm"
                />

                <!-- IconSystem Preview -->
                <div
                  v-else-if="component.id === 'icon-system'"
                  class="flex items-center gap-4"
                >
                  <IconSystem
                    name="palette-generator"
                    size="md"
                    variant="default"
                  />
                  <IconSystem
                    name="css-grid-generator"
                    size="xl"
                    variant="mono"
                  />
                  <IconSystem
                    name="color-contrast-checker"
                    size="lg"
                    variant="electric"
                  />
                </div>

                <!-- Default fallback -->
                <span v-else class="text-gray-500"
                  >Aperçu à venir pour {{ component.name }}</span
                >
              </div>
            </div>

            <!-- Middle Column: Code -->
            <div class="lg:col-span-2">
              <h4 class="text-lg font-semibold text-white mb-3">Utilisation</h4>
              <div class="h-fit">
                <CodeBlock :code="component.usage" language="vue" />
              </div>
            </div>

            <!-- Right Column: Props & Documentation -->
            <div class="lg:col-span-1 space-y-6">
              <!-- Props Documentation -->
              <div v-if="component.props && component.props.length > 0">
                <h4 class="text-lg font-semibold text-white mb-3">Props</h4>
                <div class="overflow-x-auto">
                  <div class="space-y-2">
                    <div
                      v-for="prop in component.props"
                      :key="prop.name"
                      class="p-3 bg-glass-bg-dark rounded-lg border border-border-primary/50"
                    >
                      <div class="flex items-center gap-2 mb-1">
                        <span
                          class="text-electric-blue font-mono text-sm font-semibold"
                          >{{ prop.name }}</span
                        >
                        <span class="text-gray-400 text-xs">{{
                          prop.type
                        }}</span>
                      </div>
                      <div class="text-gray-300 text-sm mb-1">
                        {{ prop.description }}
                      </div>
                      <div class="text-gray-500 text-xs">
                        Défaut:
                        <span class="font-mono">{{
                          prop.default || "aucun"
                        }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Events Documentation -->
              <div v-if="component.events && component.events.length > 0">
                <h4 class="text-lg font-semibold text-white mb-3">
                  Événements
                </h4>
                <div class="space-y-2">
                  <div
                    v-for="event in component.events"
                    :key="event.name"
                    class="p-3 bg-glass-bg-dark rounded-lg border border-border-primary/50"
                  >
                    <div class="flex items-center gap-2 mb-1">
                      <span
                        class="text-electric-blue font-mono text-sm font-semibold"
                        >{{ event.name }}</span
                      >
                      <span
                        class="text-gray-400 text-xs"
                        v-if="event.payload"
                        >{{ event.payload }}</span
                      >
                    </div>
                    <div class="text-gray-300 text-sm">
                      {{ event.description }}
                    </div>
                  </div>
                </div>
              </div>

              <!-- Slots Documentation -->
              <div v-if="component.slots && component.slots.length > 0">
                <h4 class="text-lg font-semibold text-white mb-3">Slots</h4>
                <div class="space-y-2">
                  <div
                    v-for="slot in component.slots"
                    :key="slot.name"
                    class="p-3 bg-glass-bg-dark rounded-lg border border-border-primary/50"
                  >
                    <div class="flex items-center gap-2 mb-1">
                      <span
                        class="text-electric-blue font-mono text-sm font-semibold"
                        >{{ slot.name }}</span
                      >
                    </div>
                    <div class="text-gray-300 text-sm">
                      {{ slot.description }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </UISection>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { UISection, UIButton } from "@/components/ui";
import ToolHeader from "@/components/ui/ToolHeader.vue";
import CodeBlock from "@/components/ui/CodeBlock.vue";

// Import all components for previews
import GlassCard from "@/components/ui/GlassCard.vue";
import ToolCard from "@/components/ui/ToolCard.vue";
import IconSystem from "@/components/ui/IconSystem.vue";

const activeCategory = ref("ui");

const categories = [
  { id: "all", name: "Tous" },
  { id: "ui", name: "Composants UI" },
  { id: "layout", name: "Layout" },
  { id: "form", name: "Formulaires" },
  { id: "display", name: "Affichage" },
];

const components = [
  {
    id: "glass-card",
    name: "GlassCard",
    category: "ui",
    description:
      "Carte avec effet de verre pour présenter du contenu avec un design moderne.",
    path: "src/components/ui/GlassCard.vue",
    tags: ["Card", "Glass Effect", "Container"],
    usage: `<GlassCard
  title="Générateur de Palette"
  subtitle="Outil de création de couleurs"
  class="max-w-sm"
>
  <div class="space-y-3">
    <div class="flex items-center gap-3">
      <div class="w-6 h-6 rounded-full bg-electric-blue"></div>
      <span class="text-gray-300 text-sm">#00D4FF</span>
    </div>
    <div class="flex items-center gap-3">
      <div class="w-6 h-6 rounded-full bg-emerald-500"></div>
      <span class="text-gray-300 text-sm">#10B981</span>
    </div>
  </div>
  <template #footer>
    <div class="flex gap-2">
      <button class="px-3 py-1.5 bg-electric-blue text-dark-slate rounded-md text-sm">Générer</button>
    </div>
  </template>
</GlassCard>`,
    props: [
      {
        name: "title",
        type: "String",
        default: "undefined",
        description: "Titre principal de la carte",
      },
      {
        name: "subtitle",
        type: "String",
        default: "undefined",
        description: "Sous-titre optionnel",
      },
    ],
    slots: [
      { name: "default", description: "Contenu principal de la carte" },
      { name: "footer", description: "Zone d'actions en bas de carte" },
    ],
  },
  {
    id: "code-block",
    name: "CodeBlock",
    category: "display",
    description:
      "Composant pour afficher du code avec coloration syntaxique et bouton de copie.",
    path: "src/components/ui/CodeBlock.vue",
    tags: ["Code", "Syntax Highlighting", "Copy"],
    usage: `<CodeBlock
  :code="'def hello():\\n    print(&quot;Hello World&quot;)'"
  language="python"
/>`,
    props: [
      {
        name: "code",
        type: "String",
        default: "required",
        description: "Code à afficher",
      },
      {
        name: "language",
        type: "String",
        default: "'javascript'",
        description: "Langage pour la coloration syntaxique",
      },
    ],
  },
  {
    id: "tool-card",
    name: "ToolCard",
    category: "ui",
    description:
      "Carte pour présenter un outil avec icône, titre et description.",
    path: "src/components/ui/ToolCard.vue",
    tags: ["Tool", "Card", "Navigation"],
    usage: `<ToolCard
  :tool="{
    id: 'palette-generator',
    titre: 'Générateur de Palette',
    description: 'Créez des palettes de couleurs harmonieuses pour vos projets.',
    icon: 'palette-generator',
    migrated: true
  }"
  category="theming"
  class="max-w-sm"
/>`,
    props: [
      {
        name: "tool",
        type: "Object",
        default: "required",
        description: "Objet contenant les données de l'outil",
      },
      {
        name: "category",
        type: "String",
        default: "required",
        description: "Catégorie de l'outil",
      },
    ],
    events: [
      {
        name: "click",
        description: "Émis lors du clic sur la carte",
        payload: "tool: Object",
      },
    ],
  },
  {
    id: "icon-system",
    name: "IconSystem",
    category: "ui",
    description: "Système d'icônes avec différentes tailles et variantes.",
    path: "src/components/ui/IconSystem.vue",
    tags: ["Icon", "System", "Design"],
    usage: `<div class="flex items-center gap-4">
  <IconSystem name="palette-generator" size="md" variant="default" />
  <IconSystem name="css-grid-generator" size="xl" variant="mono" />
  <IconSystem name="color-contrast-checker" size="lg" variant="electric" />
</div>`,
    props: [
      {
        name: "name",
        type: "String",
        default: "required",
        description: "Nom de l'icône",
      },
      {
        name: "size",
        type: "String",
        default: "'md'",
        description: "Taille de l'icône (xs, sm, md, lg, xl, 2xl)",
      },
      {
        name: "variant",
        type: "String",
        default: "'default'",
        description: "Variante de couleur (default, electric, mono, custom)",
      },
    ],
  },
];

const filteredComponents = computed(() => {
  if (activeCategory.value === "all") {
    return components;
  }
  return components.filter(
    (component) => component.category === activeCategory.value,
  );
});
</script>
