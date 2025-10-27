import { createApp } from "vue";
import { createPinia } from "pinia";
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
  console.log("💾 IndexedDB available at window.__db");
  console.log("🔄 Migration service available at window.__migration");
}

// Migrate data from localStorage before mounting
console.log("🔄 Checking for data migration...");

MigrationService.migrateFromLocalStorage()
  .then((result) => {
    console.log("📊 Migration result:", result);

    if (result.success && result.affectedItems > 0) {
      console.log(
        `✅ Migrated ${result.affectedItems} items from localStorage to IndexedDB`,
      );
    } else if (result.success) {
      console.log(
        "ℹ️ No migration needed (already migrated or no legacy data)",
      );
    }

    // Mount app after migration
    app.mount("#app");

    // Initialize search indexer
    initializeSearchIndexer();

    console.log("✅ App mounted successfully");
  })
  .catch((error) => {
    console.error("❌ Migration error:", error);

    // Mount app anyway (graceful degradation)
    app.mount("#app");
    initializeSearchIndexer();
  });
