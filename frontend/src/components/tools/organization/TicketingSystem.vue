<template>
  <div class="ticketing-system min-h-screen">
    <!-- Main content with container -->
    <div class="container mx-auto px-6 max-w-7xl pt-0 pb-8">
      <!-- Header -->
      <div class="tool-header-wrapper">
        <ToolHeader
          title="Système de Tickets"
          description="Gérez vos rappels clients et tâches personnelles de manière simple et efficace"
          icon="tag"
          category="organization"
          status="Nouveau"
          :show-badges="true"
        />
      </div>

      <!-- Quick Stats -->
      <div class="mb-6">
        <div class="flex flex-wrap justify-center gap-6">
          <div
            class="flex items-center gap-2 px-4 py-2 bg-glass-bg/50 rounded-lg border border-border-primary"
          >
            <span class="text-electric-blue text-lg font-bold">{{
              tickets.length
            }}</span>
            <span class="text-gray-400 text-sm">Total tickets</span>
          </div>
          <div
            class="flex items-center gap-2 px-4 py-2 bg-glass-bg/50 rounded-lg border border-border-primary"
          >
            <span class="text-yellow-500 text-lg font-bold">{{
              todoTickets
            }}</span>
            <span class="text-gray-400 text-sm">À faire</span>
          </div>
          <div
            class="flex items-center gap-2 px-4 py-2 bg-glass-bg/50 rounded-lg border border-border-primary"
          >
            <span class="text-orange-500 text-lg font-bold">{{
              inProgressTickets
            }}</span>
            <span class="text-gray-400 text-sm">En cours</span>
          </div>
          <div
            class="flex items-center gap-2 px-4 py-2 bg-glass-bg/50 rounded-lg border border-border-primary"
          >
            <span class="text-red-500 text-lg font-bold">{{
              urgentTickets
            }}</span>
            <span class="text-gray-400 text-sm">Urgents</span>
          </div>
        </div>
      </div>

      <!-- Tab Navigation -->
      <UITabs v-model="activeTab" :tabs="ticketTabs" />

      <!-- Main Content Area -->
      <div v-if="activeTab === 'active'" class="space-y-6">
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <!-- Left Sidebar: Controls -->
          <div class="lg:col-span-1 space-y-6">
            <!-- Quick Add -->
            <QuickAdd
              :tickets="tickets"
              @create-ticket="createTicket"
              @show-advanced-modal="showNewTicketModal = true"
            />

            <!-- Filters -->
            <UIGlassCard>
              <h3 class="section-title mb-4">Filtres</h3>
              <div class="space-y-3">
                <!-- Status Filter -->
                <UISelect
                  v-model="filters.status"
                  label="Statut"
                  :options="[
                    { value: 'all', label: 'Tous les statuts' },
                    { value: 'todo', label: 'À faire' },
                    { value: 'in-progress', label: 'En cours' },
                    { value: 'waiting', label: 'En attente' },
                  ]"
                />

                <!-- Priority Filter -->
                <UISelect
                  v-model="filters.priority"
                  label="Priorité"
                  :options="[
                    { value: 'all', label: 'Toutes priorités' },
                    { value: 'low', label: 'Faible' },
                    { value: 'medium', label: 'Moyenne' },
                    { value: 'high', label: 'Élevée' },
                    { value: 'urgent', label: 'Urgente' },
                  ]"
                />

                <!-- Customer Filter -->
                <UIInput
                  v-model="filters.customer"
                  label="Client"
                  placeholder="Filtrer par client..."
                />

                <!-- Clear Filters -->
                <UIButton @click="clearFilters" variant="ghost" size="sm" block>
                  Réinitialiser
                </UIButton>
              </div>
            </UIGlassCard>
          </div>
          <!-- Main Content: Tickets List -->
          <div class="lg:col-span-3 space-y-6">
            <!-- Search and Sort -->
            <div class="flex flex-col sm:flex-row gap-4">
              <UIInput
                v-model="searchQuery"
                placeholder="Rechercher dans les tickets..."
                icon-leading="search"
                class="flex-grow"
              />
              <div class="flex items-center gap-2">
                <div class="flex items-center gap-2 text-sm text-gray-400">
                  <span>Afficher:</span>
                  <UISelect
                    v-model="itemsPerPage"
                    :options="[
                      { value: 12, label: '12' },
                      { value: 24, label: '24' },
                      { value: 48, label: '48' },
                      { value: 96, label: '96' },
                    ]"
                  />
                </div>
                <UISelect
                  v-model="sortBy"
                  :options="[
                    { value: 'dueDate', label: 'Trier par échéance' },
                    { value: 'priority', label: 'Trier par priorité' },
                    { value: 'createdAt', label: 'Trier par date de création' },
                    { value: 'title', label: 'Trier par titre' },
                    { value: 'status', label: 'Trier par statut' },
                  ]"
                />
                <button
                  @click="toggleSortOrder"
                  class="px-3 py-2 bg-glass-bg-light border border-border-primary rounded-full text-white hover:bg-glass-bg transition-colors flex items-center gap-2 text-sm"
                >
                  <svg
                    class="w-4 h-4"
                    :class="{ 'rotate-180': sortOrder === 'desc' }"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 15l7-7 7 7"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <!-- Callback Reminders -->
            <CallbackReminder
              :tickets="tickets"
              @update-ticket="handleTicketUpdate"
              @snooze-callback="handleSnoozeCallback"
            />

            <!-- Bulk Actions -->
            <BulkActions
              :tickets="filteredTickets"
              :selected-tickets="selectedTickets"
              :total-tickets="filteredTickets.length"
              :local-storage-ticket-count="localStorageTicketCount"
              :is-migrating="isMigrating"
              @update-selection="selectedTickets = $event"
              @bulk-status-change="handleBulkStatusChange"
              @bulk-priority-change="handleBulkPriorityChange"
              @bulk-delete="handleBulkDelete"
              @export-tickets="exportTickets"
              @toggle-selection-mode="selectionMode = $event"
              @migrate="handleMigration"
            />

            <!-- Active Tickets Grid -->
            <div
              v-if="paginatedActiveTickets.length > 0"
              class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
            >
              <div
                v-for="ticket in paginatedActiveTickets"
                :key="ticket.id"
                class="relative"
              >
                <!-- Selection Checkbox -->
                <div v-if="selectionMode" class="absolute top-2 left-2 z-10">
                  <input
                    type="checkbox"
                    :checked="selectedTickets.includes(ticket.id)"
                    @change="toggleTicketSelection(ticket.id)"
                    class="w-4 h-4 text-electric-blue bg-glass-bg border-border-primary rounded focus:ring-electric-blue focus:ring-2"
                  />
                </div>

                <TicketCard
                  :ticket="ticket"
                  @edit="editTicket"
                  @delete="deleteTicket"
                  @status-change="handleStatusChange"
                />
              </div>
            </div>

            <!-- Pagination for Active Tickets -->
            <UIPagination
              v-if="filteredTickets.length > itemsPerPage"
              :current-page="activeCurrentPage"
              :total-items="filteredTickets.length"
              :items-per-page="itemsPerPage"
              @page-change="activeCurrentPage = $event"
              class="mt-6"
            />

            <!-- Empty State for Active Tickets -->
            <div v-if="filteredTickets.length === 0" class="text-center py-12">
              <UIGlassCard class="max-w-md mx-auto">
                <div class="mb-4 flex justify-center">
                  <svg
                    class="w-16 h-16 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h3 class="text-xl font-semibold text-white mb-2">
                  Aucun ticket actif trouvé
                </h3>
                <p class="text-gray-300 mb-4">
                  {{
                    searchQuery ||
                    filters.status !== "all" ||
                    filters.priority !== "all" ||
                    filters.customer
                      ? "Essayez avec d'autres filtres"
                      : "Créez votre premier ticket pour commencer"
                  }}
                </p>
                <UIButton
                  @click="showNewTicketModal = true"
                  variant="primary"
                  size="lg"
                >
                  Créer un ticket
                </UIButton>
              </UIGlassCard>
            </div>
          </div>
        </div>
      </div>

      <!-- Completed Tickets Tab -->
      <div v-if="activeTab === 'completed'" class="space-y-6">
        <!-- Controls -->
        <div class="flex flex-col md:flex-row gap-4 justify-between">
          <UIInput
            v-model="completedSearchQuery"
            placeholder="Rechercher dans les terminés..."
            icon-leading="search"
            class="flex-grow"
          />
          <div class="flex items-center gap-4 flex-wrap">
            <div class="flex items-center gap-2 text-sm text-gray-400">
              <span>Afficher:</span>
              <UISelect
                v-model="itemsPerPage"
                :options="[
                  { value: 12, label: '12' },
                  { value: 24, label: '24' },
                  { value: 48, label: '48' },
                  { value: 96, label: '96' },
                ]"
              />
            </div>
            <UISelect
              v-model="completedFilters.priority"
              :options="[
                { value: 'all', label: 'Toutes priorités' },
                { value: 'low', label: 'Faible' },
                { value: 'medium', label: 'Moyenne' },
                { value: 'high', label: 'Élevée' },
                { value: 'urgent', label: 'Urgente' },
              ]"
            />
            <UIInput
              v-model="completedFilters.customer"
              placeholder="Filtrer par client..."
            />
            <UIButton @click="clearCompletedFilters" variant="ghost" size="sm"
              >Réinitialiser</UIButton
            >
          </div>
        </div>

        <!-- Completed Tickets Table -->
        <div
          v-if="paginatedCompletedTickets.length > 0"
          class="bg-glass-bg/50 border border-border-primary rounded-lg overflow-hidden"
        >
          <table class="min-w-full divide-y divide-border-primary">
            <thead class="bg-glass-bg/30">
              <tr>
                <th
                  @click="toggleCompletedSort('title')"
                  class="cursor-pointer px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                >
                  Ticket
                </th>
                <th
                  @click="toggleCompletedSort('customer')"
                  class="cursor-pointer px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                >
                  Client
                </th>
                <th
                  @click="toggleCompletedSort('priority')"
                  class="cursor-pointer px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                >
                  Priorité
                </th>
                <th
                  @click="toggleCompletedSort('completedAt')"
                  class="cursor-pointer px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                >
                  Terminé le
                </th>
                <th
                  class="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-border-primary">
              <tr
                v-for="ticket in paginatedCompletedTickets"
                :key="ticket.id"
                class="hover:bg-glass-bg"
              >
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-white">
                    {{ ticket.title }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {{ ticket.customer }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                    :class="getPriorityClass(ticket.priority)"
                  >
                    {{ ticket.priority }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {{ formatDate(ticket.completedAt) }}
                </td>
                <td
                  class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"
                >
                  <UIButton
                    @click="editTicket(ticket.id)"
                    variant="ghost"
                    size="sm"
                    >Détails</UIButton
                  >
                  <UIButton
                    @click="deleteTicket(ticket.id)"
                    variant="danger"
                    size="sm"
                    class="ml-4"
                    >Supprimer</UIButton
                  >
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination for Completed Tickets -->
        <UIPagination
          v-if="completedTickets.length > itemsPerPage"
          :current-page="completedCurrentPage"
          :total-items="completedTickets.length"
          :items-per-page="itemsPerPage"
          @page-change="completedCurrentPage = $event"
          class="mt-6"
        />

        <!-- Empty State for Completed Tickets -->
        <div v-if="completedTickets.length === 0" class="text-center py-12">
          <UIGlassCard class="max-w-md mx-auto">
            <div class="mb-4 flex justify-center">
              <svg
                class="w-16 h-16 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-white mb-2">
              Aucune tâche terminée trouvée
            </h3>
            <p class="text-gray-300">
              {{
                completedSearchQuery ||
                completedFilters.priority !== "all" ||
                completedFilters.customer
                  ? "Essayez avec d'autres filtres"
                  : "Aucune tâche n'a été marquée comme terminée pour le moment."
              }}
            </p>
          </UIGlassCard>
        </div>
      </div>

      <!-- Keyboard Shortcuts Hint -->
      <div class="mt-8 text-center">
        <p class="text-xs text-gray-500">
          Astuce : Appuyez sur
          <kbd
            class="px-1.5 py-0.5 text-xs font-mono bg-gray-700 text-gray-300 rounded"
            >?</kbd
          >
          pour voir tous les raccourcis clavier disponibles
        </p>
      </div>
    </div>

    <!-- New Ticket Modal -->
    <NewTicketModal
      :show="showNewTicketModal"
      @close="showNewTicketModal = false"
      @create="createTicket"
    />

    <!-- Edit Ticket Modal -->
    <EditTicketModal
      :show="showEditTicketModal"
      :ticket="editingTicket"
      @close="closeEditModal"
      @save="saveTicketEdit"
    />

    <!-- Backdrop Overlay -->
    <Transition name="backdrop-fade">
      <div
        v-if="selectedTicket"
        class="fixed inset-0 bg-black/60 z-30"
        @click="selectedTicketId = null"
      ></div>
    </Transition>

    <!-- Ticket Detail Panel -->
    <Transition name="slide-panel">
      <TicketDetailPanel
        v-if="selectedTicket"
        :ticket="selectedTicket"
        @close="selectedTicketId = null"
        @save="saveTicketEdit"
      />
    </Transition>

    <!-- Keyboard Shortcuts -->
    <KeyboardShortcuts
      ref="keyboardShortcutsRef"
      @new-ticket="showNewTicketModal = true"
      @toggle-search="focusSearch"
      @export-data="() => exportTickets()"
      @toggle-selection="toggleSelectionMode"
    />

    <!-- Feedback Notification -->
    <div
      v-if="showFeedback"
      class="fixed top-4 right-4 z-50 bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-slide-in"
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
          d="M5 13l4 4L19 7"
        />
      </svg>
      {{ feedbackMessage }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from "vue";

// Components
import {
  UIGlassCard,
  UIInput,
  UISelect,
  UIButton,
  UITabs,
} from "@/components/ui";
import ToolHeader from "@/components/ui/ToolHeader.vue";
import TicketCard from "./TicketingSystem/TicketCard.vue";
import NewTicketModal from "./TicketingSystem/NewTicketModal.vue";
import EditTicketModal from "./TicketingSystem/EditTicketModal.vue";
import TicketDetailPanel from "./TicketingSystem/TicketDetailPanel.vue";
import CallbackReminder from "./TicketingSystem/CallbackReminder.vue";
import BulkActions from "./TicketingSystem/BulkActions.vue";
import QuickAdd from "./TicketingSystem/QuickAdd.vue";
import KeyboardShortcuts from "./TicketingSystem/KeyboardShortcuts.vue";
import UIPagination from "@/components/ui/UIPagination.vue";

// Services
import * as ticketsFirestore from "@/services/ticketsFirestore";

// Reactive data
const tickets = ref([]);
const searchQuery = ref("");
const showNewTicketModal = ref(false);
const showEditTicketModal = ref(false);
const editingTicket = ref(null);
const selectedTicketId = ref(null);

// Loading and error states
const isLoading = ref(true);
const error = ref(null);
const firestoreUnsubscribe = ref(null);
const sortBy = ref("dueDate"); // dueDate, priority, createdAt, title
const sortOrder = ref("asc"); // asc, desc
const selectedTickets = ref([]);
const selectionMode = ref(false);
const keyboardShortcutsRef = ref(null);
const activeTab = ref("active"); // 'active', 'completed'
const feedbackMessage = ref("");
const showFeedback = ref(false);

// Migration state
const localStorageTicketCount = ref(0);
const isMigrating = ref(false);

// Pagination state
const activeCurrentPage = ref(1);
const completedCurrentPage = ref(1);
const itemsPerPage = ref(12);

// Filters
const filters = ref({
  status: "all",
  priority: "all",
  customer: "",
});

// Completed Tickets Filters & Sort
const completedSearchQuery = ref("");
const completedFilters = ref({
  priority: "all",
  customer: "",
});
const completedSortBy = ref("completedAt");
const completedSortOrder = ref("desc");

// Demo data
const sampleTickets = [
  {
    id: 1,
    title: "Rappeler M. Dupont pour devis",
    description:
      "Client intéressé par refonte de site web. À rappeler avant 17h.",
    customer: "M. Dupont",
    priority: "high",
    status: "todo",
    dueDate: "2025-09-26",
    createdAt: "2025-09-25",
    type: "callback",
  },
  {
    id: 2,
    title: "Finir maquette Projet XYZ",
    description:
      "Terminer les maquettes desktop et mobile pour validation client.",
    customer: "Entreprise ABC",
    priority: "medium",
    status: "in-progress",
    dueDate: "2025-09-27",
    createdAt: "2025-09-24",
    type: "task",
  },
];

// Priority classes helper
const priorityClasses = {
  low: "bg-green-600/20 text-green-300 border-green-500/30",
  medium: "bg-yellow-600/20 text-yellow-300 border-yellow-500/30",
  high: "bg-orange-600/20 text-orange-300 border-orange-500/30",
  urgent: "bg-red-600/20 text-red-300 border-red-500/30",
};
const getPriorityClass = (priority) => priorityClasses[priority] || "";

// Computed properties
const filteredTickets = computed(() => {
  // Exclude completed tickets from main list
  let filtered = tickets.value.filter(
    (ticket) => ticket.status !== "completed",
  );

  // Search filter
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      (ticket) =>
        ticket.title.toLowerCase().includes(query) ||
        ticket.description.toLowerCase().includes(query) ||
        (ticket.customer && ticket.customer.toLowerCase().includes(query)),
    );
  }

  // Status filter
  if (filters.value.status !== "all") {
    filtered = filtered.filter(
      (ticket) => ticket.status === filters.value.status,
    );
  }

  // Priority filter
  if (filters.value.priority !== "all") {
    filtered = filtered.filter(
      (ticket) => ticket.priority === filters.value.priority,
    );
  }

  // Customer filter
  if (filters.value.customer.trim()) {
    const customerQuery = filters.value.customer.toLowerCase();
    filtered = filtered.filter(
      (ticket) =>
        ticket.customer &&
        ticket.customer.toLowerCase().includes(customerQuery),
    );
  }

  // Sort tickets
  filtered.sort((a, b) => {
    let aVal, bVal;

    switch (sortBy.value) {
      case "priority":
        const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
        aVal = priorityOrder[a.priority] || 0;
        bVal = priorityOrder[b.priority] || 0;
        break;
      case "dueDate":
        // Handle null due dates (put them at end)
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return sortOrder.value === "asc" ? 1 : -1;
        if (!b.dueDate) return sortOrder.value === "asc" ? -1 : 1;
        aVal = new Date(a.dueDate).getTime();
        bVal = new Date(b.dueDate).getTime();
        break;
      case "createdAt":
        aVal = new Date(a.createdAt).getTime();
        bVal = new Date(b.createdAt).getTime();
        break;
      case "title":
        aVal = a.title.toLowerCase();
        bVal = b.title.toLowerCase();
        break;
      case "status":
        const statusOrder = {
          todo: 1,
          "in-progress": 2,
          waiting: 3,
          completed: 4,
        };
        aVal = statusOrder[a.status] || 0;
        bVal = statusOrder[b.status] || 0;
        break;
      default:
        return 0;
    }

    if (aVal < bVal) return sortOrder.value === "asc" ? -1 : 1;
    if (aVal > bVal) return sortOrder.value === "asc" ? 1 : -1;
    return 0;
  });

  return filtered;
});

const paginatedActiveTickets = computed(() => {
  const start = (activeCurrentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredTickets.value.slice(start, end);
});

const completedTickets = computed(() => {
  let filtered = tickets.value.filter(
    (ticket) => ticket.status === "completed",
  );

  // Search filter
  if (completedSearchQuery.value.trim()) {
    const query = completedSearchQuery.value.toLowerCase();
    filtered = filtered.filter(
      (ticket) =>
        ticket.title.toLowerCase().includes(query) ||
        (ticket.description &&
          ticket.description.toLowerCase().includes(query)) ||
        (ticket.customer && ticket.customer.toLowerCase().includes(query)),
    );
  }

  // Priority filter
  if (completedFilters.value.priority !== "all") {
    filtered = filtered.filter(
      (ticket) => ticket.priority === completedFilters.value.priority,
    );
  }

  // Customer filter
  if (completedFilters.value.customer.trim()) {
    const customerQuery = completedFilters.value.customer.toLowerCase();
    filtered = filtered.filter(
      (ticket) =>
        ticket.customer &&
        ticket.customer.toLowerCase().includes(customerQuery),
    );
  }

  // Sort tickets
  filtered.sort((a, b) => {
    let aVal, bVal;

    switch (completedSortBy.value) {
      case "priority":
        const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
        aVal = priorityOrder[a.priority] || 0;
        bVal = priorityOrder[b.priority] || 0;
        break;
      case "completedAt":
        aVal = new Date(a.completedAt || 0).getTime();
        bVal = new Date(b.completedAt || 0).getTime();
        break;
      case "title":
        aVal = a.title.toLowerCase();
        bVal = b.title.toLowerCase();
        break;
      case "customer":
        aVal = a.customer?.toLowerCase() || "";
        bVal = b.customer?.toLowerCase() || "";
        break;
      default:
        return 0;
    }

    if (aVal < bVal) return completedSortOrder.value === "asc" ? -1 : 1;
    if (aVal > bVal) return completedSortOrder.value === "asc" ? 1 : -1;
    return 0;
  });

  return filtered;
});

const paginatedCompletedTickets = computed(() => {
  const start = (completedCurrentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return completedTickets.value.slice(start, end);
});

// Stats computed
const activeTicketsCount = computed(
  () => tickets.value.filter((t) => t.status !== "completed").length,
);
const todoTickets = computed(
  () => tickets.value.filter((t) => t.status === "todo").length,
);
const inProgressTickets = computed(
  () => tickets.value.filter((t) => t.status === "in-progress").length,
);
const urgentTickets = computed(
  () => tickets.value.filter((t) => t.priority === "urgent").length,
);

const ticketTabs = computed(() => [
  { value: "active", label: "Tickets Actifs", badge: activeTicketsCount.value },
  {
    value: "completed",
    label: "Terminés",
    badge: completedTickets.value.length,
  },
]);

// Selected ticket for detail panel
const selectedTicket = computed(() => {
  if (!selectedTicketId.value) return null;
  return tickets.value.find((t) => t.id === selectedTicketId.value);
});

// Watchers for pagination
watch(
  [searchQuery, filters],
  () => {
    activeCurrentPage.value = 1;
  },
  { deep: true },
);

watch(
  [completedSearchQuery, completedFilters],
  () => {
    completedCurrentPage.value = 1;
  },
  { deep: true },
);

watch(itemsPerPage, () => {
  activeCurrentPage.value = 1;
  completedCurrentPage.value = 1;
});

// Methods
const clearFilters = () => {
  filters.value.status = "all";
  filters.value.priority = "all";
  filters.value.customer = "";
  searchQuery.value = "";
};

const clearCompletedFilters = () => {
  completedFilters.value.priority = "all";
  completedFilters.value.customer = "";
  completedSearchQuery.value = "";
};

const toggleCompletedSort = (field) => {
  if (completedSortBy.value === field) {
    completedSortOrder.value =
      completedSortOrder.value === "asc" ? "desc" : "asc";
  } else {
    completedSortBy.value = field;
    completedSortOrder.value = "asc";
  }
};

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const createTicket = async (ticketData) => {
  try {
    await ticketsFirestore.createTicket({
      ...ticketData,
      status: "todo",
    });
    // Real-time listener will update tickets.value automatically
    showNewTicketModal.value = false;
    showFeedback.value = true;
    feedbackMessage.value = `Ticket "${ticketData.title}" créé avec succès.`;
    setTimeout(() => {
      showFeedback.value = false;
    }, 3000);
  } catch (err) {
    console.error("Error creating ticket:", err);
    showFeedback.value = true;
    feedbackMessage.value = "Erreur lors de la création du ticket.";
    setTimeout(() => {
      showFeedback.value = false;
    }, 3000);
  }
};

const editTicket = (ticketId) => {
  // Open the side panel instead of modal
  selectedTicketId.value = ticketId;
};

const closeEditModal = () => {
  showEditTicketModal.value = false;
  editingTicket.value = null;
};

const saveTicketEdit = async (updatedTicket) => {
  try {
    await ticketsFirestore.updateTicket(updatedTicket.id, updatedTicket);
    showFeedback.value = true;
    feedbackMessage.value = "Ticket mis à jour avec succès.";
    setTimeout(() => {
      showFeedback.value = false;
    }, 3000);
  } catch (err) {
    console.error("Error updating ticket:", err);
    showFeedback.value = true;
    feedbackMessage.value = "Erreur lors de la mise à jour.";
    setTimeout(() => {
      showFeedback.value = false;
    }, 3000);
  }
  closeEditModal();
  selectedTicketId.value = null;
};

const toggleSortOrder = () => {
  sortOrder.value = sortOrder.value === "asc" ? "desc" : "asc";
};

const showKeyboardShortcuts = () => {
  if (keyboardShortcutsRef.value) {
    keyboardShortcutsRef.value.showHelp();
  }
};

// Bulk actions
const toggleTicketSelection = (ticketId) => {
  const index = selectedTickets.value.indexOf(ticketId);
  if (index > -1) {
    selectedTickets.value.splice(index, 1);
  } else {
    selectedTickets.value.push(ticketId);
  }
};

const handleBulkStatusChange = async (ticketIds, newStatus) => {
  try {
    const updatePromises = ticketIds.map((ticketId) =>
      ticketsFirestore.updateTicket(ticketId, { status: newStatus }),
    );
    await Promise.all(updatePromises);
    selectedTickets.value = [];
    showFeedback.value = true;
    feedbackMessage.value = `${ticketIds.length} ticket(s) mis à jour.`;
    setTimeout(() => {
      showFeedback.value = false;
    }, 3000);
  } catch (err) {
    console.error("Error bulk updating status:", err);
  }
};

const handleBulkPriorityChange = async (ticketIds, newPriority) => {
  try {
    const updatePromises = ticketIds.map((ticketId) =>
      ticketsFirestore.updateTicket(ticketId, { priority: newPriority }),
    );
    await Promise.all(updatePromises);
    selectedTickets.value = [];
    showFeedback.value = true;
    feedbackMessage.value = `${ticketIds.length} ticket(s) mis à jour.`;
    setTimeout(() => {
      showFeedback.value = false;
    }, 3000);
  } catch (err) {
    console.error("Error bulk updating priority:", err);
  }
};

const handleBulkDelete = async (ticketIds) => {
  try {
    await ticketsFirestore.bulkDeleteTickets(ticketIds);
    const count = ticketIds.length;
    selectedTickets.value = [];
    showFeedback.value = true;
    feedbackMessage.value = `${count} ticket${count > 1 ? "s" : ""} supprimé${count > 1 ? "s" : ""}.`;
    setTimeout(() => {
      showFeedback.value = false;
    }, 3000);
  } catch (err) {
    console.error("Error bulk deleting:", err);
  }
};

const clearCompletedTasks = async () => {
  const completedCount = completedTickets.value.length;
  if (completedCount === 0) return;

  const message = `Êtes-vous sûr de vouloir supprimer définitivement ${completedCount} tâche${completedCount > 1 ? "s" : ""} terminée${completedCount > 1 ? "s" : ""} ?`;

  if (confirm(message)) {
    try {
      const completedIds = completedTickets.value.map((t) => t.id);
      await ticketsFirestore.bulkDeleteTickets(completedIds);
    } catch (err) {
      console.error("Error clearing completed tasks:", err);
    }
  }
};

// Export functionality
const exportTickets = (ticketData = null) => {
  const dataToExport = ticketData || tickets.value;
  const jsonData = JSON.stringify(dataToExport, null, 2);

  const blob = new Blob([jsonData], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `tickets-export-${new Date().toISOString().split("T")[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// Callback reminders
const handleTicketUpdate = async (updatedTicket) => {
  try {
    await ticketsFirestore.updateTicket(updatedTicket.id, updatedTicket);
    showFeedback.value = true;
    feedbackMessage.value = "Ticket mis à jour avec succès.";
    setTimeout(() => {
      showFeedback.value = false;
    }, 3000);
  } catch (err) {
    console.error("Error updating ticket:", err);
  }
};

const handleStatusChange = async (ticketId, newStatus) => {
  try {
    const updates = { status: newStatus };

    // Add completion timestamp for completed tickets
    if (newStatus === "completed") {
      updates.completedAt = new Date().toISOString();
    }

    await ticketsFirestore.updateTicket(ticketId, updates);
    showFeedback.value = true;
    feedbackMessage.value = "Statut mis à jour avec succès.";
    setTimeout(() => {
      showFeedback.value = false;
    }, 3000);
  } catch (err) {
    console.error("Error updating ticket status:", err);
  }
};

const handleSnoozeCallback = (ticketId) => {
  const ticket = tickets.value.find((t) => t.id === ticketId);
  if (ticket) {
    showFeedback.value = true;
    feedbackMessage.value = `Rappel "${ticket.title}" reporté à demain`;

    // Hide feedback after 3 seconds
    setTimeout(() => {
      showFeedback.value = false;
    }, 3000);
  }
};

// Keyboard shortcuts handlers
const focusSearch = () => {
  const searchInput = document.getElementById("main-search-input");
  if (searchInput) {
    searchInput.focus();
    searchInput.select();
  }
};

const toggleSelectionMode = () => {
  selectionMode.value = !selectionMode.value;
  if (!selectionMode.value) {
    selectedTickets.value = [];
  }
};

const deleteTicket = async (ticketId) => {
  if (confirm("Êtes-vous sûr de vouloir supprimer ce ticket ?")) {
    try {
      const ticket = tickets.value.find((t) => t.id === ticketId);
      await ticketsFirestore.deleteTicket(ticketId);
      if (ticket) {
        showFeedback.value = true;
        feedbackMessage.value = `Ticket "${ticket.title}" supprimé.`;
        setTimeout(() => {
          showFeedback.value = false;
        }, 3000);
      }
    } catch (err) {
      console.error("Error deleting ticket:", err);
    }
  }
};

// Firestore operations
const loadTicketsFromFirestore = async () => {
  try {
    isLoading.value = true;
    error.value = null;

    // Load tickets initially
    tickets.value = await ticketsFirestore.loadTickets();

    // Set up real-time listener for updates
    firestoreUnsubscribe.value = ticketsFirestore.subscribeToTickets(
      (updatedTickets) => {
        tickets.value = updatedTickets;
      },
    );

    isLoading.value = false;
  } catch (err) {
    console.error("Error loading tickets:", err);
    error.value = "Failed to load tickets. Please refresh the page.";
    isLoading.value = false;
  }
};

// Migration functions
const checkForLocalStorageData = () => {
  const localData = localStorage.getItem("ui-tools-tickets");

  if (localData) {
    try {
      const parsedData = JSON.parse(localData);
      if (Array.isArray(parsedData) && parsedData.length > 0) {
        localStorageTicketCount.value = parsedData.length;
      }
    } catch (err) {
      console.error("Error parsing localStorage data:", err);
    }
  }
};

const handleMigration = async () => {
  try {
    isMigrating.value = true;
    console.log("🔄 Starting migration from localStorage to Firestore...");

    const result = await ticketsFirestore.migrateFromLocalStorage();

    if (result.success) {
      showFeedback.value = true;
      feedbackMessage.value = `Migration réussie! ${result.count} ticket(s) migré(s) vers Firebase.`;
      setTimeout(() => {
        showFeedback.value = false;
      }, 5000);

      // Reset the count so button disappears
      localStorageTicketCount.value = 0;

      console.log(`✅ Migration complete: ${result.count} tickets migrated`);
    }
  } catch (err) {
    console.error("❌ Migration failed:", err);
    showFeedback.value = true;
    feedbackMessage.value = "Erreur lors de la migration. Veuillez réessayer.";
    setTimeout(() => {
      showFeedback.value = false;
    }, 5000);
  } finally {
    isMigrating.value = false;
  }
};

// Lifecycle
onMounted(async () => {
  await loadTicketsFromFirestore();

  // Check for localStorage data after a short delay (to ensure Firestore loads first)
  setTimeout(() => {
    checkForLocalStorageData();
  }, 1000);
});

onUnmounted(() => {
  // Clean up Firestore listener
  if (firestoreUnsubscribe.value) {
    firestoreUnsubscribe.value();
  }
});
</script>

<style scoped>
/* Use same patterns as catalog and palette generator */
.container {
  max-width: 1400px;
}

/* Migration Banner */
.migration-banner {
  padding: var(--space-5);
  margin-bottom: var(--space-6);
  background: linear-gradient(
    135deg,
    rgba(0, 212, 255, 0.1),
    rgba(0, 150, 255, 0.05)
  );
  border: 1px solid var(--electric-blue);
  border-radius: var(--radius-lg);
  box-shadow: 0 0 20px rgba(0, 212, 255, 0.2);
  animation: fadeInSlide 0.5s ease-out;
}

.spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes fadeInSlide {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Feedback notification animation */
.animate-slide-in {
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.tool-header-wrapper {
  margin-bottom: 2rem;
}

.section-title {
  @apply text-lg font-semibold text-white;
}

.stat-card {
  @apply p-4 rounded-lg border border-border-primary bg-glass-bg-light backdrop-blur-sm;
}

.hover-lift {
  transition: transform 0.2s ease;
}

.hover-lift:hover {
  transform: translateY(-2px);
}

/* Animations */
.ticketing-system {
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Side Panel Slide Transition */
.slide-panel-enter-active,
.slide-panel-leave-active {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-panel-enter-from {
  transform: translateX(100%);
}

.slide-panel-leave-to {
  transform: translateX(100%);
}

/* Backdrop Fade Transition */
.backdrop-fade-enter-active,
.backdrop-fade-leave-active {
  transition: opacity 0.3s ease;
}

.backdrop-fade-enter-from,
.backdrop-fade-leave-to {
  opacity: 0;
}
</style>
