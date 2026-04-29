import styles from "./styles/bookDetailsStyles";
import useBookDetails from "./hooks/useBookDetails";

import StatePanel from "./components/StatePanel";
import BookHero from "./components/BookHero";
import BookTabs from "./components/BookTabs";
import RelatedBooks from "./components/RelatedBooks";
import BorrowModal from "./components/BorrowModal";
import ReadingListModal from "./components/ReadingListModal";

export default function BookDetails() {
  const d = useBookDetails();

  if (d.loading) return <StatePanel text="Loading book details..." />;
  if (d.error) return <StatePanel text={d.error} isError />;
  if (!d.book)
    return (
      <StatePanel
        text="We could not find this book."
        actionLabel="Back to Home"
        onAction={() => d.navigate("/")}
      />
    );

  return (
    <div style={styles.page} className="book-details-page">
      <style>{`
        @media (max-width: 980px) {
          .book-details-hero { grid-template-columns: 1fr !important; }
          .book-details-content { grid-template-columns: 1fr !important; }
          .book-details-cover { max-width: 320px; }
        }
        @media (max-width: 720px) {
          .book-details-page { padding: 16px !important; }
          .book-details-surface { padding: 18px !important; }
          .book-details-meta { grid-template-columns: 1fr !important; }
          .book-details-title-row,
          .book-details-owner-card,
          .book-details-comment-footer { flex-direction: column !important; align-items: flex-start !important; }
          .book-details-title { font-size: 30px !important; }
        }
      `}</style>

      {d.message && (
        <div
          style={{
            ...styles.toast,
            background: d.message.type === "success" ? "#16a34a" : "#dc2626",
          }}
        >
          {d.message.text}
        </div>
      )}

      <div style={styles.surface} className="book-details-surface">
        <BookHero
          book={d.book}
          navigate={d.navigate}
          isAvailable={d.isAvailable}
          availabilityOptions={d.availabilityOptions}
          reactionSummary={d.reactionSummary}
          reactionsLoading={d.reactionsLoading}
          reactionBusy={d.reactionBusy}
          onOpenBorrowModal={d.handleOpenBorrowModal}
          onOpenReadingLists={d.handleOpenReadingLists}
          onReaction={d.handleReaction}
        />

        <div style={styles.contentGrid} className="book-details-content">
          <BookTabs
            activeTab={d.activeTab}
            setActiveTab={d.setActiveTab}
            book={d.book}
            totalComments={d.totalComments}
            userId={d.userId}
            commentText={d.commentText}
            setCommentText={d.setCommentText}
            commentBusy={d.commentBusy}
            commentsLoading={d.commentsLoading}
            comments={d.comments}
            replyFor={d.replyFor}
            setReplyFor={d.setReplyFor}
            replyDrafts={d.replyDrafts}
            setReplyDrafts={d.setReplyDrafts}
            editingCommentId={d.editingCommentId}
            editingText={d.editingText}
            setEditingText={d.setEditingText}
            commentActionId={d.commentActionId}
            onCommentSubmit={d.handleCommentSubmit}
            onReplySubmit={d.handleReplySubmit}
            onEditStart={d.handleStartEdit}
            onEditSave={d.handleSaveEdit}
            onEditCancel={d.onEditCancel}
            onDelete={d.handleDeleteComment}
          />

          <RelatedBooks relatedBooks={d.relatedBooks} />
        </div>
      </div>

      <BorrowModal
        open={d.borrowModalOpen}
        onClose={() => d.setBorrowModalOpen(false)}
        availabilityOptions={d.availabilityOptions}
        selectedAvailability={d.selectedAvailability}
        setSelectedAvailabilityKey={d.setSelectedAvailabilityKey}
        borrowing={d.borrowing}
        onConfirm={d.handleBorrowRequest}
      />

      <ReadingListModal
        open={d.listModalOpen}
        onClose={() => d.setListModalOpen(false)}
        lists={d.lists}
        listsLoading={d.listsLoading}
        addingToList={d.addingToList}
        onAdd={d.handleAddToList}
      />
    </div>
  );
}
