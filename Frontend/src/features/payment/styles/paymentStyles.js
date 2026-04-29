const styles = {
  page: {
    minHeight: "100vh",
    background: "#f6f7fd",
    padding: 28,
    fontFamily: "'Nunito', sans-serif",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  surface: {
    background: "#ffffff",
    borderRadius: 24,
    padding: 32,
    boxShadow: "0 8px 30px rgba(99, 102, 241, 0.08)",
    border: "1px solid #eef0ff",
    width: "100%",
    // maxWidth: 860,
    margin: "0 auto",
  },

  // ── Back button ───────────────────────────────────────────────
  backButton: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    border: "none",
    background: "transparent",
    color: "#5b5bd6",
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    padding: 0,
    marginBottom: 28,
  },

  // ── Layout ────────────────────────────────────────────────────
  layout: {
    display: "grid",
    gridTemplateColumns: "260px 1fr",
    gap: 24,
    alignItems: "start",
  },

  // ── Book summary card ─────────────────────────────────────────
  bookCard: {
    background: "linear-gradient(135deg, #eef2ff 0%, #f5f3ff 100%)",
    borderRadius: 18,
    padding: 20,
    border: "1px solid #e0e7ff",
    display: "flex",
    flexDirection: "column",
    gap: 14,
  },
  bookCoverWrap: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    overflow: "hidden",
    background: "#e0e7ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  bookCoverImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },
  bookCoverFallback: {
    fontSize: 48,
    color: "#a5b4fc",
  },
  bookTitle: {
    margin: 0,
    fontSize: 16,
    fontWeight: 800,
    color: "#111827",
    lineHeight: 1.35,
  },
  bookAuthor: {
    margin: "4px 0 0",
    fontSize: 13,
    color: "#6b7280",
  },
  bookMeta: {
    margin: "4px 0 0",
    fontSize: 12,
    color: "#9ca3af",
  },
  divider: {
    border: "none",
    borderTop: "1px solid #e0e7ff",
    margin: "4px 0",
  },
  amountRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  amountLabel: {
    fontSize: 13,
    color: "#6b7280",
    fontWeight: 600,
  },
  amountValue: {
    fontSize: 20,
    fontWeight: 800,
    color: "#4f46e5",
  },

  // ── Payment form card ─────────────────────────────────────────
  formCard: {
    background: "#fff",
    borderRadius: 18,
    padding: 28,
    border: "1px solid #eef0ff",
    boxShadow: "0 4px 16px rgba(99,102,241,0.06)",
  },
  formHeader: { marginBottom: 24 },
  formTitle: {
    margin: 0,
    fontSize: 22,
    fontWeight: 800,
    color: "#111827",
  },
  formSubtitle: {
    margin: "6px 0 0",
    fontSize: 13,
    color: "#6b7280",
  },

  // ── Card visual ───────────────────────────────────────────────
  cardVisual: {
    background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
    borderRadius: 16,
    padding: "20px 22px",
    marginBottom: 24,
    color: "#fff",
    position: "relative",
    overflow: "hidden",
    boxShadow: "0 8px 24px rgba(79,70,229,0.30)",
  },
  cardVisualChip: {
    width: 34,
    height: 26,
    borderRadius: 4,
    background: "linear-gradient(135deg, #fbbf24, #f59e0b)",
    marginBottom: 20,
  },
  cardVisualNumber: {
    fontSize: 17,
    fontWeight: 700,
    letterSpacing: 3,
    marginBottom: 16,
    opacity: 0.95,
  },
  cardVisualRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  cardVisualLabel: {
    fontSize: 10,
    opacity: 0.7,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  cardVisualValue: {
    fontSize: 13,
    fontWeight: 700,
  },
  cardVisualCircle1: {
    position: "absolute",
    top: -30,
    right: -30,
    width: 120,
    height: 120,
    borderRadius: "50%",
    background: "rgba(255,255,255,0.07)",
  },
  cardVisualCircle2: {
    position: "absolute",
    bottom: -40,
    right: 40,
    width: 160,
    height: 160,
    borderRadius: "50%",
    background: "rgba(255,255,255,0.05)",
  },

  // ── Form fields ───────────────────────────────────────────────
  fieldGroup: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  fieldRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 12,
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },
  label: {
    fontSize: 12,
    fontWeight: 700,
    color: "#374151",
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  input: {
    border: "1.5px solid #e5e7eb",
    borderRadius: 12,
    padding: "11px 14px",
    fontSize: 14,
    color: "#111827",
    outline: "none",
    fontFamily: "inherit",
    background: "#fff",
    transition: "border-color 0.15s",
  },
  inputFocus: {
    borderColor: "#6366f1",
    boxShadow: "0 0 0 3px rgba(99,102,241,0.12)",
  },

  // ── Error / success ───────────────────────────────────────────
  errorBox: {
    background: "#fef2f2",
    color: "#dc2626",
    borderRadius: 10,
    padding: "10px 14px",
    fontSize: 13,
    fontWeight: 600,
    marginTop: 4,
  },
  successBox: {
    background: "#f0fdf4",
    color: "#16a34a",
    borderRadius: 10,
    padding: "10px 14px",
    fontSize: 13,
    fontWeight: 600,
    marginTop: 4,
  },

  // ── Submit button ─────────────────────────────────────────────
  submitBtn: {
    marginTop: 8,
    width: "100%",
    padding: "14px 0",
    border: "none",
    borderRadius: 14,
    background: "linear-gradient(135deg, #4f46e5, #6d5ef4)",
    color: "#fff",
    fontSize: 15,
    fontWeight: 800,
    cursor: "pointer",
    boxShadow: "0 10px 22px rgba(79,70,229,0.24)",
    transition: "opacity 0.15s",
  },
  submitBtnDisabled: {
    opacity: 0.6,
    cursor: "not-allowed",
  },

  // ── Secure badge ──────────────────────────────────────────────
  secureBadge: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginTop: 14,
    fontSize: 12,
    color: "#9ca3af",
    fontWeight: 600,
  },

  // ── State panel ───────────────────────────────────────────────
  stateWrap: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "60vh",
    gap: 12,
    fontSize: 15,
    fontWeight: 600,
    color: "#6b7280",
  },
  stateIcon: { fontSize: 40 },
  errorText: { color: "#dc2626" },
  stateBtn: {
    border: "none",
    background: "linear-gradient(135deg, #4f46e5, #6d5ef4)",
    color: "#fff",
    borderRadius: 12,
    padding: "10px 22px",
    cursor: "pointer",
    fontWeight: 700,
    fontSize: 14,
    marginTop: 4,
  },

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