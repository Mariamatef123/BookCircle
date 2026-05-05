import styles from "../styles/bookDetailsStyles";
import { ArrowLeftIcon, BookmarkIcon, HeartSmallIcon, DislikeIcon } from "../icons/BookDetailIcons";
import { getOwnerInitials, getAvailabilityLabel, formatDate, formatMonthYear } from "../utils/formatters";
import { getUser } from "../../../utils/auth";

function InfoCard({ label, value }) {
  return (
    <div style={styles.infoCard}>
      <p style={styles.infoLabel}>{label}</p>
      <p style={styles.infoValue}>{value}</p>
    </div>
  );
}

export default function BookHero({
  
  book, navigate, isAvailable,
  availabilityOptions, reactionSummary, reactionsLoading, reactionBusy,
  onOpenBorrowModal, onOpenReadingLists, onReaction,
})

{const user=getUser();const handleReadingListClick = () => {
  if (!user) {
    navigate("/login");
    return;
  }

  onOpenReadingLists();
};const handleBorrowClick = () => {
  if (!user) {
    navigate("/login"); 
    return;
  }

  onOpenBorrowModal();
};
  return (
    <>
      <button type="button" style={styles.backButton} onClick={() => navigate("/")}>
        <ArrowLeftIcon /> Back to Home
      </button>

      <div style={styles.heroGrid} className="book-details-hero">
        <div style={styles.coverColumn} className="book-details-cover">
          {book.coverImageBase64 ? (
            <img src={`data:image/jpeg;base64,${book.coverImageBase64}`} alt={book.title} style={styles.coverImage} />
          ) : (
            <div style={styles.coverFallback}>No Cover</div>
          )}
        </div>

        <div style={styles.infoColumn}>
          <div style={styles.titleRow} className="book-details-title-row">
            <div>
              <h1 style={styles.title} className="book-details-title">{book.title}</h1>
              <p style={styles.author}>by {book.owner?.name || "Unknown owner"}</p>
            </div>
            <span style={{ ...styles.statusPill, background: isAvailable ? "#ecfdf3" : "#fff7ed", color: isAvailable ? "#15803d" : "#c2410c" }}>
              {isAvailable ? "Available" : "Borrowed"}
            </span>
          </div>

          <div style={styles.ownerCard} className="book-details-owner-card">
            <div style={styles.ownerInfo}>
              <div style={styles.ownerAvatar}>{getOwnerInitials(book.owner?.name)}</div>
              <div>
                <p style={styles.ownerName}>{book.owner?.name || "Book Owner"}</p>
                <p style={styles.ownerMeta}>
                  {book.owner?.createdAt ? `Member since ${formatMonthYear(book.owner.createdAt)}` : "Community member"}
                </p>
              </div>
            </div>
            <button type="button" style={styles.secondaryButton}  onClick={() => navigate(`/profile/${book.owner.id}`)}>View Profile</button>
          </div>

          <div style={styles.metaGrid} className="book-details-meta">
            <InfoCard label="ISBN"             value={book.isbn             || "Not available"} />
            <InfoCard label="Language"         value={book.language         || "Not available"} />
            <InfoCard label="Genre"            value={book.genre            || "Not available"} />
            <InfoCard label="Publication Date" value={book.publicationDate ? formatDate(book.publicationDate) : "Not available"} />
            <InfoCard label="Availability"     value={getAvailabilityLabel(availabilityOptions)} />
            <InfoCard label="Borrow Price"     value={book.borrowPrice != null ? `${book.borrowPrice} L.E / day` : "Not available"} />
          </div>

          <div style={styles.actionRow}>
<button
  type="button"
  style={{
    ...styles.primaryButton,
    ...((!isAvailable || !availabilityOptions.length || user?.role === "BOOK_OWNER")
      ? styles.primaryButtonDisabled
      : {})
  }}
  onClick={handleBorrowClick}
  disabled={
    !isAvailable ||
    !availabilityOptions.length ||
    user?.role === "BOOK_OWNER"
  }
>
  Request Borrow
</button>
<button
  type="button"
  style={{
    ...styles.readingListButton,
    ...(user?.role === "BOOK_OWNER"
      ? { color: "#999", cursor: "not-allowed" }
      : {})
  }}
  onClick={handleReadingListClick}
  disabled={user?.role === "BOOK_OWNER"}
>
  <BookmarkIcon /> Add to Reading List
</button>
          </div>

          <div style={styles.reactionRow}>
            <button type="button"
              style={{ ...styles.reactionButton, ...(reactionSummary.currentReaction === "LIKE" ? styles.reactionButtonActive : {}) }}
              onClick={() => onReaction("LIKE")} disabled={reactionBusy === "LIKE"}>
              <HeartSmallIcon filled={reactionSummary.currentReaction === "LIKE"} />
              Like ({reactionSummary.likeCount})
            </button>
            <button type="button"
              style={{ ...styles.reactionButton, ...(reactionSummary.currentReaction === "DISLIKE" ? styles.reactionButtonDanger : {}) }}
              onClick={() => onReaction("DISLIKE")} disabled={reactionBusy === "DISLIKE"}>
              <DislikeIcon filled={reactionSummary.currentReaction === "DISLIKE"} />
              Dislike ({reactionSummary.dislikeCount})
            </button>
            {reactionsLoading && <span style={styles.helperText}>Updating reactions...</span>}
          </div>
        </div>
      </div>
    </>
  );
}