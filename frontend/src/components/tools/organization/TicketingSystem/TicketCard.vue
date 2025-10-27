<template>
  <GlassCard
    class="ticket-card hover-lift relative overflow-hidden cursor-pointer"
    @click="$emit('edit', ticket.id)"
  >
    <!-- Priority Corner Band -->
    <div
      :class="[
        'absolute top-0 left-0 w-12 h-12 transform -translate-x-6 -translate-y-6 rotate-45',
        priorityColors[ticket.priority],
      ]"
    ></div>

    <!-- Header -->
    <div class="flex items-start justify-between mb-3">
      <div class="flex-1">
        <h3 class="text-lg font-semibold text-white mb-1 line-clamp-1">
          {{ ticket.title }}
        </h3>
        <p class="text-sm text-gray-300 mb-2">{{ ticket.customer }}</p>
      </div>

      <!-- Actions Dropdown -->
      <div class="relative" ref="dropdownRef">
        <button
          @click.stop="showMenu = !showMenu"
          class="p-1 rounded-lg hover:bg-glass-bg-light transition-colors"
        >
          <IconSystem name="dots-vertical" size="sm" class="text-gray-400" />
        </button>

        <!-- Dropdown Menu -->
        <div
          v-if="showMenu"
          class="absolute right-0 top-8 w-48 z-10"
          @click.stop
        >
          <div
            class="bg-glass-bg-light backdrop-blur-sm border border-border-primary rounded-lg py-2 shadow-lg"
          >
            <button
              @click="
                $emit('edit', ticket.id);
                showMenu = false;
              "
              class="w-full text-left px-4 py-2 text-sm text-white hover:bg-glass-bg transition-colors flex items-center gap-2"
            >
              <IconSystem name="edit" size="xs" />
              Modifier
            </button>
            <button
              @click="
                $emit('delete', ticket.id);
                showMenu = false;
              "
              class="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-glass-bg transition-colors flex items-center gap-2"
            >
              <IconSystem name="trash" size="xs" />
              Supprimer
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Description -->
    <p class="text-sm text-gray-300 mb-4 line-clamp-2">
      {{ ticket.description }}
    </p>

    <!-- Ticket Type Badge -->
    <div class="mb-3">
      <span
        :class="[
          'inline-flex items-center px-2 py-1 text-xs font-medium rounded-full',
          typeColors[ticket.type],
        ]"
      >
        <IconSystem
          v-if="ticket.type === 'callback'"
          name="phone"
          size="xs"
          class="mr-1"
          variant="mono"
        />
        <IconSystem
          v-else
          name="document"
          size="xs"
          class="mr-1"
          variant="mono"
        />
        {{ typeLabels[ticket.type] }}
      </span>
    </div>

    <!-- Dates Info -->
    <div class="flex justify-between items-center text-xs text-gray-400 mb-4">
      <span>Créé le {{ formatDate(ticket.createdAt) }}</span>
      <span
        v-if="ticket.dueDate"
        :class="{
          'text-red-400 font-medium bg-red-400/10 px-2 py-1 rounded': isOverdue,
        }"
      >
        {{ isOverdue ? "En retard" : "Échéance" }}:
        {{ formatDate(ticket.dueDate) }}
      </span>
    </div>

    <!-- Footer -->
    <div
      class="flex items-center justify-between pt-3 border-t border-border-primary"
    >
      <!-- Status -->
      <div class="flex items-center gap-2">
        <div
          :class="['w-2 h-2 rounded-full', statusColors[ticket.status]]"
        ></div>
        <span class="text-sm text-gray-300">{{
          statusLabels[ticket.status]
        }}</span>
      </div>

      <!-- Quick Actions -->
      <div class="flex items-center justify-between gap-2">
        <!-- Status Actions -->
        <div class="flex items-center gap-1">
          <button
            v-if="ticket.status === 'todo'"
            @click="$emit('status-change', ticket.id, 'in-progress')"
            class="p-1 rounded text-gray-400 hover:text-electric-blue hover:bg-glass-bg-light transition-colors"
            title="Commencer"
          >
            <IconSystem name="play" size="xs" variant="mono" />
          </button>

          <button
            v-if="ticket.status === 'in-progress'"
            @click="$emit('status-change', ticket.id, 'waiting')"
            class="p-1 rounded text-gray-400 hover:text-yellow-400 hover:bg-glass-bg-light transition-colors"
            title="Mettre en attente"
          >
            <IconSystem name="clock" size="xs" variant="mono" />
          </button>

          <button
            v-if="ticket.status === 'waiting'"
            @click="$emit('status-change', ticket.id, 'in-progress')"
            class="p-1 rounded text-gray-400 hover:text-electric-blue hover:bg-glass-bg-light transition-colors"
            title="Reprendre"
          >
            <IconSystem name="play" size="xs" variant="mono" />
          </button>

          <button
            v-if="ticket.status !== 'completed'"
            @click="$emit('status-change', ticket.id, 'completed')"
            class="p-1 rounded text-gray-400 hover:text-green-400 hover:bg-glass-bg-light transition-colors"
            title="Marquer comme terminé"
          >
            <IconSystem name="check" size="xs" variant="mono" />
          </button>

          <button
            v-if="ticket.status === 'completed'"
            @click="$emit('status-change', ticket.id, 'todo')"
            class="p-1 rounded text-gray-400 hover:text-gray-300 hover:bg-glass-bg-light transition-colors"
            title="Rouvrir"
          >
            <IconSystem name="refresh" size="xs" variant="mono" />
          </button>
        </div>

        <!-- Priority Badge -->
        <span
          :class="[
            'inline-flex items-center px-2 py-1 text-xs font-medium rounded',
            priorityBadgeColors[ticket.priority],
          ]"
        >
          {{ priorityLabels[ticket.priority] }}
        </span>
      </div>
    </div>
  </GlassCard>
</template>

<script setup>
import { ref, computed } from "vue";
import GlassCard from "@/components/ui/GlassCard.vue";

// Props
const props = defineProps({
  ticket: {
    type: Object,
    required: true,
  },
});

// Events
defineEmits(["edit", "delete", "status-change"]);

// Local state
const showMenu = ref(false);

// Color mappings using existing color scheme
const priorityColors = {
  low: "bg-gray-500",
  medium: "bg-yellow-500",
  high: "bg-orange-500",
  urgent: "bg-red-500",
};

const priorityBadgeColors = {
  low: "bg-gray-600/30 text-gray-300",
  medium: "bg-yellow-600/30 text-yellow-300",
  high: "bg-orange-600/30 text-orange-300",
  urgent: "bg-red-600/30 text-red-300",
};

const priorityLabels = {
  low: "Faible",
  medium: "Moyen",
  high: "Élevé",
  urgent: "Urgent",
};

const statusColors = {
  todo: "bg-gray-400",
  "in-progress": "bg-electric-blue",
  waiting: "bg-yellow-500",
  completed: "bg-green-500",
};

const statusLabels = {
  todo: "À faire",
  "in-progress": "En cours",
  waiting: "En attente",
  completed: "Terminé",
};

const typeColors = {
  callback: "bg-blue-600/30 text-blue-300",
  task: "bg-gray-600/30 text-gray-300",
};

const typeLabels = {
  callback: "Rappel client",
  task: "Tâche",
};

// Computed
const isOverdue = computed(() => {
  if (!props.ticket.dueDate || props.ticket.status === "completed")
    return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set to start of today

  const dueDate = new Date(props.ticket.dueDate);
  dueDate.setHours(0, 0, 0, 0); // Set to start of due date

  return dueDate < today;
});

// Methods
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

// Add click outside listener
import { onMounted, onUnmounted } from "vue";
import IconSystem from "../../../ui/IconSystem.vue";

const dropdownRef = ref(null);

// Close menu when clicking outside
const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    showMenu.value = false;
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<style scoped>
.ticket-card {
  position: relative;
  transition: all 0.2s ease;
}

.hover-lift:hover {
  transform: translateY(-4px);
}

.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Animation for card entrance */
.ticket-card {
  animation: slideInUp 0.4s ease-out;
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
