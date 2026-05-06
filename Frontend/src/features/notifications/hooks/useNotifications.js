import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getNotifications, markAsRead } from "../../../Service/NotificationService";
import { getUser } from "../../../utils/auth";


const TYPE_CONFIG = {
  BORROW_REQUEST:  { label: "Borrow Request",    bg: "#eff6ff", getTarget: ()       => "/dashboard"               },
  BORROW_ACCEPTED: { label: "Request Accepted",  bg: "#f0fdf4", getTarget: (n)      => ({ path: "/payment", state: { bookId: n.bookId } }) },
  BORROW_REJECTED: { label: "Request Rejected",   bg: "#fef2f2", getTarget: (n)      => `/book/${n.bookId}`         },
  COMMENT_ADDED:   { label: "New Comment",         bg: "#fdf4ff", getTarget: (n)      => `/book/${n.bookId}?tab=comments` },
  COMMENT_REPLIED: { label: "Reply to Comment",   bg: "#fdf4ff", getTarget: (n)      => `/book/${n.bookId}?tab=comments` },
  BOOK_LIKED:      { label: "Book Liked",         bg: "#fff1f2", getTarget: (n)      => `/book/${n.bookId}`         },
  BOOK_DISLIKED:   { label: "Book Disliked",     bg: "#fff7ed", getTarget: (n)      => `/book/${n.bookId}`         },
  BOOK_APPROVED:   { label: "Book Approved",     bg: "#f0fdf4", getTarget: (n)      => `/book/${n.bookId}`         },
  BOOK_REJECTED:   { label: "Book Rejected",    bg: "#fef2f2", getTarget: (n)      => `/book/${n.bookId}`         },
  OWNER_APPROVED:  { label: "Owner Approved",     bg: "#fffbeb", getTarget: ()       => "/dashboard"               },
};

export const DEFAULT_CONFIG = { label: "Notification", icon: "bell", bg: "#f5f3ff", getTarget: () => null };

export function getTypeConfig(type) {
  return TYPE_CONFIG[type?.toUpperCase()] ?? DEFAULT_CONFIG;
}

export default function useNotifications() {
  const navigate = useNavigate();
  const user     = getUser();
  const userId   = user?.id;

  const [notifications, setNotifications] = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [error,         setError]         = useState("");

  const fetchNotifications = async () => {
    if (!userId) return;
    setLoading(true);
    setError("");
    try {
      const res = await getNotifications(userId);
      setNotifications(Array.isArray(res?.data) ? res.data : []);
    } catch (err) {
      setError(err?.message || "Failed to load notifications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchNotifications(); }, [userId]); // eslint-disable-line


  const markRead = async (id) => {
    try {
      await markAsRead(id, userId);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true, IsRead: true } : n))
      );
    } catch { /* non-critical */ }
  };

  const markAllRead = async () => {
    const unread = notifications.filter((n) => !getIsRead(n));
    await Promise.allSettled(unread.map((n) => markAsRead(getId(n), userId)));
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true, IsRead: true })));
  };

  const handleClick = async (n) => {
    const id = getId(n);
    if (!getIsRead(n)) await markRead(id);

    const config = getTypeConfig(n.type);
    const target = config.getTarget(n);

    if (!target) return;

    if (typeof target === "string") {
      navigate(target);
    } else {

      navigate(target.path, { state: target.state });
    }
  };

  const unreadCount = notifications.filter((n) => !getIsRead(n)).length;

  return {
    notifications, loading, error,
    unreadCount, handleClick, markAllRead,
  };
}

export function getId(n)      { return n?.id      ?? n?.Id;      }
export function getIsRead(n)  { return Boolean(n?.isRead ?? n?.IsRead); }
export function getTitle(n)   { return n?.title   ?? n?.Title   ?? getTypeConfig(n?.type).label; }
export function getMessage(n) { return n?.message ?? n?.Message ?? ""; }
export function getCreatedAt(n){ return n?.createdAt ?? n?.CreatedAt; }

export function formatDate(value) {
  if (!value) return "Just now";
  try {
    return new Date(value).toLocaleString("en-US", {
      month: "short", day: "numeric",
      year: "numeric", hour: "numeric", minute: "2-digit",
    });
  } catch { return "Just now"; }
}
