<template>
  <div class="min-h-screen bg-primary space-y-12">
    <!-- Tool Header -->
    <ToolHeader
      title="Analyse Interactive de la Spécificité CSS"
      description="Comprenez la cascade CSS et la spécificité avec un calculateur et des exemples pratiques."
      icon="css-specificity"
      category="reference"
      :show-badges="true"
    />

    <!-- Main Content -->
    <div class="container mx-auto px-4 space-y-8">
      <UITabs
        v-model="activeTab"
        :tabs="tabs"
        variant="underline"
        size="lg"
        value-key="id"
        label-key="label"
        icon-key="icon"
      >
        <!-- Problem Section -->
        <template #tab-problem>
          <div class="space-y-4">
            <p class="text-secondary mb-4">
              Vous utilisez du code WLangage pour injecter une variable CSS
              (--couleur-primaire) afin de personnaliser un bouton BTN_Defaut.
              Vous vérifiez avec F12 : la variable est bien présente, mais le
              bouton conserve sa couleur grise par défaut.
            </p>

            <UIGlassCard class="p-4">
              <div class="grid md:grid-cols-3 gap-4 items-center">
                <!-- Color Picker -->
                <div class="space-y-2">
                  <label class="text-sm font-medium text-primary">
                    Choisissez une couleur pour --couleur-primaire :
                  </label>
                  <div class="flex-center">
                    <input
                      type="color"
                      v-model="problemColor"
                      class="w-16 h-16 rounded-full border-2 border-primary cursor-pointer hover-lift-sm"
                    />
                  </div>
                </div>

                <!-- Expected Result -->
                <div class="text-center space-y-2">
                  <p class="font-medium text-primary">Résultat attendu :</p>
                  <UIButton
                    :style="{
                      backgroundColor: problemColor,
                      borderColor: problemColor,
                    }"
                    class="text-white"
                  >
                    Bouton stylé
                  </UIButton>
                </div>

                <!-- Actual Result -->
                <div class="text-center space-y-2">
                  <p class="font-medium text-accent-red">
                    Résultat réel (le problème) :
                  </p>
                  <UIButton variant="secondary" disabled> BTN_Defaut </UIButton>
                </div>
              </div>

              <div
                class="mt-4 glass-accent p-3 rounded-lg border-l-4 border-electric"
              >
                <p class="text-secondary">
                  <span class="text-electric font-semibold">Constat :</span>
                  Malgré la mise à jour de la variable --couleur-primaire, le
                  BTN_Defaut reste gris. Ce n'est pas un bug. C'est le
                  fonctionnement normal de la cascade CSS.
                </p>
              </div>
            </UIGlassCard>
          </div>
        </template>

        <!-- Theory Section -->
        <template #tab-theory>
          <div class="space-y-4">
            <p class="text-secondary mb-4">
              Le navigateur décide quel style appliquer en suivant un ordre
              strict : 1. Origine et Importance, 2. Spécificité, 3. Ordre
              d'apparition.
            </p>

            <div class="grid lg:grid-cols-2 gap-6">
              <!-- Cascade Hierarchy -->
              <UIGlassCard title="La Hiérarchie de la Cascade" class="p-4">
                <div class="space-y-3">
                  <div
                    class="glass-light p-3 rounded-lg border-l-4 border-tertiary"
                  >
                    <h4 class="font-semibold text-primary mb-1">
                      1. Origine & Importance
                    </h4>
                    <p class="text-secondary text-sm">
                      D'où vient le style (navigateur, utilisateur, développeur)
                    </p>
                  </div>

                  <div
                    class="glass-accent p-3 rounded-lg border-l-4 border-electric"
                  >
                    <h4 class="font-semibold text-electric mb-1">
                      2. Spécificité (Point crucial)
                    </h4>
                    <p class="text-secondary text-sm">
                      Un score calculé pour chaque sélecteur. Le score le plus
                      élevé gagne.
                    </p>
                  </div>

                  <div
                    class="glass-light p-3 rounded-lg border-l-4 border-tertiary"
                  >
                    <h4 class="font-semibold text-primary mb-1">
                      3. Ordre d'Apparition
                    </h4>
                    <p class="text-secondary text-sm">
                      Si spécificités identiques, la dernière règle déclarée
                      gagne.
                    </p>
                  </div>
                </div>
              </UIGlassCard>

              <!-- Specificity Calculator -->
              <UIGlassCard title="Calculateur de Spécificité" class="p-4">
                <div class="space-y-3">
                  <UIInput
                    v-model="selectorInput"
                    label="Sélecteur CSS"
                    placeholder=".BTN_Defaut"
                    icon-leading="code"
                  />

                  <div class="glass-dark p-4 rounded-lg text-center">
                    <div class="text-2xl font-mono text-electric mb-2">
                      {{ calculatedSpecificity }}
                    </div>
                    <p class="text-xs text-tertiary">
                      Score de spécificité (ID, Classe, Type)
                    </p>
                  </div>

                  <div class="glass-light p-3 rounded-lg">
                    <p class="text-xs font-medium text-secondary mb-2">
                      Exemples à tester :
                    </p>
                    <div class="flex flex-wrap gap-2">
                      <button
                        v-for="example in selectorExamples"
                        :key="example"
                        @click="selectorInput = example"
                        class="text-xs px-2 py-1 glass-hover rounded transition-default hover-lift-sm"
                      >
                        {{ example }}
                      </button>
                    </div>
                  </div>
                </div>
              </UIGlassCard>
            </div>
          </div>
        </template>

        <!-- Diagnostic Section -->
        <template #tab-diagnostic>
          <div class="space-y-4">
            <p class="text-secondary mb-6">
              Utilisons les outils de développement pour voir quelles règles
              s'appliquent à notre BTN_Defaut.
            </p>

            <UIGlassCard class="p-6">
              <div class="font-mono text-sm space-y-4">
                <div class="text-tertiary">
                  Styles pour
                  <span class="text-accent-red">&lt;button&nbsp;</span>
                  <span class="text-electric">class</span>=<span
                    class="text-accent-yellow"
                    >"BTN_Defaut"</span
                  ><span class="text-accent-red">&gt;</span>
                </div>

                <div class="pt-4 space-y-3">
                  <!-- Winning Rule -->
                  <div
                    class="glass-accent p-4 rounded-lg border-primary animate-pulse-glow"
                  >
                    <div class="text-accent-purple">.BTN_Defaut {</div>
                    <div class="ml-4 text-electric">
                      background-color:
                      <span class="text-accent-green">#E0E0E0</span>;
                      <span class="text-tertiary"
                        >/* Spécificité (0,1,0) */</span
                      >
                    </div>
                    <div class="ml-4 text-electric">
                      border:
                      <span class="text-accent-green">1px solid #CCC</span>;
                    </div>
                    <div class="text-accent-purple">}</div>
                    <div class="text-xs text-tertiary mt-2">
                      Source: WDSTYLE_Project.css
                    </div>
                  </div>

                  <!-- CSS Variables -->
                  <div class="glass-light p-4 rounded-lg">
                    <div class="text-accent-purple">:root {</div>
                    <div class="ml-4 text-electric">
                      --couleur-primaire:
                      <span class="text-accent-green">{{ problemColor }}</span
                      >;
                    </div>
                    <div class="text-accent-purple">}</div>
                    <div class="text-xs text-tertiary mt-2">
                      Source: &lt;style&gt; (injecté)
                    </div>
                  </div>
                </div>

                <div
                  class="glass-warning p-4 rounded-lg border-l-4 border-accent-yellow"
                >
                  <p class="text-secondary">
                    <span class="text-accent-yellow font-semibold"
                      >Analyse :</span
                    >
                    La règle .BTN_Defaut applique directement la couleur. Votre
                    variable est définie mais pas appliquée.
                  </p>
                </div>
              </div>
            </UIGlassCard>
          </div>
        </template>

        <!-- Solution Section -->
        <template #tab-solution>
          <div class="space-y-4">
            <p class="text-secondary mb-6">
              Ajoutez une règle qui cible le même sélecteur (.BTN_Defaut) et
              utilise votre variable.
            </p>

            <div class="grid lg:grid-cols-2 gap-8">
              <!-- Code Solution -->
              <UIGlassCard title="Le Code Correctif" class="p-6">
                <CodeBlock language="css" :code="solutionCode" class="mb-4" />
                <div class="glass-light p-3 rounded-lg">
                  <p class="text-xs text-secondary">
                    Assurez-vous que votre feuille de style est chargée
                    <strong>après</strong> celle de WebDev.
                  </p>
                </div>
              </UIGlassCard>

              <!-- Demo -->
              <UIGlassCard title="Démonstration de la Solution" class="p-6">
                <div class="space-y-4">
                  <div>
                    <label
                      class="text-sm font-medium text-secondary mb-2 block"
                    >
                      Choisissez une couleur :
                    </label>
                    <div class="flex-center">
                      <input
                        type="color"
                        v-model="solutionColor"
                        class="w-16 h-16 rounded-full border-2 border-primary cursor-pointer hover-lift-sm"
                      />
                    </div>
                  </div>

                  <div class="text-center">
                    <p class="mb-3 font-medium text-secondary">
                      Résultat avec la règle corrective :
                    </p>
                    <UIButton
                      :style="{
                        backgroundColor: solutionColor,
                        borderColor: solutionColor,
                      }"
                      class="text-white"
                    >
                      BTN_Defaut
                    </UIButton>
                  </div>

                  <div
                    class="glass-success p-4 rounded-lg border-l-4 border-accent-green"
                  >
                    <p class="text-secondary">
                      <span class="text-accent-green font-semibold"
                        >Succès !</span
                      >
                      En appliquant la variable via un sélecteur de spécificité
                      égale, nous avons surchargé le style par défaut.
                    </p>
                  </div>
                </div>
              </UIGlassCard>
            </div>
          </div>
        </template>

        <!-- Best Practices Section -->
        <template #tab-practices>
          <div class="space-y-4">
            <p class="text-secondary mb-6">
              Pour un système de thèmes robuste et maintenable, considérez ces
              stratégies avancées.
            </p>

            <div class="space-y-4">
              <UIGlassCard
                v-for="(practice, index) in bestPractices"
                :key="index"
                :title="practice.title"
                collapsible
                class="p-6"
              >
                <p class="text-secondary" v-html="practice.content"></p>
              </UIGlassCard>
            </div>
          </div>
        </template>
      </UITabs>
    </div>

    <!-- Footer -->
    <footer class="mt-16 border-t border-primary glass-light">
      <div class="container mx-auto py-6 px-4 text-center text-tertiary">
        <p>
          &copy; 2025 - Application de diagnostic CSS interactive. Conçue pour
          clarifier les concepts de la cascade CSS.
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import {
  UISection,
  UIGlassCard,
  UIButton,
  UIInput,
  UITabs,
} from "@/components/ui";
import IconSystem from "@/components/ui/IconSystem.vue";
import CodeBlock from "@/components/ui/CodeBlock.vue";
import ToolHeader from "@/components/ui/ToolHeader.vue";

// Tabs configuration
const activeTab = ref("problem");
const tabs = [
  { id: "problem", label: "Le Problème", icon: "alert" },
  { id: "theory", label: "La Théorie", icon: "book" },
  { id: "diagnostic", label: "Le Diagnostic", icon: "search" },
  { id: "solution", label: "La Solution", icon: "check" },
  { id: "practices", label: "Bonnes Pratiques", icon: "star" },
];

// Reactive data
const problemColor = ref("#E57373");
const solutionColor = ref("#4ECDC4");
const selectorInput = ref(".BTN_Defaut");

// Selector examples for quick testing
const selectorExamples = [
  "button",
  ".BTN_Defaut",
  "#monBouton",
  ":root",
  "div.container",
  "nav ul li a",
];

// Solution code
const solutionCode = `/* Dans votre fichier CSS personnalisé */
.BTN_Defaut {
  background-color: var(--couleur-primaire);
  border-color: var(--couleur-primaire);
  color: white; /* Pour le contraste */
}`;

// Best practices data
const bestPractices = ref([
  {
    title: "Architecture Recommandée : Page AWP pour le CSS",
    content: `Au lieu d'injecter une balise &lt;style&gt; en WLangage, créez une page AWP dédiée (PAGE_ThemeCSS) qui ne génère que du CSS. Cette page récupère l'ID client, interroge la base de données et renvoie les variables CSS avec le MimeType text/css.<br><br><strong>Avantages :</strong> meilleure séparation des préoccupations, mise en cache optimisée et maintenance facilitée.`,
  },
  {
    title: "Évitez !important à tout prix",
    content: `Il est tentant d'utiliser !important pour forcer un style. C'est une mauvaise pratique qui brise la cascade et rend le débogage très difficile. La solution propre est toujours de maîtriser la spécificité et l'ordre de chargement.`,
  },
  {
    title: "Utilisez des CSS Custom Properties",
    content: `Les variables CSS (custom properties) permettent une personnalisation dynamique sans JavaScript. Définissez-les au niveau :root et utilisez-les dans vos sélecteurs pour créer des thèmes cohérents et maintenables.`,
  },
]);

// Specificity calculator
const calculateSpecificity = (selector) => {
  try {
    let idCount = (selector.match(/#/g) || []).length;
    let classCount =
      (selector.match(/\./g) || []).length +
      (selector.match(/\[/g) || []).length;

    // Count pseudo-classes and pseudo-elements
    const pseudoMatches = selector.match(/:[\w-]+/g) || [];
    classCount += pseudoMatches.length;

    // Count type selectors
    let typeCount = 0;
    const cleanedSelector = selector
      .replace(/#[\w-]+/g, "")
      .replace(/\.[\w-]+/g, "")
      .replace(/\[.*?\]/g, "")
      .replace(/:[\w-]+/g, "");
    const typeMatches = cleanedSelector.match(/[a-zA-Z]+/g) || [];
    typeCount = typeMatches.length;

    return `(${idCount}, ${classCount}, ${typeCount})`;
  } catch (e) {
    console.error("Error calculating specificity:", e);
    return "(0, 0, 0)";
  }
};

const calculatedSpecificity = computed(() => {
  return calculateSpecificity(selectorInput.value);
});
</script>

<style scoped>
@keyframes pulse-glow {
  0%,
  100% {
    box-shadow: 0 0 20px rgba(0, 212, 255, 0.2);
  }
  50% {
    box-shadow: 0 0 30px rgba(0, 212, 255, 0.4);
  }
}

.animate-pulse-glow {
  animation: pulse-glow 2s infinite;
}

/* Color input styling */
input[type="color"] {
  -webkit-appearance: none;
  border: none;
  cursor: pointer;
}

input[type="color"]::-webkit-color-swatch-wrapper {
  padding: 0;
}

input[type="color"]::-webkit-color-swatch {
  border: none;
  border-radius: 50%;
}

/* Remove outer border from diagnostic section */
.no-border {
  border: none !important;
}
</style>
