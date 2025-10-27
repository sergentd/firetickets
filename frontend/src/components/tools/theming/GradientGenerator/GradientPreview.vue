<template>
  <div class="gradient-preview-container">
    <div class="gradient-preview" :style="{ background: gradient }">
      <div class="preview-overlay">Dégradé CSS</div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  gradient: {
    type: String,
    required: true,
  },
});
</script>

<style scoped>
.gradient-preview-container {
  padding: 20px;
}

.gradient-preview {
  width: 100%;
  height: 300px;
  border-radius: 12px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
}

.preview-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.5);
  color: white;
  padding: 16px 24px;
  border-radius: 8px;
  font-weight: 600;
  backdrop-filter: blur(10px);
  font-size: 18px;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
}

@media (max-width: 768px) {
  .gradient-preview {
    height: 200px;
  }

  .preview-overlay {
    font-size: 16px;
    padding: 12px 18px;
  }
}

@media (max-width: 480px) {
  .gradient-preview-container {
    padding: 10px;
  }

  .gradient-preview {
    height: 150px;
  }

  .preview-overlay {
    font-size: 14px;
    padding: 10px 16px;
  }
}
</style>
