<template>
  <div class="saved-palettes space-y-4">
    <div v-if="savedPalettes.length === 0" class="no-palettes">
      <p class="text-gray-400 text-center">Aucune palette sauvegardée</p>
    </div>

    <div v-else class="palettes-list">
      <div
        v-for="palette in savedPalettes"
        :key="palette.id"
        class="palette-item"
      >
        <div class="palette-header">
          <div class="palette-meta">
            <h4 class="palette-name">{{ palette.name }}</h4>
            <span class="palette-date">{{
              formatDate(palette.timestamp)
            }}</span>
          </div>
          <div class="palette-actions">
            <button
              @click="loadPalette(palette)"
              class="action-btn load-btn"
              title="Charger cette palette"
            >
              ↵
            </button>
            <button
              @click="duplicatePalette(palette)"
              class="action-btn duplicate-btn"
              title="Dupliquer cette palette"
            >
              ⧉
            </button>
            <button
              @click="deletePalette(palette.id)"
              class="action-btn delete-btn"
              title="Supprimer cette palette"
            >
              ×
            </button>
          </div>
        </div>

        <div class="palette-preview">
          <div
            v-for="color in palette.colors"
            :key="color"
            class="color-preview"
            :style="{ backgroundColor: color }"
            :title="color"
          ></div>
        </div>

        <div class="palette-info">
          <span class="colors-count"
            >{{ palette.colors.length }} couleur{{
              palette.colors.length > 1 ? "s" : ""
            }}</span
          >
          <div class="color-values">
            <span
              v-for="(color, index) in palette.colors.slice(0, 3)"
              :key="index"
              class="color-value"
            >
              {{ color }}
            </span>
            <span v-if="palette.colors.length > 3" class="more-colors">
              +{{ palette.colors.length - 3 }} autres
            </span>
          </div>
        </div>
      </div>
    </div>

    <div v-if="savedPalettes.length > 0" class="bulk-actions">
      <button @click="exportAllPalettes" class="export-all-btn">
        Exporter toutes les palettes
      </button>
      <button @click="clearAllPalettes" class="clear-all-btn">
        Supprimer toutes les palettes
      </button>
    </div>

    <!-- Import Section -->
    <div class="import-section">
      <h4 class="text-sm font-medium text-white mb-2">
        Importer des palettes:
      </h4>
      <div class="import-controls">
        <input
          ref="fileInput"
          type="file"
          accept=".json"
          style="display: none"
          @change="importPalettes"
        />
        <button @click="$refs.fileInput.click()" class="import-btn">
          Choisir fichier JSON
        </button>
        <span
          v-if="importStatus"
          class="import-status"
          :class="importStatus.type"
        >
          {{ importStatus.message }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const emit = defineEmits(["palette-loaded"]);

const savedPalettes = ref([]);
const importStatus = ref(null);

const STORAGE_KEY = "ui-tools-saved-palettes";

onMounted(() => {
  loadSavedPalettes();
});

const loadSavedPalettes = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      savedPalettes.value = JSON.parse(saved);
    }
  } catch (error) {
    console.error("Error loading saved palettes:", error);
  }
};

const savePalettesToStorage = () => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedPalettes.value));
  } catch (error) {
    console.error("Error saving palettes:", error);
  }
};

const addPalette = (palette) => {
  const newPalette = {
    ...palette,
    id: Date.now() + Math.random(),
    timestamp: new Date().toISOString(),
  };

  savedPalettes.value.unshift(newPalette);
  savePalettesToStorage();
};

const loadPalette = (palette) => {
  emit("palette-loaded", palette.colors);
};

const duplicatePalette = (palette) => {
  const duplicate = {
    ...palette,
    id: Date.now() + Math.random(),
    name: `${palette.name} (copie)`,
    timestamp: new Date().toISOString(),
  };

  savedPalettes.value.unshift(duplicate);
  savePalettesToStorage();
};

const deletePalette = (id) => {
  if (confirm("Êtes-vous sûr de vouloir supprimer cette palette ?")) {
    savedPalettes.value = savedPalettes.value.filter((p) => p.id !== id);
    savePalettesToStorage();
  }
};

const clearAllPalettes = () => {
  if (
    confirm(
      "Êtes-vous sûr de vouloir supprimer toutes les palettes sauvegardées ?",
    )
  ) {
    savedPalettes.value = [];
    savePalettesToStorage();
  }
};

const formatDate = (timestamp) => {
  return new Date(timestamp).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const exportAllPalettes = () => {
  const data = {
    palettes: savedPalettes.value,
    exportedAt: new Date().toISOString(),
    version: "1.0",
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "palettes-export.json";
  a.click();
  URL.revokeObjectURL(url);
};

const importPalettes = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result);
      let importedCount = 0;

      if (data.palettes && Array.isArray(data.palettes)) {
        data.palettes.forEach((palette) => {
          if (palette.name && palette.colors && Array.isArray(palette.colors)) {
            addPalette(palette);
            importedCount++;
          }
        });
      } else if (data.colors && Array.isArray(data.colors)) {
        // Single palette format
        addPalette({
          name: data.name || "Palette importée",
          colors: data.colors,
        });
        importedCount++;
      }

      if (importedCount > 0) {
        importStatus.value = {
          type: "success",
          message: `${importedCount} palette${importedCount > 1 ? "s" : ""} importée${importedCount > 1 ? "s" : ""}`,
        };
      } else {
        importStatus.value = {
          type: "error",
          message: "Aucune palette valide trouvée dans le fichier",
        };
      }
    } catch (error) {
      importStatus.value = {
        type: "error",
        message: "Erreur lors de l'import: fichier JSON invalide",
      };
    }

    setTimeout(() => {
      importStatus.value = null;
    }, 3000);

    // Reset file input
    event.target.value = "";
  };

  reader.readAsText(file);
};

// Expose method for parent component
defineExpose({
  addPalette,
});
</script>

<style scoped>
.no-palettes {
  padding: 40px 20px;
  text-align: center;
}

.palette-item {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
  transition: all 0.3s ease;
}

.palette-item:hover {
  border-color: rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.15);
}

.palette-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.palette-meta {
  flex: 1;
}

.palette-name {
  font-size: 16px;
  font-weight: 600;
  color: white;
  margin: 0 0 4px 0;
}

.palette-date {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
}

.palette-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  background: var(--glass-bg-light);
  border: 1px solid var(--border-primary);
  padding: 8px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 12px;
  color: var(--text-secondary);
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-btn:hover {
  background: var(--glass-bg-medium);
  border-color: var(--electric-blue);
  color: var(--text-primary);
  transform: translateY(-1px);
}

.palette-preview {
  display: flex;
  height: 40px;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.color-preview {
  flex: 1;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.color-preview:hover {
  transform: scaleY(1.1);
}

.palette-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.colors-count {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
  font-weight: 500;
}

.color-values {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.color-value {
  font-family: monospace;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.8);
  background: rgba(255, 255, 255, 0.1);
  padding: 2px 6px;
  border-radius: 4px;
}

.more-colors {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.6);
  font-style: italic;
}

.bulk-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  padding-top: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
}

.export-all-btn,
.clear-all-btn {
  padding: 10px 16px;
  border-radius: 8px;
  border: 1px solid var(--border-primary);
  background: var(--glass-bg-light);
  color: var(--text-secondary);
  font-weight: 500;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.export-all-btn:hover {
  background: var(--glass-bg-medium);
  color: var(--text-primary);
  border-color: var(--electric-blue);
  transform: translateY(-1px);
}

.clear-all-btn:hover {
  background: var(--glass-bg-medium);
  color: #ff6b6b;
  border-color: #ff6b6b;
  transform: translateY(-1px);
}

.import-section {
  padding-top: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
}

.import-controls {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.import-btn {
  background: var(--glass-bg-light);
  color: var(--text-secondary);
  border: 1px solid var(--border-primary);
  padding: 10px 16px;
  border-radius: 8px;
  font-weight: 500;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.import-btn:hover {
  background: var(--glass-bg-medium);
  color: var(--text-primary);
  border-color: var(--electric-blue);
  transform: translateY(-1px);
}

.import-status {
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: 500;
}

.import-status.success {
  background: rgba(16, 185, 129, 0.2);
  color: #10b981;
  border: 1px solid rgba(16, 185, 129, 0.3);
}

.import-status.error {
  background: rgba(239, 68, 68, 0.2);
  color: #f87171;
  border: 1px solid rgba(239, 68, 68, 0.3);
}

@media (max-width: 640px) {
  .palette-header {
    flex-direction: column;
    gap: 8px;
  }

  .palette-actions {
    align-self: flex-end;
  }

  .color-values {
    flex-direction: column;
    gap: 4px;
  }
}
</style>
