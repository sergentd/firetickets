<template>
  <div class="migration-container">
    <div class="migration-header">
      <h1>🔄 Ticket Recreation</h1>
      <p class="description">
        This tool recreates old tickets with the correct structure
        (comments, activities, attachments arrays).
      </p>
    </div>

    <div class="status-card" v-if="statusData">
      <h2>Current Status</h2>
      <div class="status-grid">
        <div class="status-item">
          <div class="status-label">Total Tickets</div>
          <div class="status-value">{{ statusData.total }}</div>
        </div>
        <div class="status-item success">
          <div class="status-label">Recent Tickets (< 24h)</div>
          <div class="status-value">{{ statusData.newStructure }}</div>
        </div>
        <div class="status-item warning">
          <div class="status-label">Old Tickets (to recreate)</div>
          <div class="status-value">{{ statusData.oldStructure }}</div>
        </div>
      </div>
    </div>

    <div class="actions-card">
      <h2>Actions</h2>
      <div class="button-group">
        <button
          @click="checkStructure"
          :disabled="loading"
          class="btn btn-secondary"
        >
          <IconSystem name="search" />
          {{ loading && currentAction === 'check' ? 'Checking...' : 'Check Structure' }}
        </button>

        <button
          @click="runRecreation"
          :disabled="loading || (statusData && statusData.oldStructure === 0)"
          class="btn btn-primary"
        >
          <IconSystem name="refresh" />
          {{ loading && currentAction === 'recreate' ? 'Recreating...' : 'Recreate Old Tickets' }}
        </button>

        <button
          v-if="recreationResult && recreationResult.recreatedTickets && recreationResult.recreatedTickets.length > 0"
          @click="deleteOldTickets"
          :disabled="loading"
          class="btn btn-danger"
        >
          <IconSystem name="trash" />
          {{ loading && currentAction === 'delete' ? 'Deleting...' : 'Delete Old Tickets' }}
        </button>
      </div>

      <p class="help-text" v-if="statusData && statusData.oldStructure === 0">
        ✅ No old tickets to recreate (all tickets are recent)!
      </p>
    </div>

    <div class="results-card" v-if="migrationResult">
      <h2>Migration Results</h2>
      <div class="result-grid">
        <div class="result-item">
          <div class="result-label">Total Processed</div>
          <div class="result-value">{{ migrationResult.total }}</div>
        </div>
        <div class="result-item success">
          <div class="result-label">Successfully Migrated</div>
          <div class="result-value">{{ migrationResult.migrated }}</div>
        </div>
        <div class="result-item">
          <div class="result-label">Already Migrated</div>
          <div class="result-value">{{ migrationResult.alreadyMigrated }}</div>
        </div>
        <div class="result-item" :class="migrationResult.errors.length > 0 ? 'error' : ''">
          <div class="result-label">Errors</div>
          <div class="result-value">{{ migrationResult.errors.length }}</div>
        </div>
      </div>

      <div v-if="migrationResult.errors.length > 0" class="error-details">
        <h3>Errors:</h3>
        <ul>
          <li v-for="error in migrationResult.errors" :key="error.ticketId">
            <strong>{{ error.ticketId }}:</strong> {{ error.error }}
          </li>
        </ul>
      </div>

      <div v-if="migrationResult.success" class="success-message">
        ✅ Migration completed successfully!
      </div>
    </div>

    <div class="info-card">
      <h2>ℹ️ Information</h2>
      <ul>
        <li><strong>Step 1:</strong> Click "Recreate Old Tickets" to create fresh copies with correct structure.</li>
        <li><strong>Step 2:</strong> After recreation, a "Delete Old Tickets" button will appear.</li>
        <li><strong>Step 3:</strong> Delete old tickets to complete the process.</li>
        <li><strong>Safe:</strong> Old tickets remain until you explicitly delete them.</li>
        <li><strong>User Scope:</strong> Only your tickets are affected.</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { checkTicketStructures, recreateUserTickets, deleteOldTickets as deleteOldTicketsService } from '@/services/recreateTickets';
import { useToast } from '@/composables/useToast';
import IconSystem from '@/components/ui/IconSystem.vue';

const toast = useToast();

const loading = ref(false);
const currentAction = ref(null);
const statusData = ref(null);
const migrationResult = ref(null);
const recreationResult = ref(null);

const checkStructure = async () => {
  loading.value = true;
  currentAction.value = 'check';
  migrationResult.value = null;
  recreationResult.value = null;

  try {
    const result = await checkTicketStructures();
    statusData.value = result;
    toast.info(`Checked ${result.total} tickets`);
  } catch (error) {
    console.error('Error checking structure:', error);
    toast.error('Failed to check ticket structure: ' + error.message);
  } finally {
    loading.value = false;
    currentAction.value = null;
  }
};

const runRecreation = async () => {
  loading.value = true;
  currentAction.value = 'recreate';

  try {
    const result = await recreateUserTickets();
    recreationResult.value = result;
    migrationResult.value = {
      total: result.total,
      migrated: result.recreated,
      alreadyMigrated: result.skipped,
      errors: result.errors,
      success: result.success,
    };

    // Refresh status after recreation
    await checkStructure();

    if (result.success) {
      toast.success(`Successfully recreated ${result.recreated} tickets!`);
    } else {
      toast.warning(`Recreation completed with ${result.errors.length} errors`);
    }
  } catch (error) {
    console.error('Error running recreation:', error);
    toast.error('Recreation failed: ' + error.message);
  } finally {
    loading.value = false;
    currentAction.value = null;
  }
};

const deleteOldTickets = async () => {
  if (!recreationResult.value || !recreationResult.value.recreatedTickets) {
    toast.error('No old tickets to delete');
    return;
  }

  const confirmed = confirm(`Are you sure you want to delete ${recreationResult.value.recreatedTickets.length} old tickets? This is irreversible!`);
  if (!confirmed) {
    return;
  }

  loading.value = true;
  currentAction.value = 'delete';

  try {
    const oldIds = recreationResult.value.recreatedTickets.map(t => t.oldId);
    const result = await deleteOldTicketsService(oldIds);

    if (result.success) {
      toast.success(`Successfully deleted ${result.deleted} old tickets!`);
      recreationResult.value = null;
      await checkStructure();
    } else {
      toast.warning(`Deletion completed with ${result.errors.length} errors`);
    }
  } catch (error) {
    console.error('Error deleting old tickets:', error);
    toast.error('Deletion failed: ' + error.message);
  } finally {
    loading.value = false;
    currentAction.value = null;
  }
};

// Auto-check on mount
checkStructure();
</script>

<style scoped>
.migration-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
}

.migration-header {
  text-align: center;
  margin-bottom: 2rem;
}

.migration-header h1 {
  font-size: 2rem;
  margin-bottom: 0.5rem;
  color: var(--text-primary);
}

.description {
  color: var(--text-secondary);
  font-size: 1rem;
}

.status-card,
.actions-card,
.results-card,
.info-card {
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  backdrop-filter: blur(10px);
}

.status-card h2,
.actions-card h2,
.results-card h2,
.info-card h2 {
  font-size: 1.25rem;
  margin-bottom: 1rem;
  color: var(--text-primary);
}

.status-grid,
.result-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
}

.status-item,
.result-item {
  background: var(--bg-primary);
  border: 1px solid var(--glass-border);
  border-radius: 8px;
  padding: 1rem;
  text-align: center;
}

.status-item.success,
.result-item.success {
  border-color: var(--success-green);
}

.status-item.warning,
.result-item.warning {
  border-color: #f59e0b;
}

.status-item.error,
.result-item.error {
  border-color: #ef4444;
}

.status-label,
.result-label {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
}

.status-value,
.result-value {
  font-size: 2rem;
  font-weight: bold;
  color: var(--accent-electric-blue);
}

.button-group {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-primary {
  background: var(--accent-electric-blue);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  opacity: 0.9;
  transform: translateY(-1px);
}

.btn-secondary {
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  color: var(--text-primary);
}

.btn-secondary:hover:not(:disabled) {
  background: var(--bg-secondary);
}

.btn-danger {
  background: #ef4444;
  color: white;
}

.btn-danger:hover:not(:disabled) {
  background: #dc2626;
  transform: translateY(-1px);
}

.help-text {
  margin-top: 1rem;
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.error-details {
  margin-top: 1.5rem;
  padding: 1rem;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid #ef4444;
  border-radius: 8px;
}

.error-details h3 {
  color: #ef4444;
  margin-bottom: 0.5rem;
}

.error-details ul {
  list-style: none;
  padding: 0;
}

.error-details li {
  padding: 0.25rem 0;
  color: var(--text-secondary);
}

.success-message {
  margin-top: 1.5rem;
  padding: 1rem;
  background: rgba(52, 211, 153, 0.1);
  border: 1px solid var(--success-green);
  border-radius: 8px;
  color: var(--success-green);
  text-align: center;
  font-weight: 500;
}

.info-card ul {
  list-style: none;
  padding: 0;
}

.info-card li {
  padding: 0.5rem 0;
  color: var(--text-secondary);
  display: flex;
  align-items: flex-start;
}

.info-card li strong {
  color: var(--accent-electric-blue);
  margin-right: 0.5rem;
  min-width: 140px;
}
</style>
