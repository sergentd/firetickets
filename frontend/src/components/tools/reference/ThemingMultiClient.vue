<template>
  <div class="min-h-screen bg-primary space-y-12">
    <!-- Tool Header -->
    <ToolHeader
      title="Thèmes Multi-Clients"
      description="Guide interactif pour la gestion de thèmes dynamiques dans les applications WEBDEV"
      icon="theming-multiclient"
      category="reference"
      :show-badges="true"
    />

    <!-- Main Content -->
    <div class="container mx-auto px-4 space-y-8">
      <div class="grid grid-cols-1 xl:grid-cols-4 gap-6">
        <!-- Sidebar Navigation -->
        <div class="xl:col-span-1">
          <UISection title="Navigation" variant="glass" class="sticky top-8">
            <nav class="space-y-2">
              <UIButton
                v-for="section in sections"
                :key="section.id"
                :variant="activeSection === section.id ? 'danger' : 'ghost'"
                size="sm"
                class="w-full justify-start"
                @click="activeSection = section.id"
              >
                <span class="mr-2">{{ section.icon }}</span>
                {{ section.title }}
              </UIButton>
            </nav>
          </UISection>
        </div>

        <!-- Main Content -->
        <div class="xl:col-span-3 space-y-6">
          <!-- Introduction Section -->
          <UISection
            v-if="activeSection === 'intro'"
            title="Le Défi du Theming Multi-Client"
            variant="glass"
            collapsible
          >
            <div class="space-y-6">
              <p class="text-lg text-gray-200 leading-relaxed">
                Créer une application web unique capable de servir plusieurs
                clients, chacun avec sa propre identité visuelle, est un défi
                architectural majeur. Ce guide interactif explore les stratégies
                pour gérer efficacement les thèmes dans WEBDEV, en se
                concentrant sur des solutions robustes, performantes et
                maintenables à long terme.
              </p>

              <div class="bg-white/10 p-6 rounded-xl border border-white/20">
                <h3 class="text-xl font-semibold text-white mb-4">
                  Contextes d'application typiques
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div
                    v-for="context in applicationContexts"
                    :key="context.title"
                    class="context-card"
                  >
                    <h4 class="font-semibold mb-2 text-white">
                      {{ context.emoji }} {{ context.title }}
                    </h4>
                    <p class="text-sm text-gray-300">
                      {{ context.description }}
                    </p>
                  </div>
                </div>
              </div>

              <div class="bg-white/10 p-6 rounded-xl border border-white/20">
                <h3 class="text-xl font-semibold text-white mb-4">
                  Les défis techniques concrets
                </h3>
                <ul class="list-disc list-inside space-y-2 text-gray-300">
                  <li
                    v-for="challenge in technicalChallenges"
                    :key="challenge.title"
                  >
                    <strong class="text-white">{{ challenge.title }}</strong> :
                    {{ challenge.description }}
                  </li>
                </ul>
              </div>

              <div class="bg-white/10 p-6 rounded-xl border border-white/20">
                <h3 class="text-xl font-semibold text-orange-300 mb-4">
                  Objectifs de ce guide
                </h3>
                <ul class="list-disc list-inside space-y-2 text-gray-300">
                  <li v-for="objective in guideObjectives" :key="objective">
                    {{ objective }}
                  </li>
                </ul>
              </div>
            </div>
          </UISection>

          <!-- Concepts Section -->
          <UISection
            v-if="activeSection === 'concepts'"
            title="L'Écosystème de Style Natif de WEBDEV"
            variant="glass"
            collapsible
          >
            <div class="space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div
                  v-for="concept in webdevConcepts"
                  :key="concept.title"
                  class="concept-card"
                >
                  <h3 class="text-xl font-semibold mb-3 text-white">
                    {{ concept.title }}
                  </h3>
                  <p class="text-gray-300 text-sm">{{ concept.description }}</p>
                </div>
              </div>

              <div class="bg-white/10 p-6 rounded-xl border border-white/20">
                <h3 class="text-2xl font-semibold text-white mb-4">
                  📚 Glossaire des termes techniques
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div
                    v-for="term in glossaryTerms"
                    :key="term.title"
                    class="bg-white/5 p-4 rounded-lg border border-white/10"
                  >
                    <h4 class="font-semibold text-orange-300 mb-2">
                      {{ term.title }}
                    </h4>
                    <p class="text-sm text-gray-300">{{ term.definition }}</p>
                  </div>
                </div>
              </div>
            </div>
          </UISection>

          <!-- Architectures Section -->
          <UISection
            v-if="activeSection === 'architectures'"
            title="Comparaison des Architectures"
            variant="glass"
            collapsible
          >
            <div class="space-y-6">
              <!-- Architecture Tabs -->
              <div class="flex border-b border-white/20 mb-6">
                <button
                  v-for="arch in architectures"
                  :key="arch.id"
                  @click="selectedArchitecture = arch.id"
                  class="architecture-tab"
                  :class="{ active: selectedArchitecture === arch.id }"
                >
                  {{ arch.name }}
                </button>
              </div>

              <!-- Architecture Content -->
              <div
                v-for="arch in architectures"
                :key="arch.id"
                v-show="selectedArchitecture === arch.id"
              >
                <div class="architecture-content">
                  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    <div>
                      <h3 class="text-xl font-semibold text-white mb-3">
                        {{ arch.name }}
                      </h3>
                      <p class="text-gray-300 mb-4">{{ arch.description }}</p>

                      <div class="space-y-3">
                        <h4 class="font-semibold text-green-300">
                          ✅ Avantages
                        </h4>
                        <ul
                          class="list-disc list-inside text-sm text-gray-300 space-y-1"
                        >
                          <li v-for="pro in arch.pros" :key="pro">{{ pro }}</li>
                        </ul>
                      </div>

                      <div class="space-y-3 mt-4">
                        <h4 class="font-semibold text-red-300">
                          ❌ Inconvénients
                        </h4>
                        <ul
                          class="list-disc list-inside text-sm text-gray-300 space-y-1"
                        >
                          <li v-for="con in arch.cons" :key="con">{{ con }}</li>
                        </ul>
                      </div>
                    </div>

                    <div>
                      <h4 class="font-semibold text-white mb-3">Évaluation</h4>
                      <div class="space-y-3">
                        <div
                          v-for="metric in arch.metrics"
                          :key="metric.name"
                          class="metric-bar"
                        >
                          <div class="flex justify-between text-sm mb-1">
                            <span class="text-gray-300">{{ metric.name }}</span>
                            <span class="text-white">{{ metric.score }}/5</span>
                          </div>
                          <div class="w-full bg-gray-700 rounded-full h-2">
                            <div
                              class="bg-gradient-to-r from-blue-400 to-blue-600 h-2 rounded-full transition-all duration-500"
                              :style="{ width: (metric.score / 5) * 100 + '%' }"
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div v-if="arch.codeExample" class="code-example">
                    <h4 class="font-semibold text-white mb-3">
                      Exemple de code
                    </h4>
                    <CodeBlock :code="arch.codeExample" language="javascript" />
                  </div>
                </div>
              </div>
            </div>
          </UISection>

          <!-- Implementation Section -->
          <UISection
            v-if="activeSection === 'implementation'"
            title="Guide de Mise en Œuvre"
            variant="glass"
            collapsible
          >
            <div class="space-y-6">
              <p class="text-gray-300">
                Implémentation pas à pas de l'architecture recommandée avec du
                code prêt à utiliser.
              </p>

              <!-- Implementation Steps -->
              <div class="implementation-stepper">
                <div
                  v-for="(step, index) in implementationSteps"
                  :key="step.title"
                  class="step-container"
                >
                  <div class="step-indicator">
                    <div class="step-number">{{ index + 1 }}</div>
                    <div
                      v-if="index < implementationSteps.length - 1"
                      class="step-line"
                    ></div>
                  </div>

                  <div class="step-content">
                    <h3 class="text-xl font-semibold text-white mb-2">
                      {{ step.title }}
                    </h3>
                    <p class="text-gray-300 mb-4">{{ step.description }}</p>

                    <div v-if="step.code" class="mb-4">
                      <CodeBlock
                        :code="step.code"
                        :language="step.language || 'javascript'"
                      />
                    </div>

                    <div
                      v-if="step.notes"
                      class="bg-blue-500/10 p-4 rounded-lg border border-blue-500/20"
                    >
                      <p class="text-blue-200 text-sm">💡 {{ step.notes }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </UISection>

          <!-- Conclusion Section -->
          <UISection
            v-if="activeSection === 'conclusion'"
            title="Synthèse & Recommandations"
            variant="glass"
            collapsible
          >
            <div class="space-y-6">
              <div
                class="bg-green-500/10 p-6 rounded-xl border border-green-500/20"
              >
                <h3 class="text-xl font-semibold text-green-300 mb-4">
                  🎯 Architecture Recommandée
                </h3>
                <p class="text-gray-300 mb-4">
                  L'approche par variables CSS dynamiques s'impose comme la
                  solution la plus moderne et évolutive pour gérer des thèmes
                  multi-clients dans WEBDEV.
                </p>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 class="font-semibold text-white mb-2">Points forts</h4>
                    <ul
                      class="list-disc list-inside text-sm text-gray-300 space-y-1"
                    >
                      <li>Performance optimale</li>
                      <li>Maintenance simplifiée</li>
                      <li>Évolutivité maximale</li>
                      <li>Compatibilité moderne</li>
                    </ul>
                  </div>
                  <div>
                    <h4 class="font-semibold text-white mb-2">
                      Cas d'usage idéaux
                    </h4>
                    <ul
                      class="list-disc list-inside text-sm text-gray-300 space-y-1"
                    >
                      <li>Applications SaaS B2B</li>
                      <li>Portails multi-tenants</li>
                      <li>E-commerce multi-marques</li>
                      <li>Systèmes institutionnels</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div class="bg-white/10 p-6 rounded-xl border border-white/20">
                <h3 class="text-xl font-semibold text-white mb-4">
                  🚀 Prochaines Étapes
                </h3>
                <div class="space-y-3 text-gray-300">
                  <p>
                    1. <strong class="text-white">Audit de l'existant</strong> :
                    Analysez votre architecture actuelle et identifiez les
                    points de refactoring.
                  </p>
                  <p>
                    2. <strong class="text-white">Prototypage</strong> :
                    Implémentez un composant test avec la nouvelle approche.
                  </p>
                  <p>
                    3.
                    <strong class="text-white">Migration progressive</strong> :
                    Déployez par modules pour réduire les risques.
                  </p>
                  <p>
                    4. <strong class="text-white">Formation équipe</strong> :
                    Assurez-vous que tous maîtrisent les nouvelles pratiques.
                  </p>
                </div>
              </div>
            </div>
          </UISection>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { UISection, UIButton } from "@/components/ui";
import ToolHeader from "@/components/ui/ToolHeader.vue";
import CodeBlock from "@/components/ui/CodeBlock.vue";

const activeSection = ref("intro");
const selectedArchitecture = ref("css-variables");

const sections = [
  { id: "intro", title: "Introduction", icon: "🎯" },
  { id: "concepts", title: "Concepts WEBDEV", icon: "📚" },
  { id: "architectures", title: "Architectures", icon: "🏗️" },
  { id: "implementation", title: "Mise en Œuvre", icon: "⚙️" },
  { id: "conclusion", title: "Synthèse", icon: "🎯" },
];

const applicationContexts = [
  {
    emoji: "🏢",
    title: "Applications SaaS B2B",
    description:
      "Plateforme CRM où chaque entreprise cliente veut ses couleurs corporate, son logo et ses polices de marque intégrées.",
  },
  {
    emoji: "🏪",
    title: "E-commerce multi-marques",
    description:
      "Site marchand gérant plusieurs marques avec des univers visuels distincts (luxe, sport, enfants).",
  },
  {
    emoji: "🎓",
    title: "Portails éducatifs",
    description:
      "Système de formation où chaque établissement (université, école, centre) a son identité propre.",
  },
  {
    emoji: "🏛️",
    title: "Applications institutionnelles",
    description:
      "Portail administratif déployé dans plusieurs collectivités avec leurs chartes graphiques officielles.",
  },
];

const technicalChallenges = [
  {
    title: "Performance",
    description:
      "Comment éviter de charger du CSS inutile tout en gardant des temps de réponse optimaux ?",
  },
  {
    title: "Maintenabilité",
    description:
      "Comment gérer 50+ thèmes clients sans dupliquer le code et créer une dette technique ?",
  },
  {
    title: "Évolutivité",
    description:
      "Comment ajouter de nouveaux composants sans casser les thèmes existants ?",
  },
  {
    title: "Cohérence",
    description:
      "Comment s'assurer que l'expérience utilisateur reste homogène malgré les variations visuelles ?",
  },
  {
    title: "Déploiement",
    description:
      "Comment permettre aux équipes marketing de modifier l'apparence sans intervention technique ?",
  },
];

const guideObjectives = [
  "Analyser en profondeur l'écosystème de stylisation de WEBDEV et ses limites natives.",
  "Présenter et évaluer trois architectures distinctes pour la gestion de thèmes dynamiques.",
  "Fournir un guide pratique avec du code prêt à utiliser pour implémenter la solution la plus moderne.",
  "Vous donner les clés pour construire des applications multi-clients évolutives et pérennes.",
  "Démontrer comment transformer une contrainte technique en avantage concurrentiel.",
];

const webdevConcepts = [
  {
    title: "Styles WEBDEV & d'Élément",
    description:
      "Un \"Style WEBDEV\" est un conteneur appliqué à un champ (ex: un bouton). Il est composé de \"Styles d'Élément\" qui définissent l'apparence de chaque partie (libellé, fond, bordure). C'est la brique de base de la stylisation dans l'IDE.",
  },
  {
    title: "Feuilles de Styles (.STY)",
    description:
      'Le fichier `.STY` est le catalogue central de tous les "Styles WEBDEV" de votre projet. Il permet de centraliser, réutiliser et partager une charte graphique entre plusieurs projets, mais il reste une définition statique des styles.',
  },
  {
    title: "🚫 Ambiances & Gabarits (.WDY)",
    description:
      "Une \"Ambiance\" est un package visuel complet. C'est une solution séduisante mais fondamentalement **statique**. Il est impossible de changer d'ambiance dynamiquement par programmation, ce qui la disqualifie pour un besoin multi-client.",
  },
];

const glossaryTerms = [
  {
    title: "Multi-tenant",
    definition:
      "Architecture où une seule instance d'application sert plusieurs clients (tenants) avec des configurations distinctes.",
  },
  {
    title: "White-label",
    definition:
      "Produit générique développé par une société et revendu par d'autres sous leur propre marque.",
  },
  {
    title: "CSS Custom Properties",
    definition:
      "Variables CSS natives permettant de définir des valeurs réutilisables et modifiables dynamiquement.",
  },
  {
    title: "Design System",
    definition:
      "Ensemble cohérent de standards, composants et outils qui permettent de gérer le design à grande échelle.",
  },
];

const architectures = [
  {
    id: "css-variables",
    name: "Variables CSS Dynamiques",
    description:
      "Utilise les CSS Custom Properties pour créer des thèmes dynamiques modifiables en JavaScript.",
    pros: [
      "Performance optimale - pas de rechargement",
      "Maintenance simplifiée avec variables centralisées",
      "Compatible avec tous navigateurs modernes",
      "Transition fluide entre thèmes",
      "Évolutivité maximale",
    ],
    cons: [
      "Nécessite une refactorisation initiale",
      "Courbe d'apprentissage pour l'équipe",
      "Incompatible avec IE11 (si support requis)",
    ],
    metrics: [
      { name: "Performance", score: 5 },
      { name: "Maintenabilité", score: 5 },
      { name: "Évolutivité", score: 5 },
      { name: "Complexité", score: 3 },
      { name: "Compatibilité", score: 4 },
    ],
    codeExample: `// Définition des variables CSS
:root {
  --primary-color: #007acc;
  --secondary-color: #f0f0f0;
  --text-color: #333;
}

// Application dynamique
function applyTheme(themeData) {
  const root = document.documentElement;
  Object.keys(themeData).forEach(key => {
    root.style.setProperty(\`--\${key}\`, themeData[key]);
  });
}`,
  },
  {
    id: "css-classes",
    name: "Classes CSS Conditionnelles",
    description:
      "Utilise des classes CSS spécifiques pour chaque thème, appliquées dynamiquement sur le body.",
    pros: [
      "Compatibilité totale tous navigateurs",
      "Approche familière pour les développeurs",
      "Isolation complète entre thèmes",
      "Contrôle granulaire possible",
    ],
    cons: [
      "Duplication importante du CSS",
      "Taille des fichiers qui augmente rapidement",
      "Maintenance complexe avec de nombreux thèmes",
      "Risk de conflits entre classes",
    ],
    metrics: [
      { name: "Performance", score: 3 },
      { name: "Maintenabilité", score: 2 },
      { name: "Évolutivité", score: 2 },
      { name: "Complexité", score: 4 },
      { name: "Compatibilité", score: 5 },
    ],
    codeExample: `// CSS avec classes thématiques
.theme-client1 .button { background: #ff6b35; }
.theme-client2 .button { background: #1e90ff; }
.theme-client3 .button { background: #32cd32; }

// Application JavaScript
function applyTheme(themeName) {
  document.body.className = 'theme-' + themeName;
}`,
  },
  {
    id: "dynamic-css",
    name: "CSS Dynamique",
    description:
      "Génère et injecte des feuilles de style CSS en temps réel selon le client connecté.",
    pros: [
      "Flexibilité totale dans la génération",
      "Possibilité de thèmes très complexes",
      "Pas de limite sur les variations",
    ],
    cons: [
      "Performance dégradée (génération côté client)",
      "Complexité de debugging très élevée",
      "Problèmes de cache navigateur",
      "Maintenance cauchemardesque",
      "Risques de sécurité (injection CSS)",
    ],
    metrics: [
      { name: "Performance", score: 1 },
      { name: "Maintenabilité", score: 1 },
      { name: "Évolutivité", score: 3 },
      { name: "Complexité", score: 1 },
      { name: "Compatibilité", score: 3 },
    ],
    codeExample: `// Génération dynamique de CSS
function generateThemeCSS(themeConfig) {
  const css = \`
    .button {
      background: \${themeConfig.primaryColor};
      color: \${themeConfig.textColor};
      border: 1px solid \${themeConfig.borderColor};
    }
  \`;

  const styleElement = document.createElement('style');
  styleElement.textContent = css;
  document.head.appendChild(styleElement);
}`,
  },
];

const implementationSteps = [
  {
    title: "Configuration des Variables CSS",
    description:
      "Définir l'ensemble des variables CSS qui constitueront votre système de thèmes.",
    code: `:root {
  /* Couleurs principales */
  --primary-color: #007acc;
  --secondary-color: #6c757d;
  --accent-color: #28a745;

  /* Couleurs sémantiques */
  --success-color: #28a745;
  --warning-color: #ffc107;
  --error-color: #dc3545;

  /* Typographie */
  --font-family-primary: 'Inter', sans-serif;
  --font-size-base: 16px;
  --line-height-base: 1.5;

  /* Espacement */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
}`,
    language: "css",
    notes:
      "Organisez vos variables par catégories logiques pour une maintenance facilitée.",
  },
  {
    title: "Système de Gestion de Thèmes",
    description:
      "Créer un système JavaScript pour gérer le chargement et l'application des thèmes.",
    code: `class ThemeManager {
  constructor() {
    this.currentTheme = null;
    this.themeCache = new Map();
  }

  async loadTheme(clientId) {
    if (this.themeCache.has(clientId)) {
      return this.themeCache.get(clientId);
    }

    try {
      const response = await fetch(\`/api/themes/\${clientId}\`);
      const themeData = await response.json();

      this.themeCache.set(clientId, themeData);
      return themeData;
    } catch (error) {
      console.error('Erreur chargement thème:', error);
      return this.getDefaultTheme();
    }
  }

  applyTheme(themeData) {
    const root = document.documentElement;

    Object.entries(themeData.variables).forEach(([key, value]) => {
      root.style.setProperty(\`--\${key}\`, value);
    });

    this.currentTheme = themeData;
    this.saveThemePreference(themeData.id);
  }

  getDefaultTheme() {
    return {
      id: 'default',
      name: 'Thème par défaut',
      variables: {
        'primary-color': '#007acc',
        'secondary-color': '#6c757d',
        'text-color': '#333333'
      }
    };
  }
}`,
    language: "javascript",
    notes:
      "Ce système inclut la mise en cache et la gestion d'erreurs pour une expérience utilisateur optimale.",
  },
  {
    title: "Intégration avec WEBDEV",
    description:
      "Code WEBDEV pour récupérer et appliquer les thèmes selon le client connecté.",
    code: `// Code WEBDEV - Récupération thème client
PROCEDURE GetClientTheme(sClientId : string) : string
VAR
    sThemeJSON : string = ""
    stQuery : SQLQuery
    stResult : SQLResult

// Requête base de données pour récupérer le thème
stQuery..SQLQuery = "SELECT theme_config FROM client_themes WHERE client_id = {sClientId}"

SI HExécuteRequête(stQuery) ALORS
    stResult = HExécuteRequêteSQL(stQuery)
    SI PAS HEnDehors(stResult) ALORS
        sThemeJSON = stResult.theme_config
    SINON
        // Thème par défaut si non trouvé
        sThemeJSON = GetDefaultTheme()
    FIN
FIN

RENVOYER sThemeJSON

// Procédure d'application du thème
PROCEDURE ApplyTheme(sThemeJSON : string)
    // Injection du JavaScript pour appliquer le thème
    sScript : string = [
        const themeData = %1;
        if (window.themeManager) {
            window.themeManager.applyTheme(themeData);
        }
    ]

    sScript = RemplacerChaîne(sScript, "%1", sThemeJSON)
    BrowserRunJS(sScript)
FIN`,
    language: "wlanguage",
    notes:
      "Adaptez les noms de tables et champs selon votre structure de base de données.",
  },
  {
    title: "Interface d'Administration",
    description:
      "Créer une interface pour que les administrateurs puissent modifier les thèmes sans intervention technique.",
    code: `// Interface Vue.js pour l'édition de thèmes
<template>
  <div class="theme-editor">
    <h2>Éditeur de thème - {{ currentClient.name }}</h2>

    <div class="color-section">
      <h3>Couleurs principales</h3>
      <div v-for="(color, key) in themeConfig.colors" :key="key">
        <label>{{ formatLabel(key) }}</label>
        <input
          type="color"
          v-model="themeConfig.colors[key]"
          @input="previewTheme"
        />
      </div>
    </div>

    <div class="preview-section">
      <h3>Aperçu en temps réel</h3>
      <div class="preview-container" :style="previewStyles">
        <button class="preview-button">Bouton exemple</button>
        <div class="preview-card">
          <h4>Carte exemple</h4>
          <p>Texte de démonstration</p>
        </div>
      </div>
    </div>

    <div class="actions">
      <button @click="saveTheme" class="save-btn">Sauvegarder</button>
      <button @click="resetTheme" class="reset-btn">Réinitialiser</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      themeConfig: {
        colors: {
          primary: '#007acc',
          secondary: '#6c757d',
          accent: '#28a745'
        }
      }
    }
  },
  computed: {
    previewStyles() {
      return {
        '--primary-color': this.themeConfig.colors.primary,
        '--secondary-color': this.themeConfig.colors.secondary,
        '--accent-color': this.themeConfig.colors.accent
      }
    }
  },
  methods: {
    previewTheme() {
      // Aperçu en temps réel
      this.$emit('theme-preview', this.themeConfig);
    },

    async saveTheme() {
      try {
        await this.saveClientTheme(this.currentClient.id, this.themeConfig);
        this.$toast.success('Thème sauvegardé avec succès');
      } catch (error) {
        this.$toast.error('Erreur lors de la sauvegarde');
      }
    }
  }
}
<\/script>`,
    language: "vue",
    notes:
      "Cette interface permet aux non-développeurs de personnaliser facilement l'apparence.",
  },
];
</script>

<style scoped>
.context-card,
.concept-card {
  background: rgba(255, 255, 255, 0.05);
  padding: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
}

.architecture-tab {
  padding: 12px 24px;
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  transition: all 0.3s ease;
  border-bottom: 2px solid transparent;
  font-weight: 500;
}

.architecture-tab:hover {
  color: white;
  background: rgba(255, 255, 255, 0.05);
}

.architecture-tab.active {
  color: white;
  border-bottom-color: var(--accent-red);
  background: rgba(255, 255, 255, 0.1);
}

.metric-bar {
  margin-bottom: 16px;
}

.implementation-stepper {
  position: relative;
}

.step-container {
  display: flex;
  gap: 24px;
  margin-bottom: 32px;
}

.step-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
}

.step-number {
  width: 40px;
  height: 40px;
  background: var(--electric-blue);
  color: var(--bg-primary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 18px;
  box-shadow: 0 4px 12px rgba(0, 212, 255, 0.4);
}

.step-line {
  width: 2px;
  height: 60px;
  background: linear-gradient(to bottom, var(--electric-blue), transparent);
  margin-top: 8px;
}

.step-content {
  flex: 1;
}
</style>
