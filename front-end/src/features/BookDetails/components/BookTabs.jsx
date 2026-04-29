import styles from "../styles/bookDetailsStyles";
import CommentCard from "./CommentCard";

export default function BookTabs({
  activeTab, setActiveTab, book, totalComments,
  userId, commentText, setCommentText, commentBusy,
  commentsLoading, comments,
  replyFor, setReplyFor, replyDrafts, setReplyDrafts,
  editingCommentId, editingText, setEditingText,
  commentActionId,
  onCommentSubmit, onReplySubmit, onEditStart, onEditSave, onEditCancel, onDelete,
}) {
  return (
    <div>
      <div style={styles.tabs}>
        {["about", "comments"].map((tab) => (
          <button key={tab} type="button"
            style={{ ...styles.tabButton, ...(activeTab === tab ? styles.tabButtonActive : {}) }}
            onClick={() => setActiveTab(tab)}>
            {tab === "about" ? "About" : `Comments (${totalComments})`}
          </button>
        ))}
      </div>

      <div style={styles.tabPanel}>
        {activeTab === "about" ? (
          <p style={styles.description}>{book.description || "No description has been added for this book yet."}</p>
        ) : (
          <div>
            <div style={styles.commentComposer}>
              <textarea
                style={styles.commentTextarea} rows={4}
                value={commentText} onChange={(e) => setCommentText(e.target.value)}
                placeholder={userId ? "Write a comment about this book..." : "Login to add a comment."}
                disabled={!userId || commentBusy}
              />
              <div style={styles.commentComposerFooter} className="book-details-comment-footer">
                <span style={styles.helperText}>Join the conversation about this book.</span>
                <button type="button"
                  style={{ ...styles.primaryButton, ...((!userId || !commentText.trim() || commentBusy) ? styles.primaryButtonDisabled : {}) }}
                  onClick={onCommentSubmit} disabled={!userId || !commentText.trim() || commentBusy}>
                  {commentBusy ? "Posting..." : "Post Comment"}
                </button>
              </div>
            </div>

            {commentsLoading ? (
              <div style={styles.commentState}>Loading comments...</div>
            ) : comments.length === 0 ? (
              <div style={styles.commentState}>No comments yet for this book.</div>
            ) : (
              <div style={styles.commentsList}>
                {comments.map((comment) => (
                  <CommentCard
                    key={comment.id}
                    comment={comment}
                    currentUserId={userId}
                    replyFor={replyFor}
                    setReplyFor={setReplyFor}
                    replyDraft={replyDrafts[comment.id] || ""}
                    setReplyDraft={(value) => setReplyDrafts((prev) => ({ ...prev, [comment.id]: value }))}
                    editingCommentId={editingCommentId}
                    editingText={editingText}
                    setEditingText={setEditingText}
                    commentActionId={commentActionId}
                    onReplySubmit={() => onReplySubmit(comment.id)}
                    onEditStart={onEditStart}
                    onEditSave={onEditSave}
                    onEditCancel={onEditCancel}
                    onDelete={onDelete}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}