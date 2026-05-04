'use client';

import { useEffect } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Info, 
  X 
} from 'lucide-react';
import { useToast, Toast } from '@/hooks/useToast';

const toastConfig = {
  success: {
    icon: CheckCircle,
    bg: 'bg-green-500/10 border-green-500/20',
    text: 'text-green-400',
    iconBg: 'bg-green-500/20',
  },
  error: {
    icon: XCircle,
    bg: 'bg-red-500/10 border-red-500/20',
    text: 'text-red-400',
    iconBg: 'bg-red-500/20',
  },
  warning: {
    icon: AlertTriangle,
    bg: 'bg-yellow-500/10 border-yellow-500/20',
    text: 'text-yellow-400',
    iconBg: 'bg-yellow-500/20',
  },
  info: {
    icon: Info,
    bg: 'bg-blue-500/10 border-blue-500/20',
    text: 'text-blue-400',
    iconBg: 'bg-blue-500/20',
  },
};

function ToastItem({ 
  toast, 
  onRemove 
}: { 
  toast: Toast; 
  onRemove: () => void;
}) {
  const config = toastConfig[toast.type as keyof typeof toastConfig];
  const Icon = config.icon;

  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove();
    }, toast.duration || 4000);

    return () => clearTimeout(timer);
  }, [toast.duration, onRemove]);

  return (
    <div 
      className={`flex items-start gap-3 p-4 rounded-xl border backdrop-blur-xl animate-slide-up ${config.bg}`}
      style={{ 
        animation: 'slideUp 0.3s ease-out',
      }}
    >
      <div className={`p-1.5 rounded-lg ${config.iconBg}`}>
        <Icon className={`w-4 h-4 ${config.text}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium ${config.text}`}>
          {toast.message}
        </p>
        {toast.description && (
          <p className="text-sm text-slate-400 mt-0.5">
            {toast.description}
          </p>
        )}
      </div>
      <button
        onClick={onRemove}
        className="p-1 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800/50 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

export function ToastContainer() {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[200] flex flex-col gap-2 w-full max-w-sm">
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          toast={toast}
          onRemove={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
}

// Exportar o hook também
export { useToast };
