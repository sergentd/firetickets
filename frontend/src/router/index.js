import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../stores/auth";

// Import views
import Home from "../views/Home.vue";
import ToolView from "../views/ToolView.vue";
import LoginPage from "../components/auth/LoginPage.vue";

// Import migrated tools
import CSSGridGenerator from "../components/tools/theming/CSSGridGenerator.vue";
import ColorContrastChecker from "../components/tools/theming/ColorContrastChecker.vue";
import ShadowGenerator from "../components/tools/theming/ShadowGenerator.vue";
import FlexboxPlayground from "../components/tools/theming/FlexboxPlayground.vue";
import GradientGenerator from "../components/tools/theming/GradientGenerator.vue";
import PaletteGenerator from "../components/tools/theming/PaletteGenerator.vue";
import ThemingMultiClient from "../components/tools/reference/ThemingMultiClient.vue";
import WebdevGlossary from "../components/tools/reference/WebdevGlossary.vue";
import CSSSpecificity from "../components/tools/reference/CSSSpecificity.vue";
import WebUIPrinciples from "../components/tools/reference/WebUIPrinciples.vue";
import ComponentLibrary from "../components/tools/reference/ComponentLibrary.vue";
import SkillsEvaluator from "../components/tools/evaluation/SkillsEvaluator.vue";
import MindMapper from "../components/tools/visualization/MindMapper.vue";
import TicketingSystem from "../components/tools/organization/TicketingSystem.vue";
import TicketMigration from "../components/tools/admin/TicketMigration.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/login",
    name: "Login",
    component: LoginPage,
    meta: {
      title: "Connexion",
    },
  },
  {
    path: "/tool/:category/:id",
    name: "Tool",
    component: ToolView,
    props: true,
  },
  // Migrated Vue tools routes
  {
    path: "/tools/theming/css-grid-generator",
    name: "CSSGridGenerator",
    component: CSSGridGenerator,
    meta: {
      title: "Générateur de Grille CSS",
      category: "theming",
      migrated: true,
    },
  },
  {
    path: "/tools/theming/color-contrast-checker",
    name: "ColorContrastChecker",
    component: ColorContrastChecker,
    meta: {
      title: "Vérificateur de Contraste",
      category: "theming",
      migrated: true,
    },
  },
  {
    path: "/tools/theming/shadow-generator",
    name: "ShadowGenerator",
    component: ShadowGenerator,
    meta: {
      title: "Générateur d'Ombres",
      category: "theming",
      migrated: true,
    },
  },
  {
    path: "/tools/theming/flexbox-playground",
    name: "FlexboxPlayground",
    component: FlexboxPlayground,
    meta: {
      title: "Terrain de Jeu Flexbox",
      category: "theming",
      migrated: true,
    },
  },
  {
    path: "/tools/theming/gradient-generator",
    name: "GradientGenerator",
    component: GradientGenerator,
    meta: {
      title: "Générateur de Dégradés",
      category: "theming",
      migrated: true,
    },
  },
  {
    path: "/tools/theming/palette-generator",
    name: "PaletteGenerator",
    component: PaletteGenerator,
    meta: {
      title: "Générateur de Palette",
      category: "theming",
      migrated: true,
    },
  },
  {
    path: "/tools/reference/theming-multiclient",
    name: "ThemingMultiClient",
    component: ThemingMultiClient,
    meta: {
      title: "Thèmes Multi-Clients",
      category: "reference",
      migrated: true,
    },
  },
  {
    path: "/tools/reference/glossaire-webdev",
    name: "WebdevGlossary",
    component: WebdevGlossary,
    meta: {
      title: "Glossaire WEBDEV",
      category: "reference",
      migrated: true,
    },
  },
  {
    path: "/tools/reference/css-specificity",
    name: "CSSSpecificity",
    component: CSSSpecificity,
    meta: {
      title: "Spécificité CSS",
      category: "reference",
      migrated: true,
    },
  },
  {
    path: "/tools/reference/webui-principles",
    name: "WebUIPrinciples",
    component: WebUIPrinciples,
    meta: {
      title: "Principes WebUI",
      category: "reference",
      migrated: true,
    },
  },
  {
    path: "/tools/reference/component-library",
    name: "ComponentLibrary",
    component: ComponentLibrary,
    meta: {
      title: "Bibliothèque de Composants",
      category: "reference",
      migrated: true,
    },
  },
  // Alias route for easier access
  {
    path: "/components",
    redirect: "/tools/reference/component-library",
  },
  {
    path: "/tools/evaluation/skills-evaluator",
    name: "SkillsEvaluator",
    component: SkillsEvaluator,
    meta: {
      title: "Évaluateur de Compétences",
      category: "evaluation",
      migrated: true,
    },
  },
  {
    path: "/tools/visualization/mindmap",
    name: "MindMapper",
    component: MindMapper,
    meta: {
      title: "Mind Map Avancée",
      category: "visualization",
      migrated: true,
    },
  },
  {
    path: "/tools/organization/ticketing-system",
    name: "TicketingSystem",
    component: TicketingSystem,
    meta: {
      title: "Système de Tickets",
      category: "organization",
      migrated: true,
    },
  },
  {
    path: "/tools/admin/ticket-migration",
    name: "TicketMigration",
    component: TicketMigration,
    meta: {
      title: "Migration de Tickets",
      category: "admin",
      migrated: true,
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // If user clicked back/forward button, restore previous scroll position
    if (savedPosition) {
      return savedPosition;
    }
    // For all other navigation, scroll to top
    return { top: 0 };
  },
});

// Navigation guard for authentication
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  // Wait for auth to initialize on first load
  if (authStore.loading && !authStore.user) {
    await authStore.initAuth();
  }

  const isAuthenticated = authStore.isAuthenticated;
  const isLoginPage = to.name === 'Login';

  if (!isAuthenticated && !isLoginPage) {
    // Redirect to login if not authenticated and not on the login page
    console.log("🔐 AUTH: Access denied, redirecting to login");
    next({ name: 'Login' });
  } else if (isAuthenticated && isLoginPage) {
    // Redirect to home if authenticated and trying to access login page
    console.log("🔐 AUTH: Already authenticated, redirecting to home");
    next({ name: 'Home' });
  } else {
    next();
  }
});

export default router;
