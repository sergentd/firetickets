<template>
  <div class="mindmap-tool">
    <ToolHeader
      title="Mind Map Avancée"
      description="Créez et éditez des cartes mentales interactives avec export JSON et SVG."
      icon="mindmap"
      category="visualization"
      status="Migré vers Vue"
      :show-badges="true"
    />

    <div class="mindmap-app">
      <!-- Toolbar -->
      <div class="toolbar">
        <div class="toolbar-group">
          <button
            @click="addNode"
            :disabled="!selectedNodeId"
            title="Ajouter un nœud enfant (A)"
            class="toolbar-btn"
          >
            ➕ Ajouter
          </button>
          <button
            @click="deleteNode"
            :disabled="!selectedNodeId || selectedNodeId === rootNode?.id"
            title="Supprimer le nœud (Suppr)"
            class="toolbar-btn"
          >
            🗑️ Supprimer
          </button>
        </div>

        <div class="toolbar-group">
          <button
            @click="undo"
            :disabled="historyIndex <= 0"
            title="Annuler (Ctrl+Z)"
            class="toolbar-btn"
          >
            ↶ Annuler
          </button>
          <button
            @click="redo"
            :disabled="historyIndex >= history.length - 1"
            title="Rétablir (Ctrl+Y)"
            class="toolbar-btn"
          >
            ↷ Rétablir
          </button>
        </div>

        <div class="toolbar-group">
          <label for="shape-select" class="toolbar-label">Forme:</label>
          <select
            id="shape-select"
            v-model="selectedShape"
            @change="changeNodeShape"
            class="toolbar-select"
          >
            <option value="rect">Rectangle</option>
            <option value="ellipse">Ellipse</option>
          </select>

          <label for="connector-select" class="toolbar-label"
            >Connecteur:</label
          >
          <select
            id="connector-select"
            v-model="selectedConnector"
            @change="changeNodeConnector"
            class="toolbar-select"
          >
            <option value="curved">Courbé</option>
            <option value="straight">Droit</option>
            <option value="elbow">Coudé</option>
          </select>
        </div>

        <div class="toolbar-group color-palette">
          <div
            v-for="color in colors"
            :key="color"
            class="color-box"
            :class="{ selected: selectedColor === color }"
            :style="{ backgroundColor: color }"
            @click="changeNodeColor(color)"
          ></div>
        </div>

        <div class="toolbar-group">
          <button @click="reorganize" class="toolbar-btn">
            📐 Réorganiser
          </button>
          <button @click="exportJson" class="toolbar-btn">💾 JSON</button>
          <button @click="exportSvg" class="toolbar-btn">🖼️ SVG</button>
          <button @click="reset" class="toolbar-btn">🔄 Reset</button>
        </div>
      </div>

      <!-- Mind Map Canvas -->
      <div class="mindmap-container" ref="containerRef">
        <svg
          ref="svgRef"
          class="mindmap-svg"
          @mousedown="handleMouseDown"
          @mousemove="handleMouseMove"
          @mouseup="handleMouseUp"
          @mouseleave="handleMouseUp"
          @wheel="handleWheel"
          @dblclick="handleDoubleClick"
        ></svg>

        <!-- Text Editor -->
        <textarea
          ref="textEditorRef"
          class="text-editor"
          v-show="isEditing"
          @blur="handleTextEditEnd"
          @keydown="handleTextEditorKeydown"
        ></textarea>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted, nextTick } from "vue";
import ToolHeader from "@/components/ui/ToolHeader.vue";

// Reactive state
const svgRef = ref(null);
const textEditorRef = ref(null);
const containerRef = ref(null);

// Application state
const selectedNodeId = ref(null);
const selectedShape = ref("rect");
const selectedConnector = ref("curved");
const selectedColor = ref("#ffffff");
const isEditing = ref(false);
const editingNodeId = ref(null);

// Mind map data structure
const rootNode = ref(null);
const history = ref([]);
const historyIndex = ref(-1);

// View state
const viewState = reactive({
  x: 0,
  y: 0,
  zoom: 1,
});

// Interaction state
const dragState = reactive({
  active: null,
  isPanning: false,
  panStart: { x: 0, y: 0 },
});

// Constants
const NODE_WIDTH = 160;
const NODE_HEIGHT = 60;
const colors = [
  "#ffffff",
  "#A59469",
  "#D9CDB8",
  "#EFEBE4",
  "#ffadad",
  "#ffd6a5",
  "#fdffb6",
  "#caffbf",
  "#9bf6ff",
];

// Initialize the mind map
onMounted(() => {
  loadFromLocalStorage();
  saveStateToHistory();
  render();
  addKeyboardListeners();
});

onUnmounted(() => {
  removeKeyboardListeners();
});

// Load data from localStorage
const loadFromLocalStorage = () => {
  const data = localStorage.getItem("mindMapData");
  if (data) {
    rootNode.value = JSON.parse(data);
  } else {
    rootNode.value = {
      id: 1,
      text: "Idée centrale",
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      children: [],
      color: "#ffffff",
      shape: "rect",
      connector: "curved",
    };
  }
  selectedNodeId.value = rootNode.value.id;
  updateToolbarFromNode();
};

// Save data to localStorage
const saveToLocalStorage = () => {
  localStorage.setItem("mindMapData", JSON.stringify(rootNode.value));
};

// History management
const saveStateToHistory = () => {
  history.value.splice(historyIndex.value + 1);
  history.value.push(JSON.parse(JSON.stringify(rootNode.value)));
  historyIndex.value++;
};

const undo = () => {
  if (historyIndex.value > 0) {
    historyIndex.value--;
    rootNode.value = JSON.parse(
      JSON.stringify(history.value[historyIndex.value]),
    );
    selectedNodeId.value = null;
    render();
  }
};

const redo = () => {
  if (historyIndex.value < history.value.length - 1) {
    historyIndex.value++;
    rootNode.value = JSON.parse(
      JSON.stringify(history.value[historyIndex.value]),
    );
    selectedNodeId.value = null;
    render();
  }
};

// Node operations
const findNodeById = (node, id) => {
  if (node.id === id) return node;
  for (const child of node.children) {
    const found = findNodeById(child, id);
    if (found) return found;
  }
  return null;
};

const findParentOfNode = (node, childId) => {
  for (const child of node.children) {
    if (child.id === childId) return node;
    const found = findParentOfNode(child, childId);
    if (found) return found;
  }
  return null;
};

const addNode = () => {
  if (!selectedNodeId.value) return;
  const parentNode = findNodeById(rootNode.value, selectedNodeId.value);
  if (parentNode) {
    const newNode = {
      id: Date.now(),
      text: "Nouveau nœud",
      x: parentNode.x + NODE_WIDTH + 50,
      y: parentNode.y + parentNode.children.length * (NODE_HEIGHT + 20),
      children: [],
      color: parentNode.color,
      shape: parentNode.shape,
      connector: parentNode.connector,
    };
    parentNode.children.push(newNode);
    selectedNodeId.value = newNode.id;
    saveAndRender(true);
  }
};

const deleteNode = () => {
  if (!selectedNodeId.value || selectedNodeId.value === rootNode.value.id)
    return;
  const parentNode = findParentOfNode(rootNode.value, selectedNodeId.value);
  if (parentNode) {
    parentNode.children = parentNode.children.filter(
      (child) => child.id !== selectedNodeId.value,
    );
    selectedNodeId.value = parentNode.id;
    saveAndRender(true);
  }
};

const changeNodeProperty = (property, value) => {
  if (!selectedNodeId.value) return;
  const node = findNodeById(rootNode.value, selectedNodeId.value);
  if (node) {
    node[property] = value;
    saveAndRender(true);
  }
};

const changeNodeColor = (color) => {
  selectedColor.value = color;
  changeNodeProperty("color", color);
};

const changeNodeShape = () => {
  changeNodeProperty("shape", selectedShape.value);
};

const changeNodeConnector = () => {
  changeNodeProperty("connector", selectedConnector.value);
};

const updateToolbarFromNode = () => {
  const selectedNode = selectedNodeId.value
    ? findNodeById(rootNode.value, selectedNodeId.value)
    : null;
  if (selectedNode) {
    selectedShape.value = selectedNode.shape || "rect";
    selectedConnector.value = selectedNode.connector || "curved";
    selectedColor.value = selectedNode.color || "#ffffff";
  }
};

// Rendering
const render = () => {
  if (!svgRef.value) return;

  svgRef.value.innerHTML = "";
  const mainGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
  mainGroup.setAttribute(
    "transform",
    `translate(${viewState.x}, ${viewState.y}) scale(${viewState.zoom})`,
  );
  svgRef.value.appendChild(mainGroup);

  const connectorsGroup = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "g",
  );
  const nodesGroup = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "g",
  );
  mainGroup.appendChild(connectorsGroup);
  mainGroup.appendChild(nodesGroup);

  const queue = [rootNode.value];
  while (queue.length > 0) {
    const node = queue.shift();
    renderNode(node, nodesGroup);
    if (node.children) {
      node.children.forEach((child) => {
        renderConnector(node, child, connectorsGroup);
        queue.push(child);
      });
    }
  }
  updateToolbarFromNode();
};

const renderNode = (node, group) => {
  const nodeGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
  nodeGroup.classList.add("node");
  nodeGroup.setAttribute("transform", `translate(${node.x}, ${node.y})`);
  nodeGroup.dataset.id = node.id;
  if (node.id === selectedNodeId.value) {
    nodeGroup.classList.add("selected");
  }

  let shape;
  const shapeType = node.shape || "rect";
  if (shapeType === "ellipse") {
    shape = document.createElementNS("http://www.w3.org/2000/svg", "ellipse");
    shape.setAttribute("cx", 0);
    shape.setAttribute("cy", 0);
    shape.setAttribute("rx", NODE_WIDTH / 2);
    shape.setAttribute("ry", NODE_HEIGHT / 2);
  } else {
    shape = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    shape.setAttribute("x", -NODE_WIDTH / 2);
    shape.setAttribute("y", -NODE_HEIGHT / 2);
    shape.setAttribute("width", NODE_WIDTH);
    shape.setAttribute("height", NODE_HEIGHT);
    shape.setAttribute("rx", 10);
  }

  shape.classList.add("node-shape");
  shape.style.fill = node.color || "#ffffff";
  shape.style.stroke = colors.includes(node.color) ? "#A59469" : node.color;

  const text = createMultilineText(node.text);

  nodeGroup.appendChild(shape);
  nodeGroup.appendChild(text);
  group.appendChild(nodeGroup);
};

const createMultilineText = (textContent) => {
  const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
  text.classList.add("node-text");

  const words = textContent.split(" ");
  let line = "";
  let lineCount = 0;
  const maxChars = 18;

  words.forEach((word) => {
    if ((line + word).length > maxChars) {
      const tspan = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "tspan",
      );
      tspan.setAttribute("x", 0);
      tspan.setAttribute("dy", `${lineCount === 0 ? 0 : 1.2}em`);
      tspan.textContent = line.trim();
      text.appendChild(tspan);
      line = word + " ";
      lineCount++;
    } else {
      line += word + " ";
    }
  });
  const tspan = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
  tspan.setAttribute("x", 0);
  tspan.setAttribute("dy", `${lineCount === 0 ? 0 : 1.2}em`);
  tspan.textContent = line.trim();
  text.appendChild(tspan);

  // Center the text block vertically
  nextTick(() => {
    const totalHeight = text.getBBox().height;
    text.setAttribute("transform", `translate(0, ${-totalHeight / 4})`);
  });

  return text;
};

const renderConnector = (parent, child, group) => {
  const line = document.createElementNS("http://www.w3.org/2000/svg", "path");
  const connectorType = parent.connector || "curved";
  let d;

  const startX = parent.x;
  const startY = parent.y;
  const endX = child.x;
  const endY = child.y;

  if (connectorType === "straight") {
    d = `M ${startX} ${startY} L ${endX} ${endY}`;
  } else if (connectorType === "elbow") {
    const midX = startX + (endX - startX) / 2;
    d = `M ${startX} ${startY} L ${midX} ${startY} L ${midX} ${endY} L ${endX} ${endY}`;
  } else {
    d = `M ${startX} ${startY} C ${startX + 50} ${startY}, ${endX - 50} ${endY}, ${endX} ${endY}`;
  }

  line.setAttribute("d", d);
  line.classList.add("connector");
  group.appendChild(line);
};

const saveAndRender = (saveHistory = false) => {
  saveToLocalStorage();
  if (saveHistory) {
    saveStateToHistory();
  }
  render();
};

// Event handlers
const handleMouseDown = (e) => {
  const nodeElement = e.target.closest(".node");
  if (nodeElement) {
    const nodeId = parseInt(nodeElement.dataset.id);
    selectedNodeId.value = nodeId;
    const node = findNodeById(rootNode.value, nodeId);
    const mousePos = getMousePosition(e);

    dragState.active = {
      id: nodeId,
      offsetX: mousePos.x - node.x,
      offsetY: mousePos.y - node.y,
      moved: false,
    };
    render();
  } else {
    dragState.isPanning = true;
    dragState.panStart = { x: e.clientX, y: e.clientY };
  }
};

const handleMouseMove = (e) => {
  if (dragState.active) {
    dragState.active.moved = true;
    const node = findNodeById(rootNode.value, dragState.active.id);
    const mousePos = getMousePosition(e);
    node.x = mousePos.x - dragState.active.offsetX;
    node.y = mousePos.y - dragState.active.offsetY;
    render();
  } else if (dragState.isPanning) {
    const dx = e.clientX - dragState.panStart.x;
    const dy = e.clientY - dragState.panStart.y;
    viewState.x += dx;
    viewState.y += dy;
    dragState.panStart = { x: e.clientX, y: e.clientY };
    render();
  }
};

const handleMouseUp = () => {
  if (dragState.active) {
    if (dragState.active.moved) {
      saveStateToHistory();
    }
    dragState.active = null;
  }
  if (dragState.isPanning) {
    dragState.isPanning = false;
  }
};

const handleWheel = (e) => {
  e.preventDefault();
  const zoomFactor = 1.1;
  const oldZoom = viewState.zoom;
  const newZoom = e.deltaY < 0 ? oldZoom * zoomFactor : oldZoom / zoomFactor;

  const mousePoint = { x: e.clientX, y: e.clientY };

  viewState.x =
    mousePoint.x - (mousePoint.x - viewState.x) * (newZoom / oldZoom);
  viewState.y =
    mousePoint.y - (mousePoint.y - viewState.y) * (newZoom / oldZoom);
  viewState.zoom = newZoom;

  render();
};

const handleDoubleClick = (e) => {
  const nodeElement = e.target.closest(".node");
  if (nodeElement && textEditorRef.value) {
    const nodeId = parseInt(nodeElement.dataset.id);
    const node = findNodeById(rootNode.value, nodeId);

    const editorX = (node.x - NODE_WIDTH / 2) * viewState.zoom + viewState.x;
    const editorY = (node.y - NODE_HEIGHT / 2) * viewState.zoom + viewState.y;

    textEditorRef.value.style.left = `${editorX}px`;
    textEditorRef.value.style.top = `${editorY}px`;
    textEditorRef.value.style.width = `${NODE_WIDTH * viewState.zoom}px`;
    textEditorRef.value.style.height = `${NODE_HEIGHT * viewState.zoom}px`;
    textEditorRef.value.value = node.text;

    isEditing.value = true;
    editingNodeId.value = nodeId;

    nextTick(() => {
      textEditorRef.value.focus();
    });
  }
};

const handleTextEditEnd = () => {
  if (isEditing.value && editingNodeId.value) {
    const node = findNodeById(rootNode.value, editingNodeId.value);
    if (node) {
      const newText = textEditorRef.value.value.trim();
      if (newText !== node.text) {
        node.text = newText === "" ? "Sans titre" : newText;
        saveAndRender(true);
      } else {
        render();
      }
    }
    isEditing.value = false;
    editingNodeId.value = null;
  }
};

const handleTextEditorKeydown = (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    handleTextEditEnd();
  }
};

const getMousePosition = (e) => {
  const CTM = svgRef.value.getScreenCTM().inverse();
  const point = svgRef.value.createSVGPoint();
  point.x = e.clientX;
  point.y = e.clientY;
  const svgPoint = point.matrixTransform(CTM);

  return {
    x: (svgPoint.x - viewState.x) / viewState.zoom,
    y: (svgPoint.y - viewState.y) / viewState.zoom,
  };
};

// Utility functions
const reset = () => {
  if (confirm("Êtes-vous sûr de vouloir effacer toute la mind map ?")) {
    localStorage.removeItem("mindMapData");
    viewState.x = 0;
    viewState.y = 0;
    viewState.zoom = 1;
    history.value = [];
    historyIndex.value = -1;
    loadFromLocalStorage();
    render();
  }
};

const reorganize = () => {
  const layout = (node, x, y, level = 0) => {
    node.x = x;
    node.y = y;
    const childCount = node.children.length;
    if (childCount === 0) return;

    const yOffset = NODE_HEIGHT * 1.5;
    const totalHeight = (childCount - 1) * yOffset;
    let currentY = y - totalHeight / 2;

    node.children.forEach((child) => {
      layout(child, x + NODE_WIDTH * 1.5, currentY, level + 1);
      currentY += yOffset;
    });
  };
  layout(rootNode.value, rootNode.value.x, rootNode.value.y);
  saveAndRender(true);
};

const exportJson = () => {
  const dataStr = JSON.stringify(rootNode.value, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  downloadBlob(blob, "mindmap.json");
};

const exportSvg = () => {
  const mainGroup = svgRef.value.querySelector("g");
  const originalTransform = mainGroup.getAttribute("transform");
  mainGroup.removeAttribute("transform");

  const svgData = svgRef.value.outerHTML;

  mainGroup.setAttribute("transform", originalTransform);

  const blob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
  downloadBlob(blob, "mindmap.svg");
};

const downloadBlob = (blob, filename) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// Keyboard shortcuts
const handleKeyDown = (e) => {
  if (isEditing.value) return;

  if (e.key === "Delete" || e.key === "Backspace") {
    e.preventDefault();
    deleteNode();
  } else if (e.key.toLowerCase() === "a") {
    e.preventDefault();
    addNode();
  } else if (e.ctrlKey && e.key.toLowerCase() === "z") {
    e.preventDefault();
    undo();
  } else if (e.ctrlKey && e.key.toLowerCase() === "y") {
    e.preventDefault();
    redo();
  }
};

const addKeyboardListeners = () => {
  document.addEventListener("keydown", handleKeyDown);
};

const removeKeyboardListeners = () => {
  document.removeEventListener("keydown", handleKeyDown);
};
</script>

<style scoped>
.mindmap-tool {
  font-family: "Inter", sans-serif;
  background-color: #f8f7f4;
  color: #3d3b30;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.mindmap-app {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 100px);
}

/* Toolbar Styling */
.toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  padding: 15px 20px;
  background: linear-gradient(135deg, #ffffff 0%, #f8f7f4 100%);
  border-bottom: 2px solid #efebe4;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  z-index: 10;
}

.toolbar-group {
  display: flex;
  align-items: center;
  gap: 8px;
  padding-right: 20px;
  border-right: 1px solid #efebe4;
}

.toolbar-group:last-child {
  border-right: none;
}

.toolbar-btn {
  padding: 10px 16px;
  font-size: 14px;
  font-weight: 600;
  border: 1px solid #d9cdb8;
  border-radius: 8px;
  background: linear-gradient(135deg, #ffffff 0%, #f8f7f4 100%);
  color: #3d3b30;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.toolbar-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #a59469 0%, #8c7a4b 100%);
  color: white;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(165, 148, 105, 0.3);
}

.toolbar-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  filter: grayscale(100%);
}

.toolbar-label {
  font-weight: 600;
  color: #3d3b30;
  font-size: 14px;
}

.toolbar-select {
  padding: 8px 12px;
  font-size: 14px;
  border: 1px solid #d9cdb8;
  border-radius: 6px;
  background-color: #ffffff;
  color: #3d3b30;
  cursor: pointer;
  transition: all 0.2s ease;
}

.toolbar-select:hover,
.toolbar-select:focus {
  border-color: #a59469;
  box-shadow: 0 0 0 2px rgba(165, 148, 105, 0.2);
  outline: none;
}

/* Color Palette */
.color-palette {
  display: flex;
  gap: 6px;
}

.color-box {
  width: 28px;
  height: 28px;
  border: 3px solid transparent;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.color-box:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.color-box.selected {
  border-color: #a59469;
  transform: scale(1.1);
  box-shadow: 0 0 0 2px rgba(165, 148, 105, 0.3);
}

/* Mind Map Container */
.mindmap-container {
  flex-grow: 1;
  position: relative;
  background:
    radial-gradient(
      circle at 30% 70%,
      rgba(165, 148, 105, 0.03) 0%,
      transparent 50%
    ),
    radial-gradient(
      circle at 70% 30%,
      rgba(217, 205, 184, 0.03) 0%,
      transparent 50%
    );
  overflow: hidden;
}

.mindmap-svg {
  width: 100%;
  height: 100%;
  display: block;
  cursor: grab;
}

.mindmap-svg:active {
  cursor: grabbing;
}

/* SVG Nodes */
:deep(.node) {
  cursor: move;
}

:deep(.node-shape) {
  stroke-width: 2px;
  filter: drop-shadow(0px 3px 6px rgba(0, 0, 0, 0.15));
  transition:
    stroke 0.3s ease,
    stroke-width 0.3s ease;
}

:deep(.node.selected .node-shape) {
  stroke: #a59469;
  stroke-width: 3px;
}

:deep(.node-text) {
  font-size: 16px;
  font-weight: 600;
  fill: #3d3b30;
  text-anchor: middle;
  dominant-baseline: middle;
  pointer-events: none;
  user-select: none;
  white-space: pre-wrap;
}

:deep(.connector) {
  stroke: #a59469;
  stroke-width: 2px;
  fill: none;
  opacity: 0.7;
}

/* Text Editor */
.text-editor {
  position: absolute;
  display: none;
  border: 2px solid #a59469;
  border-radius: 8px;
  padding: 12px;
  font-family: "Inter", sans-serif;
  font-size: 16px;
  font-weight: 600;
  text-align: center;
  background: white;
  color: #3d3b30;
  box-shadow: 0 8px 24px rgba(165, 148, 105, 0.3);
  z-index: 20;
  resize: none;
  box-sizing: border-box;
  outline: none;
}

.text-editor:focus {
  box-shadow:
    0 8px 24px rgba(165, 148, 105, 0.4),
    0 0 0 4px rgba(165, 148, 105, 0.1);
}

/* Responsive Design */
@media (max-width: 768px) {
  .toolbar {
    padding: 10px 15px;
    gap: 6px;
  }

  .toolbar-group {
    padding-right: 15px;
    gap: 6px;
  }

  .toolbar-btn {
    padding: 8px 12px;
    font-size: 12px;
  }

  .color-box {
    width: 24px;
    height: 24px;
  }
}

/* Loading and animations */
.mindmap-tool {
  animation: fadeIn 0.6s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
