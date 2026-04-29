import styles from "../styles/bookDetailsStyles";

export default function BorrowModal({
  open, onClose,
  availabilityOptions, selectedAvailability, setSelectedAvailabilityKey,
  borrowing, onConfirm,
}) {
  if (!open) return null;
  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={styles.modalCard} onClick={(e) => e.stopPropagation()}>
        <div style={styles.modalHeader}>
          <h2 style={styles.modalTitle}>Choose Availability Date</h2>
          <button type="button" style={styles.closeButton} onClick={onClose}>x</button>
        </div>
        <div style={styles.optionList}>
          {availabilityOptions.map((option) => (
            <button
              key={option.key} type="button"
              style={{ ...styles.optionCard, ...(selectedAvailability?.key === option.key ? styles.optionCardActive : {}) }}
              onClick={() => setSelectedAvailabilityKey(option.key)}
            >
              <div>
                <p style={styles.optionTitle}>{option.label}</p>
                <p style={styles.optionMeta}>{option.rangeLabel || "Available to request"}</p>
              </div>
              <span style={styles.optionSelect}>
                {selectedAvailability?.key === option.key ? "Selected" : "Select"}
              </span>
            </button>
          ))}
        </div>
        <div style={styles.modalFooter}>
          <button type="button" style={styles.secondaryButton} onClick={onClose}>Cancel</button>
          <button
            type="button"
            style={{ ...styles.primaryButton, ...(!selectedAvailability || borrowing ? styles.primaryButtonDisabled : {}) }}
            onClick={onConfirm}
            disabled={!selectedAvailability || borrowing}
          >
            {borrowing ? "Sending..." : "Confirm Request"}
          </button>
        </div>
      </div>
    </div>
  );
}