/**
 * Palettes Store
 *
 * Manages color palettes with automatic IndexedDB persistence.
 * Replaces localStorage logic from SavedPalettes.vue component.
 */

import { defineStore } from "pinia";
import { db } from "@/db";
import type { Palette } from "@/types/persistence";

export const usePalettesStore = defineStore("palettes", {
  state: () => ({
    palettes: [] as Palette[],
    isLoading: false,
    error: null as string | null,
  }),

  getters: {
    /**
     * Get palette by ID
     */
    getPaletteById: (state) => (id: number) => {
      return state.palettes.find((p) => p.id === id);
    },

    /**
     * Get recent palettes (last 10)
     */
    recentPalettes: (state) => {
      return state.palettes
        .sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
        )
        .slice(0, 10);
    },

    /**
     * Search palettes by name or tags
     */
    searchPalettes: (state) => (query: string) => {
      const lowerQuery = query.toLowerCase();
      return state.palettes.filter(
        (p) =>
          p.name.toLowerCase().includes(lowerQuery) ||
          p.tags?.some((t) => t.toLowerCase().includes(lowerQuery)),
      );
    },
  },

  actions: {
    /**
     * Load all palettes from IndexedDB
     */
    async loadPalettes() {
      this.isLoading = true;
      this.error = null;

      try {
        this.palettes = await db.palettes.toArray();
      } catch (error: any) {
        this.error = error.message;
        console.error("Failed to load palettes:", error);
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Add new palette
     */
    async addPalette(
      palette: Omit<Palette, "id" | "createdAt" | "updatedAt" | "version">,
    ) {
      const newPalette: Omit<Palette, "id"> = {
        ...palette,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        version: 1,
      };

      try {
        const id = await db.palettes.add(newPalette as Palette);
        this.palettes.push({ ...newPalette, id } as Palette);
        return id;
      } catch (error: any) {
        this.error = error.message;
        console.error("Failed to add palette:", error);
        throw error;
      }
    },

    /**
     * Update existing palette
     */
    async updatePalette(id: number, updates: Partial<Palette>) {
      const updated = {
        ...updates,
        updatedAt: new Date().toISOString(),
      };

      try {
        await db.palettes.update(id, updated);

        const index = this.palettes.findIndex((p) => p.id === id);
        if (index !== -1) {
          this.palettes[index] = { ...this.palettes[index], ...updated };
        }
      } catch (error: any) {
        this.error = error.message;
        console.error("Failed to update palette:", error);
        throw error;
      }
    },

    /**
     * Delete palette
     */
    async deletePalette(id: number) {
      try {
        await db.palettes.delete(id);
        this.palettes = this.palettes.filter((p) => p.id !== id);
      } catch (error: any) {
        this.error = error.message;
        console.error("Failed to delete palette:", error);
        throw error;
      }
    },

    /**
     * Clear all palettes
     */
    async clearAllPalettes() {
      try {
        await db.palettes.clear();
        this.palettes = [];
      } catch (error: any) {
        this.error = error.message;
        console.error("Failed to clear palettes:", error);
        throw error;
      }
    },

    /**
     * Export palettes as JSON
     */
    exportPalettes() {
      return JSON.stringify(this.palettes, null, 2);
    },

    /**
     * Import palettes from JSON
     */
    async importPalettes(jsonData: string) {
      try {
        const importedPalettes = JSON.parse(jsonData) as Palette[];

        // Add imported palettes
        for (const palette of importedPalettes) {
          const { id, ...paletteData } = palette;
          await this.addPalette(paletteData);
        }

        await this.loadPalettes();
      } catch (error: any) {
        this.error = error.message;
        console.error("Failed to import palettes:", error);
        throw error;
      }
    },
  },
});
