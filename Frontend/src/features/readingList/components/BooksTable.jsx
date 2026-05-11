import { styles } from "../../../styles/readingListStyles";

export default function BooksTable({ books, lists, selectedListId, onSelect, onRemove }) {
  return (
    <div style={styles.card}>
      <div style={{ marginBottom: 12 }}>
        <label style={{ fontSize: 12, color: "#6B7280", marginRight: 8 }}>Select list:</label>
        <select
          value={selectedListId || ""}
          onChange={(e) => onSelect(Number(e.target.value))}
          style={styles.select}
        >
          {lists.map((l) => (
            <option key={l.id} value={l.id}>{l.name}</option>
          ))}
        </select>
      </div>

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Cover</th>
            <th style={styles.th}>Details</th>
            <th style={{ ...styles.th, width: "50%" }}>Description</th>
            <th style={styles.th}>Price</th>
            <th style={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.length === 0 ? (
            <tr><td colSpan={5} style={styles.empty}>No books in this list</td></tr>
          ) : books.map((book) => (
            <tr key={book.id} style={styles.row}>
              <td style={styles.td}>
                 <img
            src={`https://localhost:7071/${book.coverImage?.replace(/\\/g, "/")}`}
            alt={book.title}
           
                  style={styles.img}
                />
              </td>
              <td style={styles.td}>
                <p style={styles.title}>{book.title}</p>
                <p style={styles.meta}>{book.genre} • {book.language}</p>
              </td>
              <td style={styles.td}>{book.description}</td>
              <td style={styles.td}>
                <span style={styles.price}>{book.borrowPrice} L.E</span>
              </td>
              <td style={styles.td}>
                <button style={styles.btnDelete} onClick={() => onRemove(book.id)}>Remove</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}