import styles from "../styles/requestStyles";
import { InboxIcon } from "../../../components/icons/AppIcons";

export default function RequestsEmpty() {
  return (
    <div style={styles.emptyWrap}>
      <div style={styles.emptyIcon}>
        <InboxIcon size={48} />
      </div>
      <p style={styles.emptyText}>No borrow requests yet</p>
      <p style={styles.emptySubText}>Your borrow requests will appear here.</p>
    </div>
  );
}
