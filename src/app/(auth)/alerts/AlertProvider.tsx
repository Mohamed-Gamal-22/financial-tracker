"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { AlertToast, type AlertItem } from "./Alert";

type AlertPayload = {
  message: string;
  success: boolean;
  status?: number;
};

type AlertContextValue = {
  showAlert: (payload: AlertPayload) => void;
  dismissAlert: (id: string) => void;
};

const AlertContext = createContext<AlertContextValue | null>(null);

let alertId = 0;

export function AlertProvider({ children }: { children: React.ReactNode }) {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);

  const dismissAlert = useCallback((id: string) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
  }, []);

  const showAlert = useCallback((payload: AlertPayload) => {
    const id = `alert-${++alertId}`;
    setAlerts((prev) => [
      ...prev,
      {
        id,
        message: payload.message,
        success: payload.success,
        status: payload.status,
      },
    ]);
  }, []);

  const value = useMemo(
    () => ({ showAlert, dismissAlert }),
    [showAlert, dismissAlert],
  );

  return (
    <AlertContext.Provider value={value}>
      {children}
      <div
        className="pointer-events-none fixed inset-x-0 top-4 z-[100] flex flex-col items-center gap-2 px-4 sm:items-end sm:px-6"
        aria-live="polite"
      >
        {alerts.map((alert) => (
          <AlertToast key={alert.id} alert={alert} onDismiss={dismissAlert} />
        ))}
      </div>
    </AlertContext.Provider>
  );
}

export function useAlert() {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error("useAlert must be used within AlertProvider");
  }
  return context;
}
