import { styles } from "../../../styles/tableStyles";

export default function PendingUserRow({ owner, onAcceptOwner, onRejectOwner }) {
  return (
    <tr style={styles.row}>
      <td style={styles.td} data-label="Name">{owner.name}</td>
      <td style={styles.td} data-label="Email">{owner.email}</td>

      <td style={styles.td} data-label="Role">
        <span style={styles.roleBadge}>
          {owner.role.replace("_", " ")}
        </span>
      </td>

      <td style={styles.td} data-label="Joined">
        {new Date(owner.createdAt).toLocaleDateString("en-GB")}
      </td>

      <td style={styles.td} data-label="Approved">
        <span style={owner.isApproved ? styles.approvedBadge : styles.pendingBadge}>
          {owner.isApproved ? "Approved" : "Pending"}
        </span>
      </td>

      <td style={styles.td} data-label="Actions">
        <button style={styles.btnAccept} onClick={() => onAcceptOwner(owner.id)}>Approve</button>
        <button style={styles.btnReject} onClick={() => onRejectOwner(owner.id)}>Reject</button>
      </td>
    </tr>
  );
}
