import styles from "../styles/requestStyles";

export default function RequestsEmpty() {
  return (
    <div style={styles.emptyWrap}>
      <div style={styles.emptyIcon}>📭</div>
      <p style={styles.emptyText}>No borrow requests yet</p>
      <p style={styles.emptySubText}>Your borrow requests will appear here.</p>
    </div>
  );
}