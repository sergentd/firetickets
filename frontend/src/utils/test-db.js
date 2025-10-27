/**
 * Database Test Utility
 *
 * Run this in the browser console to test IndexedDB persistence
 */

import { db } from "../db/index.ts";
import { MigrationService } from "../services/persistence/MigrationService.ts";

export async function testDatabase() {
  console.log("🧪 Testing IndexedDB...");

  try {
    // Test 1: Check if DB is accessible
    const count = await db.palettes.count();
    console.log("✅ Database accessible");
    console.log(`   Palettes count: ${count}`);

    // Test 2: Add a test palette
    const testPalette = {
      name: "Test Palette",
      colors: ["#FF0000", "#00FF00", "#0000FF"],
      tags: ["test"],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: 1,
    };

    const id = await db.palettes.add(testPalette);
    console.log(`✅ Added test palette with ID: ${id}`);

    // Test 3: Read it back
    const retrieved = await db.palettes.get(id);
    console.log("✅ Retrieved palette:", retrieved);

    // Test 4: Check migration status
    const needsMigration = MigrationService.needsMigration();
    console.log(`Migration needed: ${needsMigration}`);

    // Test 5: Get all data
    const allPalettes = await db.palettes.toArray();
    console.log(`Total palettes in DB: ${allPalettes.length}`);

    console.log("✅ All tests passed!");
    return { success: true, paletteId: id };
  } catch (error) {
    console.error("❌ Test failed:", error);
    return { success: false, error: error.message };
  }
}

// Auto-run if loaded directly
if (typeof window !== "undefined") {
  window.testDatabase = testDatabase;
  console.log("💡 Run testDatabase() in console to test persistence");
}
