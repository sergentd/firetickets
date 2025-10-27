/**
 * Tickets Store
 * Manages ticket state with Pocketbase backend
 */
import { defineStore } from "pinia";
import { ref, computed } from "vue";
import ticketsService from "../services/tickets.service";
import { useAuthStore } from "./auth";

export const useTicketsStore = defineStore("tickets", () => {
  // State
  const tickets = ref([]);
  const isLoading = ref(false);
  const error = ref(null);
  const selectedTicket = ref(null);
  const filters = ref({
    status: "all",
    priority: "all",
    customer: "",
    search: "",
  });

  // Real-time subscription
  let unsubscribe = null;

  // Computed
  const filteredTickets = computed(() => {
    let result = [...tickets.value];

    // Apply status filter
    if (filters.value.status !== "all") {
      result = result.filter((t) => t.status === filters.value.status);
    }

    // Apply priority filter
    if (filters.value.priority !== "all") {
      result = result.filter((t) => t.priority === filters.value.priority);
    }

    // Apply customer filter
    if (filters.value.customer) {
      const customerLower = filters.value.customer.toLowerCase();
      result = result.filter((t) =>
        t.customer?.toLowerCase().includes(customerLower),
      );
    }

    // Apply search filter
    if (filters.value.search) {
      const searchLower = filters.value.search.toLowerCase();
      result = result.filter(
        (t) =>
          t.title?.toLowerCase().includes(searchLower) ||
          t.description?.toLowerCase().includes(searchLower) ||
          t.customer?.toLowerCase().includes(searchLower),
      );
    }

    return result;
  });

  const ticketsByStatus = computed(() => {
    return {
      todo: tickets.value.filter((t) => t.status === "todo"),
      "in-progress": tickets.value.filter((t) => t.status === "in-progress"),
      waiting: tickets.value.filter((t) => t.status === "waiting"),
      completed: tickets.value.filter((t) => t.status === "completed"),
    };
  });

  const ticketsByPriority = computed(() => {
    return {
      low: tickets.value.filter((t) => t.priority === "low"),
      medium: tickets.value.filter((t) => t.priority === "medium"),
      high: tickets.value.filter((t) => t.priority === "high"),
      urgent: tickets.value.filter((t) => t.priority === "urgent"),
    };
  });

  const overdueTickets = computed(() => {
    const today = new Date().toISOString().split("T")[0];
    return tickets.value.filter(
      (t) => t.due_date && t.due_date < today && t.status !== "completed",
    );
  });

  const upcomingCallbacks = computed(() => {
    const now = new Date();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    return tickets.value.filter((t) => {
      if (
        t.type !== "callback" ||
        t.status === "completed" ||
        !t.callback_time
      ) {
        return false;
      }

      const callbackDate = new Date(t.callback_time);
      return callbackDate >= now && callbackDate <= tomorrow;
    });
  });

  const stats = computed(() => {
    return {
      total: tickets.value.length,
      byStatus: {
        todo: ticketsByStatus.value.todo.length,
        "in-progress": ticketsByStatus.value["in-progress"].length,
        waiting: ticketsByStatus.value.waiting.length,
        completed: ticketsByStatus.value.completed.length,
      },
      byPriority: {
        low: ticketsByPriority.value.low.length,
        medium: ticketsByPriority.value.medium.length,
        high: ticketsByPriority.value.high.length,
        urgent: ticketsByPriority.value.urgent.length,
      },
      overdue: overdueTickets.value.length,
      upcomingCallbacks: upcomingCallbacks.value.length,
    };
  });

  // Actions
  async function fetchTickets() {
    const authStore = useAuthStore();
    if (!authStore.isAuthenticated) {
      tickets.value = [];
      return;
    }

    isLoading.value = true;
    error.value = null;

    try {
      const result = await ticketsService.getAll();
      tickets.value = result;
    } catch (err) {
      error.value = err.message;
      console.error("Failed to fetch tickets:", err);
    } finally {
      isLoading.value = false;
    }
  }

  async function createTicket(ticketData) {
    isLoading.value = true;
    error.value = null;

    try {
      const newTicket = await ticketsService.create(ticketData);
      tickets.value.unshift(newTicket);
      return newTicket;
    } catch (err) {
      error.value = err.message;
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function updateTicket(id, data) {
    isLoading.value = true;
    error.value = null;

    try {
      const updatedTicket = await ticketsService.update(id, data);

      // Update in local state
      const index = tickets.value.findIndex((t) => t.id === id);
      if (index !== -1) {
        tickets.value[index] = updatedTicket;
      }

      // Update selected ticket if it's the one being updated
      if (selectedTicket.value?.id === id) {
        selectedTicket.value = updatedTicket;
      }

      return updatedTicket;
    } catch (err) {
      error.value = err.message;
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function deleteTicket(id) {
    isLoading.value = true;
    error.value = null;

    try {
      await ticketsService.delete(id);

      // Remove from local state
      tickets.value = tickets.value.filter((t) => t.id !== id);

      // Clear selected ticket if it was deleted
      if (selectedTicket.value?.id === id) {
        selectedTicket.value = null;
      }
    } catch (err) {
      error.value = err.message;
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function bulkUpdateTickets(ids, data) {
    isLoading.value = true;
    error.value = null;

    try {
      await ticketsService.bulkUpdate(ids, data);
      await fetchTickets(); // Refresh all tickets
    } catch (err) {
      error.value = err.message;
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function bulkDeleteTickets(ids) {
    isLoading.value = true;
    error.value = null;

    try {
      await ticketsService.bulkDelete(ids);

      // Remove from local state
      tickets.value = tickets.value.filter((t) => !ids.includes(t.id));
    } catch (err) {
      error.value = err.message;
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  function setFilters(newFilters) {
    filters.value = { ...filters.value, ...newFilters };
  }

  function resetFilters() {
    filters.value = {
      status: "all",
      priority: "all",
      customer: "",
      search: "",
    };
  }

  function selectTicket(ticket) {
    selectedTicket.value = ticket;
  }

  function clearSelectedTicket() {
    selectedTicket.value = null;
  }

  function clearError() {
    error.value = null;
  }

  async function exportTickets() {
    try {
      return await ticketsService.exportToJSON({
        filter: buildFilterString(),
      });
    } catch (err) {
      error.value = err.message;
      throw err;
    }
  }

  // Real-time subscriptions
  async function subscribeToChanges() {
    const authStore = useAuthStore();
    if (!authStore.isAuthenticated) {
      return;
    }

    try {
      unsubscribe = await ticketsService.subscribe((event) => {
        const { action, record } = event;

        switch (action) {
          case "create":
            // Add new ticket if not already in list
            if (!tickets.value.find((t) => t.id === record.id)) {
              tickets.value.unshift(record);
            }
            break;

          case "update":
            // Update existing ticket
            const updateIndex = tickets.value.findIndex(
              (t) => t.id === record.id,
            );
            if (updateIndex !== -1) {
              tickets.value[updateIndex] = record;
            }

            // Update selected ticket
            if (selectedTicket.value?.id === record.id) {
              selectedTicket.value = record;
            }
            break;

          case "delete":
            // Remove deleted ticket
            tickets.value = tickets.value.filter((t) => t.id !== record.id);

            // Clear selected ticket
            if (selectedTicket.value?.id === record.id) {
              selectedTicket.value = null;
            }
            break;
        }
      });
    } catch (err) {
      console.error("Failed to subscribe to ticket changes:", err);
    }
  }

  async function unsubscribeFromChanges() {
    if (unsubscribe) {
      await ticketsService.unsubscribe();
      unsubscribe = null;
    }
  }

  // Helper to build filter string for API
  function buildFilterString() {
    const filterParts = [];

    if (filters.value.status !== "all") {
      filterParts.push(`status = "${filters.value.status}"`);
    }

    if (filters.value.priority !== "all") {
      filterParts.push(`priority = "${filters.value.priority}"`);
    }

    if (filters.value.customer) {
      filterParts.push(`customer ~ "${filters.value.customer}"`);
    }

    if (filters.value.search) {
      filterParts.push(
        `(title ~ "${filters.value.search}" || description ~ "${filters.value.search}")`,
      );
    }

    return filterParts.join(" && ");
  }

  return {
    // State
    tickets,
    isLoading,
    error,
    selectedTicket,
    filters,

    // Computed
    filteredTickets,
    ticketsByStatus,
    ticketsByPriority,
    overdueTickets,
    upcomingCallbacks,
    stats,

    // Actions
    fetchTickets,
    createTicket,
    updateTicket,
    deleteTicket,
    bulkUpdateTickets,
    bulkDeleteTickets,
    setFilters,
    resetFilters,
    selectTicket,
    clearSelectedTicket,
    clearError,
    exportTickets,
    subscribeToChanges,
    unsubscribeFromChanges,
  };
});
