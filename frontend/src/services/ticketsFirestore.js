import { db } from "./firebase";
import { auth } from "./auth";
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  onSnapshot,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";

const COLLECTION_NAME = "tickets";

/**
 * Firestore Ticket Service
 * Cost-conscious implementation with minimal reads/writes
 */

// Get tickets collection reference
const getTicketsCollection = () => collection(db, COLLECTION_NAME);

/**
 * Load all tickets once (initial load)
 * Returns: Promise<Array<Ticket>>
 */
export const loadTickets = async () => {
  try {
    const userId = auth.currentUser?.uid;
    if (!userId) {
      throw new Error("User not authenticated");
    }

    console.log("🔥 FIRESTORE: Loading tickets from Firebase Firestore...");
    console.log("🔥 FIRESTORE: Filtering by userId:", userId);

    const q = query(
      getTicketsCollection(),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );
    const snapshot = await getDocs(q);
    console.log(
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
    console.error("Error loading tickets:", error);
    throw error;
  }
};

/**
 * Subscribe to real-time updates (efficient - only changed documents)
 * Returns: Unsubscribe function
 */
export const subscribeToTickets = (callback) => {
  const userId = auth.currentUser?.uid;
  if (!userId) {
    console.error("🔥 FIRESTORE: Cannot subscribe - user not authenticated");
    return () => {}; // Return empty unsubscribe function
  }

  console.log("🔥 FIRESTORE: Real-time listener activated - listening for changes...");
  console.log("🔥 FIRESTORE: Filtering by userId:", userId);

  const q = query(
    getTicketsCollection(),
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );

  return onSnapshot(
    q,
    (snapshot) => {
      console.log(
        `🔥 FIRESTORE: Real-time update received! ${snapshot.docs.length} tickets`,
      );
      console.log("🔥 FIRESTORE: Changes:", {
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
      console.error("Error in tickets subscription:", error);
    },
  );
};

/**
 * Create a new ticket
 * Cost: 1 write operation
 */
export const createTicket = async (ticketData) => {
  try {
    const userId = auth.currentUser?.uid;
    if (!userId) {
      throw new Error("User not authenticated");
    }

    console.log(
      "🔥 FIRESTORE: Creating ticket in Firebase...",
      ticketData.title,
    );
    const docRef = await addDoc(getTicketsCollection(), {
      ...ticketData,
      userId: userId,
      createdAt: serverTimestamp(), // Server timestamp (accurate)
      updatedAt: serverTimestamp(),
    });
    console.log(`🔥 FIRESTORE: Ticket created with ID: ${docRef.id}`);

    return { id: docRef.id, ...ticketData, userId };
  } catch (error) {
    console.error("Error creating ticket:", error);
    throw error;
  }
};

/**
 * Update an existing ticket
 * Cost: 1 write operation
 */
export const updateTicket = async (ticketId, updates) => {
  try {
    console.log(`🔥 FIRESTORE: Updating ticket ${ticketId} in Firebase...`);
    const ticketRef = doc(db, COLLECTION_NAME, ticketId);
    await updateDoc(ticketRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
    console.log(`🔥 FIRESTORE: Ticket ${ticketId} updated successfully`);
  } catch (error) {
    console.error("Error updating ticket:", error);
    throw error;
  }
};

/**
 * Delete a ticket
 * Cost: 1 write operation
 */
export const deleteTicket = async (ticketId) => {
  try {
    console.log(`🔥 FIRESTORE: Deleting ticket ${ticketId} from Firebase...`);
    const ticketRef = doc(db, COLLECTION_NAME, ticketId);
    await deleteDoc(ticketRef);
    console.log(`🔥 FIRESTORE: Ticket ${ticketId} deleted successfully`);
  } catch (error) {
    console.error("Error deleting ticket:", error);
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
    console.error("Error bulk deleting tickets:", error);
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
      console.log("No localStorage data to migrate");
      return { success: true, count: 0 };
    }

    const tickets = JSON.parse(localData);
    console.log(`Migrating ${tickets.length} tickets from localStorage...`);

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
    console.log(
      `✅ Successfully migrated ${tickets.length} tickets to Firestore`,
    );

    // Backup localStorage data before clearing
    localStorage.setItem("ui-tools-tickets-backup", localData);

    return { success: true, count: tickets.length };
  } catch (error) {
    console.error("Error migrating tickets:", error);
    throw error;
  }
};
