import styles from "../styles/notificationStyles";
import { BellIcon } from "../../../components/icons/AppIcons";

export default function NotificationsEmpty() {
  return (
    <div style={styles.emptyWrap}>
      <div style={styles.emptyIcon}>
        <BellIcon size={52} />
      </div>
      <p style={styles.emptyText}>No notifications yet</p>
      <p style={styles.emptySubText}>We'll let you know when something happens.</p>
    </div>
  );
}
