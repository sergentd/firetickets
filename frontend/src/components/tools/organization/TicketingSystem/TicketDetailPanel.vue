<template>
  <div class="panel-container">
    <!-- Header -->
    <div class="panel-header">
      <div class="flex-1 min-w-0">
        <!-- Ticket Number + Badges -->
        <div class="header-badges">
          <span class="ticket-number">TICKET #{{ formatTicketId(ticket.id) }}</span>
          <span :class="['badge', `badge-${ticket.priority}`]">
            {{ priorityLabels[ticket.priority] }}
          </span>
          <span class="badge badge-type">
            {{ typeLabels[ticket.type] }}
          </span>
          <span :class="['badge', `badge-status-${ticket.status}`]">
            {{ statusLabels[ticket.status] }}
          </span>
        </div>

        <!-- Title -->
        <h1 class="panel-title">{{ ticket.title }}</h1>

        <!-- Timestamps -->
        <div class="timestamps">
          <span class="timestamp-item">
            <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
            </svg>
            Créé : {{ getRelativeTime(ticket.createdAt) }}
          </span>
          <span class="timestamp-divider">•</span>
          <span class="timestamp-item">
            <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
            Modifié : {{ getRelativeTime(ticket.updatedAt) }}
          </span>
        </div>
      </div>

      <!-- Close Button -->
      <button @click="$emit('close')" class="close-btn">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <!-- Action Buttons -->
    <div class="action-buttons">
      <button class="action-btn" @click="handleDuplicate">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
        <span>Dupliquer</span>
      </button>
      <button class="action-btn" @click="handlePrint">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
        </svg>
        <span>Imprimer</span>
      </button>
      <button class="action-btn" @click="handleShare">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
        </svg>
        <span>Partager</span>
      </button>
      <button class="action-btn action-btn-danger" @click="handleArchive">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
        </svg>
        <span>Archiver</span>
      </button>
    </div>

    <!-- Tabs -->
    <div class="tabs">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        @click="activeTab = tab.id"
        :class="['tab', { 'tab-active': activeTab === tab.id }]"
      >
        <svg class="tab-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path v-if="tab.id === 'details'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          <path v-else-if="tab.id === 'attachments'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
          <path v-else-if="tab.id === 'comments'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          <path v-else-if="tab.id === 'activity'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
        <span class="tab-label">{{ tab.label }}</span>
        <span v-if="tab.getCount()" class="tab-count">{{ tab.getCount() }}</span>
      </button>
    </div>

    <!-- Content -->
    <div class="content">
      <!-- Details Tab -->
      <div v-if="activeTab === 'details'" class="form">
        <form @submit.prevent="handleSubmit">
          <div class="form-group">
            <label class="form-label">Titre *</label>
            <input
              v-model="form.title"
              type="text"
              class="form-input"
              required
              placeholder="Ex: Rappeler M. Dupont pour devis"
            />
          </div>

          <div class="form-group">
            <label class="form-label">Client *</label>
            <input
              v-model="form.customer"
              type="text"
              class="form-input"
              required
              placeholder="Nom du client"
            />
          </div>

          <div class="form-group">
            <label class="form-label">Description</label>
            <textarea
              v-model="form.description"
              rows="4"
              class="form-textarea"
              placeholder="Détails du ticket..."
            ></textarea>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Priorité</label>
              <select v-model="form.priority" class="form-select">
                <option value="low">Basse</option>
                <option value="medium">Moyenne</option>
                <option value="high">Haute</option>
                <option value="urgent">Urgente</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Type</label>
              <select v-model="form.type" class="form-select">
                <option value="call">Appel</option>
                <option value="email">Email</option>
                <option value="meeting">Réunion</option>
                <option value="task">Tâche</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Statut</label>
            <select v-model="form.status" class="form-select">
              <option value="todo">À faire</option>
              <option value="in-progress">En cours</option>
              <option value="waiting">En attente</option>
              <option value="blocked">Bloqué</option>
              <option value="completed">Terminé</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Date d'échéance</label>
            <input v-model="form.dueDate" type="date" class="form-input" />
            <p class="form-help">Optionnel - définir une date limite</p>
          </div>
        </form>
      </div>

      <!-- Attachments Tab -->
      <div v-if="activeTab === 'attachments'" class="tab-content">
        <div v-if="attachments.length === 0" class="empty-state">
          <svg class="empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
          </svg>
          <p class="empty-text">Aucune pièce jointe</p>
        </div>
        <div v-else class="attachments-list">
          <div v-for="attachment in attachments" :key="attachment.id" class="attachment-item">
            <div class="attachment-icon">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
            </div>
            <div class="attachment-info">
              <p class="attachment-name">{{ attachment.name }}</p>
              <p class="attachment-meta">{{ formatFileSize(attachment.size) }} • {{ formatDate(attachment.uploadedAt) }}</p>
            </div>
            <a :href="attachment.url" target="_blank" class="attachment-download">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      <!-- Comments Tab -->
      <div v-if="activeTab === 'comments'" class="tab-content">
        <div v-if="comments.length === 0" class="empty-state">
          <svg class="empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <p class="empty-text">Aucun commentaire</p>
        </div>
        <div v-else class="comments-list">
          <div v-for="comment in comments" :key="comment.id" class="comment-item">
            <div class="comment-header">
              <span class="comment-author">{{ comment.userEmail }}</span>
              <span class="comment-date">{{ formatDate(comment.createdAt) }}</span>
            </div>
            <p class="comment-text">{{ comment.text }}</p>
          </div>
        </div>
      </div>

      <!-- Activity Tab -->
      <div v-if="activeTab === 'activity'" class="tab-content">
        <div v-if="activities.length === 0" class="empty-state">
          <svg class="empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p class="empty-text">Aucune activité</p>
        </div>
        <div v-else class="activity-list">
          <div v-for="activity in activities" :key="activity.id" class="activity-item">
            <div class="activity-icon">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="activity-content">
              <p class="activity-description">{{ activity.description }}</p>
              <p class="activity-meta">{{ formatDate(activity.timestamp) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="footer">
      <button @click="$emit('close')" class="btn btn-secondary">Annuler</button>
      <button @click="handleSubmit" class="btn btn-primary">Enregistrer</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from "vue";

const props = defineProps({
  ticket: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["close", "save", "duplicate", "archive"]);

// Computed arrays
const attachments = computed(() => props.ticket.attachments || []);
const comments = computed(() => props.ticket.comments || []);
const activities = computed(() => props.ticket.activities || []);

// Tabs
const tabs = computed(() => [
  { id: "details", label: "Détails", getCount: () => null },
  { id: "attachments", label: "Pièces jointes", getCount: () => attachments.value.length || null },
  { id: "comments", label: "Commentaires", getCount: () => comments.value.length || null },
  { id: "activity", label: "Activité", getCount: () => activities.value.length || null },
]);

const activeTab = ref("details");

// Form
const form = ref({
  title: "",
  customer: "",
  description: "",
  priority: "medium",
  type: "call",
  status: "todo",
  dueDate: "",
});

// Labels
const priorityLabels = {
  low: "Basse",
  medium: "Moyenne",
  high: "Haute",
  urgent: "Urgente",
};

const typeLabels = {
  call: "Appel",
  email: "Email",
  meeting: "Réunion",
  task: "Tâche",
};

const statusLabels = {
  todo: "À faire",
  "in-progress": "En cours",
  waiting: "En attente",
  blocked: "Bloqué",
  completed: "Terminé",
};

// Methods
const formatTicketId = (id) => {
  return id.toUpperCase().slice(0, 23);
};

const getRelativeTime = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now - date;

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "à l'instant";
  if (minutes < 60) return `il y a ${minutes} minute${minutes > 1 ? 's' : ''}`;
  if (hours < 24) return `il y a ${hours} heure${hours > 1 ? 's' : ''}`;
  return `il y a ${days} jour${days > 1 ? 's' : ''}`;
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

const formatFileSize = (bytes) => {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / 1048576).toFixed(1) + ' MB';
};

const handleSubmit = () => {
  if (!form.value.title.trim() || !form.value.customer.trim()) {
    return;
  }

  const getCurrentTimestamp = () => {
    const now = new Date();
    const offset = now.getTimezoneOffset() * 60000;
    const localTime = new Date(now.getTime() - offset);
    return localTime.toISOString();
  };

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

  emit("close");
};

const handleDuplicate = () => {
  emit("duplicate", props.ticket);
};

const handlePrint = () => {
  window.print();
};

const handleShare = () => {
  console.log("Share ticket", props.ticket);
};

const handleArchive = () => {
  emit("archive", props.ticket);
};

// Populate form when ticket changes
watch(
  () => props.ticket,
  (newTicket) => {
    if (newTicket) {
      form.value.title = newTicket.title || "";
      form.value.customer = newTicket.customer || "";
      form.value.description = newTicket.description || "";
      form.value.priority = newTicket.priority || "medium";
      form.value.type = newTicket.type || "call";
      form.value.status = newTicket.status || "todo";
      form.value.dueDate = newTicket.dueDate || "";
    }
  },
  { immediate: true, flush: "post" }
);

// Keyboard shortcut
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
.panel-container {
  position: fixed;
  top: 0;
  right: 0;
  height: 100vh;
  width: 100%;
  max-width: 600px;
  background: var(--bg-secondary);
  border-left: 1px solid var(--border-primary);
  box-shadow: -4px 0 24px rgba(0, 0, 0, 0.5);
  z-index: 40;
  display: flex;
  flex-direction: column;
}

/* Header */
.panel-header {
  display: flex;
  gap: var(--space-4);
  padding: var(--space-6);
  border-bottom: 1px solid var(--border-primary);
  background: var(--bg-primary);
}

.header-badges {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin-bottom: var(--space-4);
  flex-wrap: wrap;
}

.ticket-number {
  font-size: 11px;
  font-weight: 600;
  color: var(--text-tertiary);
  letter-spacing: 0.05em;
}

.badge {
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
  border: 1px solid;
  white-space: nowrap;
}

.badge-low {
  background: rgba(128, 128, 128, 0.15);
  color: #9ca3af;
  border-color: rgba(128, 128, 128, 0.3);
}

.badge-medium {
  background: rgba(245, 158, 11, 0.15);
  color: #f59e0b;
  border-color: rgba(245, 158, 11, 0.3);
}

.badge-high {
  background: rgba(234, 88, 12, 0.15);
  color: #ea580c;
  border-color: rgba(234, 88, 12, 0.3);
}

.badge-urgent {
  background: rgba(239, 68, 68, 0.15);
  color: #ef4444;
  border-color: rgba(239, 68, 68, 0.3);
}

.badge-type {
  background: rgba(59, 130, 246, 0.15);
  color: #3b82f6;
  border-color: rgba(59, 130, 246, 0.3);
}

.badge-status-todo,
.badge-status-in-progress {
  background: rgba(59, 130, 246, 0.15);
  color: #3b82f6;
  border-color: rgba(59, 130, 246, 0.3);
}

.badge-status-waiting,
.badge-status-blocked {
  background: rgba(128, 128, 128, 0.15);
  color: #9ca3af;
  border-color: rgba(128, 128, 128, 0.3);
}

.badge-status-completed {
  background: rgba(34, 197, 94, 0.15);
  color: #22c55e;
  border-color: rgba(34, 197, 94, 0.3);
}

.panel-title {
  font-size: 32px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: var(--space-3);
  line-height: 1.2;
}

.timestamps {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: 12px;
  color: var(--text-tertiary);
}

.timestamp-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.timestamp-divider {
  opacity: 0.5;
}

.close-btn {
  padding: var(--space-2);
  border-radius: var(--radius-lg);
  color: var(--text-tertiary);
  transition: all 0.2s;
  height: fit-content;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: var(--text-primary);
}

/* Action Buttons */
.action-buttons {
  display: flex;
  gap: var(--space-3);
  padding: var(--space-4) var(--space-6);
  border-bottom: 1px solid var(--border-primary);
}

.action-btn {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--text-secondary);
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border-primary);
  transition: all 0.2s;
}

.action-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: var(--text-primary);
}

.action-btn-danger {
  color: var(--accent-red);
}

.action-btn-danger:hover {
  background: rgba(239, 68, 68, 0.1);
  border-color: var(--accent-red);
}

/* Tabs */
.tabs {
  display: flex;
  border-bottom: 1px solid var(--border-primary);
}

.tab {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  padding: var(--space-4);
  color: var(--text-tertiary);
  transition: all 0.2s;
  border-bottom: 2px solid transparent;
  position: relative;
  font-size: var(--text-sm);
}

.tab:hover {
  color: var(--text-primary);
  background: rgba(255, 255, 255, 0.05);
}

.tab-active {
  color: var(--electric-blue);
  border-bottom-color: var(--electric-blue);
}

.tab-icon {
  width: 18px;
  height: 18px;
}

.tab-label {
  font-weight: 500;
}

.tab-count {
  font-size: 11px;
  font-weight: 600;
  color: var(--text-tertiary);
}

.tab-active .tab-count {
  color: var(--electric-blue);
}

/* Content */
.content {
  flex: 1;
  overflow-y: auto;
  padding: var(--space-6);
}

.content::-webkit-scrollbar {
  width: 6px;
}

.content::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
}

.content::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
}

/* Form */
.form-group {
  margin-bottom: var(--space-5);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-4);
}

.form-label {
  display: block;
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--space-2);
}

.form-input,
.form-textarea,
.form-select {
  width: 100%;
  padding: var(--space-3) var(--space-4);
  background: var(--bg-tertiary);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-lg);
  color: var(--text-primary);
  font-size: var(--text-base);
  transition: all 0.2s;
}

.form-input:focus,
.form-textarea:focus,
.form-select:focus {
  outline: none;
  border-color: var(--electric-blue);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-textarea {
  resize: vertical;
  font-family: inherit;
}

.form-help {
  font-size: var(--text-xs);
  color: var(--text-tertiary);
  margin-top: var(--space-1);
}

input[type="date"]::-webkit-calendar-picker-indicator {
  filter: invert(1);
}

/* Lists */
.attachments-list,
.comments-list,
.activity-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.attachment-item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3);
  background: var(--bg-tertiary);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-lg);
}

.attachment-icon {
  color: var(--text-tertiary);
}

.attachment-info {
  flex: 1;
  min-width: 0;
}

.attachment-name {
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--text-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.attachment-meta {
  font-size: var(--text-xs);
  color: var(--text-tertiary);
  margin-top: 2px;
}

.attachment-download {
  color: var(--electric-blue);
  padding: var(--space-2);
  border-radius: var(--radius-md);
  transition: all 0.2s;
}

.attachment-download:hover {
  background: rgba(59, 130, 246, 0.1);
}

.comment-item {
  padding: var(--space-4);
  background: var(--bg-tertiary);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-lg);
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-2);
}

.comment-author {
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--text-primary);
}

.comment-date {
  font-size: var(--text-xs);
  color: var(--text-tertiary);
}

.comment-text {
  font-size: var(--text-sm);
  color: var(--text-secondary);
  line-height: 1.5;
}

.activity-item {
  display: flex;
  gap: var(--space-3);
  padding: var(--space-3);
}

.activity-icon {
  color: var(--electric-blue);
  margin-top: 2px;
}

.activity-description {
  font-size: var(--text-sm);
  color: var(--text-primary);
  margin-bottom: 2px;
}

.activity-meta {
  font-size: var(--text-xs);
  color: var(--text-tertiary);
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: var(--space-12);
  color: var(--text-tertiary);
}

.empty-icon {
  width: 48px;
  height: 48px;
  margin: 0 auto var(--space-4);
  opacity: 0.5;
}

.empty-text {
  font-size: var(--text-base);
  font-weight: 600;
  color: var(--text-secondary);
}

/* Footer */
.footer {
  display: flex;
  gap: var(--space-3);
  padding: var(--space-6);
  border-top: 1px solid var(--border-primary);
  background: var(--bg-tertiary);
}

.btn {
  flex: 1;
  padding: var(--space-3) var(--space-6);
  border-radius: var(--radius-lg);
  font-size: var(--text-base);
  font-weight: 600;
  transition: all 0.2s;
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid var(--border-primary);
  color: var(--text-primary);
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.15);
}

.btn-primary {
  background: var(--electric-blue);
  border: 1px solid var(--electric-blue);
  color: white;
}

.btn-primary:hover {
  background: #2563eb;
}
</style>
