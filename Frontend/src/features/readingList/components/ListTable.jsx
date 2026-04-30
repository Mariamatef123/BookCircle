import { styles } from "../../../styles/readingListStyles";

export default function ListTable({ lists, onDelete, onView }) {
  return (
    <div style={styles.card}>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>List Name</th>
            <th style={styles.th}>Books</th>
            <th style={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {lists.length === 0 ? (
            <tr><td colSpan={3} style={styles.empty}>No lists found</td></tr>
          ) : lists.map((list) => {
     
            return (
              <tr key={list.id} style={styles.row}>
                <td style={styles.td}>
                  <p style={styles.title}>{list.name}</p>
                  <p style={styles.meta}>{list.description}</p>
                </td>
                <td style={styles.td}>
                  {list.booksCount} {list.booksCount === 1 ? 'book' : 'books'}
                </td>
                <td style={styles.td}>
                  <div style={styles.actions}>
                    <button style={styles.btnView} onClick={() => onView(list.id)}>View Books</button>
                    <button style={styles.btnDelete} onClick={() => onDelete(list.id)}>Delete</button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}