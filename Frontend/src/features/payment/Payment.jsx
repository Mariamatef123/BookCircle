import usePayment          from "./hooks/usePayment";
import PaymentStatePanel   from "./components/PaymentStatePanel";
import BookSummaryCard     from "./components/BookSummaryCard";
import PaymentForm         from "./components/PaymentForm";
import styles              from "./styles/paymentStyles";

export default function Payment() {
  const p = usePayment();

  if (p.loading) return (
    <PaymentStatePanel icon="⏳" text="Loading book details..." />
  );

  if (p.error && !p.book) return (
    <PaymentStatePanel
      icon="⚠️"
      text={p.error}
      isError
      actionLabel="Go Back"
      onAction={() => p.navigate(-1)}
    />
  );

  if (!p.book) return (
    <PaymentStatePanel
      icon="📭"
      text="No book selected for payment."
      actionLabel="Browse Books"
      onAction={() => p.navigate("/")}
    />
  );

  return (
    <div style={styles.page} className="payment-page">
      <style>{`
        @media (max-width: 720px) {
          .payment-layout { grid-template-columns: 1fr !important; }
        }
        .payment-submit-btn:hover:not(:disabled) {
          opacity: 0.9;
          transform: translateY(-1px);
        }
      `}</style>

      <div style={styles.surface}>
  
        <button
          type="button"
          style={styles.backButton}
          onClick={() => p.navigate(-1)}
        >
          ← Back
        </button>


        <div style={styles.layout} className="payment-layout">
          <BookSummaryCard book={p.book} />

          <PaymentForm
            form={p.form}
            maskedNumber={p.maskedNumber}
            error={p.error}
            success={p.success}
            submitting={p.submitting}
            focusedField={p.focusedField}
            setFocusedField={p.setFocusedField}
            handleChange={p.handleChange}
            handleSubmit={p.handleSubmit}
          />
        </div>
      </div>
    </div>
  );
}