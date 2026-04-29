const styles = {
  overlay: {
    position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)",
    display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000,
  },
  modal: {
    background: "#fff", borderRadius: 16, width: "100%", maxWidth: 640,
    maxHeight: "90vh", display: "flex", flexDirection: "column",
    boxShadow: "0 20px 60px rgba(0,0,0,0.2)", overflow: "hidden",
  },
  header: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "20px 24px", borderBottom: "1px solid #F3F4F6",
  },
  title: { margin: 0, fontSize: 18, fontWeight: 700, color: "#111827" },
  closeBtn: { background: "none", border: "none", fontSize: 18, cursor: "pointer", color: "#9CA3AF" },
  body: {
    padding: "20px 24px", overflowY: "auto",
    display: "flex", flexDirection: "column", gap: 16, flex: 1,
  },
  footer: {
    display: "flex", justifyContent: "flex-end", gap: 10,
    padding: "16px 24px", borderTop: "1px solid #F3F4F6",
  },
  cancelBtn: {
    background: "#F9FAFB", border: "1px solid #E5E7EB",
    borderRadius: 8, padding: "9px 18px", cursor: "pointer", fontSize: 14,
  },
  submitBtn: {
    background: "#4F46E5", color: "#fff", border: "none",
    borderRadius: 8, padding: "9px 18px", cursor: "pointer", fontWeight: 600, fontSize: 14,
  },
  submitBtnDisabled: {
    background: "#A5B4FC", color: "#fff", border: "none",
    borderRadius: 8, padding: "9px 18px", cursor: "not-allowed", fontSize: 14,
  },
  grid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },
  section: { display: "flex", flexDirection: "column", gap: 10 },
  label: { fontSize: 13, fontWeight: 600, color: "#374151" },
  input: {
    border: "1px solid #E5E7EB", borderRadius: 8, padding: "10px 12px",
    fontSize: 14, outline: "none", width: "100%",
    background: "#fff", boxSizing: "border-box",
  },
  textarea: {
    border: "1px solid #E5E7EB", borderRadius: 8, padding: "10px 12px",
    fontSize: 14, outline: "none", width: "100%", resize: "vertical",
    fontFamily: "inherit", background: "#fff", boxSizing: "border-box",
  },
  row: { display: "flex", gap: 8, alignItems: "center" },
  removeBtn: {
    background: "#FEE2E2", border: "none", color: "#DC2626",
    borderRadius: 6, padding: "8px 10px", cursor: "pointer", flexShrink: 0,
  },
  addBtn: {
    background: "none", border: "1px dashed #4F46E5",
    color: "#4F46E5", borderRadius: 8, padding: "8px", cursor: "pointer", width: "100%",
  },
  uploadBox: {
    display: "flex", gap: 12, alignItems: "center", padding: 12,
    border: "1px solid #E5E7EB", borderRadius: 10, background: "#F9FAFB",
  },
  image: { width: 80, height: 100, objectFit: "cover", borderRadius: 8, flexShrink: 0 },
  placeholder: {
    width: 80, height: 100, background: "#E5E7EB", borderRadius: 8, flexShrink: 0,
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 12, color: "#9CA3AF",
  },
  uploadBtn: {
    background: "#EEF2FF", color: "#4F46E5", border: "1px solid #C7D2FE",
    borderRadius: 8, padding: "7px 14px", fontSize: 13, fontWeight: 500,
    cursor: "pointer", display: "inline-block", textAlign: "center",
  },
  removeImgBtn: {
    background: "#FEE2E2", border: "none", color: "#DC2626",
    borderRadius: 6, padding: "6px 10px", cursor: "pointer", fontSize: 13,
  },
};

export default styles;