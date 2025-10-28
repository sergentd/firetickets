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
            {{ getTypeLabel(ticket.type) }}
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
            <label class="form-label">Titre <span class="required-star">*</span></label>
            <input
              v-model="form.title"
              type="text"
              class="form-input"
              required
              placeholder="Ex: Rappeler M. Dupont pour devis"
            />
          </div>

          <div class="form-group">
            <label class="form-label">Client <span class="required-star">*</span></label>
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
                <option value="task">Tâche</option>
                <option value="email">Email</option>
                <option value="call">Appel</option>
                <option value="meeting">Réunion</option>
                <option value="request">Demande</option>
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
        <!-- Drag & Drop Upload Zone -->
        <div
          :class="['upload-zone', { 'upload-zone-dragging': isDragging, 'upload-zone-uploading': isUploading }]"
          @drop="handleFileDrop"
          @dragover="handleDragOver"
          @dragleave="handleDragLeave"
        >
          <input
            type="file"
            id="file-upload"
            class="file-input"
            multiple
            @change="handleFileSelect"
          />
          <label for="file-upload" class="upload-label">
            <svg class="upload-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <span v-if="isUploading" class="upload-text">Upload en cours...</span>
            <span v-else-if="isDragging" class="upload-text">Déposez vos fichiers ici</span>
            <span v-else class="upload-text">Glissez-déposez vos fichiers ou <span class="upload-link">cliquez ici</span></span>
          </label>
          <div v-if="Object.keys(uploadProgress).length > 0" class="upload-progress-container">
            <div v-for="(progress, fileName) in uploadProgress" :key="fileName" class="upload-progress-item">
              <span class="upload-progress-name">{{ fileName }}</span>
              <div class="upload-progress-bar">
                <div class="upload-progress-fill" :style="{ width: progress + '%' }"></div>
              </div>
              <span class="upload-progress-percent">{{ Math.round(progress) }}%</span>
            </div>
          </div>
        </div>

        <!-- Attachments List -->
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
            <div class="attachment-actions">
              <button
                v-if="isPreviewable(attachment.type)"
                @click="previewAttachment(attachment)"
                class="attachment-action-btn"
                title="Prévisualiser"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
              <a :href="attachment.url" download :title="'Télécharger ' + attachment.name" class="attachment-action-btn">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </a>
              <button
                @click="handleRemoveAttachment(attachment)"
                class="attachment-action-btn attachment-delete-btn"
                title="Supprimer"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Comments Tab -->
      <div v-if="activeTab === 'comments'" class="tab-content">
        <!-- Comment Input -->
        <div class="comment-input-container">
          <textarea
            v-model="newCommentText"
            class="comment-input"
            placeholder="Ajouter un commentaire..."
            rows="3"
            @keydown.ctrl.enter="handleSubmitComment"
            @keydown.meta.enter="handleSubmitComment"
          ></textarea>
          <div class="comment-input-footer">
            <span class="comment-hint">Ctrl+Entrée pour envoyer</span>
            <button
              @click="handleSubmitComment"
              :disabled="!newCommentText.trim() || isSubmittingComment"
              class="btn-submit-comment"
            >
              <svg v-if="isSubmittingComment" class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
              <span>{{ isSubmittingComment ? 'Envoi...' : 'Envoyer' }}</span>
            </button>
          </div>
        </div>

        <!-- Comments List -->
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
        <div v-if="sortedActivities.length === 0" class="empty-state">
          <svg class="empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p class="empty-text">Aucune activité</p>
        </div>
        <div v-else class="activity-list">
          <div v-for="(activity, index) in sortedActivities" :key="activity.id" class="activity-item">
            <div class="activity-timeline">
              <div class="activity-icon-wrapper">
                <IconSystem :name="getActivityIcon(activity.type)" size="sm" />
              </div>
              <div v-if="index < sortedActivities.length - 1" class="activity-line"></div>
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
import IconSystem from "@/components/ui/IconSystem.vue";
import { addComment, addActivity, addAttachment, removeAttachment as removeAttachmentFromFirestore } from "@/services/ticketsFirestore";
import { uploadAttachment, deleteAttachment } from "@/services/storage";
import { getCurrentUser } from "@/services/auth";
import logger from "@/utils/logger";

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

// Sorted activities (most recent first)
const sortedActivities = computed(() => {
  return [...activities.value].sort((a, b) => {
    const dateA = new Date(a.timestamp);
    const dateB = new Date(b.timestamp);
    return dateB - dateA; // Descending order (most recent first)
  });
});

// Tabs
const tabs = computed(() => [
  { id: "details", label: "Détails", getCount: () => null },
  { id: "attachments", label: "Pièces jointes", getCount: () => attachments.value.length || null },
  { id: "comments", label: "Commentaires", getCount: () => comments.value.length || null },
  { id: "activity", label: "Activité", getCount: () => activities.value.length || null },
]);

const activeTab = ref("details");

// Comment input state
const newCommentText = ref("");
const isSubmittingComment = ref(false);

// File upload state
const isDragging = ref(false);
const isUploading = ref(false);
const uploadProgress = ref({});

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
  task: "Tâche",
  email: "Email",
  call: "Appel",
  meeting: "Réunion",
  request: "Demande",
  callback: "Appel", // Backward compatibility
};

// Helper to get type label with fallback
const getTypeLabel = (type) => {
  return typeLabels[type] || type || "Non défini";
};

// Helper to normalize type value for form dropdown
const normalizeType = (type) => {
  // Convert old "callback" to "call"
  if (type === "callback") return "call";
  // Ensure the type is valid, default to "task" if not
  const validTypes = ["task", "email", "call", "meeting", "request"];
  return validTypes.includes(type) ? type : "task";
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
  if (!id) return "N/A";
  return String(id).toUpperCase().slice(0, 23);
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

const handleSubmit = async () => {
  if (!form.value.title.trim() || !form.value.customer.trim()) {
    return;
  }

  const getCurrentTimestamp = () => {
    const now = new Date();
    const offset = now.getTimezoneOffset() * 60000;
    const localTime = new Date(now.getTime() - offset);
    return localTime.toISOString();
  };

  // Track changes for activity log
  const changes = [];
  if (props.ticket.title !== form.value.title) {
    changes.push(`Titre modifié: "${props.ticket.title}" → "${form.value.title}"`);
  }
  if (props.ticket.customer !== form.value.customer) {
    changes.push(`Client modifié: "${props.ticket.customer}" → "${form.value.customer}"`);
  }
  if (props.ticket.priority !== form.value.priority) {
    changes.push(`Priorité modifiée: ${priorityLabels[props.ticket.priority]} → ${priorityLabels[form.value.priority]}`);
  }
  if (props.ticket.status !== form.value.status) {
    changes.push(`Statut modifié: ${statusLabels[props.ticket.status]} → ${statusLabels[form.value.status]}`);
  }
  if (props.ticket.type !== form.value.type) {
    changes.push(`Type modifié: ${getTypeLabel(props.ticket.type)} → ${getTypeLabel(form.value.type)}`);
  }

  // Add activity for each change
  if (changes.length > 0) {
    try {
      for (const change of changes) {
        await addActivity(props.ticket.id, "ticket_updated", change);
      }
      logger.log("✅ Activities logged for ticket update");
    } catch (error) {
      logger.error("❌ Failed to log activities:", error);
    }
  }

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

// Comment methods
const handleSubmitComment = async () => {
  if (!newCommentText.value.trim() || isSubmittingComment.value) {
    return;
  }

  isSubmittingComment.value = true;
  try {
    const currentUser = getCurrentUser();
    const userEmail = currentUser?.email || "Utilisateur";

    await addComment(props.ticket.id, newCommentText.value.trim());
    await addActivity(props.ticket.id, "comment_added", `Commentaire ajouté par ${userEmail}`);
    newCommentText.value = "";
    logger.log("✅ Comment added successfully");
  } catch (error) {
    logger.error("❌ Failed to add comment:", error);
    alert("Erreur lors de l'ajout du commentaire");
  } finally {
    isSubmittingComment.value = false;
  }
};

// File upload methods
const handleFileDrop = async (event) => {
  event.preventDefault();
  isDragging.value = false;

  const files = Array.from(event.dataTransfer.files);
  if (files.length === 0) return;

  await uploadFiles(files);
};

const handleFileSelect = async (event) => {
  const files = Array.from(event.target.files);
  if (files.length === 0) return;

  await uploadFiles(files);
  event.target.value = ""; // Reset input
};

const uploadFiles = async (files) => {
  isUploading.value = true;

  try {
    for (const file of files) {
      logger.log(`📤 Uploading ${file.name}...`);

      // Upload to Firebase Storage
      const attachment = await uploadAttachment(file, props.ticket.id, (progress) => {
        uploadProgress.value[file.name] = progress;
      });

      // Add attachment to Firestore ticket
      await addAttachment(props.ticket.id, attachment);

      // Log activity
      await addActivity(props.ticket.id, "attachment_added", `Document ajouté: ${file.name}`);

      logger.log(`✅ ${file.name} uploaded successfully`);
      delete uploadProgress.value[file.name];
    }
  } catch (error) {
    logger.error("❌ Failed to upload files:", error);
    alert("Erreur lors de l'upload des fichiers");
  } finally {
    isUploading.value = false;
  }
};

const handleRemoveAttachment = async (attachment) => {
  if (!confirm(`Supprimer "${attachment.name}" ?`)) {
    return;
  }

  try {
    // Delete from Firebase Storage
    if (attachment.storagePath) {
      await deleteAttachment(attachment.storagePath);
    }

    // Remove from Firestore ticket
    await removeAttachmentFromFirestore(props.ticket.id, attachment.id);

    // Log activity
    await addActivity(props.ticket.id, "attachment_removed", `Document supprimé: ${attachment.name}`);

    logger.log(`✅ ${attachment.name} removed successfully`);
  } catch (error) {
    logger.error("❌ Failed to remove attachment:", error);
    alert("Erreur lors de la suppression du fichier");
  }
};

const handleDragOver = (event) => {
  event.preventDefault();
  isDragging.value = true;
};

const handleDragLeave = (event) => {
  event.preventDefault();
  isDragging.value = false;
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

// Activity icon mapping
const getActivityIcon = (activityType) => {
  const iconMap = {
    comment_added: "edit",
    attachment_added: "upload",
    attachment_removed: "trash",
    ticket_updated: "edit",
    ticket_created: "plus",
    status_changed: "check-circle",
    priority_changed: "alert",
    assigned: "user",
    default: "clock",
  };
  return iconMap[activityType] || iconMap.default;
};

// Attachment preview methods
const isPreviewable = (fileType) => {
  const previewableTypes = ["image/png", "image/jpeg", "image/jpg", "image/gif", "image/webp", "image/svg+xml", "application/pdf"];
  return previewableTypes.includes(fileType?.toLowerCase());
};

const previewAttachment = (attachment) => {
  // Open attachment in new window/tab for preview
  window.open(attachment.url, "_blank", "noopener,noreferrer");
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
      form.value.type = normalizeType(newTicket.type || "task");
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
  gap: 6px;
  padding: 12px 16px;
  color: var(--text-tertiary);
  transition: all 0.2s;
  border-bottom: 2px solid transparent;
  position: relative;
  font-size: 13px;
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
  width: 16px;
  height: 16px;
}

.tab-label {
  font-weight: 500;
  font-size: var(--text-xs)
}

.tab-count {
  font-size: var(--text-xs);
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

.required-star {
  color: var(--accent-red);
  margin-left: 2px;
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

.attachment-actions {
  display: flex;
  gap: var(--space-2);
}

.attachment-action-btn {
  color: var(--electric-blue);
  padding: var(--space-2);
  border-radius: var(--radius-md);
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.attachment-action-btn:hover {
  background: rgba(59, 130, 246, 0.1);
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
  gap: var(--space-4);
  position: relative;
}

.activity-timeline {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.activity-icon-wrapper {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--bg-tertiary);
  border: 2px solid var(--electric-blue);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--electric-blue);
  box-shadow: 0 0 12px rgba(0, 212, 255, 0.3);
  position: relative;
  z-index: 2;
  flex-shrink: 0;
}

.activity-line {
  width: 2px;
  flex: 1;
  background: linear-gradient(
    to bottom,
    var(--electric-blue) 0%,
    rgba(0, 212, 255, 0.3) 100%
  );
  margin-top: var(--space-2);
  margin-bottom: var(--space-2);
  min-height: 40px;
}

.activity-content {
  flex: 1;
  padding-top: var(--space-1);
  padding-bottom: var(--space-5);
}

.activity-description {
  font-size: var(--text-sm);
  color: var(--text-primary);
  margin-bottom: 4px;
  line-height: 1.4;
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

/* Upload Zone */
.upload-zone {
  border: 2px dashed var(--border-primary);
  border-radius: var(--radius-lg);
  padding: var(--space-8);
  margin-bottom: var(--space-6);
  background: var(--bg-tertiary);
  transition: all 0.2s;
  cursor: pointer;
}

.upload-zone:hover {
  border-color: var(--electric-blue);
  background: rgba(59, 130, 246, 0.05);
}

.upload-zone-dragging {
  border-color: var(--electric-blue);
  background: rgba(59, 130, 246, 0.1);
  border-style: solid;
}

.upload-zone-uploading {
  opacity: 0.6;
  cursor: wait;
}

.file-input {
  display: none;
}

.upload-label {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-3);
  cursor: pointer;
}

.upload-icon {
  width: 48px;
  height: 48px;
  color: var(--electric-blue);
  margin-bottom: var(--space-2);
}

.upload-text {
  font-size: var(--text-base);
  color: var(--text-secondary);
  text-align: center;
}

.upload-link {
  color: var(--electric-blue);
  text-decoration: underline;
  font-weight: 600;
}

.upload-progress-container {
  margin-top: var(--space-4);
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.upload-progress-item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.upload-progress-name {
  font-size: var(--text-sm);
  color: var(--text-primary);
  min-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.upload-progress-bar {
  flex: 1;
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
}

.upload-progress-fill {
  height: 100%;
  background: var(--electric-blue);
  transition: width 0.3s ease;
}

.upload-progress-percent {
  font-size: var(--text-xs);
  color: var(--text-tertiary);
  min-width: 40px;
  text-align: right;
}

/* Attachment Delete Button */
.attachment-delete-btn {
  color: var(--accent-red);
}

.attachment-delete-btn:hover {
  background: rgba(239, 68, 68, 0.1);
}

/* Comment Input */
.comment-input-container {
  margin-bottom: var(--space-6);
  background: var(--bg-tertiary);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
}

.comment-input {
  width: 100%;
  background: transparent;
  border: none;
  color: var(--text-primary);
  font-size: var(--text-base);
  font-family: inherit;
  resize: vertical;
  min-height: 80px;
}

.comment-input:focus {
  outline: none;
}

.comment-input::placeholder {
  color: var(--text-tertiary);
}

.comment-input-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: var(--space-3);
  padding-top: var(--space-3);
  border-top: 1px solid var(--border-primary);
}

.comment-hint {
  font-size: var(--text-xs);
  color: var(--text-tertiary);
}

.btn-submit-comment {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-4);
  background: var(--electric-blue);
  color: white;
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  font-weight: 600;
  transition: all 0.2s;
}

.btn-submit-comment:hover:not(:disabled) {
  background: #2563eb;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.btn-submit-comment:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-submit-comment svg {
  flex-shrink: 0;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>
