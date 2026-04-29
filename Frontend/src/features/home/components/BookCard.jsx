import BorrowedButton from "./BorrowedButton";
import StatusBadge    from "./StatusBadge";
import styles from "../styles/homeStyles";

export default function BookCard({ book, wishlist, toggleWishlist }) {
  return (
    <div className="book-card" style={styles.card}>

      {/* Cover */}
      <div style={styles.coverWrap}>
        {book.coverImageBase64 ? (
          <img
            src={`data:image/jpeg;base64,${book.coverImageBase64}`}
            alt={book.title}
            style={styles.img}
          />
        ) : (
          <div style={{ ...styles.img, background: "#eef2ff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30 }}>
            📚
          </div>
        )}
        <StatusBadge borrowStatus={book.borrowStatus} />
      </div>

      {/* Info */}
      <div style={styles.cardBody}>
        <p style={styles.bookTitle}>{book.title}</p>
        <p style={styles.bookAuthor}>{book.owner?.name || "Unknown"}</p>
        <p style={styles.bookMeta}>{book.genre} • {book.language}</p>
        <p style={styles.bookPrice}>
          {book.borrowPrice} L.E{" "}
          <span style={{ fontWeight: 400, color: "#aaa" }}>
            {book.availabilityDates?.map((d) => `${d.duration} days`).join(", ")}
          </span>
        </p>

        {/* Actions */}
        <div style={styles.actions}>
          <BorrowedButton book={book} />
        </div>
      </div>
    </div>
  );
}