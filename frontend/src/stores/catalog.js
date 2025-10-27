import { defineStore } from "pinia";

export const useCatalogStore = defineStore("catalog", {
  state: () => ({
    tools: {
      theming: [
        {
          id: "palette-generator",
          titre: "Générateur de Palette",
          description:
            "Créez, ajustez et exportez vos palettes de couleurs avec l'accessibilité à l'esprit.",
          url: "./theming/palette_generator.html",
          icon: "palette-generator",
          migrated: true,
          vueRoute: "/tools/theming/palette-generator",
        },
        {
          id: "css-grid-generator",
          titre: "Générateur de Grille CSS",
          description:
            "Créez visuellement vos layouts CSS Grid avec aperçu en temps réel et export de code.",
          url: "./theming/css-grid-generator.html",
          icon: "css-grid-generator",
          migrated: true,
          vueRoute: "/tools/theming/css-grid-generator",
        },
        {
          id: "color-contrast-checker",
          titre: "Vérificateur de Contraste",
          description:
            "Vérifiez la conformité WCAG de vos combinaisons de couleurs pour l'accessibilité.",
          url: "./theming/color-contrast-checker.html",
          icon: "color-contrast-checker",
          migrated: true,
          vueRoute: "/tools/theming/color-contrast-checker",
        },
        {
          id: "shadow-generator",
          titre: "Générateur d'Ombres",
          description:
            "Créez des effets d'ombre CSS personnalisés avec support multi-couches et aperçu en temps réel.",
          url: "./theming/shadow-generator.html",
          icon: "shadow-generator",
          migrated: true,
          vueRoute: "/tools/theming/shadow-generator",
        },
        {
          id: "flexbox-playground",
          titre: "Terrain de Jeu Flexbox",
          description:
            "Explorez CSS Flexbox avec des contrôles interactifs et des exemples de mise en page.",
          url: "./theming/flexbox-playground.html",
          icon: "flexbox-playground",
          migrated: true,
          vueRoute: "/tools/theming/flexbox-playground",
        },
        {
          id: "gradient-generator",
          titre: "Générateur de Dégradés",
          description:
            "Créez des dégradés CSS magnifiques avec contrôles visuels pour tous types de gradients.",
          url: "./theming/gradient-generator.html",
          icon: "gradient-generator",
          migrated: true,
          vueRoute: "/tools/theming/gradient-generator",
        },
      ],
      reference: [
        {
          id: "glossaire-webdev",
          titre: "Glossaire WEBDEV",
          description:
            "Référence complète du vocabulaire des styles et feuilles de style PC SOFT.",
          url: "./reference/glossaire_webdev.html",
          icon: "glossaire-webdev",
          migrated: true,
          vueRoute: "/tools/reference/glossaire-webdev",
        },
        {
          id: "theming-multiclient",
          titre: "WEBDEV Multi-Clients",
          description:
            "Guide interactif pour la gestion de thèmes dynamiques dans les applications WEBDEV.",
          url: "./reference/theming_multiclient.html",
          icon: "theming-multiclient",
          migrated: true,
          vueRoute: "/tools/reference/theming-multiclient",
        },
        {
          id: "css-specificity",
          titre: "Spécificité CSS",
          description:
            "Analyse interactive de la spécificité CSS avec calculateur et exemples pratiques.",
          url: "./reference/css_specificity.html",
          icon: "css-specificity",
          migrated: true,
          vueRoute: "/tools/reference/css-specificity",
        },
        {
          id: "webui-principles",
          titre: "Principes WebUI",
          description:
            "Tableau de bord interactif des principes fondamentaux du design web.",
          url: "./dashboard/webui_principle.html",
          icon: "webui-principles",
          migrated: true,
          vueRoute: "/tools/reference/webui-principles",
        },
        {
          id: "component-library",
          titre: "Bibliothèque de Composants",
          description:
            "Collection de composants réutilisables avec documentation et exemples de code.",
          url: "./reference/component-library.html",
          icon: "component-library",
          migrated: true,
          vueRoute: "/tools/reference/component-library",
        },
      ],
      dashboard: [],
      evaluation: [
        {
          id: "skills-evaluator",
          titre: "Évaluateur de Compétences",
          description:
            "Visualisez et exportez vos compétences de développeur sous forme de rapport PDF professionnel.",
          url: "./evaluation/skills-evaluator.html",
          icon: "skills-evaluator",
          migrated: true,
          vueRoute: "/tools/evaluation/skills-evaluator",
        },
      ],
      visualization: [
        {
          id: "mindmap",
          titre: "Mind Map Avancée",
          description:
            "Créez et éditez des cartes mentales interactives avec export JSON et SVG.",
          url: "./visualization/mindmap.html",
          icon: "mindmap",
          migrated: true,
          vueRoute: "/tools/visualization/mindmap",
        },
      ],
      organization: [
        {
          id: "ticketing-system",
          titre: "Système de Tickets",
          description:
            "Gérez vos rappels clients et tâches personnelles de manière simple et efficace.",
          url: "./organization/ticketing-system.html",
          icon: "lifebuoy",
          migrated: true,
          vueRoute: "/tools/organization/ticketing-system",
        },
      ],
    },
    categories: {
      theming: { name: "Théming & Couleurs", icon: "category-theming" },
      reference: {
        name: "Références & Documentation",
        icon: "glossaire-webdev",
      },
      dashboard: { name: "Tableaux de Bord", icon: "category-dashboard" },
      evaluation: { name: "Évaluation & Profils", icon: "skills-evaluator" },
      visualization: { name: "Visualisation", icon: "eye" },
      organization: { name: "Organisation & Productivité", icon: "lifebuoy" },
    },
    activeFilter: "all",
    searchQuery: "",
    favorites: JSON.parse(localStorage.getItem("favorites")) || [],
  }),

  getters: {
    filteredTools: (state) => {
      let tools = [];

      if (state.activeFilter === "all") {
        tools = Object.values(state.tools).flat();
      } else if (state.activeFilter === "favorites") {
        const allTools = Object.values(state.tools).flat();
        tools = allTools.filter((tool) => state.favorites.includes(tool.id));
      } else if (state.tools[state.activeFilter]) {
        tools = state.tools[state.activeFilter];
      }

      if (state.searchQuery.trim()) {
        const query = state.searchQuery.toLowerCase();
        tools = tools.filter(
          (tool) =>
            tool.titre.toLowerCase().includes(query) ||
            tool.description.toLowerCase().includes(query),
        );
      }

      return tools;
    },

    toolCount: (state) => {
      if (state.activeFilter === "all") {
        return Object.values(state.tools).reduce(
          (total, tools) => total + tools.length,
          0,
        );
      }
      return state.tools[state.activeFilter]?.length || 0;
    },

    availableCategories: (state) => {
      return Object.entries(state.categories).filter(
        ([key]) => state.tools[key] && state.tools[key].length > 0,
      );
    },
    isFavorite: (state) => (toolId) => {
      return state.favorites.includes(toolId);
    },
  },

  actions: {
    setFilter(filter) {
      this.activeFilter = filter;
    },

    searchTools(query) {
      this.searchQuery = query;
    },

    getToolById(category, id) {
      return this.tools[category]?.find((tool) => tool.id === id);
    },

    getCategoryTools(category) {
      return this.tools[category] || [];
    },

    toggleFavorite(toolId) {
      const index = this.favorites.indexOf(toolId);
      if (index === -1) {
        this.favorites.push(toolId);
      } else {
        this.favorites.splice(index, 1);
      }
      localStorage.setItem("favorites", JSON.stringify(this.favorites));
    },
  },
});
