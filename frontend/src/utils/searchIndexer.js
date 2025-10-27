import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import { createPinia } from "pinia";
import { useSearchIndexStore } from "@/stores/searchIndex";

/**
 * Pre-index a component by rendering it in a hidden container
 * and extracting its searchable content
 *
 * @param {Object} component - Vue component definition
 * @param {Object} config - Tool configuration
 */
export async function preIndexComponent(component, config) {
  return new Promise((resolve) => {
    // Create a hidden container
    const container = document.createElement("div");
    container.style.display = "none";
    container.style.position = "absolute";
    container.style.top = "-9999px";
    document.body.appendChild(container);

    // Create a temporary app instance
    const app = createApp(component);

    // Create a minimal router for the temporary app
    const router = createRouter({
      history: createWebHistory(),
      routes: [
        { path: "/", component: { template: "<div></div>" } },
        { path: "/:pathMatch(.*)*", component: { template: "<div></div>" } }, // Catch-all route
      ],
    });

    // Create a Pinia instance for the temporary app
    const pinia = createPinia();

    // Provide necessary plugins to avoid warnings
    app.use(pinia);
    app.use(router);

    // Suppress ALL warnings and errors for this temporary app
    app.config.warnHandler = () => {}; // Suppress all warnings during indexing
    app.config.errorHandler = () => {}; // Suppress all errors during indexing

    // Also suppress router and Vue warnings
    const originalWarn = console.warn;
    const originalError = console.error;
    const indexingStartTime = Date.now();

    console.warn = (...args) => {
      // Only filter warnings during the first 2 seconds after indexing starts
      if (Date.now() - indexingStartTime > 2000) {
        originalWarn.apply(console, args);
        return;
      }

      // Filter out all warnings during indexing
      const message = args[0]?.toString() || "";
      if (
        message.includes("Vue warn") ||
        message.includes("Vue Router warn") ||
        message.includes("router-link") ||
        message.includes("router.resolve") ||
        message.includes("Invalid value for prop") ||
        message.includes("Invalid prop") ||
        message.includes("type check failed") ||
        message.includes("custom validator check failed")
      ) {
        return;
      }
      originalWarn.apply(console, args);
    };

    console.error = (...args) => {
      // Only filter errors during the first 2 seconds after indexing starts
      if (Date.now() - indexingStartTime > 2000) {
        originalError.apply(console, args);
        return;
      }

      // Filter out all errors during indexing
      const message = args[0]?.toString() || "";
      if (
        message.includes("Vue warn") ||
        message.includes("Vue Router warn") ||
        message.includes("router-link") ||
        message.includes("router.resolve")
      ) {
        return;
      }
      originalError.apply(console, args);
    };

    // Mount the component
    app.mount(container);

    // Wait for component to fully render and extract content
    setTimeout(() => {
      const entries = extractContentFromDOM(container, config);

      // Restore original console methods
      console.warn = originalWarn;
      console.error = originalError;

      // Clean up
      app.unmount();
      document.body.removeChild(container);

      resolve(entries);
    }, 300);
  });
}

/**
 * Extract searchable content from a DOM element
 */
function extractContentFromDOM(container, config) {
  const entries = [];

  // Find all UISection components
  const sections = container.querySelectorAll(".ui-section, section");

  sections.forEach((section) => {
    // Extract title
    const titleElement = section.querySelector(".section__title, h2, h3");
    if (!titleElement) return;

    const title = stripHtml(titleElement.textContent);
    if (!title || title.length < 3) return;

    // Extract content from section body
    const contentElement =
      section.querySelector(".section__content") || section;
    const content = extractTextContent(contentElement);
    const cleanContent = stripHtml(content);

    if (!cleanContent || cleanContent.length < 10) return;

    // Use existing section ID if present, otherwise generate from title
    let sectionId = section.id || section.getAttribute("id");

    // If no existing ID, generate from title
    if (!sectionId) {
      sectionId = slugify(title);
    }

    entries.push({
      id: sectionId,
      title: title,
      content: cleanContent,
      keywords: extractKeywords(cleanContent),
      context: `${config.toolTitle} > ${title}`,
      toolId: config.toolId,
      toolTitle: config.toolTitle,
      category: config.category,
      route: config.route,
    });
  });

  return entries;
}

/**
 * Strip HTML tags from content
 */
function stripHtml(html) {
  if (!html) return "";
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Extract text content recursively from DOM element
 */
function extractTextContent(element) {
  if (!element) return "";

  // Skip script and style elements
  if (element.tagName === "SCRIPT" || element.tagName === "STYLE") {
    return "";
  }

  let text = "";

  for (const node of element.childNodes) {
    if (node.nodeType === Node.TEXT_NODE) {
      text += node.textContent + " ";
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      text += extractTextContent(node) + " ";
    }
  }

  return text;
}

/**
 * Extract keywords from text
 */
function extractKeywords(text, minLength = 3) {
  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length >= minLength);

  // French stop words
  const stopWords = [
    "une",
    "les",
    "des",
    "pour",
    "avec",
    "dans",
    "sur",
    "qui",
    "que",
    "mais",
    "son",
    "par",
    "peut",
    "sont",
    "ont",
    "lui",
    "vous",
    "nous",
    "tout",
    "tous",
    "autre",
    "même",
    "faire",
    "elle",
    "ses",
    "leur",
  ];

  return [...new Set(words.filter((word) => !stopWords.includes(word)))];
}

/**
 * Generate slug from text
 */
function slugify(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

/**
 * Index multiple tools at once
 */
export async function indexTools(toolConfigs) {
  const searchStore = useSearchIndexStore();

  for (const config of toolConfigs) {
    try {
      const entries = await preIndexComponent(config.component, {
        toolId: config.toolId,
        toolTitle: config.toolTitle,
        category: config.category,
        route: config.route,
      });

      if (entries.length > 0) {
        searchStore.addEntries(config.toolId, entries);
      }
    } catch (error) {
      console.error(`[SearchIndexer] Failed to index ${config.toolId}:`, error);
    }
  }
}
