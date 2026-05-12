import styles from "../styles/bookDetailsStyles";
import { getCommentAuthor, formatDateTime } from "../utils/formatters";

export default function CommentCard({
  comment, currentUserId,
  replyFor, setReplyFor,
  replyDraft, setReplyDraft,
  editingCommentId, editingText, setEditingText,
  commentActionId,
  onReplySubmit, onEditStart, onEditSave, onEditCancel, onDelete,
}) {
  const canManage = String(comment.userId) === String(currentUserId);

  return (
    <div style={styles.commentCard}>
      <div style={styles.commentHeader}>
        <div>
          <p style={styles.commentAuthor}>{getCommentAuthor(comment, currentUserId)}</p>
          <p style={styles.commentTime}>{formatDateTime(comment.createdAt)}</p>
        </div>
        <div style={styles.commentActions}>
          <button type="button" style={styles.linkButton}
            onClick={() => setReplyFor(replyFor === comment.id ? null : comment.id)}>
            Reply
          </button>
          {canManage && (
            <>
              <button type="button" style={styles.linkButton} onClick={() => onEditStart(comment)}>Edit</button>
              <button type="button" style={styles.linkButtonDanger} onClick={() => onDelete(comment.id)}>Delete</button>
            </>
          )}
        </div>
      </div>

      {editingCommentId === comment.id ? (
        <div>
          <textarea rows={3} style={styles.commentTextarea} value={editingText} onChange={(e) => setEditingText(e.target.value)} />
          <div style={styles.inlineActionRow}>
            <button type="button"
              style={{ ...styles.primaryButton, ...(commentActionId === comment.id ? styles.primaryButtonDisabled : {}) }}
              onClick={() => onEditSave(comment.id)} disabled={commentActionId === comment.id}>
              {commentActionId === comment.id ? "Saving..." : "Save"}
            </button>
            <button type="button" style={styles.secondaryButton} onClick={onEditCancel}>Cancel</button>
          </div>
        </div>
      ) : (
        <p style={styles.commentBody}>{comment.content}</p>
      )}

      {replyFor === comment.id && (
        //Show reply textarea ONLY for the selected comment
        //Hide it for all others
        <div style={styles.replyComposer}>
          <textarea rows={3} style={styles.commentTextarea} value={replyDraft}
            onChange={(e) => setReplyDraft(e.target.value)} placeholder="Write a reply..." />
          <div style={styles.inlineActionRow}>
            <button type="button"
              style={{ ...styles.primaryButton, ...((!replyDraft.trim() || commentActionId === comment.id) ? styles.primaryButtonDisabled : {}) }}
              onClick={onReplySubmit} disabled={!replyDraft.trim() || commentActionId === comment.id}>
              {commentActionId === comment.id ? "Posting..." : "Reply"}
            </button>
            <button type="button" style={styles.secondaryButton} onClick={() => setReplyFor(null)}>Cancel</button>
          </div>
        </div>
      )}

      {comment.replies?.length > 0 && (
        <div style={styles.replyList}>
          {comment.replies.map((reply) => {
            const canManageReply = String(reply.userId) === String(currentUserId);
            return (
              <div key={reply.id} style={styles.replyCard}>
                <div style={styles.commentHeader}>
                  <div>
                    <p style={styles.commentAuthor}>{getCommentAuthor(reply, currentUserId)}</p>
                    <p style={styles.commentTime}>{formatDateTime(reply.createdAt)}</p>
                  </div>
                  {canManageReply && (
                    <div style={styles.commentActions}>
                      <button type="button" style={styles.linkButton} onClick={() => onEditStart(reply)}>Edit</button>
                      <button type="button" style={styles.linkButtonDanger} onClick={() => onDelete(reply.id)}>Delete</button>
                    </div>
                  )}
                </div>
                {editingCommentId === reply.id ? (
                  <div>
                    <textarea rows={3} style={styles.commentTextarea} value={editingText} onChange={(e) => setEditingText(e.target.value)} />
                    <div style={styles.inlineActionRow}>
                      <button type="button"
                        style={{ ...styles.primaryButton, ...(commentActionId === reply.id ? styles.primaryButtonDisabled : {}) }}
                        onClick={() => onEditSave(reply.id)} disabled={commentActionId === reply.id}>
                        {commentActionId === reply.id ? "Saving..." : "Save"}
                      </button>
                      <button type="button" style={styles.secondaryButton} onClick={onEditCancel}>Cancel</button>
                    </div>
                  </div>
                ) : (
                  <p style={styles.commentBody}>{reply.content}</p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}