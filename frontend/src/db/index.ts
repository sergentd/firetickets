/**
 * IndexedDB Database Configuration using Dexie.js
 *
 * This file defines the database schema and handles versioning/migrations.
 * Each version upgrade includes migration logic to transform existing data.
 */

import Dexie, { type Table } from "dexie";
import type {
  Palette,
  Ticket,
  MindMap,
  Checklist,
  SkillsProfile,
  ToolConfig,
  UserPreferences,
  MetadataEntry,
} from "@/types/persistence";

/**
 * Main Database Class
 */
export class UIToolsDatabase extends Dexie {
  // Typed tables for better TypeScript support
  palettes!: Table<Palette, number>;
  tickets!: Table<Ticket, number>;
  mindmaps!: Table<MindMap, number>;
  checklists!: Table<Checklist, number>;
  skills!: Table<SkillsProfile, number>;
  toolConfigs!: Table<ToolConfig, string>;
  preferences!: Table<UserPreferences, string>;
  metadata!: Table<MetadataEntry, string>;

  constructor() {
    super("UIToolsAtelier");

    this.version(1).stores({
      // User-generated content
      palettes: "++id, name, createdAt, updatedAt, *colors, *tags",
      tickets:
        "++id, status, priority, dueDate, createdAt, updatedAt, type, *tags",
      mindmaps: "++id, name, createdAt, updatedAt",
      checklists: "++id, projectName, createdAt, updatedAt",
      skills: "++id, userId, createdAt, updatedAt",

      // Tool configurations (session state)
      toolConfigs: "toolId, createdAt, updatedAt, isSession",

      // User preferences (key-value)
      preferences: "key, updatedAt",

      // Metadata (app-level key-value storage)
      metadata: "key, updatedAt",
    });

    // Future version example (uncomment when needed):
    // this.version(2).stores({
    //   palettes: '++id, name, createdAt, updatedAt, *colors, *tags, userId', // Add userId index
    //   // ... other collections
    // }).upgrade(async tx => {
    //   // Migration logic
    //   await tx.table('palettes').toCollection().modify(palette => {
    //     palette.userId = palette.userId || 'default'
    //   })
    // })
  }
}

// Export singleton instance
export const db = new UIToolsDatabase();

/**
 * Database utility functions
 */

/**
 * Clear all data from the database (use with caution!)
 */
export async function clearAllData(): Promise<void> {
  await Promise.all([
    db.palettes.clear(),
    db.tickets.clear(),
    db.mindmaps.clear(),
    db.checklists.clear(),
    db.skills.clear(),
    db.toolConfigs.clear(),
    db.preferences.clear(),
    db.metadata.clear(),
  ]);
  console.log("✅ All database data cleared");
}

/**
 * Get database storage statistics
 */
export async function getStorageStats() {
  const stats = {
    palettes: await db.palettes.count(),
    tickets: await db.tickets.count(),
    mindmaps: await db.mindmaps.count(),
    checklists: await db.checklists.count(),
    skills: await db.skills.count(),
    toolConfigs: await db.toolConfigs.count(),
    preferences: await db.preferences.count(),
    metadata: await db.metadata.count(),
  };

  const totalItems = Object.values(stats).reduce(
    (sum, count) => sum + count,
    0,
  );

  return {
    collections: stats,
    totalItems,
    version: db.verno,
  };
}

/**
 * Export all data as JSON
 */
export async function exportAllData() {
  const [palettes, tickets, mindmaps, checklists, skills, toolConfigs] =
    await Promise.all([
      db.palettes.toArray(),
      db.tickets.toArray(),
      db.mindmaps.toArray(),
      db.checklists.toArray(),
      db.skills.toArray(),
      db.toolConfigs.toArray(),
    ]);

  const preferences = await db.preferences.toArray();

  return {
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
      preferences: preferences[0] || {},
    },
  };
}

/**
 * Check if database is accessible
 */
export async function checkDatabaseAccess(): Promise<boolean> {
  try {
    await db.metadata.toArray();
    return true;
  } catch (error) {
    console.error("Database access error:", error);
    return false;
  }
}
