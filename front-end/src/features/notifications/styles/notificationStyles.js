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
    // maxWidth: 780,
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
  h1: { margin: 0, fontSize: 24, fontWeight: 800, color: "#111827" },
  sub: { margin: "5px 0 0", fontSize: 13, color: "#6b7280", fontWeight: 500 },
  countChip: {
    background: "#eef2ff",
    color: "#4f46e5",
    borderRadius: 20,
    padding: "5px 14px",
    fontSize: 13,
    fontWeight: 700,
    alignSelf: "center",
  },
  markAllBtn: {
    border: "1px solid #e0e7ff",
    background: "#fff",
    color: "#4f46e5",
    borderRadius: 10,
    padding: "7px 14px",
    fontSize: 13,
    fontWeight: 700,
    cursor: "pointer",
    alignSelf: "center",
  },

  // ── List ──────────────────────────────────────────────────────
  list: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },

  // ── Card ──────────────────────────────────────────────────────
  card: {
    borderRadius: 16,
    border: "1px solid #eef0ff",
    padding: "16px 18px",
    cursor: "pointer",
    transition: "transform 0.15s, box-shadow 0.15s",
    position: "relative",
  },
  cardUnread: {
    background: "#eef2ff",
    borderColor: "#c7d2fe",
  },
  cardRead: {
    background: "#fff",
  },

  // ── Card inner ────────────────────────────────────────────────
  cardTop: {
    display: "flex",
    alignItems: "flex-start",
    gap: 14,
  },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: 12,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 20,
    flexShrink: 0,
  },
  cardBody: { flex: 1, minWidth: 0 },
  cardTitleRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 8,
    flexWrap: "wrap",
  },
  cardTitle: {
    margin: 0,
    fontSize: 14,
    fontWeight: 800,
    color: "#111827",
    lineHeight: 1.35,
  },
  cardTime: {
    fontSize: 11,
    color: "#9ca3af",
    fontWeight: 600,
    whiteSpace: "nowrap",
    flexShrink: 0,
  },
  cardMessage: {
    margin: "5px 0 0",
    fontSize: 13,
    color: "#6b7280",
    lineHeight: 1.6,
  },

  // ── CTA strip (e.g. "Go to Payment") ─────────────────────────
  ctaStrip: {
    marginTop: 12,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    background: "linear-gradient(135deg, #4f46e5, #6d5ef4)",    width: "fit-content",
    borderRadius: 12,
    padding: "10px 16px",
    color: "#fff",
  },
  ctaText: {
    fontSize: 13,
    fontWeight: 700,
  },
  ctaArrow: {
    fontSize: 16,
    fontWeight: 800,
  },

  // ── Unread dot ────────────────────────────────────────────────
  unreadDot: {
    position: "absolute",
    top: 16,
    right: 16,
    width: 9,
    height: 9,
    borderRadius: "50%",
    background: "#4f46e5",
    boxShadow: "0 0 0 2px #fff",
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
  emptyIcon:    { fontSize: 52 },
  emptyText:    { margin: 0, fontSize: 15, fontWeight: 700, color: "#6b7280" },
  emptySubText: { margin: 0, fontSize: 13 },

  // ── States ────────────────────────────────────────────────────
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
};

export default styles;