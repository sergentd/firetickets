<template>
  <div class="min-h-screen bg-primary space-y-12">
    <!-- Tool Header -->
    <ToolHeader
      title="Terrain de Jeu Flexbox"
      description="Explorez CSS Flexbox avec des contrôles interactifs et des exemples de mise en page"
      icon="flexbox-playground"
      category="theming"
      :show-badges="true"
    />

    <!-- Main Content -->
    <div class="container mx-auto px-4 space-y-8">
      <!-- Tabs Navigation -->
      <UITabs
        v-model="activeTab"
        :tabs="mainTabs"
        variant="underline"
        size="lg"
        value-key="id"
        label-key="label"
      >
        <!-- Playground Tab -->
        <template #tab-playground>
          <div class="grid grid-cols-1 xl:grid-cols-4 gap-6">
            <!-- Container Controls -->
            <div class="xl:col-span-1 space-y-6">
              <UISection title="Conteneur Flex" variant="glass" collapsible>
                <ContainerControls
                  :container="flexState.container"
                  @update="updateContainerProperty"
                  @preset="applyPreset"
                />
              </UISection>
            </div>

            <!-- Flex Container Preview -->
            <div class="xl:col-span-2 space-y-6">
              <UISection title="Conteneur Flexbox" variant="glass" collapsible>
                <template #actions>
                  <div class="flex gap-2">
                    <UIButton
                      variant="success"
                      size="sm"
                      icon="plus"
                      @click="addFlexItem"
                    >
                      Ajouter
                    </UIButton>
                    <UIButton
                      variant="danger"
                      size="sm"
                      @click="removeFlexItem"
                      :disabled="flexState.items.length <= 1"
                    >
                      Supprimer
                    </UIButton>
                  </div>
                </template>

                <FlexContainer
                  :container="flexState.container"
                  :items="flexState.items"
                  :selected-item-id="flexState.selectedItemId"
                  @item-click="selectItem"
                />
              </UISection>

              <!-- CSS Output -->
              <UISection title="Code CSS" variant="glass" collapsible>
                <template #actions>
                  <UIButton
                    :variant="copied ? 'success' : 'primary'"
                    size="sm"
                    @click="copyCSS"
                  >
                    {{ copied ? "✅ Copié!" : "📋 Copier" }}
                  </UIButton>
                </template>

                <CodeOutput :code="generatedCSS" language="css" />
              </UISection>
            </div>

            <!-- Item Controls -->
            <div class="xl:col-span-1">
              <UISection
                title="Propriétés de l'Élément"
                variant="glass"
                collapsible
              >
                <div v-if="selectedItem">
                  <div class="selected-item-indicator glass-light">
                    <p class="text-primary font-medium">
                      Élément {{ selectedItem.id }} sélectionné
                    </p>
                  </div>

                  <ItemControls
                    :item="selectedItem"
                    @update="updateItemProperty"
                  />
                </div>
                <div v-else class="no-selection">
                  Cliquez sur un élément pour voir ses propriétés
                </div>
              </UISection>
            </div>
          </div>
        </template>

        <!-- Theory Tab -->
        <template #tab-theory>
          <UISection title="💡 Théorie Flexbox" variant="glass">
            <FlexboxTheory />
          </UISection>
        </template>
      </UITabs>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from "vue";
import { UISection, UIButton, UITabs } from "@/components/ui";
import ToolHeader from "@/components/ui/ToolHeader.vue";
import CodeOutput from "@/components/ui/CodeOutput.vue";
import ContainerControls from "./FlexboxPlayground/ContainerControls.vue";
import FlexContainer from "./FlexboxPlayground/FlexContainer.vue";
import ItemControls from "./FlexboxPlayground/ItemControls.vue";
import FlexboxTheory from "./FlexboxPlayground/FlexboxTheory.vue";

// Tab state
const activeTab = ref("playground");
const mainTabs = [
  { id: "playground", label: "🎮 Terrain de Jeu" },
  { id: "theory", label: "📚 Théorie" },
];

// State management
const flexState = reactive({
  container: {
    flexDirection: "row",
    flexWrap: "nowrap",
    justifyContent: "flex-start",
    alignItems: "stretch",
    alignContent: "stretch",
  },
  items: [
    { id: 1, flexGrow: 0, flexShrink: 1, flexBasis: "auto", alignSelf: "auto" },
    { id: 2, flexGrow: 0, flexShrink: 1, flexBasis: "auto", alignSelf: "auto" },
    { id: 3, flexGrow: 0, flexShrink: 1, flexBasis: "auto", alignSelf: "auto" },
  ],
  selectedItemId: null,
});

const nextItemId = ref(4);
const copied = ref(false);

// Computed properties
const selectedItem = computed(() => {
  return flexState.items.find((item) => item.id === flexState.selectedItemId);
});

const generatedCSS = computed(() => {
  const containerCSS = Object.keys(flexState.container)
    .map((prop) => {
      const cssProperty = prop.replace(/([A-Z])/g, "-$1").toLowerCase();
      return `    ${cssProperty}: ${flexState.container[prop]};`;
    })
    .join("\n");

  let itemsCSS = "";
  const itemsWithCustomProps = flexState.items.filter(
    (item) =>
      item.flexGrow !== 0 ||
      item.flexShrink !== 1 ||
      item.flexBasis !== "auto" ||
      item.alignSelf !== "auto",
  );

  if (itemsWithCustomProps.length > 0) {
    itemsCSS =
      "\n\n/* Éléments avec propriétés personnalisées */\n" +
      itemsWithCustomProps
        .map((item) => {
          const props = [];
          if (item.flexGrow !== 0)
            props.push(`    flex-grow: ${item.flexGrow};`);
          if (item.flexShrink !== 1)
            props.push(`    flex-shrink: ${item.flexShrink};`);
          if (item.flexBasis !== "auto")
            props.push(`    flex-basis: ${item.flexBasis};`);
          if (item.alignSelf !== "auto")
            props.push(`    align-self: ${item.alignSelf};`);
          return `.flex-item:nth-child(${flexState.items.indexOf(item) + 1}) {\n${props.join("\n")}\n}`;
        })
        .join("\n\n");
  }

  return `.flex-container {\n    display: flex;\n${containerCSS}\n}${itemsCSS}`;
});

// Methods
const updateContainerProperty = ({ property, value }) => {
  flexState.container[property] = value;
};

const updateItemProperty = ({ property, value }) => {
  if (selectedItem.value) {
    selectedItem.value[property] = value;
  }
};

const selectItem = (itemId) => {
  flexState.selectedItemId = itemId;
};

const addFlexItem = () => {
  flexState.items.push({
    id: nextItemId.value++,
    flexGrow: 0,
    flexShrink: 1,
    flexBasis: "auto",
    alignSelf: "auto",
  });
};

const removeFlexItem = () => {
  if (flexState.items.length > 1) {
    if (flexState.selectedItemId) {
      flexState.items = flexState.items.filter(
        (item) => item.id !== flexState.selectedItemId,
      );
      flexState.selectedItemId = null;
    } else {
      flexState.items.pop();
    }
  }
};

const applyPreset = (preset) => {
  switch (preset) {
    case "center":
      flexState.container = {
        flexDirection: "row",
        flexWrap: "nowrap",
        justifyContent: "center",
        alignItems: "center",
        alignContent: "stretch",
      };
      break;
    case "space-between":
      flexState.container = {
        flexDirection: "row",
        flexWrap: "nowrap",
        justifyContent: "space-between",
        alignItems: "center",
        alignContent: "stretch",
      };
      break;
    case "sidebar":
      flexState.container = {
        flexDirection: "row",
        flexWrap: "nowrap",
        justifyContent: "flex-start",
        alignItems: "stretch",
        alignContent: "stretch",
      };
      if (flexState.items[0]) flexState.items[0].flexBasis = "200px";
      if (flexState.items[1]) flexState.items[1].flexGrow = 1;
      break;
    case "navbar":
      flexState.container = {
        flexDirection: "row",
        flexWrap: "nowrap",
        justifyContent: "space-between",
        alignItems: "center",
        alignContent: "stretch",
      };
      break;
    case "card-grid":
      flexState.container = {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-around",
        alignItems: "flex-start",
        alignContent: "flex-start",
      };
      flexState.items.forEach((item) => {
        item.flexBasis = "150px";
        item.flexGrow = 0;
      });
      break;
    case "column-center":
      flexState.container = {
        flexDirection: "column",
        flexWrap: "nowrap",
        justifyContent: "center",
        alignItems: "center",
        alignContent: "stretch",
      };
      break;
  }
};

const copyCSS = async () => {
  try {
    await navigator.clipboard.writeText(generatedCSS.value);
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 2000);
  } catch (error) {
    console.error("Failed to copy CSS:", error);
  }
};
</script>

<style scoped>
.selected-item-indicator {
  padding: var(--space-3);
  border-radius: var(--radius-md);
  margin-bottom: var(--space-4);
}

.no-selection {
  color: var(--text-tertiary);
  text-align: center;
  padding: var(--space-8) var(--space-4);
}
</style>
