"use client";

import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from "lucide-react";
import { ToastItem } from "./DialogContext";

interface ToastContainerProps {
  toasts: ToastItem[];
  onRemove: (id: string) => void;
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[110] flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((toast) => {
        const icon = {
          success: <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />,
          error: <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />,
          warning: <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />,
          info: <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />,
        }[toast.type];

        const borderColor = {
          success: "border-emerald-500/40 bg-zinc-950/95 shadow-emerald-950/20",
          error: "border-rose-500/40 bg-zinc-950/95 shadow-rose-950/20",
          warning: "border-amber-500/40 bg-zinc-950/95 shadow-amber-950/20",
          info: "border-blue-500/40 bg-zinc-950/95 shadow-blue-950/20",
        }[toast.type];

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-2.5 p-3 rounded-xl border ${borderColor} shadow-xl backdrop-blur-md text-white animate-in slide-in-from-bottom-2 duration-200 transition-all`}
          >
            {icon}
            <p className="text-xs text-zinc-200 leading-snug flex-1 select-none">
              {toast.message}
            </p>
            <button
              type="button"
              onClick={() => onRemove(toast.id)}
              className="p-0.5 rounded text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
