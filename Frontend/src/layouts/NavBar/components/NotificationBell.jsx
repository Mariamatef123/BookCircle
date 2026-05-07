import { useState, useRef, useEffect } from "react";
import { useNotificationsContext } from "../../../context/notificationContext";
import { getIsRead } from "../../../features/notifications/hooks/useNotifications";

function NotificationsBell({ navigate, user }) {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const notificationRef = useRef(null);
  const userId = user?.id;

  const {
    notifications,
    unreadCount,
    loading: notificationsLoading,
    handleClick: handleNotificationClick,
    refetch: fetchNotifications,
  } = useNotificationsContext();

  const unread = notifications.filter((n) => !getIsRead(n));

  useEffect(() => {
    const handleClickOutside = (e) => {
      const clickedOutsideNotifications =
        notificationRef.current && !notificationRef.current.contains(e.target);
      if (clickedOutsideNotifications) setNotificationsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNotificationToggle = async () => {
    if (!userId) {
      navigate("/login");
      return;
    }
    if (!notificationsOpen) {
      await fetchNotifications();
    }
    setNotificationsOpen((prev) => !prev);
  };

  return (
    <div ref={notificationRef} style={{ position: "relative" }}>
      <button type="button" style={notificationButtonStyle} onClick={handleNotificationToggle}>
        <svg width="22" height="22" fill="currentColor" className="bi bi-bell" viewBox="0 0 16 16">
          <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2" />
          <path d="M8 1.918l-.797.161A4 4 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4 4 0 0 0-3.203-3.92z" />
        </svg>
        {unreadCount > 0 && <span style={notificationBadgeStyle}>{unreadCount > 9 ? "9+" : unreadCount}</span>}
      </button>

      {notificationsOpen && (
        <div style={notificationPanelStyle}>
          <div style={notificationHeaderStyle}>
            <span>Notifications</span>
            {notificationsLoading && <span style={notificationSubtleStyle}>Loading...</span>}
          </div>

          {notificationsLoading ? (
            <div style={notificationStateStyle}>Loading notifications...</div>
          ) : unread.length === 0 ? (
            <div style={notificationStateStyle}>No notifications yet.</div>
          ) : (
            unread.map((notification) => (
              <button
                key={getNotificationId(notification)}
                type="button"
                style={{
                  ...notificationItemStyle,
                  background: "#eef2ff",
                }}
                onClick={() => handleNotificationClick(notification)}
              >
                <div style={{ minWidth: 0 }}>
                  <div style={notificationMessageStyle}>{getNotificationMessage(notification)}</div>
                  <div style={notificationTimeStyle}>
                    {formatNotificationTime(notification.createdAt || notification.CreatedAt)}
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}

// ─── Shared styles ────────────────────────────────────────────
const notificationButtonStyle = {
  border: "none",
  background: "transparent",
  cursor: "pointer",
  position: "relative",
  padding: 0,
  color: "#374151",
};
const notificationBadgeStyle = {
  position: "absolute",
  top: -6,
  right: -8,
  minWidth: 18,
  height: 18,
  borderRadius: 999,
  background: "#ef4444",
  color: "#fff",
  fontSize: 10,
  fontWeight: 700,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "0 5px",
};
const notificationPanelStyle = {
  position: "absolute",
  top: "calc(100% + 10px)",
  right: 0,
  width: 320,
  maxHeight: 360,
  overflowY: "auto",
  background: "#fff",
  border: "1px solid #E5E7EB",
  borderRadius: 14,
  boxShadow: "0 12px 30px rgba(0,0,0,0.12)",
  zIndex: 1100,
};
const notificationHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "12px 14px",
  borderBottom: "1px solid #F3F4F6",
  fontSize: 13,
  fontWeight: 700,
  color: "#111827",
};
const notificationSubtleStyle = {
  fontSize: 11,
  color: "#9CA3AF",
  fontWeight: 600,
};
const notificationStateStyle = {
  padding: "16px 14px",
  fontSize: 13,
  color: "#6B7280",
};
const notificationItemStyle = {
  width: "100%",
  border: "none",
  borderBottom: "1px solid #F3F4F6",
  textAlign: "left",
  padding: "12px 14px",
  cursor: "pointer",
};
const notificationMessageStyle = {
  fontSize: 13,
  color: "#111827",
  fontWeight: 600,
  lineHeight: 1.5,
};
const notificationTimeStyle = {
  marginTop: 4,
  fontSize: 11,
  color: "#9CA3AF",
};

// ─── Helper functions ─────────────────────────────────────────
function getNotificationId(notification) {
  return notification?.id ?? notification?.Id;
}

function getNotificationMessage(notification) {
  return notification?.message ?? notification?.Message ?? "New notification";
}

function formatNotificationTime(value) {
  if (!value) return "Just now";
  try {
    return new Date(value).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return "Just now";
  }
}

export default NotificationsBell;