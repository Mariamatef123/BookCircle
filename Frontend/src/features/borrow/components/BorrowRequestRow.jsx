import { styles } from "../../../styles/tableStyles";

export default function BorrowRequestRow({
  borrow, userId, onAcceptRequest, onRejectRequest
}) {
  return (
    <tr style={styles.row}>
      <td style={styles.td}>{borrow.book.title}</td>

      <td style={styles.td}>
        {new Date(borrow.requestedAt).toLocaleDateString("en-GB")}
      </td>

      <td style={styles.td}>{borrow.availabilityDate.duration}</td>

      <td style={styles.td}>{borrow.reader.name}</td>

      <td style={styles.td}>
        <span style={styles.pendingBadge}>{borrow.status}</span>
      </td>

      <td style={styles.td}>
        <button style={styles.btnAccept} onClick={() => onAcceptRequest(userId, borrow.id)}>Approve</button>
        <button style={styles.btnReject} onClick={() => onRejectRequest(userId, borrow.id)}>Reject</button>
      </td>
    </tr>
  );
}