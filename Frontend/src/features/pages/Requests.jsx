import { useState, useEffect } from "react";
import { getMyRequests, cancelRequest } from "../../Service/BorrowService"; // Adjust path if needed
import { styles } from "../../styles/requestStyles";
import { getUser } from "../../utils/auth";

export default function RequestsPage() {
  const user = getUser();
  const userId = user?.id;

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchRequests = async () => {
    if (!userId) return;
    try {
      setLoading(true);
      const res = await getMyRequests(userId);
      setRequests(res.data?.data || []);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to fetch requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRequests(); }, [userId]);

  const handleCancel = async (reqId) => {
    if (!window.confirm("Cancel this borrow request?")) return;
    try {
      await cancelRequest(userId, reqId);
      setRequests(prev => prev.filter(r => r.id !== reqId));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to cancel request");
    }
  };

  if (loading) return <div style={styles.center}>Loading requests...</div>;
  if (error) return <div style={styles.error}>{error}</div>;

  return (
    <div style={styles.wrapper}>
      <h1 style={styles.h1}>My Borrow Requests</h1>
      <p style={styles.sub}>Track and manage your pending book requests</p>

      {requests.length === 0 ? (
        <div style={styles.empty}>No requests found</div>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Book</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Requested On</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map(req => (
              <tr key={req.id} style={styles.row}>
                <td style={styles.td}>{req.bookTitle || req.book?.title || "Unknown Book"}</td>
                <td style={styles.td}>
                  <span style={{ ...styles.badge, backgroundColor: getStatusColor(req.status) }}>
                    {req.status}
                  </span>
                </td>
                <td style={styles.td}>
                  {req.createdAt ? new Date(req.createdAt).toLocaleDateString() : "N/A"}
                </td>
                <td style={styles.td}>
                  {req.status === "PENDING" && (
                    <button style={styles.btnCancel} onClick={() => handleCancel(req.id)}>
                      Cancel
                    </button>
                  )}
                  {req.status !== "PENDING" && <span style={{ color: "#888" }}>—</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

function getStatusColor(status) {
  switch (status?.toUpperCase()) {
    case "PENDING": return "#f59e0b";
    case "APPROVED": return "#10b981";
    case "REJECTED": return "#ef4444";
    case "CANCELLED": return "#6b7280";
    default: return "#3b82f6";
  }
}
