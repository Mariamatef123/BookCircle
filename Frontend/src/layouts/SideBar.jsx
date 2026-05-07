import { useNavigate, useLocation } from "react-router-dom";
import { isLoggedIn, logout, getUser } from "../utils/auth";
import { useNotificationsContext } from "../context/notificationContext";

const HomeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
  </svg>
);
const RequestsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <line x1="3" y1="9" x2="21" y2="9" />
    <line x1="9" y1="21" x2="9" y2="9" />
  </svg>
);
const ReadingListIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
  </svg>
);
const NotificationsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);
const ProfileIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="7" r="4" />
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
  </svg>
);
const LoginIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M10 17l5-5-5-5" />
    <path d="M15 12H3" />
  </svg>
);
const LogoutIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

export default function SideBar() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const loggedIn  = isLoggedIn();
  const user      = getUser();

  // ─── shared state from context — same instance as NavBar ───
  const { unreadCount } = useNotificationsContext();

  const handleNotificationsClick = () => {
    navigate("/notifications");
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleProfileClick = () => {
    if (user?.role === "BOOK_OWNER") {
      navigate(`/profile/${user.id}`);
    }
  };

  const navItems = [
    { label: "Home", icon: HomeIcon, path: "/" },

    user?.role === "READER" && {
      label: "Requests",
      icon: RequestsIcon,
      path: "/requests",
    },

    user?.role === "READER" && {
      label: "Reading List",
      icon: ReadingListIcon,
      path: "/reading-list",
    },

    loggedIn && (user?.role === "BOOK_OWNER" || user?.role === "READER") && {
      label: "Notifications",
      icon: NotificationsIcon,
      path: "/notifications",
      badge: unreadCount,
      onClick: handleNotificationsClick,
    },

    loggedIn
      ? (user?.role === "ADMIN" || user?.role === "BOOK_OWNER") && {
          label: "Dashboard",
          icon: ProfileIcon,
          path: "/dashboard",
        }
      : { label: "Login", icon: LoginIcon, path: "/login" },

  ].filter(Boolean);

  return (
    <div style={styles.wrapper}>
      <nav style={styles.nav}>
        {navItems.map(({ label, icon: Icon, path, badge, onClick }) => {
          const isActive = location.pathname === path;

          return (
            <button
              key={label}
              onClick={() => onClick ? onClick() : navigate(path)}
              style={{
                ...styles.navItem,
                ...(isActive ? styles.navItemActive : {}),
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.background = "#f5f5ff";
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.background = "transparent";
              }}
            >
              <span style={{ ...styles.icon, color: isActive ? "#5b5bd6" : "#9090a0" }}>
                <Icon />
              </span>

              <span style={{
                ...styles.label,
                fontWeight: isActive ? 700 : 500,
                color: isActive ? "#5b5bd6" : "#3d3d4e",
              }}>
                {label}
              </span>

              {badge > 0 && (
                <span style={styles.badge}>
                  {badge > 99 ? "99+" : badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {loggedIn && user && (
        <div style={styles.userSection}>
          <div style={styles.userCard} onClick={handleProfileClick}>
            <div style={styles.userAvatar}>
              {user.name?.split(" ").map((p) => p[0]?.toUpperCase()).slice(0, 2).join("") || "U"}
            </div>
            <div style={styles.userInfo}>
              <p style={styles.userName}>{user.name || "User"}</p>
              <p style={styles.userRole}>
                {user.role?.replaceAll("_", " ") || "Member"}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            style={styles.logoutBtn}
            onMouseEnter={(e) => e.currentTarget.style.background = "#fef2f2"}
            onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
          >
            <LogoutIcon />
            <span>Logout</span>
          </button>
        </div>
      )}
    </div>
  );
}

const styles = {
  wrapper: {
    backgroundColor: "#ffffff",
    display: "flex",
    flexDirection: "column",
    padding: "20px 12px",
    fontFamily: "'Nunito', sans-serif",
    borderRight: "1px solid #eef0ff",
    gap: 4,
    position: "sticky",
    top: "0",
    overflowY: "auto",
  },
  nav: {
    display: "flex",
    flexDirection: "column",
    gap: 2,
    flex: 1,
  },
  navItem: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "10px 14px",
    borderRadius: 12,
    border: "none",
    backgroundColor: "transparent",
    cursor: "pointer",
    width: "100%",
    textAlign: "left",
    transition: "background 0.15s",
  },
  navItemActive: {
    backgroundColor: "#ededfc",
  },
  icon: {
    display: "flex",
    alignItems: "center",
    flexShrink: 0,
  },
  label: {
    fontSize: 15,
    flex: 1,
  },
  badge: {
    background: "#ef4444",
    color: "#fff",
    fontSize: 11,
    fontWeight: 700,
    borderRadius: 999,
    minWidth: 20,
    height: 20,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "0 5px",
    flexShrink: 0,
  },
  userSection: {
    borderTop: "1px solid #eef0ff",
    paddingTop: 14,
    marginTop: 8,
    display: "flex",
    flexDirection: "column",
    gap: 4,
  },
  userCard: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "8px 10px",
    borderRadius: 12,
    background: "linear-gradient(135deg, #f5f3ff, #eef2ff)",
    border: "1px solid #e0e7ff",
    cursor: "pointer",
  },
  userAvatar: {
    width: 36,
    height: 36,
    borderRadius: "50%",
    background: "linear-gradient(135deg, #5b5bd6, #8b5cf6)",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 800,
    fontSize: 13,
    flexShrink: 0,
  },
  userInfo: { minWidth: 0 },
  userName: {
    margin: 0,
    fontSize: 13,
    fontWeight: 700,
    color: "#111827",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  userRole: {
    margin: "2px 0 0",
    fontSize: 11,
    color: "#6b7280",
    textTransform: "capitalize",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  logoutBtn: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "9px 14px",
    borderRadius: 12,
    border: "none",
    background: "transparent",
    color: "#dc2626",
    fontSize: 14,
    fontWeight: 700,
    cursor: "pointer",
    width: "100%",
    textAlign: "left",
    transition: "background 0.15s",
  },
};