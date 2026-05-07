function UserSection({ user }) {
  return (
    <div className="d-flex align-items-center gap-2">
      <svg width="28" height="28" fill="currentColor" className="bi bi-person-circle" viewBox="0 0 16 16">
        <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
      </svg>
      <div className="lh-sm">
        <div style={{ fontWeight: "600", fontSize: "14px" }}>{user?.name || "Guest"}</div>
        <div style={{ fontSize: "12px", color: "gray" }}>{formatUserRole(user?.role)}</div>
      </div>
    </div>
  );
}

function formatUserRole(role) {
  if (!role) return "User";
  return role.replaceAll("_", " ");
}

export default UserSection;