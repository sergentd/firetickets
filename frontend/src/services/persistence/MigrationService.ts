/**
 * Migration Service
 *
 * Handles automatic data migration from localStorage to IndexedDB.
 * Detects old storage formats and converts them to the new schema.
 */

import { db } from "@/db";
import type { MigrationResult } from "@/types/persistence";

/**
 * Migration Service for localStorage to IndexedDB
 */
export class MigrationService {
  /**
   * Migrate all data from localStorage to IndexedDB
   */
  static async migrateFromLocalStorage(): Promise<MigrationResult> {
    // Check if migration already done
    const migrated = localStorage.getItem("ui-tools-migration-complete");
    if (migrated === "true") {
      return {
        success: true,
        migratedFrom: 0,
        migratedTo: 1,
        affectedItems: 0,
      };
    }

    const migrations: string[] = [];
    let totalItems = 0;

    try {
      // 1. Migrate palettes
      const oldPalettes = localStorage.getItem("ui-tools-saved-palettes");
      if (oldPalettes) {
        try {
          const palettes = JSON.parse(oldPalettes);
          const migratedPalettes = palettes.map((p: any) => ({
            ...p,
            createdAt: p.timestamp || new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            version: 1,
          }));
          await db.palettes.bulkAdd(migratedPalettes);
          migrations.push("palettes");
          totalItems += migratedPalettes.length;
          console.log(`✅ Migrated ${migratedPalettes.length} palettes`);
        } catch (e) {
          console.error("Failed to migrate palettes:", e);
        }
      }

      // 2. Migrate tickets
      const oldTickets = localStorage.getItem("ui-tools-tickets");
      if (oldTickets) {
        try {
          const tickets = JSON.parse(oldTickets);
          const migratedTickets = tickets.map((t: any) => ({
            ...t,
            createdAt: t.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            version: 1,
          }));
          await db.tickets.bulkAdd(migratedTickets);
          migrations.push("tickets");
          totalItems += migratedTickets.length;
          console.log(`✅ Migrated ${migratedTickets.length} tickets`);
        } catch (e) {
          console.error("Failed to migrate tickets:", e);
        }
      }

      // 3. Migrate mind maps
      const oldMindMaps = localStorage.getItem("mindMapData");
      if (oldMindMaps) {
        try {
          const mindmap = JSON.parse(oldMindMaps);
          await db.mindmaps.add({
            name: "Migrated Mind Map",
            root: mindmap,
            connector: "curved",
            zoom: 1,
            pan: { x: 0, y: 0 },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            version: 1,
          });
          migrations.push("mindmaps");
          totalItems += 1;
          console.log("✅ Migrated mind map");
        } catch (e) {
          console.error("Failed to migrate mind map:", e);
        }
      }

      // 4. Migrate checklists
      const oldChecklists = localStorage.getItem("checklistData");
      if (oldChecklists) {
        try {
          const pages = JSON.parse(oldChecklists);
          await db.checklists.add({
            projectName: "Default Project",
            pages: pages,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            version: 1,
          });
          migrations.push("checklists");
          totalItems += 1;
          console.log("✅ Migrated checklist");
        } catch (e) {
          console.error("Failed to migrate checklists:", e);
        }
      }

      // 5. Migrate favorites (now in preferences)
      const oldFavorites = localStorage.getItem("favorites");
      if (oldFavorites) {
        try {
          const favorites = JSON.parse(oldFavorites);
          await db.preferences.put({
            key: "user-preferences",
            favorites: favorites,
            updatedAt: new Date().toISOString(),
          } as any);
          migrations.push("favorites");
          totalItems += 1;
          console.log("✅ Migrated favorites");
        } catch (e) {
          console.error("Failed to migrate favorites:", e);
        }
      }

      // Mark migration as complete
      localStorage.setItem("ui-tools-migration-complete", "true");

      // Store migration metadata
      await db.metadata.put({
        key: "last-migration",
        value: {
          timestamp: new Date().toISOString(),
          collections: migrations,
          totalItems,
        },
        updatedAt: new Date().toISOString(),
      });

      console.log(
        `✅ Migration complete: ${migrations.length} collections, ${totalItems} items`,
      );

      return {
        success: true,
        migratedFrom: 0,
        migratedTo: 1,
        affectedItems: totalItems,
      };
    } catch (error: any) {
      console.error("Migration failed:", error);
      return {
        success: false,
        migratedFrom: 0,
        migratedTo: 1,
        affectedItems: totalItems,
        errors: [error.message],
      };
    }
  }

  /**
   * Check if migration is needed
   */
  static needsMigration(): boolean {
    const migrated = localStorage.getItem("ui-tools-migration-complete");
    return migrated !== "true";
  }

  /**
   * Get migration status
   */
  static async getMigrationStatus() {
    const metadata = await db.metadata.get("last-migration");
    return metadata?.value || null;
  }
}
