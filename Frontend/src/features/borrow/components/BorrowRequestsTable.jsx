import Card from "../../../components/Card/Card";
import { listStyles as styles } from "../../../styles/tableStyles";

export default function BorrowRequestsTable({
  borrows, role, userId, onAcceptRequest, onRejectRequest
}) {
  return (
    <table style={styles.table}>
      <thead>
        <tr>
          <th style={{...styles.th, width: 140}}>Book Name</th>
          <th style={{...styles.th, width: 190}}>Requested At</th>
          
          <th style={{...styles.th, width: 120}}>Duration</th>
          <th style={{...styles.th, width: 130}}>Reader</th>
          <th style={{...styles.th, width: 100}}>Status</th>
          <th style={{...styles.th, width: 140}}>Actions</th>
        </tr>
      </thead>

      <tbody>
        {borrows.length === 0 ? (
          <tr><td colSpan={6} style={styles.empty}>No pending requests</td></tr>
        ) : (
          borrows.map(borrow => (
            <Card
              key={borrow.id}
              borrow={borrow}
              role={role}
              userId={userId}
              activeTab="pending"
              onAcceptRequest={onAcceptRequest}
              onRejectRequest={onRejectRequest}
            />
          ))
        )}
      </tbody>
    </table>
  );
}