"use client";

import { useEffect } from "react";
import { AlertTriangle, AlertCircle, Info, CheckCircle2, X } from "lucide-react";
import { DialogVariant } from "./DialogContext";
import { Portal } from "./Portal";

interface ConfirmDialogProps {
  isOpen: boolean;
  isAlert?: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: DialogVariant;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  isOpen,
  isAlert = false,
  title,
  message,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  variant = "danger",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onCancel();
      } else if (e.key === "Enter" && !e.shiftKey) {
        onConfirm();
      }
    }
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen, onConfirm, onCancel]);

  if (!isOpen) return null;

  const variantStyles = {
    danger: {
      icon: <AlertTriangle className="w-5 h-5 text-rose-400" />,
      iconBg: "bg-rose-950/80 border-rose-800/50",
      confirmBtn: "bg-rose-600 hover:bg-rose-500 text-white shadow-rose-900/20",
    },
    warning: {
      icon: <AlertCircle className="w-5 h-5 text-amber-400" />,
      iconBg: "bg-amber-950/80 border-amber-800/50",
      confirmBtn: "bg-amber-600 hover:bg-amber-500 text-white shadow-amber-900/20",
    },
    info: {
      icon: <Info className="w-5 h-5 text-blue-400" />,
      iconBg: "bg-blue-950/80 border-blue-800/50",
      confirmBtn: "bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/20",
    },
    success: {
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
      iconBg: "bg-emerald-950/80 border-emerald-800/50",
      confirmBtn: "bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/20",
    },
  }[variant];

  return (
    <Portal>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-md bg-[#14161A] border border-[#23272F] rounded-2xl shadow-2xl p-5 text-white space-y-4 animate-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl border ${variantStyles.iconBg}`}>
              {variantStyles.icon}
            </div>
            <h3 className="font-bold text-base text-zinc-100">{title}</h3>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-zinc-300 leading-relaxed whitespace-pre-line pl-1">
          {message}
        </p>

        <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-[#23272F]">
          {!isAlert && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 rounded-xl bg-[#0B0C0E] hover:bg-[#1A1D24] text-zinc-300 hover:text-white text-xs font-semibold border border-[#23272F] transition-colors cursor-pointer"
            >
              {cancelText}
            </button>
          )}
          <button
            type="button"
            autoFocus
            onClick={onConfirm}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer ${variantStyles.confirmBtn}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
    </Portal>
  );
}
