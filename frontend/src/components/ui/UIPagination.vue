<template>
  <nav
    v-if="totalPages > 1"
    class="flex items-center justify-between text-sm text-gray-400"
  >
    <div>
      Affichage de {{ itemRange.start }}-{{ itemRange.end }} sur
      {{ totalItems }} éléments
    </div>
    <div class="flex items-center gap-2">
      <button
        @click="changePage(1)"
        :disabled="currentPage === 1"
        class="px-3 py-1 border border-border-primary rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-glass-bg"
      >
        &laquo;
      </button>
      <button
        @click="changePage(currentPage - 1)"
        :disabled="currentPage === 1"
        class="px-3 py-1 border border-border-primary rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-glass-bg"
      >
        Précédent
      </button>
      <span class="px-3 py-1"> Page {{ currentPage }} / {{ totalPages }} </span>
      <button
        @click="changePage(currentPage + 1)"
        :disabled="currentPage === totalPages"
        class="px-3 py-1 border border-border-primary rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-glass-bg"
      >
        Suivant
      </button>
      <button
        @click="changePage(totalPages)"
        :disabled="currentPage === totalPages"
        class="px-3 py-1 border border-border-primary rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-glass-bg"
      >
        &raquo;
      </button>
    </div>
  </nav>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  currentPage: {
    type: Number,
    required: true,
  },
  totalItems: {
    type: Number,
    required: true,
  },
  itemsPerPage: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits(["page-change"]);

const totalPages = computed(() => {
  if (props.totalItems === 0) return 1;
  return Math.ceil(props.totalItems / props.itemsPerPage);
});

const itemRange = computed(() => {
  const start = (props.currentPage - 1) * props.itemsPerPage + 1;
  const end = Math.min(
    props.currentPage * props.itemsPerPage,
    props.totalItems,
  );
  return { start, end };
});

const changePage = (page) => {
  if (page > 0 && page <= totalPages.value) {
    emit("page-change", page);
  }
};
</script>
