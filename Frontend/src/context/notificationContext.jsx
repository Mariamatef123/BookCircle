import { createContext, useContext } from "react";
import useNotifications from "../features/notifications/hooks/useNotifications";

const NotificationsContext = createContext(null);

export function NotificationsProvider({ children }) {
  const value = useNotifications(); // single shared instance
  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useNotificationsContext() {
  const ctx = useContext(NotificationsContext);
  if (!ctx) {
    throw new Error(
      "useNotificationsContext must be used inside <NotificationsProvider>"
    );
  }
  return ctx;
}