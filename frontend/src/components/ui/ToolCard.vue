<template>
  <component
    :is="useVueRouting && vueRoute ? 'router-link' : 'a'"
    :to="useVueRouting && vueRoute ? vueRoute : undefined"
    :href="!useVueRouting || !vueRoute ? tool.url || '#' : undefined"
    :target="!useVueRouting ? '_blank' : undefined"
    :rel="!useVueRouting ? 'noopener noreferrer' : undefined"
    class="tool-card-link"
    :data-category="category"
    @click="handleClick"
  >
    <UIGlassCard variant="light" :hover="true" class="tool-card" padding="card">
      <div class="card-content">
        <!-- Header with icon, category, and favorite button -->
        <div class="card-header">
          <div class="tool-icon-wrapper">
            <IconSystem :name="tool.icon" size="xl" variant="electric" />
            <div class="icon-glow"></div>
          </div>
          <div class="category-label">
            {{ category }}
          </div>
          <button
            @click.prevent="toggleFavorite"
            class="favorite-button"
            :aria-label="
              isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'
            "
          >
            <IconSystem
              :name="isFavorite ? 'star-filled' : 'star'"
              size="sm"
              class="star-icon"
              :class="{ 'is-favorite': isFavorite }"
            />
          </button>
        </div>

        <h3 class="card-title" v-html="highlightTitle(tool.titre)"></h3>

        <p class="card-description">
          {{ tool.description }}
        </p>

        <div class="card-footer">
          <span class="footer-label">Ouvrir l'outil</span>
          <div class="footer-actions">
            <IconSystem
              :name="useVueRouting ? 'chevron-right' : 'external-link'"
              size="sm"
              class="action-icon"
            />
            <div class="action-dot"></div>
          </div>
        </div>
      </div>
    </UIGlassCard>
  </component>
</template>

<script setup>
import { computed } from "vue";
import { useCatalogStore } from "@/stores/catalog";
import IconSystem from "@/components/ui/IconSystem.vue";
import UIGlassCard from "@/components/ui/base/UIGlassCard.vue";

const props = defineProps({
  tool: {
    type: Object,
    required: true,
    validator: (tool) => {
      return tool && tool.id && tool.titre && tool.description && tool.icon;
    },
  },
  category: {
    type: String,
    required: true,
  },
  useRouter: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["click"]);
const catalog = useCatalogStore();

const isFavorite = computed(() => catalog.isFavorite(props.tool.id));

const toggleFavorite = () => {
  catalog.toggleFavorite(props.tool.id);
};

// Automatically use Vue routing for migrated tools
const useVueRouting = computed(() => {
  return props.tool.migrated || props.useRouter;
});

// Route for Vue migrated tools
const vueRoute = computed(() => {
  if (props.tool.migrated && props.tool.vueRoute) {
    return props.tool.vueRoute;
  }
  if (props.useRouter) {
    return {
      name: "Tool",
      params: {
        category: props.category,
        id: props.tool.id,
      },
    };
  }
  return null;
});

const handleClick = () => {
  emit("click", props.tool);
};

// Highlight the unique/differentiating word in the title with electric blue
const highlightTitle = (title) => {
  const words = title.split(" ");
  if (words.length === 1) return title;

  // Highlight the word that makes each tool unique (the main subject/object)
  const highlights = {
    Palette: true, // Générateur de Palette
    Grille: true, // Générateur de Grille CSS
    Contraste: true, // Vérificateur de Contraste
    Ombres: true, // Générateur d'Ombres
    Flexbox: true, // Terrain de Jeu Flexbox
    Dégradés: true, // Générateur de Dégradés
    WEBDEV: true, // Glossaire WEBDEV
    "Multi-Clients": true, // WEBDEV Multi-Clients
    Spécificité: true, // Spécificité CSS
    WebUI: true, // Principes WebUI
    Compétences: true, // Évaluateur de Compétences
    Mind: true, // Mind Map Avancée
    Map: true, // Mind Map Avancée (fallback)
  };

  let highlightIndex = -1;
  words.forEach((word, index) => {
    if (highlights[word]) {
      highlightIndex = index;
    }
  });

  // If no specific word found, highlight the last meaningful word
  if (highlightIndex === -1) {
    // Skip common words and highlight the most meaningful one
    const skipWords = [
      "de",
      "du",
      "des",
      "le",
      "la",
      "les",
      "et",
      "Générateur",
      "Vérificateur",
      "Terrain",
      "Jeu",
      "Évaluateur",
      "Principes",
    ];
    for (let i = words.length - 1; i >= 0; i--) {
      if (!skipWords.includes(words[i])) {
        highlightIndex = i;
        break;
      }
    }
  }

  const highlightedWords = words.map((word, index) => {
    if (index === highlightIndex) {
      return `<span class="text-electric-blue">${word}</span>`;
    }
    return word;
  });

  return highlightedWords.join(" ");
};
</script>

<style scoped>
.tool-card-link {
  display: block;
  text-decoration: none;
  transition: var(--transition-default);
}

.tool-card {
  height: 100%;
  cursor: pointer;
}

.card-content {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-4);
  position: relative;
}

.tool-icon-wrapper {
  position: relative;
  transition: var(--transition-default);
}

.tool-card-link:hover .tool-icon-wrapper {
  transform: scale(1.1);
}

.icon-glow {
  position: absolute;
  inset: calc(-1 * var(--space-2));
  background: rgba(var(--electric-blue-rgb), 0.05);
  border-radius: var(--radius-full);
  opacity: 0;
  transition: var(--transition-default);
}

.tool-card-link:hover .icon-glow {
  opacity: 1;
}

.category-label {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  font-size: var(--text-xs);
  color: var(--text-tertiary);
  font-weight: var(--font-medium);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  background: var(--glass-bg-light);
  padding: var(--space-1) var(--space-3);
  border-radius: var(--radius-full);
}

.favorite-button {
  color: var(--text-tertiary);
  background: transparent;
  border: none;
  cursor: pointer;
  transition: var(--transition-default);
  z-index: 10;
  padding: var(--space-1);
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
}

.favorite-button:hover {
  color: var(--electric-blue);
  background: rgba(var(--electric-blue-rgb), 0.1);
}

.star-icon {
  transition: var(--transition-default);
}

.star-icon.is-favorite {
  color: var(--electric-blue);
}

.card-title {
  font-size: var(--text-xl);
  font-weight: var(--font-bold);
  color: var(--text-primary);
  margin-bottom: var(--space-3);
  line-height: var(--leading-tight);
}

.card-description {
  color: var(--text-secondary);
  flex-grow: 1;
  font-size: var(--text-sm);
  line-height: var(--leading-relaxed);
  margin-bottom: var(--space-4);
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: var(--space-4);
  margin-top: auto;
  border-top: 1px solid var(--border-primary);
  transition: var(--transition-default);
}

.tool-card-link:hover .card-footer {
  border-top-color: rgba(var(--electric-blue-rgb), 0.2);
}

.footer-label {
  font-size: var(--text-xs);
  color: var(--text-tertiary);
  transition: var(--transition-default);
}

.tool-card-link:hover .footer-label {
  color: var(--electric-blue);
}

.footer-actions {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.action-icon {
  color: var(--text-tertiary);
  transition: var(--transition-default);
}

.tool-card-link:hover .action-icon {
  color: var(--electric-blue);
}

.action-dot {
  width: var(--space-2);
  height: var(--space-2);
  background: var(--electric-blue);
  border-radius: var(--radius-full);
  opacity: 0;
  transition: var(--transition-default);
}

.tool-card-link:hover .action-dot {
  opacity: 1;
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .tool-card-link,
  .tool-card,
  .tool-icon-wrapper,
  .icon-glow,
  .favorite-button,
  .star-icon,
  .card-footer,
  .footer-label,
  .action-icon,
  .action-dot {
    transition: none;
  }

  .tool-card-link:hover .tool-icon-wrapper {
    transform: none;
  }
}
</style>
