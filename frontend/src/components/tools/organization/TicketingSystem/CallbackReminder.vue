<template>
  <!-- Callback Reminders Panel -->
  <GlassCard v-if="callbackTickets.length > 0" class="mb-6">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-white flex items-center gap-2">
        <svg
          class="w-5 h-5 text-electric-blue"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
          />
        </svg>
        Rappels Clients
      </h3>
      <button
        @click="showAll = !showAll"
        class="text-sm text-electric-blue hover:text-electric-blue-light transition-colors"
      >
        {{ showAll ? "Masquer" : `Voir tous (${callbackTickets.length})` }}
      </button>
    </div>

    <!-- Today's Callbacks -->
    <div class="space-y-3">
      <div
        v-for="ticket in displayedCallbacks"
        :key="ticket.id"
        class="callback-item p-3 rounded-lg border border-border-primary bg-glass-bg-light"
      >
        <!-- Callback Header -->
        <div class="flex items-start justify-between mb-2">
          <div class="flex-1">
            <h4 class="font-medium text-white text-sm mb-1">
              {{ ticket.customer }}
            </h4>
            <p class="text-gray-300 text-xs line-clamp-1">{{ ticket.title }}</p>
          </div>

          <!-- Urgency Indicator -->
          <div class="flex items-center gap-2">
            <span
              v-if="isUrgent(ticket)"
              class="flex items-center gap-1 text-xs text-red-400 bg-red-400/20 px-2 py-1 rounded-full"
            >
              <div class="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
              Urgent
            </span>
            <span
              v-else-if="isDueToday(ticket)"
              class="flex items-center gap-1 text-xs text-yellow-400 bg-yellow-400/20 px-2 py-1 rounded-full"
            >
              <div class="w-2 h-2 bg-yellow-400 rounded-full"></div>
              Aujourd'hui
            </span>
          </div>
        </div>

        <!-- Callback Actions -->
        <div class="flex items-center justify-between">
          <div class="text-xs text-gray-400">
            {{ getCallbackTimeText(ticket) }}
          </div>

          <div class="flex items-center gap-2">
            <button
              @click="markAsCalled(ticket.id)"
              class="text-xs px-2 py-1 bg-green-600/20 text-green-400 rounded hover:bg-green-600/30 transition-colors"
            >
              Appelé
            </button>
            <button
              @click="snoozeCallback(ticket.id)"
              class="text-xs px-2 py-1 bg-yellow-600/20 text-yellow-400 rounded hover:bg-yellow-600/30 transition-colors"
            >
              Reporter
            </button>
          </div>
        </div>
      </div>

      <!-- Show more button -->
      <!-- <button
        v-if="!showAll && callbackTickets.length > 3"
        @click="showAll = true"
        class="w-full text-center text-sm text-electric-blue hover:text-electric-blue-light py-2 transition-colors"
      >
        Voir {{ callbackTickets.length - 3 }} rappels de plus
      </button> -->
    </div>
  </GlassCard>
</template>

<script setup>
import { ref, computed } from "vue";
import GlassCard from "@/components/ui/GlassCard.vue";

// Props
const props = defineProps({
  tickets: {
    type: Array,
    required: true,
  },
});

// Events
const emit = defineEmits(["update-ticket", "snooze-callback"]);

// Local state
const showAll = ref(false);

// Computed
const callbackTickets = computed(() => {
  return props.tickets
    .filter(
      (ticket) => ticket.type === "callback" && ticket.status !== "completed",
    )
    .sort((a, b) => {
      // Sort by due date, then by priority
      if (a.dueDate && b.dueDate) {
        return new Date(a.dueDate) - new Date(b.dueDate);
      }
      if (a.dueDate && !b.dueDate) return -1;
      if (!a.dueDate && b.dueDate) return 1;

      // If no due dates, sort by priority
      const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
      return (
        (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0)
      );
    });
});

const displayedCallbacks = computed(() => {
  if (showAll.value) return callbackTickets.value;
  return callbackTickets.value.slice(0, 3);
});

// Methods
const isUrgent = (ticket) => {
  if (ticket.priority === "urgent") return true;
  if (!ticket.dueDate) return false;

  const today = new Date();
  const dueDate = new Date(ticket.dueDate);
  const diffTime = dueDate - today;
  const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));

  // Consider urgent if due in less than 2 hours
  return diffHours <= 2 && diffHours >= 0;
};

const isDueToday = (ticket) => {
  if (!ticket.dueDate) return false;

  const today = new Date().toDateString();
  const dueDate = new Date(ticket.dueDate).toDateString();

  return today === dueDate;
};

const getCallbackTimeText = (ticket) => {
  if (!ticket.dueDate) {
    return "Aucune échéance";
  }

  const today = new Date();
  const dueDate = new Date(ticket.dueDate);
  const diffTime = dueDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return `En retard de ${Math.abs(diffDays)} jour${Math.abs(diffDays) > 1 ? "s" : ""}`;
  } else if (diffDays === 0) {
    return "À rappeler aujourd'hui";
  } else if (diffDays === 1) {
    return "À rappeler demain";
  } else {
    return `À rappeler dans ${diffDays} jours`;
  }
};

const markAsCalled = (ticketId) => {
  const ticket = props.tickets.find((t) => t.id === ticketId);
  if (ticket) {
    const updatedTicket = {
      ...ticket,
      status: "completed",
      completedAt: new Date().toISOString(),
      notes:
        (ticket.notes || "") +
        `\n[${new Date().toLocaleString("fr-FR")}] Client rappelé`,
    };
    emit("update-ticket", updatedTicket);
  }
};

const snoozeCallback = (ticketId) => {
  const ticket = props.tickets.find((t) => t.id === ticketId);
  if (ticket) {
    // Snooze for 1 day
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const updatedTicket = {
      ...ticket,
      dueDate: tomorrow.toISOString().split("T")[0],
      notes:
        (ticket.notes || "") +
        `\n[${new Date().toLocaleString("fr-FR")}] Rappel reporté à demain`,
    };
    emit("update-ticket", updatedTicket);
    emit("snooze-callback", ticketId);
  }
};
</script>

<style scoped>
.callback-item {
  transition: all 0.2s ease;
}

.callback-item:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(0, 212, 255, 0.3);
}

.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.animate-pulse {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
</style>
