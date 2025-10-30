import { db } from "./firebase";
import { auth } from "./auth";
import logger from "@/utils/logger";
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import {
  getMockTickets,
  createMockTicket,
  updateMockTicket,
  deleteMockTicket,
  subscribeMockTickets,
  addMockComment,
  addMockActivity,
  addMockAttachment,
  removeMockAttachment,
} from "./mockData";

const COLLECTION_NAME = "tickets";
const isDevMode = import.meta.env.VITE_DEV_MODE === "true";

/**
 * Firestore Ticket Service
 * Cost-conscious implementation with minimal reads/writes
 *
 * DEV MODE: Set VITE_DEV_MODE=true in .env.local to use mock data
 */

// Get tickets collection reference
const getTicketsCollection = () => collection(db, COLLECTION_NAME);

/**
 * Load all tickets once (initial load)
 * Returns: Promise<Array<Ticket>>
 */
export const loadTickets = async () => {
  // DEV MODE: Return mock data
  if (isDevMode) {
    logger.log("🔥 FIRESTORE [DEV MODE]: Loading mock tickets...");
    const tickets = await getMockTickets();
    logger.log(`🔥 FIRESTORE [DEV MODE]: Loaded ${tickets.length} mock tickets`);
    return tickets;
  }

  try {
    const userId = auth.currentUser?.uid;
    if (!userId) {
      throw new Error("User not authenticated");
    }

    logger.log("🔥 FIRESTORE: Loading tickets from Firebase Firestore...");
    logger.log("🔥 FIRESTORE: Filtering by userId:", userId);

    const q = query(
      getTicketsCollection(),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );
    const snapshot = await getDocs(q);
    logger.log(
      `🔥 FIRESTORE: Loaded ${snapshot.docs.length} tickets from Firebase`,
    );

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      // Convert Firestore timestamps to ISO strings
      createdAt:
        doc.data().createdAt?.toDate?.()?.toISOString() || doc.data().createdAt,
      updatedAt:
        doc.data().updatedAt?.toDate?.()?.toISOString() || doc.data().updatedAt,
      dueDate: doc.data().dueDate || null,
      completedAt:
        doc.data().completedAt?.toDate?.()?.toISOString() ||
        doc.data().completedAt,
    }));
  } catch (error) {
    logger.error("Error loading tickets:", error);
    throw error;
  }
};

/**
 * Subscribe to real-time updates (efficient - only changed documents)
 * Returns: Unsubscribe function
 */
export const subscribeToTickets = (callback) => {
  // DEV MODE: Use mock subscription
  if (isDevMode) {
    logger.log("🔥 FIRESTORE [DEV MODE]: Real-time listener activated (mock mode)");
    return subscribeMockTickets(callback);
  }

  const userId = auth.currentUser?.uid;
  if (!userId) {
    logger.error("🔥 FIRESTORE: Cannot subscribe - user not authenticated");
    return () => {}; // Return empty unsubscribe function
  }

  logger.log("🔥 FIRESTORE: Real-time listener activated - listening for changes...");
  logger.log("🔥 FIRESTORE: Filtering by userId:", userId);

  const q = query(
    getTicketsCollection(),
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );

  return onSnapshot(
    q,
    (snapshot) => {
      logger.log(
        `🔥 FIRESTORE: Real-time update received! ${snapshot.docs.length} tickets`,
      );
      logger.log("🔥 FIRESTORE: Changes:", {
        added: snapshot.docChanges().filter((c) => c.type === "added").length,
        modified: snapshot.docChanges().filter((c) => c.type === "modified")
          .length,
        removed: snapshot.docChanges().filter((c) => c.type === "removed")
          .length,
      });

      const tickets = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt:
          doc.data().createdAt?.toDate?.()?.toISOString() ||
          doc.data().createdAt,
        updatedAt:
          doc.data().updatedAt?.toDate?.()?.toISOString() ||
          doc.data().updatedAt,
        dueDate: doc.data().dueDate || null,
        completedAt:
          doc.data().completedAt?.toDate?.()?.toISOString() ||
          doc.data().completedAt,
      }));
      callback(tickets);
    },
    (error) => {
      logger.error("Error in tickets subscription:", error);
    },
  );
};

/**
 * Create a new ticket
 * Cost: 1 write operation
 */
export const createTicket = async (ticketData) => {
  // DEV MODE: Use mock data
  if (isDevMode) {
    logger.log("🔥 FIRESTORE [DEV MODE]: Creating mock ticket...", ticketData.title);
    const newId = await createMockTicket(ticketData);
    logger.log(`🔥 FIRESTORE [DEV MODE]: Mock ticket created with ID: ${newId}`);
    return { id: newId, ...ticketData, userId: "dev-user-123" };
  }

  try {
    const userId = auth.currentUser?.uid;
    if (!userId) {
      throw new Error("User not authenticated");
    }

    logger.log(
      "🔥 FIRESTORE: Creating ticket in Firebase...",
      ticketData.title,
    );

    // Filter out undefined values - Firebase doesn't accept undefined
    const cleanData = Object.entries(ticketData).reduce((acc, [key, value]) => {
      if (value !== undefined) {
        acc[key] = value;
      }
      return acc;
    }, {});

    const now = new Date().toISOString();
    const initialActivity = {
      id: `act-${Date.now()}`,
      type: "ticket_created",
      description: "Ticket créé",
      timestamp: now,
    };

    const docRef = await addDoc(getTicketsCollection(), {
      ...cleanData,
      userId: userId,
      createdAt: serverTimestamp(), // Server timestamp (accurate)
      updatedAt: serverTimestamp(),
      activities: [initialActivity],
    });
    logger.log(`🔥 FIRESTORE: Ticket created with ID: ${docRef.id}`);

    return { id: docRef.id, ...ticketData, userId };
  } catch (error) {
    logger.error("Error creating ticket:", error);
    throw error;
  }
};

/**
 * Update an existing ticket
 * Cost: 1 write operation
 */
export const updateTicket = async (ticketId, updates) => {
  // DEV MODE: Update mock data
  if (isDevMode) {
    logger.log(`🔥 FIRESTORE [DEV MODE]: Updating mock ticket ${ticketId}...`);
    await updateMockTicket(ticketId, updates);
    logger.log(`🔥 FIRESTORE [DEV MODE]: Mock ticket ${ticketId} updated successfully`);
    return;
  }

  try {
    logger.log(`🔥 FIRESTORE: Updating ticket ${ticketId} in Firebase...`);

    // Filter out undefined values - Firebase doesn't accept undefined
    const cleanUpdates = Object.entries(updates).reduce((acc, [key, value]) => {
      if (value !== undefined) {
        acc[key] = value;
      }
      return acc;
    }, {});

    const ticketRef = doc(db, COLLECTION_NAME, String(ticketId));
    await updateDoc(ticketRef, {
      ...cleanUpdates,
      updatedAt: serverTimestamp(),
    });
    logger.log(`🔥 FIRESTORE: Ticket ${ticketId} updated successfully`);
  } catch (error) {
    logger.error("Error updating ticket:", error);
    throw error;
  }
};

/**
 * Add a comment to a ticket
 * Cost: 1 write operation
 */
export const addComment = async (ticketId, commentText) => {
  // DEV MODE: Use mock data
  if (isDevMode) {
    logger.log(`🔥 FIRESTORE [DEV MODE]: Adding mock comment to ticket ${ticketId}...`);
    const newComment = await addMockComment(ticketId, commentText);
    logger.log(`🔥 FIRESTORE [DEV MODE]: Mock comment added successfully`);
    return newComment;
  }

  try {
    const userId = auth.currentUser?.uid;
    const userEmail = auth.currentUser?.email;
    if (!userId) {
      throw new Error("User not authenticated");
    }

    logger.log(`🔥 FIRESTORE: Adding comment to ticket ${ticketId}...`);

    const ticketRef = doc(db, COLLECTION_NAME, String(ticketId));
    const newComment = {
      id: `com-${Date.now()}`,
      text: commentText,
      userEmail: userEmail,
      createdAt: new Date().toISOString(),
    };

    await updateDoc(ticketRef, {
      comments: [...(await getTicketComments(ticketId)), newComment],
      updatedAt: serverTimestamp(),
    });

    logger.log(`🔥 FIRESTORE: Comment added successfully`);
    return newComment;
  } catch (error) {
    logger.error("Error adding comment:", error);
    throw error;
  }
};

/**
 * Helper to get existing comments
 */
const getTicketComments = async (ticketId) => {
  const ticketRef = doc(db, COLLECTION_NAME, String(ticketId));
  const ticketSnap = await getDoc(ticketRef);
  if (ticketSnap.exists()) {
    return ticketSnap.data().comments || [];
  }
  return [];
};

/**
 * Add an activity entry to a ticket
 * Cost: 1 write operation (merged with other updates)
 */
export const addActivity = async (ticketId, activityType, description) => {
  // DEV MODE: Use mock data
  if (isDevMode) {
    logger.log(`🔥 FIRESTORE [DEV MODE]: Adding mock activity to ticket ${ticketId}...`);
    const newActivity = await addMockActivity(ticketId, activityType, description);
    logger.log(`🔥 FIRESTORE [DEV MODE]: Mock activity added successfully`);
    return newActivity;
  }

  try {
    logger.log(`🔥 FIRESTORE: Adding activity to ticket ${ticketId}...`);

    const ticketRef = doc(db, COLLECTION_NAME, String(ticketId));
    const newActivity = {
      id: `act-${Date.now()}`,
      type: activityType,
      description: description,
      timestamp: new Date().toISOString(),
    };

    const ticketSnap = await getDoc(ticketRef);
    const currentActivities = ticketSnap.exists() ? (ticketSnap.data().activities || []) : [];

    await updateDoc(ticketRef, {
      activities: [...currentActivities, newActivity],
    });

    logger.log(`🔥 FIRESTORE: Activity added successfully`);
    return newActivity;
  } catch (error) {
    logger.error("Error adding activity:", error);
    throw error;
  }
};

/**
 * Add an attachment to a ticket
 * Cost: 1 write operation
 */
export const addAttachment = async (ticketId, attachment) => {
  // DEV MODE: Use mock data
  if (isDevMode) {
    logger.log(`🔥 FIRESTORE [DEV MODE]: Adding mock attachment to ticket ${ticketId}...`);
    const newAttachment = await addMockAttachment(ticketId, attachment);
    logger.log(`🔥 FIRESTORE [DEV MODE]: Mock attachment added successfully`);
    return newAttachment;
  }

  try {
    logger.log(`🔥 FIRESTORE: Adding attachment to ticket ${ticketId}...`);

    const ticketRef = doc(db, COLLECTION_NAME, String(ticketId));
    const ticketSnap = await getDoc(ticketRef);
    const currentAttachments = ticketSnap.exists() ? (ticketSnap.data().attachments || []) : [];

    await updateDoc(ticketRef, {
      attachments: [...currentAttachments, attachment],
      updatedAt: serverTimestamp(),
    });

    logger.log(`🔥 FIRESTORE: Attachment added successfully`);
    return attachment;
  } catch (error) {
    logger.error("Error adding attachment:", error);
    throw error;
  }
};

/**
 * Remove an attachment from a ticket
 * Cost: 1 write operation
 */
export const removeAttachment = async (ticketId, attachmentId) => {
  // DEV MODE: Use mock data
  if (isDevMode) {
    logger.log(`🔥 FIRESTORE [DEV MODE]: Removing mock attachment from ticket ${ticketId}...`);
    await removeMockAttachment(ticketId, attachmentId);
    logger.log(`🔥 FIRESTORE [DEV MODE]: Mock attachment removed successfully`);
    return;
  }

  try {
    logger.log(`🔥 FIRESTORE: Removing attachment ${attachmentId} from ticket ${ticketId}...`);

    const ticketRef = doc(db, COLLECTION_NAME, String(ticketId));
    const ticketSnap = await getDoc(ticketRef);
    const currentAttachments = ticketSnap.exists() ? (ticketSnap.data().attachments || []) : [];

    const updatedAttachments = currentAttachments.filter(att => att.id !== attachmentId);

    await updateDoc(ticketRef, {
      attachments: updatedAttachments,
      updatedAt: serverTimestamp(),
    });

    logger.log(`🔥 FIRESTORE: Attachment removed successfully`);
  } catch (error) {
    logger.error("Error removing attachment:", error);
    throw error;
  }
};

/**
 * Delete a ticket
 * Cost: 1 write operation
 */
export const deleteTicket = async (ticketId) => {
  // DEV MODE: Delete mock data
  if (isDevMode) {
    logger.log(`🔥 FIRESTORE [DEV MODE]: Deleting mock ticket ${ticketId}...`);
    await deleteMockTicket(ticketId);
    logger.log(`🔥 FIRESTORE [DEV MODE]: Mock ticket ${ticketId} deleted successfully`);
    return;
  }

  try {
    logger.log(`🔥 FIRESTORE: Deleting ticket ${ticketId} from Firebase...`);
    const ticketRef = doc(db, COLLECTION_NAME, String(ticketId));
    await deleteDoc(ticketRef);
    logger.log(`🔥 FIRESTORE: Ticket ${ticketId} deleted successfully`);
  } catch (error) {
    logger.error("Error deleting ticket:", error);
    throw error;
  }
};

/**
 * Bulk delete tickets (efficient batching)
 * Cost: N write operations (where N = number of tickets)
 */
export const bulkDeleteTickets = async (ticketIds) => {
  try {
    const deletePromises = ticketIds.map((id) => deleteTicket(id));
    await Promise.all(deletePromises);
  } catch (error) {
    logger.error("Error bulk deleting tickets:", error);
    throw error;
  }
};

/**
 * One-time migration: Import tickets from localStorage to Firestore
 * Cost: N write operations (where N = number of tickets)
 */
export const migrateFromLocalStorage = async () => {
  try {
    const localData = localStorage.getItem("ui-tools-tickets");
    if (!localData) {
      logger.log("No localStorage data to migrate");
      return { success: true, count: 0 };
    }

    const tickets = JSON.parse(localData);
    logger.log(`Migrating ${tickets.length} tickets from localStorage...`);

    const migrationPromises = tickets.map((ticket) =>
      addDoc(getTicketsCollection(), {
        ...ticket,
        // Convert ISO strings to Firestore Timestamps
        createdAt: ticket.createdAt
          ? Timestamp.fromDate(new Date(ticket.createdAt))
          : serverTimestamp(),
        updatedAt: ticket.updatedAt
          ? Timestamp.fromDate(new Date(ticket.updatedAt))
          : serverTimestamp(),
        completedAt: ticket.completedAt
          ? Timestamp.fromDate(new Date(ticket.completedAt))
          : null,
      }),
    );

    await Promise.all(migrationPromises);
    logger.log(
      `✅ Successfully migrated ${tickets.length} tickets to Firestore`,
    );

    // Backup localStorage data before clearing
    localStorage.setItem("ui-tools-tickets-backup", localData);

    return { success: true, count: tickets.length };
  } catch (error) {
    logger.error("Error migrating tickets:", error);
    throw error;
  }
};
