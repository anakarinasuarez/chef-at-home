"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface Notification {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}

interface NotificationContextType {
  notifications: Notification[];
  showNotification: (
    message: string,
    type: "success" | "error" | "info"
  ) => void;
  removeNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export function useNotification() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }
  return context;
}

interface NotificationProviderProps {
  children: ReactNode;
}

export function NotificationProvider({ children }: NotificationProviderProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const showNotification = (
    message: string,
    type: "success" | "error" | "info"
  ) => {
    const id = Date.now().toString();
    const newNotification: Notification = { id, message, type };

    setNotifications((prev) => [...prev, newNotification]);

    // Auto-remove after 3 seconds
    setTimeout(() => {
      removeNotification(id);
    }, 3000);
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id)
    );
  };

  const value: NotificationContextType = {
    notifications,
    showNotification,
    removeNotification,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      {/* Render notifications */}
      <div className="fixed top-20 right-4 z-50 space-y-2">
        {notifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onRemove={removeNotification}
          />
        ))}
      </div>
    </NotificationContext.Provider>
  );
}

// Componente interno para renderizar cada notificación
function NotificationItem({
  notification,
  onRemove,
}: {
  notification: Notification;
  onRemove: (id: string) => void;
}) {
  const getBackgroundColor = () => {
    switch (notification.type) {
      case "success":
        return "#10B981"; // green-500
      case "error":
        return "#EF4444"; // red-500
      case "info":
        return "#3B82F6"; // blue-500
      default:
        return "#10B981";
    }
  };

  const getIcon = () => {
    switch (notification.type) {
      case "success":
        return "✓";
      case "error":
        return "✕";
      case "info":
        return "ℹ";
      default:
        return "✓";
    }
  };

  return (
    <div
      className="px-6 py-3 rounded-lg shadow-lg transition-all duration-300 flex items-center gap-3 text-white"
      style={{
        backgroundColor: getBackgroundColor(),
      }}
    >
      <span className="text-lg">{getIcon()}</span>
      <span className="text-sm font-medium">{notification.message}</span>
      <button
        onClick={() => onRemove(notification.id)}
        className="ml-2 text-white hover:text-gray-200 transition-colors"
      >
        ×
      </button>
    </div>
  );
}
