/**
 * Ticket Recreation Utility
 *
 * Instead of migrating, we recreate all tickets with a fresh structure
 */

import { db } from "./firebase";
import { auth } from "./auth";
import logger from "@/utils/logger";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  query,
  where,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";

const COLLECTION_NAME = "tickets";

/**
 * Recreate all tickets for the current user
 */
export const recreateUserTickets = async () => {
  try {
    const userId = auth.currentUser?.uid;
    if (!userId) {
      throw new Error("User not authenticated");
    }

    logger.log("🔄 RECREATION: Starting ticket recreation...");
    logger.log("🔄 RECREATION: User ID:", userId);

    // Get all tickets for this user
    const q = query(
      collection(db, COLLECTION_NAME),
      where("userId", "==", userId)
    );
    const snapshot = await getDocs(q);

    logger.log(`🔄 RECREATION: Found ${snapshot.docs.length} tickets to recreate`);

    let recreatedCount = 0;
    let skippedCount = 0;
    const errors = [];
    const recreatedTickets = [];

    // Define cutoff: tickets created in last 24 hours are considered "new" and will be skipped
    const cutoffDate = new Date(Date.now() - 24 * 60 * 60 * 1000);

    // Process each ticket
    for (const ticketDoc of snapshot.docs) {
      try {
        const ticketData = ticketDoc.data();
        const oldTicketId = ticketDoc.id;

        // Get creation date
        let createdAt;
        if (ticketData.createdAt?.toDate) {
          createdAt = ticketData.createdAt.toDate();
        } else if (ticketData.createdAt) {
          createdAt = new Date(ticketData.createdAt);
        } else {
          createdAt = new Date(0); // Very old if no date
        }

        // Skip tickets created in last 24 hours (these are new and working)
        if (createdAt > cutoffDate) {
          skippedCount++;
          logger.log(`⏭️  RECREATION: Skipping ticket ${oldTicketId} - created recently (${createdAt.toISOString()})`);
          continue;
        }

        logger.log(`🔄 RECREATION: Recreating ticket ${oldTicketId} (created: ${createdAt.toISOString()})...`);

        // Create new ticket with fresh structure
        const newTicketData = {
          // Core fields from old ticket
          title: ticketData.title || "Sans titre",
          customer: ticketData.customer || "",
          description: ticketData.description || "",
          priority: ticketData.priority || "medium",
          type: ticketData.type || "task",
          status: ticketData.status || "todo",
          dueDate: ticketData.dueDate || null,

          // Preserve timestamps if they exist
          createdAt: ticketData.createdAt
            ? (ticketData.createdAt.toDate ? ticketData.createdAt : Timestamp.fromDate(new Date(ticketData.createdAt)))
            : serverTimestamp(),
          updatedAt: serverTimestamp(),
          completedAt: ticketData.completedAt
            ? (ticketData.completedAt.toDate ? ticketData.completedAt : Timestamp.fromDate(new Date(ticketData.completedAt)))
            : null,

          // Preserve existing arrays or create empty ones
          comments: Array.isArray(ticketData.comments) ? ticketData.comments : [],
          activities: Array.isArray(ticketData.activities) ? ticketData.activities : [],
          attachments: Array.isArray(ticketData.attachments) ? ticketData.attachments : [],

          // Set userId
          userId: userId,
        };

        // Create new ticket
        const newTicketRef = await addDoc(collection(db, COLLECTION_NAME), newTicketData);

        recreatedTickets.push({
          oldId: oldTicketId,
          newId: newTicketRef.id,
          title: newTicketData.title,
        });

        recreatedCount++;
        logger.log(`✅ RECREATION: Ticket "${newTicketData.title}" recreated with ID: ${newTicketRef.id}`);
        logger.log(`   Old ID: ${oldTicketId} → New ID: ${newTicketRef.id}`);

      } catch (error) {
        logger.error(`❌ RECREATION: Error recreating ticket ${ticketDoc.id}:`, error);
        errors.push({
          ticketId: ticketDoc.id,
          error: error.message,
        });
      }
    }

    // Summary
    logger.log("\n" + "=".repeat(60));
    logger.log("🔄 RECREATION COMPLETE");
    logger.log("=".repeat(60));
    logger.log(`✅ Recreated: ${recreatedCount} tickets`);
    logger.log(`⏭️  Skipped: ${skippedCount} tickets (already new structure)`);
    logger.log(`❌ Errors: ${errors.length} tickets`);
    logger.log("=".repeat(60) + "\n");

    if (recreatedTickets.length > 0) {
      logger.log("📋 Recreated tickets:");
      recreatedTickets.forEach(ticket => {
        logger.log(`  - "${ticket.title}" (${ticket.oldId} → ${ticket.newId})`);
      });
    }

    if (errors.length > 0) {
      logger.error("Errors during recreation:", errors);
    }

    return {
      success: errors.length === 0,
      total: snapshot.docs.length,
      recreated: recreatedCount,
      skipped: skippedCount,
      errors,
      recreatedTickets,
    };
  } catch (error) {
    logger.error("❌ RECREATION: Fatal error during recreation:", error);
    throw error;
  }
};

/**
 * Delete old tickets after recreation
 * WARNING: This is irreversible!
 */
export const deleteOldTickets = async (oldTicketIds) => {
  try {
    logger.log("🗑️  Deleting old tickets...");

    let deletedCount = 0;
    const errors = [];

    for (const ticketId of oldTicketIds) {
      try {
        const ticketRef = doc(db, COLLECTION_NAME, ticketId);
        await deleteDoc(ticketRef);
        deletedCount++;
        logger.log(`✅ Deleted old ticket: ${ticketId}`);
      } catch (error) {
        logger.error(`❌ Error deleting ticket ${ticketId}:`, error);
        errors.push({
          ticketId,
          error: error.message,
        });
      }
    }

    logger.log(`\n✅ Deleted ${deletedCount} old tickets`);

    if (errors.length > 0) {
      logger.error("Errors during deletion:", errors);
    }

    return {
      success: errors.length === 0,
      deleted: deletedCount,
      errors,
    };
  } catch (error) {
    logger.error("❌ Fatal error during deletion:", error);
    throw error;
  }
};

/**
 * Check ticket structures (by date - tickets older than 24h will be recreated)
 */
export const checkTicketStructures = async () => {
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

    const cutoffDate = new Date(Date.now() - 24 * 60 * 60 * 1000);
    let oldTickets = 0;
    let newTickets = 0;

    snapshot.docs.forEach((ticketDoc) => {
      const ticketData = ticketDoc.data();

      // Get creation date
      let createdAt;
      if (ticketData.createdAt?.toDate) {
        createdAt = ticketData.createdAt.toDate();
      } else if (ticketData.createdAt) {
        createdAt = new Date(ticketData.createdAt);
      } else {
        createdAt = new Date(0); // Very old if no date
      }

      if (createdAt > cutoffDate) {
        newTickets++;
      } else {
        oldTickets++;
        logger.log(`Old ticket ${ticketDoc.id} - created: ${createdAt.toISOString()}`);
      }
    });

    logger.log(`\nTicket Check Summary:`);
    logger.log(`  Total tickets: ${snapshot.docs.length}`);
    logger.log(`  ✅ Recent (< 24h): ${newTickets}`);
    logger.log(`  ⚠️  Old (will be recreated): ${oldTickets}`);

    return {
      total: snapshot.docs.length,
      newStructure: newTickets,
      oldStructure: oldTickets,
    };
  } catch (error) {
    logger.error("Error checking ticket structures:", error);
    throw error;
  }
};
