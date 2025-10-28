<template>
  <div
    :class="[
      'glass-card rounded-sm p-6 transition-default',
      variant === 'white' ? 'glass-card-white hover-lift' : '',
      className,
    ]"
  >
    <!-- Header slot -->
    <div v-if="$slots.header" class="mb-4">
      <slot name="header" />
    </div>

    <!-- Title and subtitle -->
    <div v-if="title || subtitle" class="mb-4">
      <h3
        v-if="title"
        class="text-xl font-bold text-primary mb-2 leading-tight"
      >
        {{ title }}
      </h3>
      <p v-if="subtitle" class="text-secondary text-sm">
        {{ subtitle }}
      </p>
    </div>

    <!-- Default content slot -->
    <div class="flex-grow">
      <slot />
    </div>

    <!-- Footer slot -->
    <div v-if="$slots.footer" class="mt-4 pt-4 border-t border-t-white/10">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: "",
  },
  subtitle: {
    type: String,
    default: "",
  },
  variant: {
    type: String,
    default: "glass", // 'glass' or 'white'
    validator: (value) => ["glass", "white"].includes(value),
  },
  className: {
    type: String,
    default: "",
  },
});
</script>
