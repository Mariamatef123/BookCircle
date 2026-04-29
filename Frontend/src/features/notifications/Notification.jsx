import useNotifications   from "./hooks/useNotifications";
import NotificationCard   from "./components/NotificationCard";
import NotificationsEmpty from "./components/NotificationsEmpty";
import styles             from "./styles/notificationStyles";

export default function Notification() {
  const {
    notifications, loading, error,
    unreadCount, handleClick, markAllRead,
  } = useNotifications();

  // ── Loading ───────────────────────────────────────────────────
  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.stateWrap}>
          <span style={styles.stateIcon}>⏳</span>
          <p>Loading notifications...</p>
        </div>
      </div>
    );
  }

  // ── Error ─────────────────────────────────────────────────────
  if (error) {
    return (
      <div style={styles.page}>
        <div style={styles.stateWrap}>
          <span style={styles.stateIcon}></span>
          <p style={styles.errorText}>{error}</p>
        </div>
      </div>
    );
  }

  // ── Page ──────────────────────────────────────────────────────
  return (
    <div style={styles.page}>
      <div style={styles.surface}>

        {/* Header */}
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

        {/* List */}
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