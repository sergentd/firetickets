/**
 * Persistence Manager
 *
 * Central coordination service for all data persistence operations.
 * Handles validation, migrations, and routing to appropriate storage adapters.
 */

import { db } from "@/db";
import { ValidationService } from "./ValidationService";
import type {
  StorageStats,
  DataExport,
  ImportResult,
} from "@/types/persistence";

/**
 * Main Persistence Manager
 */
export class PersistenceManager {
  /**
   * Save data to a collection with validation
   */
  static async save<T>(collection: string, data: T): Promise<void> {
    // Validate data
    const validation = ValidationService.validate(collection, data);
    if (!validation.valid) {
      throw new Error(`Validation failed: ${validation.error}`);
    }

    // Save to appropriate collection
    const table = this.getTable(collection);
    if (!table) {
      throw new Error(`Unknown collection: ${collection}`);
    }

    await table.put(validation.data);
  }

  /**
   * Load all items from a collection
   */
  static async loadAll<T>(collection: string): Promise<T[]> {
    const table = this.getTable(collection);
    if (!table) {
      throw new Error(`Unknown collection: ${collection}`);
    }

    return table.toArray() as Promise<T[]>;
  }

  /**
   * Load a single item by ID
   */
  static async loadById<T>(
    collection: string,
    id: number | string,
  ): Promise<T | undefined> {
    const table = this.getTable(collection);
    if (!table) {
      throw new Error(`Unknown collection: ${collection}`);
    }

    return table.get(id) as Promise<T | undefined>;
  }

  /**
   * Delete an item from a collection
   */
  static async delete(collection: string, id: number | string): Promise<void> {
    const table = this.getTable(collection);
    if (!table) {
      throw new Error(`Unknown collection: ${collection}`);
    }

    await table.delete(id);
  }

  /**
   * Clear all items from a collection
   */
  static async clear(collection: string): Promise<void> {
    const table = this.getTable(collection);
    if (!table) {
      throw new Error(`Unknown collection: ${collection}`);
    }

    await table.clear();
  }

  /**
   * Get storage statistics
   */
  static async getStorageStats(): Promise<StorageStats> {
    const stats = {
      palettes: await db.palettes.count(),
      tickets: await db.tickets.count(),
      mindmaps: await db.mindmaps.count(),
      checklists: await db.checklists.count(),
      skills: await db.skills.count(),
      toolConfigs: await db.toolConfigs.count(),
    };

    const totalItems = Object.values(stats).reduce(
      (sum, count) => sum + count,
      0,
    );

    // Get browser storage estimate
    let quota = 0;
    let usage = 0;
    let percentage = 0;

    if ("storage" in navigator && "estimate" in navigator.storage) {
      const estimate = await navigator.storage.estimate();
      quota = estimate.quota || 0;
      usage = estimate.usage || 0;
      percentage = quota > 0 ? (usage / quota) * 100 : 0;
    }

    return {
      quota,
      usage,
      percentage,
      collections: stats,
    };
  }

  /**
   * Export all data as JSON
   */
  static async exportAll(): Promise<DataExport> {
    const [palettes, tickets, mindmaps, checklists, skills, toolConfigs] =
      await Promise.all([
        db.palettes.toArray(),
        db.tickets.toArray(),
        db.mindmaps.toArray(),
        db.checklists.toArray(),
        db.skills.toArray(),
        db.toolConfigs.toArray(),
      ]);

    const preferences = await db.preferences.get("user-preferences");

    const exportData: DataExport = {
      version: "1.0",
      exportedAt: new Date().toISOString(),
      application: "UI Tools Atelier",
      data: {
        palettes,
        tickets,
        mindmaps,
        checklists,
        skills,
        toolConfigs,
        preferences: preferences as any,
      },
      checksum: "", // TODO: Implement checksum calculation
    };

    return exportData;
  }

  /**
   * Import data from JSON
   */
  static async importData(
    data: DataExport,
    options = { merge: false },
  ): Promise<ImportResult> {
    const imported: string[] = [];
    const errors: string[] = [];

    try {
      // Validate export format
      if (data.version !== "1.0") {
        throw new Error(`Unsupported export version: ${data.version}`);
      }

      // Import each collection
      if (data.data.palettes && data.data.palettes.length > 0) {
        try {
          if (!options.merge) {
            await db.palettes.clear();
          }
          await db.palettes.bulkAdd(data.data.palettes);
          imported.push(`palettes (${data.data.palettes.length})`);
        } catch (e: any) {
          errors.push(`Palettes: ${e.message}`);
        }
      }

      if (data.data.tickets && data.data.tickets.length > 0) {
        try {
          if (!options.merge) {
            await db.tickets.clear();
          }
          await db.tickets.bulkAdd(data.data.tickets);
          imported.push(`tickets (${data.data.tickets.length})`);
        } catch (e: any) {
          errors.push(`Tickets: ${e.message}`);
        }
      }

      if (data.data.mindmaps && data.data.mindmaps.length > 0) {
        try {
          if (!options.merge) {
            await db.mindmaps.clear();
          }
          await db.mindmaps.bulkAdd(data.data.mindmaps);
          imported.push(`mindmaps (${data.data.mindmaps.length})`);
        } catch (e: any) {
          errors.push(`Mind maps: ${e.message}`);
        }
      }

      if (data.data.checklists && data.data.checklists.length > 0) {
        try {
          if (!options.merge) {
            await db.checklists.clear();
          }
          await db.checklists.bulkAdd(data.data.checklists);
          imported.push(`checklists (${data.data.checklists.length})`);
        } catch (e: any) {
          errors.push(`Checklists: ${e.message}`);
        }
      }

      if (data.data.skills && data.data.skills.length > 0) {
        try {
          if (!options.merge) {
            await db.skills.clear();
          }
          await db.skills.bulkAdd(data.data.skills);
          imported.push(`skills (${data.data.skills.length})`);
        } catch (e: any) {
          errors.push(`Skills: ${e.message}`);
        }
      }

      if (data.data.preferences) {
        try {
          await db.preferences.put(data.data.preferences as any);
          imported.push("preferences");
        } catch (e: any) {
          errors.push(`Preferences: ${e.message}`);
        }
      }

      return {
        success: imported.length > 0,
        imported,
        errors,
        message:
          imported.length > 0
            ? `Successfully imported: ${imported.join(", ")}`
            : "No data imported",
      };
    } catch (error: any) {
      return {
        success: false,
        imported,
        errors: [error.message],
        message: `Import failed: ${error.message}`,
      };
    }
  }

  /**
   * Get table reference by collection name
   */
  private static getTable(collection: string) {
    switch (collection) {
      case "palettes":
        return db.palettes;
      case "tickets":
        return db.tickets;
      case "mindmaps":
        return db.mindmaps;
      case "checklists":
        return db.checklists;
      case "skills":
        return db.skills;
      case "toolConfigs":
        return db.toolConfigs;
      case "preferences":
        return db.preferences;
      case "metadata":
        return db.metadata;
      default:
        return null;
    }
  }
}
