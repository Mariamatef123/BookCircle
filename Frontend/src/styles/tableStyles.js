export const styles = {
  row: {
    borderBottom: "1px solid #f5f5f5",
    transition: "background 0.15s",
  },
  td: {
    padding: "12px",
    verticalAlign: "middle",
    fontSize: 14,
    color: "#111827",
    wordBreak: "break-word",
    whiteSpace: "normal",
  },
  img: {
    width: 80,
    height: 56,
    borderRadius: 8,
    objectFit: "cover",
    display: "block",
  },
  title: { margin: 0, fontWeight: 600 },
  sub: { margin: "3px 0 0", fontSize: 12, color: "#6B7280" },
  price: { fontWeight: 600, color: "#4F46E5" },

  actions: { display: "flex", gap: 8, flexWrap: "wrap" },

  roleBadge: {
    background: "#EEF2FF",
    color: "#4338CA",
    borderRadius: 6,
    padding: "3px 8px",
    fontSize: 12,
  },

  approvedBadge: {
    background: "#DCFCE7",
    color: "#15803D",
    borderRadius: 6,
    padding: "3px 8px",
  },

  pendingBadge: {
    background: "#FEF9C3",
    color: "#A16207",
    borderRadius: 6,
    padding: "3px 8px",
  },

  disabled: {
    opacity: 0.5,
    pointerEvents: "none",
  },

  btnAccept: { background: "#DCFCE7", color: "#15803D", border: "none", borderRadius: 6, padding: "5px 10px" },
  btnReject: { background: "#FEE2E2", color: "#DC2626", border: "none", borderRadius: 6, padding: "5px 10px" },
  btnEdit: { background: "#E0E7FF", color: "#4F46E5", border: "none", borderRadius: 6, padding: "5px 10px" },
  btnDelete: { background: "#FFEDD5", color: "#C2410C", border: "none", borderRadius: 6, padding: "5px 10px" },
};
export const listStyles = {
  container: {
    background: "#fff",
    borderRadius: 16,
    padding: 16,
    boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    tableLayout: "fixed",
  },
  th: {
    textAlign: "left",
    fontSize: 13,
    fontWeight: 600,
    color: "#6B7280",
    padding: "8px 12px",
    borderBottom: "1px solid #eee",
  },
  empty: {
    textAlign: "center",
    padding: 20,
    color: "#9CA3AF",
  },
};