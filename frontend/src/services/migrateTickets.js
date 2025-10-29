/**
 * Ticket Structure Migration Utility
 *
 * This script standardizes all tickets in Firebase to have the complete structure:
 * - comments: []
 * - activities: []
 * - attachments: []
 *
 * Run this to migrate old tickets that don't have these arrays.
 */

import { db } from "./firebase";
import { auth } from "./auth";
import logger from "@/utils/logger";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  query,
  where,
} from "firebase/firestore";

const COLLECTION_NAME = "tickets";

/**
 * Migrate all tickets for the current user to the new structure
 */
export const migrateUserTickets = async () => {
  try {
    const userId = auth.currentUser?.uid;
    if (!userId) {
      throw new Error("User not authenticated");
    }

    logger.log("🔄 MIGRATION: Starting ticket structure migration...");
    logger.log("🔄 MIGRATION: User ID:", userId);

    // Get all tickets for this user
    const q = query(
      collection(db, COLLECTION_NAME),
      where("userId", "==", userId)
    );
    const snapshot = await getDocs(q);

    logger.log(`🔄 MIGRATION: Found ${snapshot.docs.length} tickets to check`);

    let migratedCount = 0;
    let alreadyMigratedCount = 0;
    const errors = [];

    // Process each ticket
    for (const ticketDoc of snapshot.docs) {
      try {
        const ticketData = ticketDoc.data();
        const ticketId = ticketDoc.id;

        // Check if migration is needed
        const needsMigration =
          !ticketData.comments ||
          !ticketData.activities ||
          !ticketData.attachments;

        if (needsMigration) {
          logger.log(`🔄 MIGRATION: Migrating ticket ${ticketId}...`);

          // Prepare the update with missing fields
          const updates = {};

          if (!ticketData.comments) {
            updates.comments = [];
            logger.log(`  - Adding comments array`);
          }

          if (!ticketData.activities) {
            updates.activities = [];
            logger.log(`  - Adding activities array`);
          }

          if (!ticketData.attachments) {
            updates.attachments = [];
            logger.log(`  - Adding attachments array`);
          }

          // Update the ticket
          const ticketRef = doc(db, COLLECTION_NAME, ticketId);
          await updateDoc(ticketRef, updates);

          migratedCount++;
          logger.log(`✅ MIGRATION: Ticket ${ticketId} migrated successfully`);
        } else {
          alreadyMigratedCount++;
          logger.log(`✓ MIGRATION: Ticket ${ticketId} already has correct structure`);
        }
      } catch (error) {
        logger.error(`❌ MIGRATION: Error migrating ticket ${ticketDoc.id}:`, error);
        errors.push({
          ticketId: ticketDoc.id,
          error: error.message,
        });
      }
    }

    // Summary
    logger.log("\n" + "=".repeat(60));
    logger.log("🔄 MIGRATION COMPLETE");
    logger.log("=".repeat(60));
    logger.log(`✅ Migrated: ${migratedCount} tickets`);
    logger.log(`✓ Already up-to-date: ${alreadyMigratedCount} tickets`);
    logger.log(`❌ Errors: ${errors.length} tickets`);
    logger.log("=".repeat(60) + "\n");

    if (errors.length > 0) {
      logger.error("Errors during migration:", errors);
    }

    return {
      success: errors.length === 0,
      total: snapshot.docs.length,
      migrated: migratedCount,
      alreadyMigrated: alreadyMigratedCount,
      errors,
    };
  } catch (error) {
    logger.error("❌ MIGRATION: Fatal error during migration:", error);
    throw error;
  }
};

/**
 * Migrate all tickets in the database (admin function)
 * WARNING: This will migrate ALL tickets for ALL users
 */
export const migrateAllTickets = async () => {
  try {
    logger.log("🔄 MIGRATION: Starting FULL database migration...");
    logger.log("⚠️  WARNING: This will migrate ALL tickets for ALL users");

    // Get ALL tickets (no user filter)
    const snapshot = await getDocs(collection(db, COLLECTION_NAME));

    logger.log(`🔄 MIGRATION: Found ${snapshot.docs.length} tickets to check`);

    let migratedCount = 0;
    let alreadyMigratedCount = 0;
    const errors = [];

    // Process each ticket
    for (const ticketDoc of snapshot.docs) {
      try {
        const ticketData = ticketDoc.data();
        const ticketId = ticketDoc.id;

        // Check if migration is needed
        const needsMigration =
          !ticketData.comments ||
          !ticketData.activities ||
          !ticketData.attachments;

        if (needsMigration) {
          logger.log(`🔄 MIGRATION: Migrating ticket ${ticketId}...`);

          // Prepare the update with missing fields
          const updates = {};

          if (!ticketData.comments) {
            updates.comments = [];
          }

          if (!ticketData.activities) {
            updates.activities = [];
          }

          if (!ticketData.attachments) {
            updates.attachments = [];
          }

          // Update the ticket
          const ticketRef = doc(db, COLLECTION_NAME, ticketId);
          await updateDoc(ticketRef, updates);

          migratedCount++;
        } else {
          alreadyMigratedCount++;
        }
      } catch (error) {
        logger.error(`❌ MIGRATION: Error migrating ticket ${ticketDoc.id}:`, error);
        errors.push({
          ticketId: ticketDoc.id,
          error: error.message,
        });
      }
    }

    // Summary
    logger.log("\n" + "=".repeat(60));
    logger.log("🔄 FULL DATABASE MIGRATION COMPLETE");
    logger.log("=".repeat(60));
    logger.log(`✅ Migrated: ${migratedCount} tickets`);
    logger.log(`✓ Already up-to-date: ${alreadyMigratedCount} tickets`);
    logger.log(`❌ Errors: ${errors.length} tickets`);
    logger.log("=".repeat(60) + "\n");

    if (errors.length > 0) {
      logger.error("Errors during migration:", errors);
    }

    return {
      success: errors.length === 0,
      total: snapshot.docs.length,
      migrated: migratedCount,
      alreadyMigrated: alreadyMigratedCount,
      errors,
    };
  } catch (error) {
    logger.error("❌ MIGRATION: Fatal error during full migration:", error);
    throw error;
  }
};

/**
 * Check ticket structure without migrating
 */
export const checkTicketStructure = async () => {
  try {
    const userId = auth.currentUser?.uid;
    if (!userId) {
      throw new Error("User not authenticated");
    }

    const q = query(
      collection(db, COLLECTION_NAME),
      where("userId", "==", userId)
    );
    const snapshot = await getDocs(q);

    let needsMigration = 0;
    let upToDate = 0;

    snapshot.docs.forEach((ticketDoc) => {
      const ticketData = ticketDoc.data();
      const hasCorrectStructure =
        ticketData.comments &&
        ticketData.activities &&
        ticketData.attachments;

      if (hasCorrectStructure) {
        upToDate++;
      } else {
        needsMigration++;
        logger.log(`Ticket ${ticketDoc.id} needs migration:`, {
          hasComments: !!ticketData.comments,
          hasActivities: !!ticketData.activities,
          hasAttachments: !!ticketData.attachments,
        });
      }
    });

    logger.log(`\nStructure Check Summary:`);
    logger.log(`  Total tickets: ${snapshot.docs.length}`);
    logger.log(`  ✅ Up-to-date: ${upToDate}`);
    logger.log(`  ⚠️  Needs migration: ${needsMigration}`);

    return {
      total: snapshot.docs.length,
      upToDate,
      needsMigration,
    };
  } catch (error) {
    logger.error("Error checking ticket structure:", error);
    throw error;
  }
};
