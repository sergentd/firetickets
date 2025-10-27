/**
 * Pinia IndexedDB Persistence Plugin
 *
 * Automatically persists Pinia store state to IndexedDB.
 * Provides selective persistence and async hydration during app initialization.
 */

import type { PiniaPluginContext } from "pinia";
import { watch } from "vue";
import { db } from "@/db";

export interface PersistOptions {
  /**
   * Collection name in IndexedDB (defaults to store.$id)
   */
  collection?: string;

  /**
   * Paths to persist (if undefined, persists entire state)
   * Example: ['todos', 'user.preferences']
   */
  paths?: string[];

  /**
   * Debounce delay in ms (default: 300ms)
   */
  debounce?: number;

  /**
   * Enable debug logging
   */
  debug?: boolean;
}

/**
 * Pinia plugin for IndexedDB persistence
 */
export function createPersistedState() {
  return ({ options, store }: PiniaPluginContext) => {
    // Check if store has persist option
    if (!options.persist) {
      return;
    }

    const persistOptions: PersistOptions =
      typeof options.persist === "boolean" ? {} : options.persist;

    const collection = persistOptions.collection || store.$id;
    const paths = persistOptions.paths;
    const debounceMs = persistOptions.debounce || 300;
    const debug = persistOptions.debug || false;

    let debounceTimer: ReturnType<typeof setTimeout> | null = null;

    // Helper: Get value from path
    const getValueFromPath = (obj: any, path: string) => {
      return path.split(".").reduce((acc, part) => acc?.[part], obj);
    };

    // Helper: Set value at path
    const setValueAtPath = (obj: any, path: string, value: any) => {
      const parts = path.split(".");
      const last = parts.pop()!;
      const target = parts.reduce((acc, part) => {
        if (!acc[part]) acc[part] = {};
        return acc[part];
      }, obj);
      target[last] = value;
    };

    // Get state to persist
    const getStateToPersist = () => {
      if (!paths || paths.length === 0) {
        return store.$state;
      }

      const partialState: any = {};
      paths.forEach((path) => {
        const value = getValueFromPath(store.$state, path);
        setValueAtPath(partialState, path, value);
      });
      return partialState;
    };

    // Save to IndexedDB (debounced)
    const saveToIndexedDB = () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }

      debounceTimer = setTimeout(async () => {
        try {
          const stateToPersist = getStateToPersist();

          // Add metadata
          const dataToSave = {
            key: collection,
            ...stateToPersist,
            updatedAt: new Date().toISOString(),
          };

          await db.preferences.put(dataToSave as any);

          if (debug) {
            console.log(
              `[Persist] Saved ${collection} to IndexedDB`,
              dataToSave,
            );
          }
        } catch (error) {
          console.error(`[Persist] Failed to save ${collection}:`, error);
        }
      }, debounceMs);
    };

    // Load from IndexedDB on initialization
    const loadFromIndexedDB = async () => {
      try {
        const data = await db.preferences.get(collection);

        if (data) {
          if (debug) {
            console.log(`[Persist] Loaded ${collection} from IndexedDB`, data);
          }

          // Remove metadata keys
          const { key, updatedAt, ...stateData } = data as any;

          if (paths && paths.length > 0) {
            // Restore only specified paths
            paths.forEach((path) => {
              const value = getValueFromPath(stateData, path);
              if (value !== undefined) {
                setValueAtPath(store.$state, path, value);
              }
            });
          } else {
            // Restore entire state
            store.$patch(stateData);
          }
        } else if (debug) {
          console.log(`[Persist] No existing data for ${collection}`);
        }
      } catch (error) {
        console.error(`[Persist] Failed to load ${collection}:`, error);
      }
    };

    // Watch for state changes
    watch(
      () => store.$state,
      () => {
        saveToIndexedDB();
      },
      { deep: true },
    );

    // Load initial state
    loadFromIndexedDB();

    // Expose hydration promise for stores that need to wait
    store.$hydrated = loadFromIndexedDB();
  };
}

// Augment Pinia types
declare module "pinia" {
  export interface DefineStoreOptionsBase<S, Store> {
    /**
     * Persist store state to IndexedDB
     */
    persist?: boolean | PersistOptions;
  }

  export interface PiniaCustomProperties {
    /**
     * Promise that resolves when store is hydrated from IndexedDB
     */
    $hydrated?: Promise<void>;
  }
}
