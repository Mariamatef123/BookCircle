import StatusBadge from "../../../components/StatusBadge/StatusBadge";
import { styles } from "../../../styles/tableStyles";
import BookActions from "./BookActions";

export default function BookRow(props) {
  const { book } = props;

  return (
    <tr style={styles.row}>
      <td style={styles.td}>
 <img
  src={`https://localhost:7071/${book.coverImage?.replace(/\\/g, "/")}`}
  alt={book.title}
  style={styles.img}
/>
      </td>

      <td style={styles.td}>
        <p style={styles.title}>{book.title}</p>
        <p style={styles.sub}>{book.genre} • {book.language}</p>
      </td>

      <td style={styles.td}>{book.description}</td>

      <td style={styles.td}>
        <span style={styles.price}>{book.borrowPrice} L.E</span>
      </td>

      <td style={styles.td}>
        <StatusBadge status={book.status} />
      </td>

      <td style={styles.td}>
        <StatusBadge status={book.borrowStatus} />
      </td>

      <td style={styles.td}>
        {book.availabilityDates?.map(d => `${d.duration} days`).join(" • ")}
      </td>

      <td style={styles.td}>
        <BookActions {...props} />
      </td>
    </tr>
  );
}