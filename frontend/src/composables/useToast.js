import { reactive } from 'vue';

const state = reactive({
  toasts: [],
});

let toastId = 0;

export const toastState = {
  toasts: state.toasts,

  addToast(message, type = 'info', duration = 3000) {
    const id = ++toastId;
    const toast = { id, message, type };

    state.toasts.push(toast);

    // Auto-remove after duration
    if (duration > 0) {
      setTimeout(() => {
        this.removeToast(id);
      }, duration);
    }

    return id;
  },

  removeToast(id) {
    const index = state.toasts.findIndex(t => t.id === id);
    if (index > -1) {
      state.toasts.splice(index, 1);
    }
  },

  clear() {
    state.toasts = [];
  },
};

export const useToast = () => {
  return {
    success: (message, duration) => toastState.addToast(message, 'success', duration),
    error: (message, duration) => toastState.addToast(message, 'error', duration),
    info: (message, duration) => toastState.addToast(message, 'info', duration),
    warning: (message, duration) => toastState.addToast(message, 'warning', duration),
    removeToast: (id) => toastState.removeToast(id),
    clear: () => toastState.clear(),
  };
};
