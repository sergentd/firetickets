<template>
  <div class="min-h-screen bg-primary space-y-12">
    <!-- Tool Header -->
    <ToolHeader
      title="Glossaire WEBDEV"
      description="Référence complète du vocabulaire des styles et feuilles de style PC SOFT"
      icon="glossaire-webdev"
      category="reference"
      :show-badges="true"
    />

    <!-- Main Content -->
    <div class="container mx-auto px-4 space-y-8">
      <UITabs
        v-model="activeTab"
        :tabs="sections"
        variant="underline"
        size="lg"
        value-key="id"
        label-key="label"
        icon-key="icon"
      >
        <template #tab-fondamentaux>
          <div class="space-y-6">
            <div
              v-for="term in fundamentalsTerms"
              :key="term.id"
              :id="term.id"
              class="glossary-entry"
            >
              <dt class="term-title">{{ term.title }}</dt>
              <dd class="term-definition" v-html="term.definition"></dd>
            </div>
          </div>
        </template>

        <template #tab-types-styles>
          <div class="space-y-6">
            <div
              v-for="term in styleTypesTerms"
              :key="term.id"
              :id="term.id"
              class="glossary-entry"
            >
              <dt class="term-title">{{ term.title }}</dt>
              <dd class="term-definition" v-html="term.definition"></dd>
            </div>
          </div>
        </template>

        <template #tab-mecanismes>
          <div class="space-y-6">
            <div
              v-for="term in mechanismsTerms"
              :key="term.id"
              :id="term.id"
              class="glossary-entry"
            >
              <dt class="term-title">{{ term.title }}</dt>
              <dd class="term-definition" v-html="term.definition"></dd>
            </div>
          </div>
        </template>

        <template #tab-outils-avances>
          <div class="space-y-6">
            <div
              v-for="term in advancedTerms"
              :key="term.id"
              :id="term.id"
              class="glossary-entry"
            >
              <dt class="term-title">{{ term.title }}</dt>
              <dd class="term-definition" v-html="term.definition"></dd>
            </div>
          </div>
        </template>
      </UITabs>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { UITabs } from "@/components/ui";
import ToolHeader from "@/components/ui/ToolHeader.vue";

const activeTab = ref("fondamentaux");

const sections = [
  {
    id: "fondamentaux",
    label: "Les Fondamentaux",
    icon: "book",
  },
  {
    id: "types-styles",
    label: "Types de Styles",
    icon: "palette",
  },
  {
    id: "mecanismes",
    label: "Mécanismes",
    icon: "cog",
  },
  {
    id: "outils-avances",
    label: "Outils Avancés",
    icon: "wrench",
  },
];

const fundamentalsTerms = [
  {
    id: "wdy-sheet",
    title: "Feuille de style de projet WEBDEV (.WDY)",
    definition:
      "Fichier propriétaire contenant l'ensemble des styles spécifiques à <strong>un seul projet WEBDEV</strong>. Elle est gérée via l'éditeur de styles visuel et est compilée en CSS standard.",
  },
  {
    id: "sty-sheet",
    title: "Feuille de style de projet WINDEV (.STY)",
    definition:
      "Équivalent du <code>.WDY</code> pour les projets d'applications lourdes (Windows, Linux). Elle définit l'apparence des fenêtres et des champs natifs.",
  },
  {
    id: "wws-sheet",
    title: "Feuille de style partagée (.WWS)",
    definition:
      "Acronyme de <strong>W</strong>indev <strong>W</strong>ebdev <strong>S</strong>tyle sheet. Feuille de style conçue pour être <strong>partagée</strong> entre plusieurs projets (WINDEV, WEBDEV, WINDEV Mobile) afin de garantir une charte graphique cohérente.",
  },
  {
    id: "webdev-style",
    title: "Style WEBDEV",
    definition:
      "Ensemble de propriétés graphiques nommé et réutilisable. C'est l'équivalent direct d'une <strong>classe CSS</strong>.",
  },
  {
    id: "ambiance",
    title: "Ambiance",
    definition:
      "Collection de styles formant un thème graphique complet. Elle définit notamment les <strong>styles par défaut</strong> pour chaque type de champ du projet.",
  },
];

const styleTypesTerms = [
  {
    id: "style-champ",
    title: "Style de Champ",
    definition:
      "Le type de style le plus courant, appliqué aux champs (boutons, saisies, libellés...). Il définit leur apparence visuelle de base.",
  },
  {
    id: "style-page",
    title: "Style de Page",
    definition:
      "Appliqué à une page entière, il permet de définir des propriétés globales comme la couleur ou l'image de fond et les marges par défaut.",
  },
  {
    id: "style-cellule",
    title: "Style de Cellule",
    definition:
      "Spécifique aux champs Tableau et aux cellules de mise en page. Il contrôle l'apparence d'une cellule : fond, bordures, alignement.",
  },
  {
    id: "style-repetiteur",
    title: "Style de Répétiteur",
    definition:
      "Définit l'apparence des différentes zones d'un champ Répétiteur (fond de la zone répétée, fond de la zone sélectionnée ou survolée).",
  },
];

const mechanismsTerms = [
  {
    id: "heritage-styles",
    title: "Héritage des styles",
    definition:
      'Un style peut être basé sur un autre. Le style "enfant" hérite de toutes les propriétés du style "parent". Toute modification du parent est répercutée sur ses enfants.',
  },
  {
    id: "surcharge-style",
    title: "Surcharge de style",
    definition:
      "Modification locale des propriétés d'un élément sans altérer le style de base. Dans l'éditeur, une propriété surchargée apparaît en <strong>gras</strong>. C'est le niveau le plus prioritaire.",
  },
  {
    id: "priorite-styles",
    title: "Règle de priorité des styles",
    definition:
      "L'apparence finale d'un champ est déterminée par une cascade. La règle (du plus fort au plus faible) est : <br><strong>1. Surcharge de style</strong> > <strong>2. Style du champ</strong> > <strong>3. Style par défaut de l'ambiance</strong>.",
  },
];

const advancedTerms = [
  {
    id: "catalogue-styles",
    title: "Catalogue de styles",
    definition:
      "Bibliothèque de styles prêts à l'emploi fournis par PC SOFT. Ils peuvent être importés dans la feuille de style du projet pour être utilisés ou personnalisés.",
  },
  {
    id: "gabarit-page",
    title: "Gabarit de page",
    definition:
      "Modèle de page réutilisable contenant une mise en page et des styles prédéfinis. Il permet de créer rapidement des pages cohérentes avec un design uniforme.",
  },
  {
    id: "plan",
    title: "Plan",
    definition:
      "Mécanisme permettant de superposer plusieurs couches d'interface dans une même page. Chaque plan peut avoir ses propres styles et être affiché ou masqué dynamiquement.",
  },
  {
    id: "ancrage",
    title: "Ancrage",
    definition:
      "Propriété définissant le comportement d'un champ (position et taille) lors du redimensionnement du navigateur. C'est le mécanisme de base du design responsive dans WEBDEV.",
  },
  {
    id: "classe-css",
    title: "Classe CSS",
    definition:
      "WEBDEV permet d'associer des classes CSS standards à n'importe quel champ. C'est essentiel pour intégrer des frameworks externes ou utiliser des animations CSS complexes.",
  },
];
</script>

<style scoped>
.glossary-entry {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 20px;
  transition: all 0.3s ease;
  scroll-margin-top: 6rem;
}

.glossary-entry:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.2);
}

.glossary-entry.highlight {
  background: rgba(255, 215, 0, 0.1);
  border-color: rgba(255, 215, 0, 0.3);
  box-shadow: 0 0 20px rgba(255, 215, 0, 0.2);
}

.term-title {
  font-size: 18px;
  font-weight: 600;
  color: white;
  margin-bottom: 12px;
  display: block;
}

.term-definition {
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.6;
  font-size: 15px;
}

/* Style for HTML content in definitions */
.term-definition :deep(strong) {
  color: #ffd700;
  font-weight: 600;
}

.term-definition :deep(code) {
  background: rgba(0, 0, 0, 0.3);
  color: #64ffda;
  padding: 2px 6px;
  border-radius: 3px;
  font-family: "Monaco", "Menlo", "Ubuntu Mono", monospace;
  font-size: 13px;
}

.term-definition :deep(br) {
  margin-bottom: 8px;
}

/* Mobile responsiveness */
@media (max-width: 1024px) {
  .toc-link {
    padding: 8px 10px;
    font-size: 14px;
  }

  .term-title {
    font-size: 16px;
  }

  .term-definition {
    font-size: 14px;
  }
}
</style>
