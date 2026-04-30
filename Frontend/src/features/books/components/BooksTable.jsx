import Card from "../../../components/Card/Card";
import { listStyles as styles } from "../../../styles/tableStyles";

export default function BooksTable({
  books, role, userId, onAccept, onReject, onEdit, onDelete
}) {
  return (
    <table style={styles.table}>
      <thead>
        <tr>
          <th style={{...styles.th, width: 100}}>Cover</th>
          <th style={{...styles.th, width: 160}}>Details</th>
          <th style={{...styles.th, width: 405}}>Description</th>
          <th style={{...styles.th, width: 100}}>Price</th>
          <th style={{...styles.th, width: 120}}>Status</th>
          <th style={{...styles.th, width: 120}}>Borrow</th>
          <th style={{...styles.th, width: 130}}>Dates</th>
          <th style={{...styles.th, width: 150}}>Actions</th>
        </tr>
      </thead>

      <tbody>
        {books.length === 0 ? (
          <tr><td colSpan={8} style={styles.empty}>No books found</td></tr>
        ) : (
          books.map(book => (
            <Card
              key={book.id}
              book={book}
              role={role}
              userId={userId}
              activeTab="books"
              onAccept={onAccept}
              onReject={onReject}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))
        )}
      </tbody>
    </table>
  );
}