import styles from "../styles/paymentStyles";
import { AlertTriangleIcon, CheckCircleIcon, LockIcon } from "../../../components/icons/AppIcons";

export default function PaymentForm({
  form, maskedNumber,
  error, success, submitting,
  focusedField, setFocusedField,
  handleChange, handleSubmit,
}) {
  const inputStyle = (name) => ({
    ...styles.input,
    ...(focusedField === name ? styles.inputFocus : {}),
  });

  return (
    <div style={styles.formCard}>
      <div style={styles.formHeader}>
        <h2 style={styles.formTitle}>Complete Payment</h2>
        <p style={styles.formSubtitle}>Your payment info is encrypted and secure.</p>
      </div>


      <div style={styles.cardVisual}>
        <div style={styles.cardVisualCircle1} />
        <div style={styles.cardVisualCircle2} />
        <div style={styles.cardVisualChip} />
        <div style={styles.cardVisualNumber}>{maskedNumber}</div>
        <div style={styles.cardVisualRow}>
          <div>
            <div style={styles.cardVisualLabel}>Card Holder</div>
            <div style={styles.cardVisualValue}>
              {form.cardName.trim() || "FULL NAME"}
            </div>
          </div>
          <div>
            <div style={styles.cardVisualLabel}>Expires</div>
            <div style={styles.cardVisualValue}>
              {form.expiry || "MM/YY"}
            </div>
          </div>
        </div>
      </div>


      <div style={styles.fieldGroup}>

        <div style={styles.field}>
          <label style={styles.label}>Cardholder Name</label>
          <input
            style={inputStyle("cardName")}
            name="cardName"
            placeholder="John Smith"
            value={form.cardName}
            onChange={handleChange}
            onFocus={() => setFocusedField("cardName")}
            onBlur={() => setFocusedField("")}
            autoComplete="cc-name"
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Card Number</label>
          <input
            style={inputStyle("cardNumber")}
            name="cardNumber"
            placeholder="1234 5678 9012 3456"
            value={form.cardNumber}
            onChange={handleChange}
            onFocus={() => setFocusedField("cardNumber")}
            onBlur={() => setFocusedField("")}
            inputMode="numeric"
            autoComplete="cc-number"
          />
        </div>

        <div style={styles.fieldRow}>
          <div style={styles.field}>
            <label style={styles.label}>Expiry Date</label>
            <input
              style={inputStyle("expiry")}
              name="expiry"
              placeholder="MM/YY"
              value={form.expiry}
              onChange={handleChange}
              onFocus={() => setFocusedField("expiry")}
              onBlur={() => setFocusedField("")}
              inputMode="numeric"
              autoComplete="cc-exp"
            />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>CVV</label>
            <input
              style={inputStyle("cvv")}
              name="cvv"
              placeholder="•••"
              value={form.cvv}
              onChange={handleChange}
              onFocus={() => setFocusedField("cvv")}
              onBlur={() => setFocusedField("")}
              inputMode="numeric"
              autoComplete="cc-csc"
              type="password"
            />
          </div>
        </div>
      </div>

      {/* Error / Success */}
      {error && (
        <div style={{ ...styles.errorBox, display: "flex", alignItems: "center", gap: 6 }}>
          <AlertTriangleIcon size={15} /> {error}
        </div>
      )}
      {success && (
        <div style={{ ...styles.successBox, display: "flex", alignItems: "center", gap: 6 }}>
          <CheckCircleIcon size={15} /> {success}
        </div>
      )}

  
      <button
        type="submit"
        onClick={handleSubmit}
        disabled={submitting || !!success}
        style={{
          ...styles.submitBtn,
          ...(submitting || success ? styles.submitBtnDisabled : {}),
        }}
      >
        {submitting ? "Processing..." : success ? "Redirecting..." : "Pay Now"}
      </button>

      <div style={styles.secureBadge}>
        <LockIcon size={14} /> Payments are secure
      </div>
    </div>
  );
}
