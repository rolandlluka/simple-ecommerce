import { useEffect, useState } from 'react';
import { Toast, ToastDescription, ToastTitle } from '@/components/ui/toast';
import { CheckCircle2 } from 'lucide-react';

interface ToastMessage {
  id: string;
  message: string;
  type?: 'success' | 'error';
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const handleShowToast = (event: Event) => {
      const customEvent = event as CustomEvent<{ message: string; type?: 'success' | 'error' }>;
      const newToast: ToastMessage = {
        id: Date.now().toString(),
        message: customEvent.detail.message,
        type: customEvent.detail.type || 'success',
      };
      
      setToasts((prev) => [...prev, newToast]);

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
      }, 3000);
    };

    window.addEventListener('show-toast', handleShowToast);

    return () => {
      window.removeEventListener('show-toast', handleShowToast);
    };
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 w-full max-w-sm pointer-events-none">
      {toasts.map((toast, index) => (
        <div
          key={toast.id}
          className="pointer-events-auto animate-in fade-in slide-in-from-top-2 duration-300"
          style={{
            animationDelay: `${index * 50}ms`,
          }}
        >
          <Toast
            variant={toast.type === 'error' ? 'destructive' : 'success'}
            onClose={() => removeToast(toast.id)}
          >
            <div className="flex items-start gap-3">
              {toast.type === 'success' && (
                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
              )}
              <div className="flex-1">
                <ToastTitle>
                  {toast.type === 'success' ? 'Success' : 'Error'}
                </ToastTitle>
                <ToastDescription>{toast.message}</ToastDescription>
              </div>
            </div>
          </Toast>
        </div>
      ))}
    </div>
  );
}

export function showToast(message: string, type: 'success' | 'error' = 'success') {
  const event = new CustomEvent('show-toast', {
    detail: { message, type },
  });
  window.dispatchEvent(event);
}

