import { useEffect, useState, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { browseBooks } from "../Service/BookService";
import { getNotifications, markAsRead } from "../Service/NotificationService";
import { getUser } from "../utils/auth";
import { BooksIcon, SettingsIcon, XIcon } from "./icons/AppIcons";

function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = getUser();
  const userId = user?.id;

  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({ genre: "", language: "", maxPrice: "" });
  const [notifications, setNotifications] = useState([]);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notificationsLoading, setNotificationsLoading] = useState(false);

  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  const filterPanelRef = useRef(null);
  const notificationRef = useRef(null);

  // Sync title with URL
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSearchTerm(params.get("q") ?? "");
  }, [location.search]);
  /* eslint-enable react-hooks/set-state-in-effect */

  // Close dropdown/filters on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      const clickedOutsideSearch =
        dropdownRef.current && !dropdownRef.current.contains(e.target) &&
        inputRef.current   && !inputRef.current.contains(e.target);
      const clickedOutsideFilters =
        filterPanelRef.current && !filterPanelRef.current.contains(e.target);
      const clickedOutsideNotifications =
        notificationRef.current && !notificationRef.current.contains(e.target);

      if (clickedOutsideSearch) setShowSuggestions(false);
      if (clickedOutsideSearch && clickedOutsideFilters) setShowFilters(false);
      if (clickedOutsideNotifications) setNotificationsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((notification) => !getNotificationIsRead(notification)).length;

  const fetchNotifications = async () => {
    if (!userId) {
      setNotifications([]);
      return;
    }

    setNotificationsLoading(true);
    try {
      const res = await getNotifications(userId);
      setNotifications(Array.isArray(res?.data) ? res.data : []);
    } catch {
      setNotifications([]);
    } finally {
      setNotificationsLoading(false);
    }
  };

  /* eslint-disable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */
  useEffect(() => {
    fetchNotifications();
  }, [userId]);
  /* eslint-enable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */

  const activeFilterCount = Object.values(filters).filter((v) => v !== "").length;

  // ─── Debounced live suggestions ───────────────────────────────
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const trimmedTitle = searchTerm.trim();
    const hasAnyFilter =
      trimmedTitle ||
      filters.genre.trim() ||
      filters.language.trim() ||
      filters.maxPrice;

    if (!hasAnyFilter) {
      setSuggestions([]);
      setShowSuggestions(false);
      setHighlightedIndex(-1);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await browseBooks({
          title:    trimmedTitle    || undefined,
          genre:    filters.genre.trim()    || undefined,
          language: filters.language.trim() || undefined,
          maxPrice: filters.maxPrice        || undefined,
        });
        const list = Array.isArray(res?.data) ? res.data : [];
        setSuggestions(list.slice(0, 8));
        setShowSuggestions(list.length > 0);
        setHighlightedIndex(-1);
      } catch {
        setSuggestions([]);
        setShowSuggestions(false);
      } finally {
        setLoading(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [searchTerm, filters]);
  /* eslint-enable react-hooks/set-state-in-effect */

  // ─── Submit ───────────────────────────────────────────────────
  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = searchTerm.trim();
    const query = new URLSearchParams();
    if (trimmed)               query.set("q",        trimmed);
    if (filters.genre.trim())  query.set("genre",    filters.genre.trim());
    if (filters.language.trim()) query.set("language", filters.language.trim());
    if (filters.maxPrice)      query.set("maxPrice", filters.maxPrice);

    const qs = query.toString();
    navigate(qs ? `/?${qs}` : "/", { replace: location.pathname === "/" });
    setShowSuggestions(false);
    setShowFilters(false);
    inputRef.current?.blur();
  };

  const handleSuggestionClick = (book) => {
    setSearchTerm(book.title);
    setShowSuggestions(false);
    setHighlightedIndex(-1);
    navigate(`/?q=${encodeURIComponent(book.title)}`);
  };

  const clearFilters = () => {
    setFilters({ genre: "", language: "", maxPrice: "" });
  };

  const handleNotificationToggle = async () => {
    if (!userId) {
      navigate("/login");
      return;
    }

    if (!notificationsOpen) {
      await fetchNotifications();
    }

    setNotificationsOpen((prev) => !prev);
  };

  const handleNotificationClick = async (notification) => {
    const notificationId = getNotificationId(notification);

    if (notificationId && !getNotificationIsRead(notification)) {
      try {
        await markAsRead(notificationId,userId);
        setNotifications((prev) =>
          prev.map((item) =>
            getNotificationId(item) === notificationId
              ? { ...item, isRead: true, IsRead: true }
              : item
          )
        );
      } catch {
        // keep navigation even if marking as read fails
      }
    }

    const target = getNotificationTarget(notification);
    setNotificationsOpen(false);

    if (target) {
      navigate(target);
    }
  };

  // ─── Keyboard nav ─────────────────────────────────────────────
  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((p) => (p < suggestions.length - 1 ? p + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((p) => (p > 0 ? p - 1 : suggestions.length - 1));
    } else if (e.key === "Enter" && highlightedIndex >= 0) {
      e.preventDefault();
      handleSuggestionClick(suggestions[highlightedIndex]);
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
      setShowFilters(false);
      setHighlightedIndex(-1);
    }
  };

  return (
    <nav className="navbar navbar-expand-lg bg-body-white pb-0" >
      <div
        className="container-fluid mt-2"
        style={{ borderBottom: "1px solid #f0f0f5", paddingBottom: "15px" }}
      >
        {/* BRAND */}
        <div className="col-2 text-center">
          <Link
            className="navbar-brand fs-4"
            to="/"
            style={{ fontWeight: "bold", textDecoration: "none", color: "inherit" }}
          >
            Book Circle
          </Link>
        </div>

        {/* SEARCH */}
        <div
          className="collapse navbar-collapse col-6 justify-content-center"
          id="navbarSupportedContent"
        >
          <form
            className="d-flex w-100"
            role="search"
            onSubmit={handleSubmit}
            style={{ position: "relative" }}
          >
            {/* Search input row */}
            <div style={{ position: "relative", flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", border: "1px solid #dee2e6", borderRadius: 8, overflow: "visible", background: "#fff" }}>

                {/* Title input */}
                <input
                  ref={inputRef}
                  className="form-control border-0 shadow-none"
                  type="search"
                  placeholder="Search books by title..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                  onKeyDown={handleKeyDown}
                  autoComplete="off"
                  style={{ borderRadius: 0, flex: 1 }}
                />

                {/* Filter toggle button */}
                <button
                  type="button"
                  onClick={() => setShowFilters((p) => !p)}
                  style={{
                    border: "none",
                    borderLeft: "1px solid #dee2e6",
                    background: showFilters ? "#EEF2FF" : "#F9FAFB",
                    padding: "8px 12px",
                    cursor: "pointer",
                    color: showFilters ? "#4F46E5" : "#6B7280",
                    fontSize: 13,
                    fontWeight: 500,
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    whiteSpace: "nowrap",
                  }}
                >
                  <SettingsIcon size={15} /> Filters
                  {activeFilterCount > 0 && (
                    <span style={{
                      background: "#4F46E5", color: "#fff",
                      borderRadius: "50%", width: 18, height: 18,
                      fontSize: 11, fontWeight: 700,
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      {activeFilterCount}
                    </span>
                  )}
                </button>
              </div>

              {/* ── FILTER PANEL ── */}
              {showFilters && (
                <div
                  ref={filterPanelRef}
                  style={{
                    position: "absolute",
                    top: "calc(100% + 6px)",
                    left: 0,
                    right: 0,
                    background: "#fff",
                    border: "1px solid #E5E7EB",
                    borderRadius: 12,
                    zIndex: 1001,
                    padding: 16,
                    boxShadow: "0 8px 24px rgba(0,0,0,0.10)",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                    <span style={{ fontWeight: 600, fontSize: 13, color: "#111827" }}>Filter Results</span>
                    {activeFilterCount > 0 && (
                      <button
                        type="button"
                        onClick={clearFilters}
                        style={{ background: "none", border: "none", color: "#EF4444", fontSize: 12, cursor: "pointer", fontWeight: 500, display: "inline-flex", alignItems: "center", gap: 4 }}
                      >
                        <XIcon size={12} /> Clear all
                      </button>
                    )}
                  </div>

                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    {/* Genre */}
                    <div style={{ flex: 1, minWidth: 120 }}>
                      <label style={labelStyle}>Genre</label>
                      <input
                        style={filterInputStyle}
                        type="text"
                        placeholder="e.g. Fiction"
                        value={filters.genre}
                        onChange={(e) => setFilters((p) => ({ ...p, genre: e.target.value }))}
                      />
                    </div>

                    {/* Language */}
                    <div style={{ flex: 1, minWidth: 120 }}>
                      <label style={labelStyle}>Language</label>
                      <input
                        style={filterInputStyle}
                        type="text"
                        placeholder="e.g. Arabic"
                        value={filters.language}
                        onChange={(e) => setFilters((p) => ({ ...p, language: e.target.value }))}
                      />
                    </div>

                    {/* Max Price */}
                    <div style={{ flex: 1, minWidth: 100 }}>
                      <label style={labelStyle}>Max Price (L.E)</label>
                      <input
                        style={filterInputStyle}
                        type="number"
                        placeholder="e.g. 50"
                        min={0}
                        value={filters.maxPrice}
                        onChange={(e) => setFilters((p) => ({ ...p, maxPrice: e.target.value }))}
                      />
                    </div>
                  </div>

                  {/* Active filter badges */}
                  {activeFilterCount > 0 && (
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 10 }}>
                      {filters.genre && (
                        <span style={badgeStyle}>
                          Genre: <strong>{filters.genre}</strong>
                          <button style={badgeClearStyle} onClick={() => setFilters((p) => ({ ...p, genre: "" }))}>
                            <XIcon size={10} />
                          </button>
                        </span>
                      )}
                      {filters.language && (
                        <span style={badgeStyle}>
                          Language: <strong>{filters.language}</strong>
                          <button style={badgeClearStyle} onClick={() => setFilters((p) => ({ ...p, language: "" }))}>
                            <XIcon size={10} />
                          </button>
                        </span>
                      )}
                      {filters.maxPrice && (
                        <span style={badgeStyle}>
                          Max: <strong>{filters.maxPrice} L.E</strong>
                          <button style={badgeClearStyle} onClick={() => setFilters((p) => ({ ...p, maxPrice: "" }))}>
                            <XIcon size={10} />
                          </button>
                        </span>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* ── SUGGESTIONS DROPDOWN ── */}
              {showSuggestions && !showFilters && (
                <div
                  ref={dropdownRef}
                  style={{
                    position: "absolute",
                    top: "calc(100% + 6px)",
                    left: 0,
                    right: 0,
                    background: "#fff",
                    border: "1px solid #E5E7EB",
                    borderRadius: 10,
                    zIndex: 1000,
                    maxHeight: 320,
                    overflowY: "auto",
                    boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
                  }}
                >
                  {/* Header */}
                  <div style={{ padding: "8px 14px 4px", fontSize: 11, color: "#9CA3AF", fontWeight: 600, letterSpacing: 0.5, borderBottom: "1px solid #F3F4F6" }}>
                    {loading ? "SEARCHING..." : `${suggestions.length} RESULT${suggestions.length !== 1 ? "S" : ""}`}
                  </div>

                  {loading ? (
                    <div style={itemStyle}>
                      <span style={{ color: "#9CA3AF", fontSize: 13 }}>Loading suggestions...</span>
                    </div>
                  ) : suggestions.length === 0 ? (
                    <div style={itemStyle}>
                      <span style={{ color: "#9CA3AF", fontSize: 13 }}>No books match your search</span>
                    </div>
                  ) : (
                    suggestions.map((book, index) => (
                      <div
                        key={book.id}
                        onClick={() => handleSuggestionClick(book)}
                        onMouseEnter={() => setHighlightedIndex(index)}
                        onMouseLeave={() => setHighlightedIndex(-1)}
                        style={{
                          ...itemStyle,
                          background: highlightedIndex === index ? "#EEF2FF" : "#fff",
                        }}
                      >
                        {/* Cover */}
                        {book.coverImageBase64 ? (
                          <img
                            src={`data:image/jpeg;base64,${book.coverImageBase64}`}
                            alt={book.title}
                            style={{ width: 34, height: 44, borderRadius: 4, objectFit: "cover", flexShrink: 0 }}
                          />
                        ) : (
                          <span style={{ color: "#4F46E5", flexShrink: 0 }}>
                            <BooksIcon size={22} />
                          </span>
                        )}

                        {/* Info */}
                        <div style={{ flex: 1, minWidth: 0, marginLeft: 10 }}>
                          <div style={{
                            fontWeight: 500, fontSize: 13,
                            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                            color: highlightedIndex === index ? "#4F46E5" : "#111827",
                          }}>
                            {book.title}
                          </div>
                          <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 2 }}>
                            {[book.genre, book.language].filter(Boolean).join(" • ")}
                          </div>
                        </div>

                        {/* Price */}
                        {book.borrowPrice != null && (
                          <span style={{ fontSize: 12, color: "#4F46E5", fontWeight: 600, marginLeft: 8, whiteSpace: "nowrap" }}>
                            {book.borrowPrice} L.E
                          </span>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Search button */}
            <button
              className="btn ms-2"
              type="submit"
              style={{ border: "1px solid #dee2e6", whiteSpace: "nowrap", background: "#4F46E5", color: "#fff", borderRadius: 8, padding: "8px 18px", fontWeight: 500 }}
            >
              Search
            </button>
          </form>
        </div>

        {/* RIGHT SIDE */}
        <div className="d-flex align-items-center gap-3 col-2 justify-content-center">
          <div ref={notificationRef} style={{ position: "relative" }}>
            <button type="button" style={notificationButtonStyle} onClick={handleNotificationToggle}>
              <svg width="22" height="22" fill="currentColor" className="bi bi-bell" viewBox="0 0 16 16">
                <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2" />
                <path d="M8 1.918l-.797.161A4 4 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4 4 0 0 0-3.203-3.92z" />
              </svg>
              {unreadCount > 0 && <span style={notificationBadgeStyle}>{unreadCount > 9 ? "9+" : unreadCount}</span>}
            </button>

            {notificationsOpen && (
              <div style={notificationPanelStyle}>
                <div style={notificationHeaderStyle}>
                  <span>Notifications</span>
                  {notificationsLoading && <span style={notificationSubtleStyle}>Loading...</span>}
                </div>

                {notificationsLoading ? (
                  <div style={notificationStateStyle}>Loading notifications...</div>
                ) : notifications.length === 0 ? (
                  <div style={notificationStateStyle}>No notifications yet.</div>
                ) : (
                  notifications.filter((notification) => !notification.isRead).map((notification) => (
                    <button
                      key={getNotificationId(notification)}
                      type="button"
                      style={{
                        ...notificationItemStyle,
                        background: getNotificationIsRead(notification) ? "#fff" : "#eef2ff",
                      }}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div style={{ minWidth: 0 }}>
                        <div style={notificationMessageStyle}>{getNotificationMessage(notification)}</div>
                        <div style={notificationTimeStyle}>
                          {formatNotificationTime(notification.createdAt || notification.CreatedAt)}
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          <div className="d-flex align-items-center gap-2">
            <svg width="28" height="28" fill="currentColor" className="bi bi-person-circle" viewBox="0 0 16 16">
              <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
            </svg>
            <div className="lh-sm">
              <div style={{ fontWeight: "600", fontSize: "14px" }}>{user?.name || "Guest"}</div>
              <div style={{ fontSize: "12px", color: "gray" }}>{formatUserRole(user?.role)}</div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

// ─── Shared styles ────────────────────────────────────────────
const itemStyle = {
  display: "flex", alignItems: "center",
  padding: "10px 14px", cursor: "pointer",
  borderBottom: "1px solid #F3F4F6",
  transition: "background 0.1s",  
};
const labelStyle = {
  display: "block", fontSize: 11, fontWeight: 600,
  color: "#6B7280", marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.4,
};
const filterInputStyle = {
  width: "100%", border: "1px solid #E5E7EB", borderRadius: 8,
  padding: "7px 10px", fontSize: 13, outline: "none",
  color: "#111827", boxSizing: "border-box",
};
const badgeStyle = {
  background: "#EEF2FF", color: "#4F46E5", borderRadius: 20,
  padding: "3px 10px", fontSize: 12,
  display: "inline-flex", alignItems: "center", gap: 6,
};
const badgeClearStyle = {
  background: "none", border: "none", color: "#818CF8",
  cursor: "pointer", fontSize: 11, padding: 0,
  display: "inline-flex", alignItems: "center",
};
const notificationButtonStyle = {
  border: "none",
  background: "transparent",
  cursor: "pointer",
  position: "relative",
  padding: 0,
  color: "#374151",
};
const notificationBadgeStyle = {
  position: "absolute",
  top: -6,
  right: -8,
  minWidth: 18,
  height: 18,
  borderRadius: 999,
  background: "#ef4444",
  color: "#fff",
  fontSize: 10,
  fontWeight: 700,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "0 5px",
};
const notificationPanelStyle = {
  position: "absolute",
  top: "calc(100% + 10px)",
  right: 0,
  width: 320,
  maxHeight: 360,
  overflowY: "auto",
  background: "#fff",
  border: "1px solid #E5E7EB",
  borderRadius: 14,
  boxShadow: "0 12px 30px rgba(0,0,0,0.12)",
  zIndex: 1100,
};
const notificationHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "12px 14px",
  borderBottom: "1px solid #F3F4F6",
  fontSize: 13,
  fontWeight: 700,
  color: "#111827",
};
const notificationSubtleStyle = {
  fontSize: 11,
  color: "#9CA3AF",
  fontWeight: 600,
};
const notificationStateStyle = {
  padding: "16px 14px",
  fontSize: 13,
  color: "#6B7280",
};
const notificationItemStyle = {
  width: "100%",
  border: "none",
  borderBottom: "1px solid #F3F4F6",
  textAlign: "left",
  padding: "12px 14px",
  cursor: "pointer",
};
const notificationMessageStyle = {
  fontSize: 13,
  color: "#111827",
  fontWeight: 600,
  lineHeight: 1.5,
};
const notificationTimeStyle = {
  marginTop: 4,
  fontSize: 11,
  color: "#9CA3AF",
};

function getNotificationId(notification) {
  return notification?.id ?? notification?.Id;
}

function getNotificationIsRead(notification) {
  return Boolean(notification?.isRead ?? notification?.IsRead);
}

function getNotificationMessage(notification) {
  return notification?.message ?? notification?.Message ?? "New notification";
}

function getNotificationTarget(notification) {
  const bookId = notification?.bookId ?? notification?.BookId;
  const type = String(notification?.type ?? notification?.Type ?? "").toUpperCase();

  if (!bookId) return null;

  if (type.includes("COMMENT")) {
    return `/book/${bookId}?tab=comments`;
  }

  return `/book/${bookId}`;
}

function formatNotificationTime(value) {
  if (!value) return "Just now";

  try {
    return new Date(value).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return "Just now";
  }
}

function formatUserRole(role) {
  if (!role) return "User";
  return role.replaceAll("_", " ");
}

export default NavBar;
