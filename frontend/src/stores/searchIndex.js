import { defineStore } from "pinia";
import Fuse from "fuse.js";

export const useSearchIndexStore = defineStore("searchIndex", {
  state: () => ({
    tools: {}, // Map of toolId -> { toolTitle, category, entries[] }
    fuse: null,
    isIndexed: false,
  }),

  getters: {
    /**
     * Get all indexed entries count
     */
    totalEntries: (state) => {
      return Object.values(state.tools).reduce((sum, tool) => {
        return sum + (tool.entries?.length || 0);
      }, 0);
    },

    /**
     * Get all entries as flat array
     */
    allEntries: (state) => {
      return Object.values(state.tools).flatMap((tool) => tool.entries || []);
    },
  },

  actions: {
    /**
     * Add entries for a tool
     * @param {string} toolId - Unique tool identifier
     * @param {Array} entries - Array of searchable entries
     */
    addEntries(toolId, entries) {
      if (!Array.isArray(entries) || entries.length === 0) {
        return;
      }

      // Store entries for this tool
      this.tools[toolId] = {
        toolId,
        toolTitle: entries[0]?.toolTitle || toolId,
        category: entries[0]?.category || "reference",
        entries: entries,
      };

      // Rebuild search index
      this.rebuildIndex();
    },

    /**
     * Remove entries for a tool
     * @param {string} toolId - Unique tool identifier
     */
    removeEntries(toolId) {
      if (this.tools[toolId]) {
        delete this.tools[toolId];
        this.rebuildIndex();
      }
    },

    /**
     * Rebuild the Fuse.js search index
     */
    rebuildIndex() {
      const allEntries = this.allEntries;

      if (allEntries.length === 0) {
        this.fuse = null;
        this.isIndexed = false;
        return;
      }

      // Configure Fuse.js with weighted scoring
      this.fuse = new Fuse(allEntries, {
        keys: [
          { name: "title", weight: 3 },
          { name: "keywords", weight: 2 },
          { name: "content", weight: 1 },
        ],
        threshold: 0.4, // 0 = perfect match, 1 = match anything
        includeScore: true,
        includeMatches: true,
        minMatchCharLength: 2,
        ignoreLocation: true, // Don't penalize matches far from the start
        distance: 1000, // Allow matches across longer strings
      });

      this.isIndexed = true;
    },

    /**
     * Search the index
     * @param {string} query - Search query
     * @param {Object} options - Search options
     * @returns {Array} Search results
     */
    search(query, options = {}) {
      const { category = null, maxResults = 50, groupByTool = false } = options;

      // Return empty if no index or empty query
      if (!this.fuse || !query || !query.trim()) {
        return [];
      }

      // Perform search
      let results = this.fuse.search(query);

      // Filter by category if specified
      if (category) {
        results = results.filter((r) => r.item.category === category);
      }

      // Limit results
      results = results.slice(0, maxResults);

      // Group by tool if requested
      if (groupByTool) {
        return this.groupByTool(results);
      }

      // Return flat list with score and matches
      return results.map((r) => ({
        ...r.item,
        score: r.score,
        matches: r.matches,
      }));
    },

    /**
     * Group search results by tool
     * @param {Array} results - Fuse.js results
     * @returns {Array} Grouped results
     */
    groupByTool(results) {
      const grouped = {};

      results.forEach((result) => {
        const toolId = result.item.toolId;

        if (!grouped[toolId]) {
          grouped[toolId] = {
            toolId,
            toolTitle: this.tools[toolId]?.toolTitle || toolId,
            category: this.tools[toolId]?.category || "reference",
            results: [],
          };
        }

        grouped[toolId].results.push({
          ...result.item,
          score: result.score,
          matches: result.matches,
        });
      });

      // Convert to array and sort by best score in each group
      return Object.values(grouped).sort((a, b) => {
        const aScore = Math.min(...a.results.map((r) => r.score || 1));
        const bScore = Math.min(...b.results.map((r) => r.score || 1));
        return aScore - bScore;
      });
    },

    /**
     * Clear all indexed content
     */
    clearAll() {
      this.tools = {};
      this.fuse = null;
      this.isIndexed = false;
    },
  },
});
