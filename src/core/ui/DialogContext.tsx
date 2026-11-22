"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { ConfirmDialog } from "./ConfirmDialog";
import { ToastContainer } from "./ToastContainer";

export type DialogVariant = "danger" | "warning" | "info" | "success";

export interface ConfirmOptions {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: DialogVariant;
}

export interface AlertOptions {
  title?: string;
  message: string;
  buttonText?: string;
  variant?: DialogVariant;
}

export interface ToastItem {
  id: string;
  message: string;
  type: "success" | "error" | "info" | "warning";
}

interface DialogContextValue {
  confirm: (options: ConfirmOptions | string) => Promise<boolean>;
  alert: (options: AlertOptions | string) => Promise<void>;
  toast: {
    success: (msg: string) => void;
    error: (msg: string) => void;
    info: (msg: string) => void;
    warning: (msg: string) => void;
  };
}

const DialogContext = createContext<DialogContextValue | null>(null);

export function DialogProvider({ children }: { children: ReactNode }) {
  const [dialog, setDialog] = useState<{
    isOpen: boolean;
    isAlert: boolean;
    title: string;
    message: string;
    confirmText: string;
    cancelText: string;
    variant: DialogVariant;
    resolve: (val: boolean) => void;
  } | null>(null);

  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const confirm = useCallback((opts: ConfirmOptions | string): Promise<boolean> => {
    const options: ConfirmOptions = typeof opts === "string" ? { message: opts } : opts;
    return new Promise((resolve) => {
      setDialog({
        isOpen: true,
        isAlert: false,
        title: options.title || "Confirmar Ação",
        message: options.message,
        confirmText: options.confirmText || "Confirmar",
        cancelText: options.cancelText || "Cancelar",
        variant: options.variant || "danger",
        resolve,
      });
    });
  }, []);

  const alert = useCallback((opts: AlertOptions | string): Promise<void> => {
    const options: AlertOptions = typeof opts === "string" ? { message: opts } : opts;
    return new Promise((resolve) => {
      setDialog({
        isOpen: true,
        isAlert: true,
        title: options.title || "Aviso",
        message: options.message,
        confirmText: options.buttonText || "Entendido",
        cancelText: "",
        variant: options.variant || "info",
        resolve: () => resolve(),
      });
    });
  }, []);

  const addToast = useCallback((message: string, type: ToastItem["type"]) => {
    const id = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3800);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = {
    success: useCallback((msg: string) => addToast(msg, "success"), [addToast]),
    error: useCallback((msg: string) => addToast(msg, "error"), [addToast]),
    info: useCallback((msg: string) => addToast(msg, "info"), [addToast]),
    warning: useCallback((msg: string) => addToast(msg, "warning"), [addToast]),
  };

  const handleClose = (result: boolean) => {
    if (dialog) {
      dialog.resolve(result);
      setDialog(null);
    }
  };

  return (
    <DialogContext.Provider value={{ confirm, alert, toast }}>
      {children}
      {dialog?.isOpen && (
        <ConfirmDialog
          isOpen={dialog.isOpen}
          isAlert={dialog.isAlert}
          title={dialog.title}
          message={dialog.message}
          confirmText={dialog.confirmText}
          cancelText={dialog.cancelText}
          variant={dialog.variant}
          onConfirm={() => handleClose(true)}
          onCancel={() => handleClose(false)}
        />
      )}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </DialogContext.Provider>
  );
}

export function useDialog(): DialogContextValue {
  const ctx = useContext(DialogContext);
  if (!ctx) {
    throw new Error("useDialog deve ser usado dentro de um DialogProvider");
  }
  return ctx;
}
