import { styles } from "../../../styles/tableStyles";

export default function BookActions({
  
  role, userId, book,
  onAccept, onReject, onDelete, onEdit
}) {
  return (
    <div style={styles.actions}>

      {role === "ADMIN" && (
        <>
          <button style={styles.btnAccept} onClick={() => onAccept(userId, book.id)}>Accept</button>
          <button style={styles.btnReject} onClick={() => onReject(userId, book.id)}>Reject</button>
        </>
      )}

      {role === "BOOK_OWNER" && (
        <>
          <button style={styles.btnEdit} onClick={() => onEdit(book)}>Edit</button>

          <button
            onClick={() => onDelete(book.id)}
            disabled={book.borrowStatus === "BORROWED"}
            style={{
              ...styles.btnDelete,
              ...(book.borrowStatus === "BORROWED" && styles.disabled)
            }}
          >
            Delete
          </button>
        </>
      )}

    </div>
  );
}