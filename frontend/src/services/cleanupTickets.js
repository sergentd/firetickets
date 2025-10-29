/**
 * Simple Ticket Cleanup - Delete old problematic tickets
 *
 * Run this in the browser console to delete all tickets older than 24 hours
 */

import { db } from "./firebase";
import { auth } from "./auth";
import logger from "@/utils/logger";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  query,
  where,
} from "firebase/firestore";

const COLLECTION_NAME = "tickets";

/**
 * Delete all tickets older than specified hours
 */
export const deleteOldTickets = async (olderThanHours = 24) => {
  try {
    const userId = auth.currentUser?.uid;
    if (!userId) {
      throw new Error("User not authenticated");
    }

    logger.log(`🗑️  Starting cleanup: deleting tickets older than ${olderThanHours} hours...`);

    // Get all tickets
    const q = query(
      collection(db, COLLECTION_NAME),
      where("userId", "==", userId)
    );
    const snapshot = await getDocs(q);

    const cutoffDate = new Date(Date.now() - olderThanHours * 60 * 60 * 1000);
    let deletedCount = 0;
    let keptCount = 0;
    const errors = [];

    for (const ticketDoc of snapshot.docs) {
      try {
        const ticketData = ticketDoc.data();

        // Get creation date
        let createdAt;
        if (ticketData.createdAt?.toDate) {
          createdAt = ticketData.createdAt.toDate();
        } else if (ticketData.createdAt) {
          createdAt = new Date(ticketData.createdAt);
        } else {
          createdAt = new Date(0);
        }

        // Delete if older than cutoff
        if (createdAt < cutoffDate) {
          await deleteDoc(doc(db, COLLECTION_NAME, ticketDoc.id));
          logger.log(`✅ Deleted: ${ticketData.title} (${ticketDoc.id}) - created ${createdAt.toISOString()}`);
          deletedCount++;
        } else {
          logger.log(`✓ Kept: ${ticketData.title} (${ticketDoc.id}) - created ${createdAt.toISOString()}`);
          keptCount++;
        }
      } catch (error) {
        logger.error(`❌ Error deleting ticket ${ticketDoc.id}:`, error);
        errors.push({
          ticketId: ticketDoc.id,
          error: error.message,
        });
      }
    }

    logger.log("\n" + "=".repeat(60));
    logger.log("🗑️  CLEANUP COMPLETE");
    logger.log("=".repeat(60));
    logger.log(`✅ Deleted: ${deletedCount} tickets`);
    logger.log(`✓ Kept: ${keptCount} tickets`);
    logger.log(`❌ Errors: ${errors.length}`);
    logger.log("=".repeat(60));

    return {
      success: errors.length === 0,
      deleted: deletedCount,
      kept: keptCount,
      errors,
    };
  } catch (error) {
    logger.error("❌ Fatal error during cleanup:", error);
    throw error;
  }
};

/**
 * Delete ALL tickets (nuclear option)
 */
export const deleteAllTickets = async () => {
  try {
    const userId = auth.currentUser?.uid;
    if (!userId) {
      throw new Error("User not authenticated");
    }

    logger.log("🗑️  NUCLEAR OPTION: Deleting ALL tickets...");

    const q = query(
      collection(db, COLLECTION_NAME),
      where("userId", "==", userId)
    );
    const snapshot = await getDocs(q);

    let deletedCount = 0;
    const errors = [];

    for (const ticketDoc of snapshot.docs) {
      try {
        await deleteDoc(doc(db, COLLECTION_NAME, ticketDoc.id));
        logger.log(`✅ Deleted: ${ticketDoc.id}`);
        deletedCount++;
      } catch (error) {
        logger.error(`❌ Error deleting ticket ${ticketDoc.id}:`, error);
        errors.push({
          ticketId: ticketDoc.id,
          error: error.message,
        });
      }
    }

    logger.log("\n" + "=".repeat(60));
    logger.log("🗑️  ALL TICKETS DELETED");
    logger.log("=".repeat(60));
    logger.log(`✅ Deleted: ${deletedCount} tickets`);
    logger.log(`❌ Errors: ${errors.length}`);
    logger.log("=".repeat(60));

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

// Make functions available globally for console access
if (typeof window !== 'undefined') {
  window.deleteOldTickets = deleteOldTickets;
  window.deleteAllTickets = deleteAllTickets;
}
