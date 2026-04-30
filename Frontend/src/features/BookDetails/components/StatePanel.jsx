import styles from "../styles/bookDetailsStyles";

export default function StatePanel({ text, isError = false, actionLabel, onAction }) {
  return (
    <div style={styles.page}>
      <div style={styles.statePanel}>
        <p style={{ ...styles.stateText, color: isError ? "#dc2626" : "#374151" }}>{text}</p>
        {actionLabel && (
          <button type="button" style={styles.primaryButton} onClick={onAction}>{actionLabel}</button>
        )}
      </div>
    </div>
  );
}