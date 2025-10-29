import { createApp } from "vue";
import { createPinia } from "pinia";
import logger from "@/utils/logger";
import router from "./router";
import App from "./App.vue";
import "./style.css";
import { initializeSearchIndexer } from "./boot/search-indexer";
import { createPersistedState } from "./plugins/pinia-indexeddb.ts";
import { MigrationService } from "./services/persistence/MigrationService.ts";
import { db } from "./db/index.ts";

// Create app
const app = createApp(App);

// Setup Pinia with persistence plugin
const pinia = createPinia();
pinia.use(createPersistedState());

app.use(pinia);
app.use(router);

// Make db available globally for debugging
if (import.meta.env.DEV) {
  window.__db = db;
  window.__migration = MigrationService;
}

// ALWAYS make cleanup functions available (for production fixes)
import('./services/cleanupTickets').then((module) => {
  window.deleteOldTickets = module.deleteOldTickets;
  window.deleteAllTickets = module.deleteAllTickets;
  logger.log('🧹 Cleanup functions available: deleteOldTickets(hours), deleteAllTickets()');
});

// Migrate data from localStorage before mounting
logger.log("🔄 Checking for data migration...");

MigrationService.migrateFromLocalStorage()
  .then((result) => {
    logger.log("📊 Migration result:", result);

    if (result.success && result.affectedItems > 0) {
      logger.log(
        `✅ Migrated ${result.affectedItems} items from localStorage to IndexedDB`,
      );
    } else if (result.success) {
      logger.log(
        "ℹ️ No migration needed (already migrated or no legacy data)",
      );
    }

    // Mount app after migration
    app.mount("#app");

    // Initialize search indexer
    initializeSearchIndexer();

    logger.log("✅ App mounted successfully");
  })
  .catch((error) => {
    logger.error("❌ Migration error:", error);

    // Mount app anyway (graceful degradation)
    app.mount("#app");
    initializeSearchIndexer();
  });
