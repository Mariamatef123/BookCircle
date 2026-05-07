import useNotifications   from "./hooks/useNotifications";
import NotificationCard   from "./components/NotificationCard";
import NotificationsEmpty from "./components/NotificationsEmpty";
import styles             from "./styles/notificationStyles";
import { AlertTriangleIcon, ClockIcon } from "../../components/icons/AppIcons";
import { useNotificationsContext } from "../../context/notificationContext";

export default function Notification() {
  const {
    notifications, loading, error,
    unreadCount, handleClick, markAllRead,
  } = useNotificationsContext();

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.stateWrap}>
          <span style={styles.stateIcon}><ClockIcon size={38} /></span>
          <p>Loading notifications...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.page}>
        <div style={styles.stateWrap}>
          <span style={styles.stateIcon}><AlertTriangleIcon size={38} /></span>
          <p style={styles.errorText}>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.surface}>


        <div style={styles.header}>
          <div>
            <h1 style={styles.h1}>Notifications</h1>
            <p style={styles.sub}>
              {unreadCount > 0
                ? `You have ${unreadCount} unread notification${unreadCount !== 1 ? "s" : ""}`
                : "You're all caught up!"}
            </p>
          </div>

          <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
            {notifications.length > 0 && (
              <span style={styles.countChip}>
                {notifications.length} total
              </span>
            )}
            {unreadCount > 0 && (
              <button
                type="button"
                style={styles.markAllBtn}
                onClick={markAllRead}
              >
                Mark all as read
              </button>
            )}
          </div>
        </div>

        {notifications.length === 0 ? (
          <NotificationsEmpty />
        ) : (
          <div style={styles.list}>
            {notifications.map((n) => (
              <NotificationCard
                key={n?.id ?? n?.Id}
                notification={n}
                onClick={handleClick}
              />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
