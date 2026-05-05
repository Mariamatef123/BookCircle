import styles from "../styles/requestStyles";
import RequestsEmpty from "./RequestsEmpty";

function getStatusStyle(status) {
  switch (status?.toUpperCase()) {
    case "PENDING":   return { bg: "#fffbeb", color: "#b45309", dot: "#f59e0b" };
    case "APPROVED":  return { bg: "#f0fdf4", color: "#15803d", dot: "#22c55e" };
    case "REJECTED":  return { bg: "#fef2f2", color: "#dc2626", dot: "#ef4444" };
    case "CANCELLED": return { bg: "#f9fafb", color: "#6b7280", dot: "#9ca3af" };
    default:          return { bg: "#eff6ff", color: "#1d4ed8", dot: "#3b82f6" };
  }
}

function formatDate(value) {
  if (!value) return { main: "N/A", sub: "" };
  const d = new Date(value);
  return {
    main: d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    sub:  d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
  };
}

export default function RequestsTable({ requests, canceling, onCancel }) {
  if (requests.length === 0) return <RequestsEmpty />;

  return (
    <div style={styles.tableCard}>
      <table style={styles.table}>
        <thead style={styles.thead}>
          <tr>
            <th style={styles.th}>Book</th>
            <th style={styles.th}>Status</th>
            <th style={styles.th}>Duration</th>
            <th style={styles.th}>Requested On</th>
            <th style={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((req) => {
            const statusStyle = getStatusStyle(req.status);
            const date        = formatDate(req.createdAt);
            const isPending   = req.status?.toUpperCase() === "PENDING";
            const isCanceling = canceling === req.id;
            const bookTitle   = req.bookTitle || req.book?.title || "Unknown Book";
            const bookMeta    = [req.book?.genre, req.book?.language].filter(Boolean).join(" • ");

            return (
              <tr
                key={req.id}
                style={styles.row}
                onMouseEnter={(e) => e.currentTarget.style.background = "#fafaff"}
                onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
              >
                {/* Book */}
                <td style={styles.td}>
                  <div style={styles.bookCell}>
                    {req.book?.coverImageBase64 ? (
                      <img
                        src={`data:image/jpeg;base64,${req.book.coverImageBase64}`}
                        alt={bookTitle}
                        style={styles.bookCover}
                      />
                    ) : (
                      <div style={styles.bookCoverFallback}>📚</div>
                    )}
                    <div>
                      <p style={styles.bookTitle}>{bookTitle}</p>
                      {bookMeta && <p style={styles.bookMeta}>{bookMeta}</p>}
                    </div>
                  </div>
                </td>

              
                <td style={styles.td}>
                  <span style={{
                    ...styles.badge,
                    background: statusStyle.bg,
                    color: statusStyle.color,
                  }}>
                    <span style={{ ...styles.badgeDot, background: statusStyle.dot }} />
                    {req.status}
                  </span>
                </td>

                <td style={styles.td}>
                  {req.availabilityDate.duration ? (
                    <span style={styles.durationChip}>{req.availabilityDate.duration} days</span>
                  ) : (
                    <span style={styles.dashText}>—</span>
                  )}
                </td>

              
     <td style={styles.td}>
  <p style={{ ...styles.dateText, margin: 0 }}>
    {new Date(req.requestedAt).toLocaleDateString()}
  </p>

  <p style={{ ...styles.dateSubText, margin: 0 }}>
    {new Date(req.requestedAt).toLocaleTimeString()}
  </p>
</td>
         
                <td style={styles.td}>
                  {isPending ? (
                    <button
                      style={{
                        ...styles.btnCancel,
                        opacity: isCanceling ? 0.6 : 1,
                        cursor:  isCanceling ? "not-allowed" : "pointer",
                      }}
                      onClick={() => onCancel(req.id)}
                      disabled={isCanceling}
                    >
                      {isCanceling ? "Cancelling..." : "Cancel"}
                    </button>
                  ) : (
                    <span style={styles.dashText}>—</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}