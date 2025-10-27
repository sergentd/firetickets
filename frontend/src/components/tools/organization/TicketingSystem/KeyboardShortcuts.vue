<template>
  <!-- Keyboard Shortcuts Help -->
  <div
    v-if="showHelp"
    class="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    @click="showHelp = false"
  >
    <div
      class="w-full max-w-lg bg-glass-bg-light backdrop-blur-sm border border-border-primary rounded-lg shadow-xl"
      @click.stop
    >
      <div class="p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-bold text-white">Raccourcis Clavier</h3>
          <button
            @click="showHelp = false"
            class="p-1 rounded text-gray-400 hover:text-white"
          >
            <svg
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div class="space-y-4">
          <div class="grid grid-cols-1 gap-3">
            <div
              v-for="shortcut in shortcuts"
              :key="shortcut.key"
              class="flex items-center justify-between"
            >
              <span class="text-gray-300 text-sm">{{
                shortcut.description
              }}</span>
              <div class="flex items-center gap-1">
                <kbd
                  v-for="key in shortcut.keys"
                  :key="key"
                  class="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-200 border border-gray-300 rounded"
                >
                  {{ key }}
                </kbd>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-6 text-center">
          <button
            @click="showHelp = false"
            class="px-4 py-2 bg-electric-blue hover:bg-electric-blue-dark text-black rounded text-sm font-medium"
          >
            Compris
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";

// Events
const emit = defineEmits([
  "new-ticket",
  "toggle-search",
  "export-data",
  "toggle-selection",
  "show-help",
]);

// Local state
const showHelp = ref(false);

// Keyboard shortcuts configuration
const shortcuts = [
  { key: "new", description: "Nouveau ticket", keys: ["Alt", "N"] },
  { key: "search", description: "Rechercher", keys: ["Alt", "F"] },
  { key: "export", description: "Exporter", keys: ["Alt", "E"] },
  { key: "select", description: "Mode sélection", keys: ["Alt", "S"] },
  { key: "help", description: "Aide raccourcis", keys: ["?"] },
];

// Keyboard event handler
const handleKeydown = (event) => {
  // Check if user is typing in an input
  if (
    event.target.tagName === "INPUT" ||
    event.target.tagName === "TEXTAREA" ||
    event.target.tagName === "SELECT"
  ) {
    return;
  }

  // Handle shortcuts
  if (event.altKey) {
    switch (event.key.toLowerCase()) {
      case "n":
        event.preventDefault();
        event.stopPropagation();
        emit("new-ticket");
        break;
      case "f":
        event.preventDefault();
        event.stopPropagation();
        emit("toggle-search");
        break;
      case "e":
        event.preventDefault();
        event.stopPropagation();
        emit("export-data");
        break;
      case "s":
        event.preventDefault();
        event.stopPropagation();
        emit("toggle-selection");
        break;
    }
  } else {
    switch (event.key) {
      case "?":
        event.preventDefault();
        showHelp.value = true;
        break;
      case "Escape":
        showHelp.value = false;
        break;
    }
  }
};

// Lifecycle
onMounted(() => {
  document.addEventListener("keydown", handleKeydown);
});

onUnmounted(() => {
  document.removeEventListener("keydown", handleKeydown);
});

// Expose for parent component
defineExpose({
  showHelp: () => (showHelp.value = true),
});
</script>

<style scoped>
kbd {
  display: inline-block;
  padding: 3px 5px;
  font:
    11px ui-monospace,
    SFMono-Regular,
    "SF Mono",
    Consolas,
    "Liberation Mono",
    Menlo,
    monospace;
  line-height: 10px;
  color: #24292f;
  vertical-align: middle;
  background-color: #f6f8fa;
  border: solid 1px rgba(175, 184, 193, 0.2);
  border-bottom-color: rgba(175, 184, 193, 0.2);
  border-radius: 6px;
  box-shadow: inset 0 -1px 0 rgba(175, 184, 193, 0.2);
}

/* Modal animation */
.fixed {
  animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
