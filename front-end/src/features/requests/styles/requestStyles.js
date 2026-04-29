const styles = {
  page: {
    minHeight: "100vh",
    background: "#f6f7fd",
    padding: 28,
    fontFamily: "'Nunito', sans-serif",
  },
  surface: {
    background: "#ffffff",
    borderRadius: 24,
    padding: 28,
    boxShadow: "0 8px 30px rgba(99, 102, 241, 0.08)",
    border: "1px solid #eef0ff",
    maxWidth: 1100,
    margin: "0 auto",
  },

  // ── Header ────────────────────────────────────────────────────
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 28,
    flexWrap: "wrap",
    gap: 12,
  },
  h1: {
    margin: 0,
    fontSize: 24,
    fontWeight: 800,
    color: "#111827",
  },
  sub: {
    margin: "5px 0 0",
    fontSize: 13,
    color: "#6b7280",
    fontWeight: 500,
  },
  countChip: {
    background: "#eef2ff",
    color: "#4f46e5",
    borderRadius: 20,
    padding: "5px 14px",
    fontSize: 13,
    fontWeight: 700,
    alignSelf: "center",
  },

  // ── Table card ────────────────────────────────────────────────
  tableCard: {
    background: "#fff",
    borderRadius: 18,
    border: "1px solid #eef0ff",
    overflow: "hidden",
    boxShadow: "0 2px 12px rgba(99,102,241,0.06)",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  thead: {
    background: "linear-gradient(135deg, #f5f3ff 0%, #eef2ff 100%)",
  },
  th: {
    padding: "14px 18px",
    textAlign: "left",
    fontSize: 12,
    fontWeight: 700,
    color: "#6b7280",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    borderBottom: "1px solid #eef0ff",
  },
  td: {
    padding: "16px 18px",
    fontSize: 14,
    color: "#111827",
    verticalAlign: "middle",
    borderBottom: "1px solid #f5f5ff",
  },
  row: {
    transition: "background 0.15s",
  },

  // ── Book cell ─────────────────────────────────────────────────
  bookCell: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
  bookCover: {
    width: 42,
    height: 54,
    borderRadius: 8,
    objectFit: "cover",
    flexShrink: 0,
    border: "1px solid #eef0ff",
  },
  bookCoverFallback: {
    width: 42,
    height: 54,
    borderRadius: 8,
    background: "#eef2ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 18,
    flexShrink: 0,
  },
  bookTitle: {
    margin: 0,
    fontWeight: 700,
    fontSize: 14,
    color: "#111827",
  },
  bookMeta: {
    margin: "3px 0 0",
    fontSize: 12,
    color: "#9ca3af",
  },

  // ── Status badge ──────────────────────────────────────────────
  badge: {
    display: "inline-flex",
    alignItems: "center",
    gap: 5,
    padding: "4px 12px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 700,
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: "50%",
  },

  // ── Date cell ─────────────────────────────────────────────────
  dateText: {
    fontSize: 13,
    color: "#374151",
    fontWeight: 500,
  },
  dateSubText: {
    fontSize: 11,
    color: "#9ca3af",
    marginTop: 2,
  },

  // ── Duration cell ─────────────────────────────────────────────
  durationChip: {
    background: "#f5f3ff",
    color: "#7c3aed",
    borderRadius: 8,
    padding: "4px 10px",
    fontSize: 12,
    fontWeight: 700,
    display: "inline-block",
  },

  // ── Actions ───────────────────────────────────────────────────
  btnCancel: {
    border: "none",
    background: "#fef2f2",
    color: "#dc2626",
    borderRadius: 10,
    padding: "7px 14px",
    fontSize: 13,
    fontWeight: 700,
    cursor: "pointer",
  },
  dashText: {
    color: "#d1d5db",
    fontSize: 16,
    fontWeight: 700,
  },

  // ── Empty ─────────────────────────────────────────────────────
  emptyWrap: {
    padding: "64px 0",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 10,
    color: "#9ca3af",
  },
  emptyIcon: { fontSize: 48 },
  emptyText: { margin: 0, fontSize: 15, fontWeight: 700, color: "#6b7280" },
  emptySubText: { margin: 0, fontSize: 13 },

  // ── State ─────────────────────────────────────────────────────
  stateWrap: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "60vh",
    gap: 10,
    fontFamily: "'Nunito', sans-serif",
    fontSize: 15,
    fontWeight: 600,
    color: "#6b7280",
  },
  stateIcon: { fontSize: 38 },
  errorText: { color: "#dc2626" },

  // ── Toast ─────────────────────────────────────────────────────
  toast: {
    position: "fixed",
    top: 18,
    right: 22,
    color: "#fff",
    padding: "12px 16px",
    borderRadius: 14,
    fontSize: 14,
    fontWeight: 700,
    zIndex: 2500,
    boxShadow: "0 14px 30px rgba(15,23,42,0.2)",
  },
};

export default styles;