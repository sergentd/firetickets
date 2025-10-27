<template>
  <GlassCard>
    <!-- Advanced Ticket Creation Button -->
    <button
      @click="$emit('show-advanced-modal')"
      class="w-full p-3 text-left bg-glass-bg hover:bg-glass-bg-light border border-border-primary rounded-lg transition-all duration-200 group"
    >
      <div class="flex items-center gap-3">
        <div
          class="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center bg-electric-blue/20"
        >
          <svg
            class="w-4 h-4 text-electric-blue"
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
        </div>
        <div class="flex-1">
          <h4
            class="text-sm font-medium text-white group-hover:text-electric-blue transition-colors"
          >
            Nouveau ticket
          </h4>
        </div>
      </div>
    </button>

    <!-- Separator -->
    <div class="border-t border-border-primary my-4"></div>

    <!-- Quick Add Presets -->
    <div class="grid grid-cols-1 gap-2 mb-4">
      <button
        v-for="preset in presets"
        :key="preset.id"
        @click="createFromPreset(preset)"
        class="w-full p-3 text-left bg-glass-bg hover:bg-glass-bg-light border border-border-primary rounded-lg transition-all duration-200 group"
      >
        <div class="flex items-start gap-3">
          <div
            :class="[
              'flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center',
            ]"
            :style="{ backgroundColor: preset.bgColor }"
          >
            <svg
              class="w-4 h-4"
              :class="preset.iconColor"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                :d="preset.icon"
              />
            </svg>
          </div>
          <div class="flex-1">
            <h4
              class="text-sm font-medium text-white group-hover:text-electric-blue transition-colors"
            >
              {{ preset.title }}
            </h4>
            <p class="text-xs text-gray-400 mt-1">{{ preset.description }}</p>
          </div>
        </div>
      </button>
    </div>

    <!-- Quick Input Form -->
    <div class="border-t border-border-primary pt-4">
      <form @submit.prevent="quickCreate" class="space-y-3">
        <input
          id="quick-add-title-input"
          v-model="quickTitle"
          type="text"
          placeholder="Nouveau rappel..."
          class="w-full px-3 py-2 bg-glass-bg border border-border-primary rounded-lg text-white placeholder-gray-400 text-sm focus:ring-2 focus:ring-electric-blue focus:border-electric-blue transition-all duration-200"
        />
        <div class="flex gap-2">
          <!-- Client Autocomplete Input -->
          <div class="relative flex-1">
            <input
              ref="customerSearchInput"
              v-model="quickCustomer"
              type="text"
              placeholder="Nom du client..."
              @focus="showCustomerDropdown = true"
              @blur="setTimeout(() => (showCustomerDropdown = false), 200)"
              @input="showCustomerDropdown = true"
              class="w-full px-3 py-2 bg-glass-bg border border-border-primary rounded-lg text-white placeholder-gray-400 text-sm focus:ring-2 focus:ring-electric-blue focus:border-electric-blue transition-all duration-200"
            />

            <!-- Customer Dropdown -->
            <div
              v-if="
                showCustomerDropdown &&
                (filteredCustomers.length > 0 || quickCustomer.trim())
              "
              class="absolute top-full left-0 right-0 mt-1 bg-glass-bg-light backdrop-blur-sm border border-border-primary rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto"
            >
              <button
                v-for="customer in filteredCustomers"
                :key="customer"
                type="button"
                @click="selectCustomer(customer)"
                class="w-full text-left px-3 py-2 text-white text-sm hover:bg-glass-bg transition-colors border-b border-border-primary last:border-b-0"
              >
                {{ customer }}
              </button>

              <!-- New customer option -->
              <div
                v-if="
                  quickCustomer.trim() &&
                  !filteredCustomers.includes(quickCustomer.trim())
                "
                class="border-t border-border-primary"
              >
                <button
                  type="button"
                  @click="selectCustomer(quickCustomer.trim())"
                  class="w-full text-left px-3 py-2 text-electric-blue text-sm hover:bg-glass-bg transition-colors flex items-center gap-2"
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
                  Créer "{{ quickCustomer.trim() }}"
                </button>
              </div>
            </div>
          </div>
          <input
            v-model="quickPhone"
            type="tel"
            placeholder="Téléphone..."
            class="w-32 px-3 py-2 bg-glass-bg border border-border-primary rounded-lg text-white placeholder-gray-400 text-sm focus:ring-2 focus:ring-electric-blue focus:border-electric-blue transition-all duration-200"
          />
        </div>
        <div class="flex gap-2">
          <select
            v-model="quickPriority"
            class="flex-1 px-3 py-2 bg-glass-bg border border-border-primary rounded-lg text-white text-sm focus:ring-2 focus:ring-electric-blue focus:border-electric-blue"
          >
            <option value="medium">Moyenne</option>
            <option value="low">Faible</option>
            <option value="high">Élevée</option>
            <option value="urgent">Urgente</option>
          </select>
          <input
            v-model="quickDueDate"
            type="date"
            placeholder="Échéance (optionnel)"
            class="flex-1 px-3 py-2 bg-glass-bg border border-border-primary rounded-lg text-white text-sm focus:ring-2 focus:ring-electric-blue focus:border-electric-blue [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert"
          />
        </div>
        <button
          type="submit"
          :disabled="!quickTitle.trim() || !quickCustomer.trim()"
          class="w-full px-3 py-2 bg-electric-blue hover:bg-electric-blue-dark text-black rounded-lg transition-all duration-200 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
          Créer
        </button>
      </form>
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
const emit = defineEmits(["create-ticket", "show-advanced-modal"]);

// Local state
const quickTitle = ref("");
const quickCustomer = ref("");
const quickPhone = ref("");
const quickPriority = ref("medium");
const quickType = ref("callback");
const quickDueDate = ref("");

// Autocomplete state
const showCustomerDropdown = ref(false);
const customerSearchInput = ref(null);

// Presets for common ticket types
const presets = [
  {
    id: "callback-urgent",
    title: "Rappel Urgent",
    description: "Rappeler un client dans les 2h",
    type: "callback",
    priority: "urgent",
    dueDate: () => {
      const today = new Date();
      today.setHours(today.getHours() + 2);
      return today.toISOString().split("T")[0];
    },
    icon: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z",
    bgColor: "var(--accent-red-alpha-20)",
    iconColor: "text-red-400",
  },
  {
    id: "callback-today",
    title: "Rappel Aujourd'hui",
    description: "Rappeler un client aujourd'hui",
    type: "callback",
    priority: "high",
    dueDate: () => new Date().toISOString().split("T")[0],
    icon: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z",
    bgColor: "var(--accent-orange-alpha-20)",
    iconColor: "text-orange-400",
  },
  {
    id: "callback-tomorrow",
    title: "Rappel Demain",
    description: "Rappeler un client demain matin",
    type: "callback",
    priority: "medium",
    dueDate: () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      return tomorrow.toISOString().split("T")[0];
    },
    icon: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z",
    bgColor: "var(--electric-blue-alpha-20)",
    iconColor: "text-electric-blue",
  },
];

// Computed
const recentCustomers = computed(() => {
  // Get unique customers from recent tickets
  const customers = [
    ...new Set(
      props.tickets
        .filter((ticket) => ticket.customer && ticket.customer.trim())
        .map((ticket) => ticket.customer),
    ),
  ];
  return customers.sort();
});

const filteredCustomers = computed(() => {
  if (!quickCustomer.value || quickCustomer.value.length < 1) {
    return recentCustomers.value.slice(0, 8); // Show top 8 recent customers
  }

  const searchTerm = quickCustomer.value.toLowerCase();
  return recentCustomers.value
    .filter((customer) => customer.toLowerCase().includes(searchTerm))
    .slice(0, 8);
});

// Methods
const selectCustomer = (customer) => {
  quickCustomer.value = customer;
  showCustomerDropdown.value = false;
};

const createFromPreset = (preset) => {
  const ticketData = {
    title: `${preset.title} - `,
    customer: "",
    description: preset.description,
    type: preset.type,
    priority: preset.priority,
    dueDate:
      typeof preset.dueDate === "function" ? preset.dueDate() : preset.dueDate,
  };

  // Pre-fill quick form
  quickTitle.value = ticketData.title;
  quickPriority.value = ticketData.priority;
  quickType.value = ticketData.type;
  quickDueDate.value = ticketData.dueDate;

  // Focus on title input and position cursor after " - "
  setTimeout(() => {
    const titleInput = document.getElementById("quick-add-title-input");
    if (titleInput) {
      titleInput.focus();
      // Place cursor after " - " so user can start typing
      const cursorPos = ticketData.title.length; // Position after " - "
      titleInput.setSelectionRange(cursorPos, cursorPos);
    }
  }, 100);
};

const quickCreate = () => {
  if (!quickTitle.value.trim() || !quickCustomer.value.trim()) return;

  const ticketData = {
    title: quickTitle.value.trim(),
    customer: quickCustomer.value.trim(),
    description: `Numéro de téléphone: ${quickPhone.value}`,
    type: quickType.value,
    priority: quickPriority.value,
    dueDate: quickDueDate.value || null,
  };

  emit("create-ticket", ticketData);

  // Reset form
  quickTitle.value = "";
  quickCustomer.value = "";
  quickPhone.value = "";
  quickPriority.value = "medium";
  quickType.value = "callback";
  quickDueDate.value = "";
};
</script>

<style scoped>
.section-title {
  @apply text-lg font-semibold text-white;
}

/* Hover effects */
.group:hover .group-hover\:text-electric-blue {
  color: var(--electric-blue);
}

/* Smooth transitions */
button {
  transition: all 0.2s ease;
}

/* Custom focus styles */
input:focus,
select:focus {
  box-shadow: 0 0 0 3px rgba(0, 212, 255, 0.1);
}

/* Autocomplete dropdown scrollbar */
.max-h-48::-webkit-scrollbar {
  width: 6px;
}

.max-h-48::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}

.max-h-48::-webkit-scrollbar-thumb {
  background: rgba(0, 212, 255, 0.5);
  border-radius: 3px;
}

.max-h-48::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 212, 255, 0.7);
}
</style>
