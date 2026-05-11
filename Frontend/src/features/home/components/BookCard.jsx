import BorrowedButton from "./BorrowedButton";
import StatusBadge    from "./StatusBadge";
import styles from "../styles/homeStyles";
import { BooksIcon } from "../../../components/icons/AppIcons";

export default function BookCard({ book }) {
  return (
    <div className="book-card" style={styles.card}>

      {/* Cover */}
      <div style={styles.coverWrap}>
        {book.coverImage ? (
     <img
      src={`https://localhost:7071/${book.coverImage?.replace(/\\/g, "/")}`}
      alt={book.title}
      style={styles.img}
    />
        ) : (
          <div style={{ ...styles.img, background: "#eef2ff", display: "flex", alignItems: "center", justifyContent: "center", color: "#4F46E5" }}>
            <BooksIcon size={30} />
          </div>
        )}
        <StatusBadge borrowStatus={book.borrowStatus} />
      </div>

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

    
        <div style={styles.actions}>
          <BorrowedButton book={book} />
        </div>
      </div>
    </div>
  );
}
