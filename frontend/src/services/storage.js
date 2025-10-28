import { storage } from "./firebase";
import { auth } from "./auth";
import logger from "@/utils/logger";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

const isDevMode = import.meta.env.VITE_DEV_MODE === "true";

/**
 * Firebase Storage Service
 * Handles file uploads for ticket attachments
 */

/**
 * Upload a file to Firebase Storage
 * @param {File} file - The file to upload
 * @param {string} ticketId - The ticket ID for organizing files
 * @param {function} onProgress - Progress callback (optional)
 * @returns {Promise<Object>} - Returns attachment object with url, metadata
 */
export const uploadAttachment = async (file, ticketId, onProgress = null) => {
  // DEV MODE: Return mock attachment
  if (isDevMode) {
    logger.log("🔥 STORAGE [DEV MODE]: Mock upload", file.name);
    return {
      id: `att-${Date.now()}`,
      name: file.name,
      type: file.type,
      size: file.size,
      url: URL.createObjectURL(file),
      uploadedAt: new Date().toISOString(),
      storagePath: `mock/${ticketId}/${file.name}`,
    };
  }

  try {
    const userId = auth.currentUser?.uid;
    if (!userId) {
      throw new Error("User not authenticated");
    }

    // Create storage reference
    const timestamp = Date.now();
    const fileName = `${timestamp}_${file.name}`;
    const storagePath = `attachments/${userId}/${ticketId}/${fileName}`;
    const storageRef = ref(storage, storagePath);

    logger.log(`🔥 STORAGE: Uploading ${file.name} to ${storagePath}...`);

    // Upload file
    const uploadTask = uploadBytesResumable(storageRef, file);

    // Return promise that resolves with download URL
    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Progress callback
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          if (onProgress) {
            onProgress(progress);
          }
          logger.log(`🔥 STORAGE: Upload progress: ${progress.toFixed(1)}%`);
        },
        (error) => {
          // Error callback
          logger.error("🔥 STORAGE: Upload failed", error);
          reject(error);
        },
        async () => {
          // Success callback
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            logger.log(
              `🔥 STORAGE: Upload complete! Download URL: ${downloadURL}`,
            );

            const attachment = {
              id: `att-${timestamp}`,
              name: file.name,
              type: file.type,
              size: file.size,
              url: downloadURL,
              uploadedAt: new Date().toISOString(),
              storagePath: storagePath,
            };

            resolve(attachment);
          } catch (error) {
            logger.error("🔥 STORAGE: Failed to get download URL", error);
            reject(error);
          }
        },
      );
    });
  } catch (error) {
    logger.error("🔥 STORAGE: Error uploading attachment", error);
    throw error;
  }
};

/**
 * Delete a file from Firebase Storage
 * @param {string} storagePath - The storage path of the file
 * @returns {Promise<void>}
 */
export const deleteAttachment = async (storagePath) => {
  // DEV MODE: Just log
  if (isDevMode) {
    logger.log("🔥 STORAGE [DEV MODE]: Mock delete", storagePath);
    return;
  }

  try {
    logger.log(`🔥 STORAGE: Deleting file at ${storagePath}...`);
    const storageRef = ref(storage, storagePath);
    await deleteObject(storageRef);
    logger.log(`🔥 STORAGE: File deleted successfully`);
  } catch (error) {
    logger.error("🔥 STORAGE: Error deleting attachment", error);
    throw error;
  }
};

/**
 * Upload multiple files
 * @param {File[]} files - Array of files to upload
 * @param {string} ticketId - The ticket ID
 * @param {function} onProgress - Progress callback for each file (optional)
 * @returns {Promise<Object[]>} - Array of attachment objects
 */
export const uploadMultipleAttachments = async (
  files,
  ticketId,
  onProgress = null,
) => {
  const uploadPromises = files.map((file, index) => {
    const fileProgressCallback = onProgress
      ? (progress) => onProgress(index, progress)
      : null;
    return uploadAttachment(file, ticketId, fileProgressCallback);
  });

  return Promise.all(uploadPromises);
};
