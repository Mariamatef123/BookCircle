import StatusBadge from "../../../components/StatusBadge/StatusBadge";
import { styles } from "../../../styles/tableStyles";
import BookActions from "./BookActions";

export default function BookRow(props) {
  const { book } = props;

  return (
    <tr style={styles.row}>
      <td style={styles.td} data-label="Cover">
 <img
  src={`${import.meta.env.VITE_API_URL}/${book.coverImage?.replace(/\\/g, "/")}`}
  alt={book.title}
  style={styles.img}
/>
      </td>

      <td style={styles.td} data-label="Details">
        <p style={styles.title}>{book.title}</p>
        <p style={styles.sub}>{book.genre} • {book.language}</p>
      </td>

      <td style={styles.td} data-label="Description">{book.description}</td>

      <td style={styles.td} data-label="Price">
        <span style={styles.price}>{book.borrowPrice} L.E</span>
      </td>

      <td style={styles.td} data-label="Status">
        <StatusBadge status={book.status} />
      </td>

      <td style={styles.td} data-label="Borrow">
        <StatusBadge status={book.borrowStatus} />
      </td>

      <td style={styles.td} data-label="Dates">
        {book.availabilityDates?.map(d => `${d.duration} days`).join(" • ")}
      </td>

      <td style={styles.td} data-label="Actions">
        <BookActions {...props} />
      </td>
    </tr>
  );
}
