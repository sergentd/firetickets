<template>
  <!-- Bulk Actions Bar -->
  <div
    v-if="selectedTickets.length > 0"
    class="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40"
  >
    <div
      class="bg-glass-bg-light backdrop-blur-sm border border-border-primary rounded-lg px-6 py-3 shadow-xl"
    >
      <div class="flex items-center gap-4">
        <!-- Selection Info -->
        <div class="text-white text-sm">
          <span class="font-medium">{{ selectedTickets.length }}</span>
          <span class="text-gray-300"
            >ticket{{ selectedTickets.length > 1 ? "s" : "" }} sélectionné{{
              selectedTickets.length > 1 ? "s" : ""
            }}</span
          >
        </div>

        <!-- Separator -->
        <div class="w-px h-6 bg-border-primary"></div>

        <!-- Bulk Actions -->
        <div class="flex items-center gap-2">
          <!-- Status Change -->
          <select
            v-model="bulkStatus"
            @change="changeBulkStatus"
            class="px-3 py-1.5 bg-glass-bg border border-border-primary rounded text-white text-sm focus:ring-2 focus:ring-electric-blue focus:border-electric-blue"
          >
            <option value="">Changer le statut</option>
            <option value="todo">À faire</option>
            <option value="in-progress">En cours</option>
            <option value="waiting">En attente</option>
            <option value="completed">Terminé</option>
          </select>

          <!-- Priority Change -->
          <select
            v-model="bulkPriority"
            @change="changeBulkPriority"
            class="px-3 py-1.5 bg-glass-bg border border-border-primary rounded text-white text-sm focus:ring-2 focus:ring-electric-blue focus:border-electric-blue"
          >
            <option value="">Changer la priorité</option>
            <option value="low">Faible</option>
            <option value="medium">Moyenne</option>
            <option value="high">Élevée</option>
            <option value="urgent">Urgente</option>
          </select>

          <!-- Delete -->
          <button
            @click="confirmBulkDelete"
            class="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded text-sm transition-colors flex items-center gap-1"
          >
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            Supprimer
          </button>

          <!-- Export -->
          <button
            @click="exportSelected"
            class="px-3 py-1.5 bg-electric-blue hover:bg-electric-blue-dark text-black rounded text-sm transition-colors flex items-center gap-1"
          >
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Exporter
          </button>

          <!-- Cancel -->
          <button
            @click="clearSelection"
            class="px-3 py-1.5 text-gray-300 hover:text-white transition-colors text-sm"
          >
            Annuler
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Selection Checkbox for individual tickets -->
  <template v-if="showSelectionMode">
    <div class="mb-6 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <label class="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            :checked="allSelected"
            @change="toggleSelectAll"
            class="w-4 h-4 text-electric-blue bg-glass-bg border-border-primary rounded focus:ring-electric-blue focus:ring-2"
          />
          <span class="text-sm text-gray-300">
            {{ allSelected ? "Tout désélectionner" : "Tout sélectionner" }}
          </span>
        </label>
        <span v-if="selectedTickets.length > 0" class="text-xs text-gray-400">
          ({{ selectedTickets.length }}/{{ totalTickets }} sélectionnés)
        </span>
      </div>

      <button
        @click="toggleSelectionMode"
        class="text-sm text-gray-400 hover:text-white transition-colors"
      >
        Annuler la sélection
      </button>
    </div>
  </template>

  <!-- Enable Selection Mode Button -->
  <div v-if="!showSelectionMode && totalTickets > 0" class="mb-6">
    <div class="bg-glass-bg border border-border-primary rounded-lg p-4">
      <div class="flex items-center justify-between">
        <div>
          <h4 class="text-sm font-medium text-white mb-1">Actions groupées</h4>
          <p class="text-xs text-gray-400">
            Sélectionnez plusieurs tickets pour les modifier en lot
          </p>
        </div>
        <div class="flex items-center gap-3">
          <!-- Migration Button (only show if localStorage data exists) -->
          <button
            v-if="localStorageTicketCount > 0"
            @click="$emit('migrate')"
            :disabled="isMigrating"
            class="migration-button-warning"
          >
            <IconSystem
              v-if="!isMigrating"
              name="migrate"
              size="xs"
              variant="mono"
            />
            <IconSystem
              v-else
              name="spinner"
              size="xs"
              variant="mono"
              class="animate-spin"
            />
            <span v-if="!isMigrating"
              >Migrer {{ localStorageTicketCount }} tickets</span
            >
            <span v-else>Migration...</span>
          </button>

          <button
            @click="toggleSelectionMode"
            class="px-4 py-2 bg-electric-blue hover:bg-electric-blue-dark text-black rounded text-sm font-medium flex items-center gap-2 transition-colors"
          >
            <IconSystem name="check-circle" size="xs" variant="mono" />
            Sélection
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import IconSystem from "@/components/ui/IconSystem.vue";

// Props
const props = defineProps({
  tickets: {
    type: Array,
    required: true,
  },
  selectedTickets: {
    type: Array,
    required: true,
  },
  totalTickets: {
    type: Number,
    required: true,
  },
  localStorageTicketCount: {
    type: Number,
    default: 0,
  },
  isMigrating: {
    type: Boolean,
    default: false,
  },
});

// Events
const emit = defineEmits([
  "update-selection",
  "bulk-status-change",
  "bulk-priority-change",
  "bulk-delete",
  "export-tickets",
  "toggle-selection-mode",
  "migrate",
]);

// Local state
const showSelectionMode = ref(false);
const bulkStatus = ref("");
const bulkPriority = ref("");

// Computed
const allSelected = computed(() => {
  return (
    props.totalTickets > 0 &&
    props.selectedTickets.length === props.totalTickets
  );
});

// Methods
const toggleSelectionMode = () => {
  showSelectionMode.value = !showSelectionMode.value;
  if (!showSelectionMode.value) {
    clearSelection();
  }
  emit("toggle-selection-mode", showSelectionMode.value);
};

const toggleSelectAll = () => {
  if (allSelected.value) {
    emit("update-selection", []);
  } else {
    const allIds = props.tickets.map((ticket) => ticket.id);
    emit("update-selection", allIds);
  }
};

const clearSelection = () => {
  emit("update-selection", []);
};

const changeBulkStatus = () => {
  if (bulkStatus.value && props.selectedTickets.length > 0) {
    emit("bulk-status-change", props.selectedTickets, bulkStatus.value);
    bulkStatus.value = "";
  }
};

const changeBulkPriority = () => {
  if (bulkPriority.value && props.selectedTickets.length > 0) {
    emit("bulk-priority-change", props.selectedTickets, bulkPriority.value);
    bulkPriority.value = "";
  }
};

const confirmBulkDelete = () => {
  if (props.selectedTickets.length === 0) return;

  const message = `Êtes-vous sûr de vouloir supprimer ${props.selectedTickets.length} ticket${props.selectedTickets.length > 1 ? "s" : ""} ?`;

  if (confirm(message)) {
    emit("bulk-delete", props.selectedTickets);
  }
};

const exportSelected = () => {
  const selectedTicketData = props.tickets.filter((ticket) =>
    props.selectedTickets.includes(ticket.id),
  );
  emit("export-tickets", selectedTicketData);
};

// Expose methods and state to parent
defineExpose({
  showSelectionMode,
  toggleSelectionMode,
  clearSelection,
});
</script>

<style scoped>
/* Smooth transitions */
.bulk-actions-bar {
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    transform: translate(-50%, 100%);
    opacity: 0;
  }
  to {
    transform: translate(-50%, 0);
    opacity: 1;
  }
}

/* Custom checkbox styling */
input[type="checkbox"]:checked {
  background-color: var(--electric-blue);
  border-color: var(--electric-blue);
}

/* Backdrop blur effect */
.backdrop-blur-sm {
  backdrop-filter: blur(4px);
}

/* Migration button with warning colors */
.migration-button-warning {
  padding: 0.5rem 1rem;
  background: var(--electric-blue);
  color: black;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
}

.migration-button-warning:hover:not(:disabled) {
  background: var(--electric-blue-dark);
  transform: translateY(-1px);
}

.migration-button-warning:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
