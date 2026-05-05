import useRequests    from "./hooks/useRequests";
import RequestsTable  from "./components/RequestsTable";
import styles         from "./styles/requestStyles";

export default function RequestsPage() {
  const { requests, loading, error, toast, canceling, handleCancel } = useRequests();

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.stateWrap}>
          <span style={styles.stateIcon}>⏳</span>
          <p>Loading your requests...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.page}>
        <div style={styles.stateWrap}>
          <span style={styles.stateIcon}>⚠️</span>
          <p style={styles.errorText}>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <style>{`
        @media (max-width: 720px) {
          .requests-surface { padding: 16px !important; }
          .requests-table th:nth-child(3),
          .requests-table td:nth-child(3) { display: none; }
        }
      `}</style>

      {toast && (
        <div style={{
          ...styles.toast,
          background: toast.type === "success" ? "#16a34a" : "#dc2626",
        }}>
          {toast.text}
        </div>
      )}

      <div style={styles.surface} className="requests-surface">

       
        <div style={styles.header}>
          <div>
            <h1 style={styles.h1}>My Borrow Requests</h1>
            <p style={styles.sub}>Track and manage your pending book requests</p>
          </div>
          {requests.length > 0 && (
            <span style={styles.countChip}>
              {requests.length} request{requests.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>


        <RequestsTable
          requests={requests}
          canceling={canceling}
          onCancel={handleCancel}
        />

      </div>
    </div>
  );
}