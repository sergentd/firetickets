Guide de Refactorisation pour un IconSystem Scalable

Objectif

Transformer IconSystem.vue d'un composant monolithique avec une longue chaîne v-if en un chargeur dynamique qui importe à la volée les composants d'icônes individuels.

Cela améliore drastiquement la maintenabilité : pour ajouter une icône, il suffira de créer un nouveau fichier, sans jamais modifier le IconSystem.vue principal.

Étape 1 : Créer la nouvelle structure de dossiers

Nous avons besoin d'un répertoire pour stocker tous nos composants d'icônes individuels et un fichier pour gérer les alias (par exemple, "view" -> "Eye").

Créez un dossier icons (par exemple, src/components/icons/).

Créez un fichier icon-map.js dans ce dossier (par exemple, src/components/icons/icon-map.js).

Étape 2 : Créer le fichier icon-map.js

Ce fichier gérera les alias (comme view devenant Eye) et convertira les noms kebab-case en PascalCase pour correspondre aux noms de fichiers.

Créez le fichier src/components/icons/icon-map.js :

// Map d'alias pour que plusieurs 'name' props pointent vers le même composant d'icône.
const aliases = {
  view: 'Eye',
  'eye-off': 'EyeSlash',
  profile: 'User',
  tickets: 'Headset',
  tag: 'Headset',
  'more-vertical': 'DotsVertical',
  pencil: 'Edit',
  delete: 'Trash',
  file: 'Document',
  time: 'Clock',
  redo: 'Refresh',
  'settings-gear': 'Cog',
  tool: 'Wrench',
  warning: 'Alert',
  idea: 'Lightbulb',
  migrate: 'Upload',
  loading: 'Spinner',
  réunion: 'Reunion', // Gère l'accent
};

/**
 * Convertit une chaîne 'kebab-case' ou gère un alias en 'PascalCase'
 * @param {string} name - Le nom de l'icône (la prop)
 * @returns {string} - Le nom du composant (PascalCase)
 */
export const getIconComponentName = (name) => {
  if (!name) return 'DefaultIcon';
  
  // Gérer l'accent pour 'réunion'
  const cleanName = name.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  
  const aliasedName = aliases[cleanName] || aliases[name];
  if (aliasedName) {
    return aliasedName;
  }

  // Convertit kebab-case -> PascalCase
  return cleanName
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
};


Étape 3 : Extraire les icônes dans des fichiers individuels

Vous devez maintenant parcourir chaque v-if de IconSystem.vue et extraire le bloc <g>...</g> dans son propre fichier .vue dans le dossier src/components/icons/.

Le nom du fichier doit être en PascalCase. Par exemple, name === 'palette-generator' devient src/components/icons/PaletteGenerator.vue.

Exemple 1 : src/components/icons/PaletteGenerator.vue
(Basé sur v-if="name === 'palette-generator'")

<template>
  <g>
    <!-- Main circle -->
    <circle
      cx="12"
      cy="12"
      r="8"
      stroke="currentColor"
      stroke-width="2"
      fill="none"
    />
    <!-- Inner colored circles -->
    <circle cx="9" cy="9" r="1.5" :fill="primaryColor" />
    <circle cx="15" cy="9" r="1.5" :fill="secondaryColor" />
    <circle cx="9" cy="15" r="1.5" :fill="accentColor" />
    <circle cx="15" cy="15" r="1.5" :fill="tertiaryColor" />
    <circle cx="12" cy="12" r="1.5" :fill="accentRed" />
  </g>
</template>


Exemple 2 : src/components/icons/EmailIcon.vue
(Basé sur v-else-if="name === 'email'")

<template>
  <g>
    <path
      d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
      stroke="currentColor"
      stroke-width="2"
      fill="none"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <polyline
      points="22,6 12,13 2,6"
      stroke="currentColor"
      stroke-width="2"
      fill="none"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </g>
</template>


Exemple 3 (Fallback) : src/components/icons/DefaultIcon.vue
(Basé sur le bloc <g v-else>)

<template>
  <g>
    <rect
      x="3"
      y="3"
      width="18"
      height="18"
      :fill="primaryColor"
      stroke="currentColor"
      stroke-width="2"
      rx="3"
    />
    <circle cx="12" cy="12" r="4" :fill="accentColor" />
  </g>
</template>


Action : Répétez ce processus pour toutes les icônes.

Étape 4 : Mettre à jour IconSystem.vue

C'est l'étape finale. Nous vidons le <template> de sa logique v-if et nous mettons à jour le <script> pour qu'il utilise defineAsyncComponent.

Notez que les props calculées (comme primaryColor) sont conservées. Elles resteront "dans la scope" lorsque le composant enfant <g> sera rendu.

Remplacez l'intégralité de IconSystem.vue par ceci :

<template>
  <svg
    :class="['icon-svg', size, colorClass]"
    :width="iconSize"
    :height="iconSize"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)"
  >
    <!-- 
      Le composant dynamique est rendu ici.
      Toutes les props calculées (primaryColor, etc.) 
      sont disponibles dans son scope.
    -->
    <component :is="iconComponent" />
  </svg>
</template>

<script setup>
import { computed, defineAsyncComponent } from 'vue';
import { getIconComponentName } from './icons/icon-map.js';

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) =>
      ['xs', 'sm', 'md', 'lg', 'xl', '2xl'].includes(value),
  },
  variant: {
    type: String,
    default: 'default',
    validator: (value) =>
      ['default', 'electric', 'mono', 'custom'].includes(value),
  },
  customColors: {
    type: Object,
    default: () => ({}),
  },
});

// *** LOGIQUE DE CHARGEMENT DYNAMIQUE ***

const iconComponent = computed(() => {
  const componentName = getIconComponentName(props.name);
  
  return defineAsyncComponent({
    loader: () => 
      import(`./icons/${componentName}.vue`)
        .catch(err => {
          console.warn(`[IconSystem] L'icône "${componentName}" (demandée via "${props.name}") n'a pas été trouvée. Utilisation du fallback.`);
          return import(`./icons/DefaultIcon.vue`);
        }),
    // Vous pouvez ajouter un composant de chargement si nécessaire
    // loadingComponent: LoadingIconComponent, 
    // delay: 200,
  });
});


// *** TOUTE LA LOGIQUE EXISTANTE EST CONSERVÉE CI-DESSOUS ***

// Size mappings
const iconSize = computed(() => {
  const sizes = {
    xs: '16',
    sm: '20',
    md: '24',
    lg: '32',
    xl: '48',
    '2xl': '64',
  };
  return sizes[props.size] || '24';
});

// Color schemes
const colorScheme = computed(() => {
  if (
    props.variant === 'custom' &&
    Object.keys(props.customColors).length > 0
  ) {
    return props.customColors;
  }

  const schemes = {
    default: {
      primary: 'var(--electric-blue)',
      secondary: 'var(--electric-blue-light)',
      accent: 'var(--electric-blue-dark)',
      tertiary: 'rgba(var(--electric-blue-rgb), 0.6)',
    },
    electric: {
      primary: '#00D4FF',
      secondary: '#33DDFF',
      accent: '#0099CC',
      tertiary: 'rgba(0, 212, 255, 0.4)',
    },
    mono: {
      primary: 'currentColor',
      secondary: 'currentColor',
      accent: 'currentColor',
      tertiary: 'currentColor',
    },
  };

  return schemes[props.variant] || schemes.default;
});

// Individual color accessors
const primaryColor = computed(() => colorScheme.value.primary);
const secondaryColor = computed(() => colorScheme.value.secondary);
const accentColor = computed(() => colorScheme.value.accent);
const tertiaryColor = computed(() => colorScheme.value.tertiary);
const accentRed = computed(() => 'var(--accent-red)');

// CSS classes
const colorClass = computed(() => {
  if (props.variant === 'mono') return 'text-current';
  return 'text-electric-blue';
});
</script>

<style scoped>
.icon-svg {
  display: inline-block;
  vertical-align: middle;
  flex-shrink: 0;
}

/* Note: Le @apply de Tailwind ne fonctionnera pas 
  dans le <style> de ce composant si vous n'avez pas
  un build-step (comme Vite/PostCSS) qui le traite.
  Si c'est du CDN, c'est ok.
*/
.xs {
  @apply w-4 h-4;
}
.sm {
  @apply w-5 h-5;
}
.md {
  @apply w-6 h-6;
}
.lg {
  @apply w-8 h-8;
}
.xl {
  @apply w-12 h-12;
}
.\32xl {
  @apply w-16 h-16;
}
</style>


Bilan

Avantages :

Maintenabilité : IconSystem.vue n'est plus modifié. L'ajout d'une icône new-feature se résume à créer src/components/icons/NewFeature.vue.

Lisibilité : Les fichiers sont petits et dédiés à une seule tâche.

Performance (Bundling) : Grâce à defineAsyncComponent et à l'import dynamique import(), votre bundler (comme Vite ou Webpack) va "code-splitter" chaque icône. Seules les icônes réellement utilisées sur une page seront téléchargées par le client, au lieu d'un unique et énorme composant d'icônes.

Inconvénient :

Fichiers multiples : Vous passez d'un seul fichier à N+2 fichiers. C'est le coût normal de la scalabilité.