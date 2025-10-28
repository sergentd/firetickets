<template>
  <Teleport to="body">
    <div class="toast-container">
      <TransitionGroup name="toast">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          :class="['toast', `toast-${toast.type}`]"
        >
          <div class="toast-icon">
            <IconSystem :name="getIcon(toast.type)" size="sm" />
          </div>
          <div class="toast-content">
            <p class="toast-message">{{ toast.message }}</p>
          </div>
          <button @click="removeToast(toast.id)" class="toast-close">
            <IconSystem name="x" size="sm" />
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup>
import { toastState } from '@/composables/useToast';
import IconSystem from './IconSystem.vue';

const { toasts, removeToast } = toastState;

const getIcon = (type) => {
  const icons = {
    success: 'check-circle',
    error: 'alert',
    info: 'lightbulb',
    warning: 'alert',
  };
  return icons[type] || 'lightbulb';
};
</script>

<style scoped>
.toast-container {
  position: fixed;
  top: 24px;
  right: 24px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 12px;
  pointer-events: none;
}

.toast {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 320px;
  max-width: 480px;
  padding: 16px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-lg);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4),
              0 0 0 1px rgba(255, 255, 255, 0.1) inset;
  backdrop-filter: blur(12px);
  pointer-events: auto;
  transition: all 0.3s ease;
}

.toast:hover {
  transform: translateX(-4px);
  box-shadow: 0 12px 48px rgba(0, 0, 0, 0.5),
              0 0 0 1px rgba(255, 255, 255, 0.15) inset;
}

/* Toast Types */
.toast-success {
  border-left: 4px solid var(--success-green);
}

.toast-success .toast-icon {
  color: var(--success-green);
}

.toast-error {
  border-left: 4px solid var(--accent-red);
}

.toast-error .toast-icon {
  color: var(--accent-red);
}

.toast-info {
  border-left: 4px solid var(--electric-blue);
}

.toast-info .toast-icon {
  color: var(--electric-blue);
}

.toast-warning {
  border-left: 4px solid #f59e0b;
}

.toast-warning .toast-icon {
  color: #f59e0b;
}

.toast-icon {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.toast-content {
  flex: 1;
  min-width: 0;
}

.toast-message {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
  line-height: 1.5;
  margin: 0;
}

.toast-close {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-tertiary);
  border-radius: var(--radius-md);
  transition: all 0.2s;
}

.toast-close:hover {
  background: rgba(255, 255, 255, 0.1);
  color: var(--text-primary);
}

/* Animations */
.toast-enter-active {
  animation: toast-slide-in 0.3s ease;
}

.toast-leave-active {
  animation: toast-slide-out 0.3s ease;
}

@keyframes toast-slide-in {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes toast-slide-out {
  from {
    transform: translateX(0) scale(1);
    opacity: 1;
  }
  to {
    transform: translateX(100%) scale(0.9);
    opacity: 0;
  }
}

/* Progress bar */
.toast::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  height: 2px;
  background: linear-gradient(
    90deg,
    var(--electric-blue) 0%,
    var(--electric-blue-light) 100%
  );
  animation: toast-progress 3s linear;
}

.toast-success::after {
  background: linear-gradient(
    90deg,
    var(--success-green) 0%,
    #4ade80 100%
  );
}

.toast-error::after {
  background: linear-gradient(
    90deg,
    var(--accent-red) 0%,
    #f87171 100%
  );
}

@keyframes toast-progress {
  from {
    width: 100%;
  }
  to {
    width: 0%;
  }
}

/* Responsive */
@media (max-width: 640px) {
  .toast-container {
    top: 16px;
    right: 16px;
    left: 16px;
  }

  .toast {
    min-width: auto;
    max-width: 100%;
  }
}
</style>
