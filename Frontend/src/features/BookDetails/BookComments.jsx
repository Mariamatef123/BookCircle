import { useOutletContext } from "react-router-dom";
import CommentCard from "./components/CommentCard";
import styles from "./styles/bookDetailsStyles";


export default function CommentsTab() {

  const d = useOutletContext();

  return (
    <div>
      <div style={styles.commentComposer}>
        <textarea
          style={styles.commentTextarea}
          rows={4}
          value={d.commentText}
      onChange={(e) => {
  if (!d.userId) {
    d.navigate("/login");
    return;
  }
  d.setCommentText(e.target.value);
}}
          placeholder={d.userId ? "Write a comment..." : "Login required"}

          disabled={!d.userId || d.commentBusy}
        />

        <div style={styles.commentComposerFooter}>
          <button
            style={styles.primaryButton}
            onClick={d.handleCommentSubmit}
            disabled={!d.userId || !d.commentText.trim()}
          >
            Post Comment
          </button>
        </div>
      </div>

      {d.commentsLoading ? (
        <div>Loading...</div>
      ) : (
        d.comments.map((comment) => (
          <CommentCard
            key={comment.id}
            comment={comment}
            currentUserId={d.userId}
            replyFor={d.replyFor}
            setReplyFor={d.setReplyFor}
            replyDraft={d.replyDrafts[comment.id] || ""}
            setReplyDraft={(v) =>
              d.setReplyDrafts((p) => ({ ...p, [comment.id]: v }))
            }
            editingCommentId={d.editingCommentId}
            editingText={d.editingText}
            setEditingText={d.setEditingText}
            commentActionId={d.commentActionId}
            onReplySubmit={() => d.handleReplySubmit(comment.id)}
            onEditStart={d.handleStartEdit}
            onEditSave={d.handleSaveEdit}
            onEditCancel={d.onEditCancel}
            onDelete={d.handleDeleteComment}
          />
        ))
      )}
    </div>
  );
}