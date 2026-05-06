import styles from "../styles/paymentStyles";
import { BookOpenIcon } from "../../../components/icons/AppIcons";

export default function BookSummaryCard({ book }) {
  return (
    <div style={styles.bookCard}>
      {/* Cover */}
      <div style={styles.bookCoverWrap}>
        {book.coverImageBase64 ? (
          <img
            src={`data:image/jpeg;base64,${book.coverImageBase64}`}
            alt={book.title}
            style={styles.bookCoverImg}
          />
        ) : (
          <div style={styles.bookCoverFallback}>
            <BookOpenIcon size={48} />
          </div>
        )}
      </div>

      {/* Info */}
      <div>
        <p style={styles.bookTitle}>{book.title}</p>
        <p style={styles.bookAuthor}>by {book.owner?.name || "Unknown"}</p>
        <p style={styles.bookMeta}>
          {[book.genre, book.language].filter(Boolean).join(" • ")}
        </p>
      </div>

      <hr style={styles.divider} />

      {/* Amount */}
      <div style={styles.amountRow}>
        <span style={styles.amountLabel}>Total</span>
        <span style={styles.amountValue}>{book.borrowPrice} L.E</span>
      </div>

      {/* Availability */}
      {book.availabilityDates?.length > 0 && (
        <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 4 }}>
          Duration: {book.availabilityDates.map((d) => `${d.duration} days`).join(", ")}
        </div>
      )}
    </div>
  );
}
