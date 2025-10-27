<template>
  <!-- Modal Backdrop -->
  <div
    v-if="show"
    class="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
  >
    <!-- Modal Content -->
    <div
      class="w-full max-w-2xl bg-glass-bg-light backdrop-blur-sm border border-border-primary rounded-lg shadow-xl modal-content"
      @click.stop
    >
      <!-- Header -->
      <div
        class="flex items-center justify-between p-6 border-b border-border-primary"
      >
        <h2 class="text-xl font-bold text-white">Créer un nouveau ticket</h2>
        <button
          @click="$emit('close')"
          class="p-2 rounded-lg hover:bg-glass-bg transition-colors text-gray-400 hover:text-white"
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

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="p-6 space-y-6">
        <!-- Title -->
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">
            Titre <span class="text-red-400">*</span>
          </label>
          <input
            v-model="form.title"
            type="text"
            required
            class="w-full px-4 py-3 bg-glass-bg border border-border-primary rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-electric-blue focus:border-electric-blue transition-all duration-200"
            placeholder="Ex: Rappeler M. Dupont pour devis"
          />
        </div>

        <!-- Customer -->
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">
            Client <span class="text-red-400">*</span>
          </label>
          <input
            v-model="form.customer"
            type="text"
            required
            class="w-full px-4 py-3 bg-glass-bg border border-border-primary rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-electric-blue focus:border-electric-blue transition-all duration-200"
            placeholder="Nom du client ou entreprise"
          />
        </div>

        <!-- Description -->
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">
            Description
          </label>
          <textarea
            v-model="form.description"
            rows="3"
            class="w-full px-4 py-3 bg-glass-bg border border-border-primary rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-electric-blue focus:border-electric-blue transition-all duration-200 resize-none"
            placeholder="Détails supplémentaires..."
          ></textarea>
        </div>

        <!-- Priority and Type Row -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Priority -->
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2"
              >Priorité</label
            >
            <select
              v-model="form.priority"
              class="w-full px-4 py-3 bg-glass-bg border border-border-primary rounded-lg text-white focus:ring-2 focus:ring-electric-blue focus:border-electric-blue"
            >
              <option value="low">Faible</option>
              <option value="medium">Moyenne</option>
              <option value="high">Élevée</option>
              <option value="urgent">Urgente</option>
            </select>
          </div>

          <!-- Type -->
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2"
              >Type</label
            >
            <select
              v-model="form.type"
              class="w-full px-4 py-3 bg-glass-bg border border-border-primary rounded-lg text-white focus:ring-2 focus:ring-electric-blue focus:border-electric-blue"
            >
              <option value="task">Tâche générale</option>
              <option value="callback">Rappel client</option>
            </select>
          </div>
        </div>

        <!-- Due Date -->
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2"
            >Date d'échéance</label
          >
          <input
            v-model="form.dueDate"
            type="date"
            class="w-full px-4 py-3 bg-glass-bg border border-border-primary rounded-lg text-white focus:ring-2 focus:ring-electric-blue focus:border-electric-blue custom-date-picker"
          />
          <p class="text-xs text-gray-400 mt-1">
            Optionnel - définir une date limite
          </p>
        </div>

        <!-- Form Actions -->
        <div
          class="flex items-center justify-end gap-4 pt-4 border-t border-border-primary"
        >
          <button
            type="button"
            @click="$emit('close')"
            class="px-6 py-2 text-gray-300 hover:text-white transition-colors"
          >
            Annuler
          </button>
          <button
            type="submit"
            class="px-6 py-2 bg-electric-blue hover:bg-electric-blue-dark text-black rounded-lg transition-all duration-200 font-medium hover-lift flex items-center gap-2"
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
                d="M12 4v16m8-8H4"
              />
            </svg>
            Créer le ticket
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";

// Props
const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
});

// Events
const emit = defineEmits(["close", "create"]);

// Form data
const form = ref({
  title: "",
  customer: "",
  description: "",
  priority: "medium",
  type: "task",
  dueDate: "",
});

// Methods
const handleSubmit = () => {
  if (!form.value.title.trim() || !form.value.customer.trim()) {
    return;
  }

  // Emit the form data
  emit("create", {
    title: form.value.title.trim(),
    customer: form.value.customer.trim(),
    description: form.value.description.trim(),
    priority: form.value.priority,
    type: form.value.type,
    dueDate: form.value.dueDate || null,
  });

  // Reset form
  resetForm();

  // Close modal
  emit("close");
};

const resetForm = () => {
  form.value = {
    title: "",
    customer: "",
    description: "",
    priority: "medium",
    type: "task",
    dueDate: "",
  };
};

// Reset form when modal is opened
watch(
  () => props.show,
  (newShow) => {
    if (newShow) {
      resetForm();
      // Focus first input after modal animation
      setTimeout(() => {
        const firstInput = document.querySelector('input[type="text"]');
        if (firstInput) firstInput.focus();
      }, 100);
    }
  },
);

// Keyboard shortcuts
const handleKeydown = (event) => {
  if (event.key === "Escape") {
    emit("close");
  }
};

// Add/remove event listeners
import { onMounted, onUnmounted } from "vue";

onMounted(() => {
  document.addEventListener("keydown", handleKeydown);
});

onUnmounted(() => {
  document.removeEventListener("keydown", handleKeydown);
});
</script>

<style scoped>
.modal-content {
  animation: modalSlideIn 0.3s ease-out;
  max-height: 90vh;
  overflow-y: auto;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(-20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.hover-lift {
  transition: transform 0.2s ease;
}

.hover-lift:hover {
  transform: translateY(-1px);
}

/* Custom scrollbar for modal */
.modal-content::-webkit-scrollbar {
  width: 6px;
}

.modal-content::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
}

.modal-content::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
}

.modal-content::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}
</style>
