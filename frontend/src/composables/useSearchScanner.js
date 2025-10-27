import { onMounted, onUnmounted, getCurrentInstance } from "vue";
import { useSearchIndexStore } from "@/stores/searchIndex";

/**
 * Universal search content scanner that automatically extracts
 * UISections and their content from any component
 *
 * @param {Object} config - Configuration object
 * @param {string} config.toolId - Unique tool identifier
 * @param {string} config.toolTitle - Display name of the tool
 * @param {string} config.category - Tool category (reference, theming, etc.)
 * @param {string} config.route - Vue Router path to the tool
 */
export function useSearchScanner(config) {
  const searchStore = useSearchIndexStore();
  const instance = getCurrentInstance();

  /**
   * Strip HTML tags from content
   */
  const stripHtml = (html) => {
    if (!html) return "";
    return html
      .replace(/<[^>]*>/g, " ")
      .replace(/&nbsp;/g, " ")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&amp;/g, "&")
      .replace(/\s+/g, " ")
      .trim();
  };

  /**
   * Extract meaningful keywords from text
   */
  const extractKeywords = (text, minLength = 3) => {
    const words = text
      .toLowerCase()
      .replace(/[^\w\s]/g, " ")
      .split(/\s+/)
      .filter((word) => word.length >= minLength);

    // Remove common French stop words
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
  };

  /**
   * Extract text content from a DOM element recursively
   */
  const extractTextContent = (element) => {
    if (!element) return "";

    // Skip script and style elements
    if (element.tagName === "SCRIPT" || element.tagName === "STYLE") {
      return "";
    }

    let text = "";

    // Get direct text nodes
    for (const node of element.childNodes) {
      if (node.nodeType === Node.TEXT_NODE) {
        text += node.textContent + " ";
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        text += extractTextContent(node) + " ";
      }
    }

    return text;
  };

  /**
   * Generate a slug from text (for IDs)
   */
  const slugify = (text) => {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
      .replace(/[^\w\s-]/g, "") // Remove special chars
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .replace(/-+/g, "-") // Remove consecutive hyphens
      .trim();
  };

  /**
   * Scan the component for UISection elements and extract their content
   */
  const scanContent = () => {
    if (!instance) return [];

    // Wait for next tick to ensure DOM is fully rendered
    setTimeout(() => {
      const el = instance.proxy.$el;
      if (!el) return;

      const entries = [];

      // Find all UISection components by their class
      const sections = el.querySelectorAll(".ui-section, section");

      sections.forEach((section, index) => {
        // Try to find the section title
        // UISection renders titles as h2 with class section__title
        let title = "";
        const titleElement = section.querySelector(".section__title, h2, h3");

        if (titleElement) {
          title = stripHtml(titleElement.textContent);
        }

        // Skip if no title found or title is too short
        if (!title || title.length < 3) return;

        // Extract all text content from the section's content area
        const contentElement =
          section.querySelector(".section__content") || section;
        const content = extractTextContent(contentElement);
        const cleanContent = stripHtml(content);

        // Skip empty content
        if (!cleanContent || cleanContent.length < 10) return;

        // Create a unique ID for this section based on the title
        const sectionId = slugify(title);

        // Try to find an existing ID on the section element
        let existingId = section.id || titleElement?.id;

        // If no ID exists, try to set one on the section for navigation
        if (!existingId) {
          existingId = sectionId;
          section.id = sectionId;
        }

        entries.push({
          id: existingId,
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

      // Register the extracted entries
      if (entries.length > 0) {
        searchStore.addEntries(config.toolId, entries);
        console.log(
          `[SearchScanner] Indexed ${entries.length} sections from ${config.toolTitle}`,
        );
      }
    }, 500); // Give time for component to fully render
  };

  /**
   * Register content on component mount
   */
  onMounted(() => {
    scanContent();
  });

  /**
   * Unregister content when component unmounts (optional)
   */
  onUnmounted(() => {
    searchStore.removeEntries(config.toolId);
  });

  return {
    scanContent,
  };
}
