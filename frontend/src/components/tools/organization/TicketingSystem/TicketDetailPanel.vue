<template>
  <!-- Side Panel -->
  <div class="panel-container">
    <!-- Header -->
    <div class="panel-header">
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2 mb-2">
          <span class="panel-ticket-number">Ticket #{{ ticket.id }}</span>
          <span
            :class="[
              'panel-priority-badge',
              priorityBadgeColors[ticket.priority],
            ]"
          >
            {{ priorityLabels[ticket.priority] }}
          </span>
        </div>
        <h2 class="panel-title">{{ ticket.title }}</h2>
      </div>
      <button @click="$emit('close')" class="panel-close-btn">
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

    <!-- Tabs -->
    <div class="panel-tabs">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        @click="activeTab = tab.id"
        :class="['panel-tab', { 'panel-tab--active': activeTab === tab.id }]"
      >
        {{ tab.label }}
        <div v-if="activeTab === tab.id" class="panel-tab-indicator"></div>
      </button>
    </div>

    <!-- Content Area (Scrollable) -->
    <div class="panel-content">
      <!-- Details Tab -->
      <div v-if="activeTab === 'details'" class="panel-form">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Title -->
          <UIInput
            v-model="form.title"
            label="Titre"
            type="text"
            required
            placeholder="Ex: Rappeler M. Dupont pour devis"
            :key="`title-${ticket.id}`"
          />

          <!-- Customer -->
          <UIInput
            v-model="form.customer"
            label="Client"
            type="text"
            required
            placeholder="Nom du client"
            :key="`customer-${ticket.id}`"
          />

          <!-- Description -->
          <div>
            <label class="form-label">Description</label>
            <textarea
              v-model="form.description"
              rows="4"
              class="form-textarea"
              placeholder="Détails du ticket..."
              :key="`description-${ticket.id}`"
            ></textarea>
          </div>

          <!-- Priority and Type Row -->
          <div class="grid grid-cols-2 gap-4">
            <!-- Priority -->
            <UISelect
              v-model="form.priority"
              label="Priorité"
              :key="`priority-${ticket.id}`"
              :options="[
                { value: 'low', label: 'Basse' },
                { value: 'medium', label: 'Moyenne' },
                { value: 'high', label: 'Haute' },
                { value: 'urgent', label: 'Urgente' },
              ]"
            />

            <!-- Type -->
            <UISelect
              v-model="form.type"
              label="Type"
              :key="`type-${ticket.id}`"
              :options="[
                { value: 'call', label: 'Appel' },
                { value: 'email', label: 'Email' },
                { value: 'meeting', label: 'Réunion' },
                { value: 'task', label: 'Tâche' },
              ]"
            />
          </div>

          <!-- Status -->
          <UISelect
            v-model="form.status"
            label="Statut"
            :key="`status-${ticket.id}`"
            :options="[
              { value: 'todo', label: 'À faire' },
              { value: 'in-progress', label: 'En cours' },
              { value: 'waiting', label: 'En attente' },
              { value: 'blocked', label: 'Bloqué' },
              { value: 'completed', label: 'Terminé' },
            ]"
          />

          <!-- Due Date -->
          <div>
            <label class="form-label">Date d'échéance</label>
            <input v-model="form.dueDate" type="date" class="form-input" />
            <p class="form-help">Optionnel - définir une date limite</p>
          </div>

          <!-- Timestamps Info -->
          <div class="info-card">
            <h4 class="info-card-title">Informations</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <span class="info-label">Créé le</span>
                <span class="info-value">{{
                  formatDate(ticket.createdAt)
                }}</span>
              </div>
              <div v-if="ticket.updatedAt">
                <span class="info-label">Modifié le</span>
                <span class="info-value">{{
                  formatDate(ticket.updatedAt)
                }}</span>
              </div>
            </div>
          </div>
        </form>
      </div>

      <!-- Activity Tab -->
      <div v-if="activeTab === 'activity'" class="panel-empty-state">
        <svg
          class="w-12 h-12 mx-auto mb-4 opacity-50"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <p>Historique des activités</p>
        <p class="text-xs mt-1">Fonctionnalité à venir</p>
      </div>

      <!-- Comments Tab -->
      <div v-if="activeTab === 'comments'" class="panel-empty-state">
        <svg
          class="w-12 h-12 mx-auto mb-4 opacity-50"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
        <p>Commentaires</p>
        <p class="text-xs mt-1">Fonctionnalité à venir</p>
      </div>
    </div>

    <!-- Footer Actions -->
    <div class="panel-footer">
      <UIButton variant="secondary" size="lg" @click="$emit('close')">
        Annuler
      </UIButton>
      <UIButton variant="primary" size="lg" @click="handleSubmit">
        Enregistrer
      </UIButton>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from "vue";
import { UIInput, UISelect, UIButton } from "@/components/ui";

// Props
const props = defineProps({
  ticket: {
    type: Object,
    required: true,
  },
});

// Events
const emit = defineEmits(["close", "save"]);

// Tabs
const tabs = [
  { id: "details", label: "Détails" },
  { id: "activity", label: "Activité" },
  { id: "comments", label: "Commentaires" },
];

const activeTab = ref("details");

// Form state
const form = ref({
  title: "",
  customer: "",
  description: "",
  priority: "medium",
  type: "call",
  status: "todo",
  dueDate: "",
});

// Priority labels and colors
const priorityLabels = {
  low: "Basse",
  medium: "Moyenne",
  high: "Haute",
  urgent: "Urgente",
};

const priorityBadgeColors = {
  low: "priority-low",
  medium: "priority-medium",
  high: "priority-high",
  urgent: "priority-urgent",
};

// Methods
const handleSubmit = () => {
  if (!form.value.title.trim() || !form.value.customer.trim()) {
    return;
  }

  // Helper function to get current local timestamp
  const getCurrentTimestamp = () => {
    const now = new Date();
    const offset = now.getTimezoneOffset() * 60000;
    const localTime = new Date(now.getTime() - offset);
    return localTime.toISOString();
  };

  // Emit the updated ticket data
  emit("save", {
    ...props.ticket,
    title: form.value.title.trim(),
    customer: form.value.customer.trim(),
    description: form.value.description.trim(),
    priority: form.value.priority,
    type: form.value.type,
    status: form.value.status,
    dueDate: form.value.dueDate || null,
    updatedAt: getCurrentTimestamp(),
  });

  // Close panel
  emit("close");
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Populate form when ticket changes
watch(
  () => props.ticket,
  (newTicket) => {
    if (newTicket) {
      // Update each property individually to ensure reactivity
      form.value.title = newTicket.title || "";
      form.value.customer = newTicket.customer || "";
      form.value.description = newTicket.description || "";
      form.value.priority = newTicket.priority || "medium";
      form.value.type = newTicket.type || "call";
      form.value.status = newTicket.status || "todo";
      form.value.dueDate = newTicket.dueDate || "";
    }
  },
  { immediate: true, flush: "post" },
);

// Keyboard shortcut to close
const handleKeydown = (e) => {
  if (e.key === "Escape") {
    emit("close");
  }
};

onMounted(() => {
  document.addEventListener("keydown", handleKeydown);
});

onUnmounted(() => {
  document.removeEventListener("keydown", handleKeydown);
});
</script>

<style scoped>
/* ================================
   PANEL CONTAINER
   ================================ */
.panel-container {
  position: fixed;
  top: 0;
  right: 0;
  height: 100vh;
  width: 100%;
  background: var(--bg-secondary);
  border-left: 1px solid var(--border-primary);
  box-shadow: -4px 0 24px rgba(0, 0, 0, 0.5);
  z-index: 40;
  display: flex;
  flex-direction: column;
}

@media (min-width: 768px) {
  .panel-container {
    width: 500px;
  }
}

@media (min-width: 1024px) {
  .panel-container {
    width: 600px;
  }
}

/* ================================
   PANEL HEADER
   ================================ */
.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-6);
  border-bottom: 1px solid var(--border-primary);
  flex-shrink: 0;
  background: var(--bg-tertiary);
}

.panel-ticket-number {
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
  color: var(--text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.panel-priority-badge {
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-sm);
  font-size: var(--text-xs);
  font-weight: var(--font-semibold);
}

.priority-low {
  background: rgba(128, 128, 128, 0.3);
  color: var(--text-secondary);
  border: 1px solid rgba(128, 128, 128, 0.5);
}

.priority-medium {
  background: rgba(255, 230, 109, 0.3);
  color: var(--accent-yellow);
  border: 1px solid rgba(255, 230, 109, 0.5);
}

.priority-high {
  background: var(--accent-orange-alpha-20);
  color: var(--accent-orange);
  border: 1px solid rgba(234, 88, 12, 0.5);
}

.priority-urgent {
  background: var(--accent-red-alpha-20);
  color: var(--accent-red);
  border: 1px solid rgba(255, 107, 107, 0.5);
}

.panel-title {
  font-size: var(--text-2xl);
  font-weight: var(--font-bold);
  color: var(--text-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.panel-close-btn {
  padding: var(--space-2);
  border-radius: var(--radius-lg);
  color: var(--text-tertiary);
  transition: var(--transition-fast);
  margin-left: var(--space-4);
  flex-shrink: 0;
}

.panel-close-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: var(--text-primary);
}

/* ================================
   PANEL TABS
   ================================ */
.panel-tabs {
  display: flex;
  border-bottom: 1px solid var(--border-primary);
  flex-shrink: 0;
}

.panel-tab {
  padding: var(--space-3) var(--space-6);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--text-tertiary);
  position: relative;
  transition: var(--transition-fast);
}

.panel-tab:hover {
  color: var(--text-primary);
}

.panel-tab--active {
  color: var(--electric-blue);
}

.panel-tab-indicator {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--electric-blue);
}

/* ================================
   PANEL CONTENT
   ================================ */
.panel-content {
  flex: 1;
  overflow-y: auto;
}

.panel-content::-webkit-scrollbar {
  width: 6px;
}

.panel-content::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
}

.panel-content::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
}

.panel-content::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}

.panel-form {
  padding: var(--space-6);
}

.panel-empty-state {
  padding: var(--space-6);
  text-align: center;
  padding-top: var(--space-12);
  padding-bottom: var(--space-12);
  color: var(--text-tertiary);
}

/* ================================
   FORM ELEMENTS
   ================================ */
.form-label {
  display: block;
  font-family: var(--font-labels);
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin-bottom: var(--space-2);
  letter-spacing: -0.01em;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: var(--space-3) var(--space-4);
  background: var(--bg-tertiary);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-lg);
  color: var(--text-primary);
  font-size: var(--text-base);
  transition: var(--transition-fast);
}

.form-input::placeholder,
.form-textarea::placeholder {
  color: var(--text-tertiary);
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: var(--electric-blue);
  ring: 2px;
  ring-color: var(--electric-blue-alpha-20);
}

.form-textarea {
  resize: none;
  font-family: inherit;
}

.form-help {
  font-size: var(--text-xs);
  color: var(--text-tertiary);
  margin-top: var(--space-1);
}

/* White calendar icon for date input */
input[type="date"]::-webkit-calendar-picker-indicator {
  filter: invert(1);
  cursor: pointer;
}

input[type="date"]::-webkit-calendar-picker-indicator:hover {
  filter: invert(1) brightness(0.8);
}

/* ================================
   INFO CARD
   ================================ */
.info-card {
  padding: var(--space-4);
  background: var(--bg-tertiary);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-primary);
}

.info-card-title {
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin-bottom: var(--space-3);
}

.info-label {
  display: block;
  color: var(--text-tertiary);
  margin-bottom: var(--space-1);
}

.info-value {
  color: var(--text-secondary);
  font-weight: var(--font-medium);
}

/* ================================
   PANEL FOOTER
   ================================ */
.panel-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  padding: var(--space-6);
  border-top: 1px solid var(--border-primary);
  flex-shrink: 0;
  background: var(--bg-tertiary);
}
</style>
