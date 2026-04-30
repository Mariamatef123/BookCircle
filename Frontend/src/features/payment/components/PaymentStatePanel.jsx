import styles from "../styles/paymentStyles";

export default function PaymentStatePanel({ icon, text, isError, actionLabel, onAction }) {
  return (
    <div style={styles.page}>
      <div style={styles.stateWrap}>
        <span style={styles.stateIcon}>{icon}</span>
        <p style={isError ? styles.errorText : {}}>{text}</p>
        {actionLabel && (
          <button type="button" style={styles.stateBtn} onClick={onAction}>
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
}