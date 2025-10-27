<template>
  <div class="code-output bg-gray-900 rounded-lg overflow-hidden">
    <!-- Header with copy button -->
    <div
      class="flex items-center justify-between p-3 bg-gray-800 border-b border-gray-700"
    >
      <div class="flex items-center space-x-2">
        <div class="flex space-x-1">
          <div class="w-3 h-3 bg-red-500 rounded-full"></div>
          <div class="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <div class="w-3 h-3 bg-green-500 rounded-full"></div>
        </div>
        <span v-if="language" class="text-gray-400 text-sm font-mono ml-4">
          {{ language }}
        </span>
      </div>

      <button
        @click="copyToClipboard"
        class="flex items-center space-x-2 px-3 py-1 bg-gray-700 hover:bg-gray-600 text-gray-300 text-sm rounded transition-colors duration-200"
        :class="{ 'text-green-400': copied }"
      >
        <svg
          v-if="!copied"
          class="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
          />
        </svg>
        <svg
          v-else
          class="w-4 h-4"
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
        <span>{{ copied ? "Copié!" : "Copier" }}</span>
      </button>
    </div>

    <!-- Code content -->
    <div class="p-4 overflow-x-auto">
      <pre
        v-if="!useSlot"
        class="text-sm text-gray-300 font-mono leading-relaxed"
      ><code>{{ formattedCode }}</code></pre>
      <div v-else class="text-sm text-gray-300 font-mono leading-relaxed">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick } from "vue";

const props = defineProps({
  code: {
    type: String,
    default: "",
  },
  language: {
    type: String,
    default: "",
  },
  useSlot: {
    type: Boolean,
    default: false,
  },
});

const copied = ref(false);

const formattedCode = computed(() => {
  return props.code.trim();
});

const copyToClipboard = async () => {
  try {
    const textToCopy = props.useSlot
      ? document.querySelector(".code-output pre")?.textContent || ""
      : props.code;

    await navigator.clipboard.writeText(textToCopy);
    copied.value = true;

    // Reset copied state after 2 seconds
    setTimeout(() => {
      copied.value = false;
    }, 2000);
  } catch (error) {
    console.error("Failed to copy to clipboard:", error);

    // Fallback for older browsers
    const textArea = document.createElement("textarea");
    textArea.value = props.code;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);

    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 2000);
  }
};
</script>

<style scoped>
/* Custom scrollbar for code area */
.code-output ::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.code-output ::-webkit-scrollbar-track {
  background: #374151;
}

.code-output ::-webkit-scrollbar-thumb {
  background: #6b7280;
  border-radius: 3px;
}

.code-output ::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}
</style>
