import { indexTools } from "../utils/searchIndexer";

// Import components for indexing
import CSSSpecificity from "../components/tools/reference/CSSSpecificity.vue";
import WebdevGlossary from "../components/tools/reference/WebdevGlossary.vue";
import ThemingMultiClient from "../components/tools/reference/ThemingMultiClient.vue";
import WebUIPrinciples from "../components/tools/reference/WebUIPrinciples.vue";
import ComponentLibrary from "../components/tools/reference/ComponentLibrary.vue";

// Define reference tools to pre-index (only tools with documentation content)
const referenceTools = [
  {
    component: CSSSpecificity,
    toolId: "css-specificity",
    toolTitle: "Analyse Interactive de la Spécificité CSS",
    category: "reference",
    route: "/tools/reference/css-specificity",
  },
  {
    component: WebdevGlossary,
    toolId: "glossaire-webdev",
    toolTitle: "Glossaire WEBDEV",
    category: "reference",
    route: "/tools/reference/glossaire-webdev",
  },
  {
    component: ThemingMultiClient,
    toolId: "theming-multiclient",
    toolTitle: "Thèmes Multi-Clients",
    category: "reference",
    route: "/tools/reference/theming-multiclient",
  },
  {
    component: WebUIPrinciples,
    toolId: "webui-principles",
    toolTitle: "Principes WebUI",
    category: "reference",
    route: "/tools/reference/webui-principles",
  },
  {
    component: ComponentLibrary,
    toolId: "component-library",
    toolTitle: "Bibliothèque de Composants",
    category: "reference",
    route: "/tools/reference/component-library",
  },
];

export function initializeSearchIndexer() {
  // Pre-index reference tools in the background
  setTimeout(() => {
    indexTools(referenceTools).catch((error) => {
      console.error("[SearchIndexer] Error during pre-indexing:", error);
    });
  }, 1000); // Delay to ensure app is fully initialized
}
