import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

export type ToastType = 'success' | 'error';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
  exiting?: boolean;
}

interface ToastContextType {
  toasts: Toast[];
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, message, type }]);

    // Start exit animation after 3.5s
    setTimeout(() => {
      setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, exiting: true } : t)));
    }, 3500);

    // Remove after 4s
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, showToast }}>
      {children}
      {/* Toast container */}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`
              pointer-events-auto min-w-[280px] max-w-[400px] px-5 py-4 rounded-xl
              font-body text-sm font-medium flex items-center gap-3 shadow-card
              ${toast.exiting ? 'toast-exit' : 'toast-enter'}
              ${
                toast.type === 'success'
                  ? 'bg-secondary-container text-on-secondary-container'
                  : 'bg-error-container text-on-error-container'
              }
            `}
          >
            <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
              {toast.type === 'success' ? 'check_circle' : 'error'}
            </span>
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextType {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
