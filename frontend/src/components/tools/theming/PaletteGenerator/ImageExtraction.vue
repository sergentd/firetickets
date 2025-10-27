<template>
  <div class="image-extraction text-center space-y-4">
    <div class="image-preview-container">
      <div v-if="!imagePreview" class="no-image">
        <p class="text-gray-400">Aucune image chargée</p>
      </div>
      <div v-else>
        <img :src="imagePreview" class="preview-image" />
      </div>
    </div>

    <input
      ref="fileInput"
      type="file"
      accept="image/*"
      style="display: none"
      @change="handleImageUpload"
    />

    <button @click="$refs.fileInput.click()" class="upload-btn">
      Choisir une image
    </button>
  </div>
</template>

<script setup>
import { ref } from "vue";

const emit = defineEmits(["colors-extracted"]);

const fileInput = ref(null);
const imagePreview = ref(null);

const handleImageUpload = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    imagePreview.value = e.target.result;

    const img = new Image();
    img.onload = () => {
      const colors = extractColorsFromImage(img);
      emit("colors-extracted", colors);
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
};

const extractColorsFromImage = (image) => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  // Scale down image for performance
  const maxDim = 100;
  const scale = maxDim / Math.max(image.width, image.height);
  canvas.width = image.width * scale;
  canvas.height = image.height * scale;

  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

  // Extract dominant colors
  const colorMap = {};
  const step = 4 * 5; // Sample every 5th pixel

  for (let i = 0; i < imageData.length; i += step) {
    // Group similar colors by reducing precision
    const key = `${imageData[i] >> 4},${imageData[i + 1] >> 4},${imageData[i + 2] >> 4}`;
    if (!colorMap[key]) colorMap[key] = [];
    colorMap[key].push([imageData[i], imageData[i + 1], imageData[i + 2]]);
  }

  // Sort by frequency and get top 5 colors
  const sortedColors = Object.values(colorMap).sort(
    (a, b) => b.length - a.length,
  );
  const dominantColors = sortedColors.slice(0, 5).map((group) => {
    // Average the colors in each group
    const avg = group
      .reduce(
        (acc, c) => [acc[0] + c[0], acc[1] + c[1], acc[2] + c[2]],
        [0, 0, 0],
      )
      .map((c) => Math.round(c / group.length));

    return rgbToHex(avg[0], avg[1], avg[2]);
  });

  return dominantColors;
};

const rgbToHex = (r, g, b) => {
  return (
    "#" +
    [r, g, b]
      .map((x) => {
        const hex = x.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
      })
      .join("")
  );
};
</script>

<style scoped>
.image-preview-container {
  min-height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  border: 2px dashed rgba(255, 255, 255, 0.2);
}

.no-image {
  padding: 20px;
}

.preview-image {
  max-height: 96px;
  max-width: 100%;
  border-radius: 8px;
  margin: 8px;
}

.upload-btn {
  background: linear-gradient(135deg, #14b8a6 0%, #0f766e 100%);
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
}

.upload-btn:hover {
  background: linear-gradient(135deg, #0f766e 0%, #0d5962 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(20, 184, 166, 0.4);
}
</style>
