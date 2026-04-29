import Card from "../../../components/Card/Card";
import { listStyles as styles } from "../../../styles/tableStyles";

export default function PendingOwnersTable({
  owners, role, userId, onAcceptOwner, onRejectOwner
}) {
  return (
    <table style={styles.table}>
      <thead>
        <tr>
          <th style={{...styles.th, width: 140}}>Name</th>
          <th style={{...styles.th, width: 190}}>Email</th>
          <th style={{...styles.th, width: 120}}>Role</th>
          <th style={{...styles.th, width: 130}}>Joined</th>
          <th style={{...styles.th, width: 100}}>Approved</th>
          <th style={{...styles.th, width: 140}}>Actions</th>
        </tr>
      </thead>

      <tbody>
        {owners.length === 0 ? (
          <tr><td colSpan={6} style={styles.empty}>No pending owners</td></tr>
        ) : (
          owners.map(owner => (
            <Card
              key={owner.id}
              owner={owner}
              role={role}
              userId={userId}
              activeTab="pending"
              onAcceptOwner={onAcceptOwner}
              onRejectOwner={onRejectOwner}
            />
          ))
        )}
      </tbody>
    </table>
  );
}