import { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getNotifications, markAsRead } from "../../../Service/NotificationService";
import { getUser } from "../../../utils/auth";
import signalRService from "../../../Service/SignalR";

/* ================= TYPE CONFIG ================= */
const NOTIFICATION_TYPE = {
  0:  "BORROW_REQUEST",
  1:  "BORROW_ACCEPTED",
  2:  "BORROW_REJECTED",
  3:  "COMMENT_ADDED",
  4:  "COMMENT_REPLIED",
  5:  "BOOK_LIKED",
  6:  "BOOK_DISLIKED",
  7:  "BOOK_APPROVED",
  8:  "BOOK_REJECTED",
  9:  "OWNER_APPROVED",
  10: "OWNER_REJECTED",
  11: "ACCOUNT_REQUEST",
};

// helper — works for both "BOOK_LIKED" and 5
export function resolveType(raw) {
  if (raw == null) return null;
  if (typeof raw === "number") return NOTIFICATION_TYPE[raw] ?? null;
  return String(raw).toUpperCase();
}

const TYPE_CONFIG = {
  BORROW_REQUEST:  { label: "Borrow Request",   bg: "#eff6ff", getTarget: () => "/dashboard" },
  BORROW_ACCEPTED: { label: "Request Accepted", bg: "#f0fdf4", getTarget: (n) => ({ path: "/payment", state: { bookId: n.bookId , paymentDone: false} }) },
  BORROW_REJECTED: { label: "Request Rejected", bg: "#fef2f2", getTarget: (n) => `/book/${n.bookId}` },
  COMMENT_ADDED:   { label: "New Comment",       bg: "#fdf4ff", getTarget: (n) => `/book/${n.bookId}?tab=comments` },
  COMMENT_REPLIED: { label: "Reply to Comment",  bg: "#fdf4ff", getTarget: (n) => `/book/${n.bookId}?tab=comments` },
  BOOK_LIKED:      { label: "Book Liked",        bg: "#fff1f2", getTarget: (n) => `/book/${n.bookId}` },
  BOOK_DISLIKED:   { label: "Book Disliked",     bg: "#fff7ed", getTarget: (n) => `/book/${n.bookId}` },
  BOOK_APPROVED:   { label: "Book Approved",     bg: "#f0fdf4", getTarget: (n) => `/book/${n.bookId}` },
  BOOK_REJECTED:   { label: "Book Rejected",     bg: "#fef2f2", getTarget: (n) => `/book/${n.bookId}` },
  OWNER_APPROVED:  { label: "Owner Approved",    bg: "#fffbeb", getTarget: () => "/dashboard" },
  ACCOUNT_REQUEST: { label: "User Registered",   bg: "#fffbeb", getTarget: () => "/dashboard" },
};

export const DEFAULT_CONFIG = { label: "Notification", bg: "#f5f3ff", getTarget: () => null };

/* ================= HELPERS ================= */

export function getTypeConfig(type) {
  const key = resolveType(type);
  if (!key) return DEFAULT_CONFIG;
  return TYPE_CONFIG[key] ?? DEFAULT_CONFIG;
}

export const resolveNotificationRoute = (type, notification) => {
  const key = resolveType(type);
  if (!key) return null;

  const config = TYPE_CONFIG[key] || DEFAULT_CONFIG;

  // ❌ BLOCK PAYMENT ROUTE AFTER COMPLETION
  if (key === "BORROW_ACCEPTED" && notification.paymentDone) {
    return null;
  }

  const target = config.getTarget(notification);
  if (!target) return null;

  return typeof target === "string"
    ? { path: target }
    : target;
};

export const getId     = (n) => n?.id     ?? n?.Id;
export const getIsRead = (n) => Boolean(n?.isRead ?? n?.IsRead);

/* ================= HOOK ================= */

export default function useNotifications() {
  const navigate = useNavigate();
  const user = getUser();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState(null);

  /* ---------- FETCH ---------- */
  const fetchNotifications = useCallback(async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      setError(null);
      const res = await getNotifications(user.id);
      setNotifications(res.data || []);
    } catch (err) {
      setError(err?.message || "Failed to load notifications.");
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  /* ---------- SIGNALR ---------- */
  useEffect(() => {
    if (!user?.id) return;

    const onNew = (notification) => {
      setNotifications((prev) => {
        const id = getId(notification);
        if (!id) return prev;
        if (prev.some((n) => getId(n) === id)) return prev;
        return [notification, ...prev];
      });
    };

    signalRService.startConnection(user.id);
    signalRService.onReceiveNotification(onNew);

    return () => {
      signalRService.offReceiveNotification(onNew);
    };
  }, [user?.id]);

  /* ---------- DERIVED ---------- */
  const unreadCount = useMemo(
    () => notifications.filter((n) => !getIsRead(n)).length,
    [notifications]
  );

  /* ---------- ACTIONS ---------- */

  // ✅ FIX: mark the notification as read (update isRead flag in state)
  // instead of removing it — this makes unreadCount decrement correctly
  // and the badge number updates immediately after clicking.
  const markRead = useCallback(async (id) => {
    await markAsRead(id, user.id);
    setNotifications((prev) =>
      prev.map((n) => (getId(n) === id ? { ...n, isRead: true, IsRead: true } : n))
    );
  }, [user?.id]);

  const handleClick = useCallback(
    async (n) => {
      const id = getId(n);

      if (!getIsRead(n)) {
        await markRead(id);
        //badge decrements here because setNotifications above sets isRead: true
        // and unreadCount is derived via useMemo from notifications state
      }

      const route = resolveNotificationRoute(n.type, n);
      if (route) {
        navigate(route.path, { state: route.state });
      }
    },
    [navigate, markRead]
  );

  const markAllRead = useCallback(async () => {
    const unread = notifications.filter((n) => !getIsRead(n));
    await Promise.allSettled(unread.map((n) => markAsRead(getId(n), user.id)));
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true, IsRead: true })));
    window.dispatchEvent(new CustomEvent("notifications-read-all"));
  }, [notifications, user?.id]);

  return {
    notifications,
    loading,
    error,
    unreadCount,
    handleClick,
    markAllRead,
    refetch: fetchNotifications,
    resolveType,
  };
}

/* ================= FORMATTERS ================= */

export function getTitle(n)     { return n?.title     ?? n?.Title     ?? getTypeConfig(n?.type).label; }
export function getMessage(n)   { return n?.message   ?? n?.Message   ?? ""; }
export function getCreatedAt(n) { return n?.createdAt ?? n?.CreatedAt; }

export function formatDate(value) {
  if (!value) return "Just now";
  try {
    return new Date(value).toLocaleString("en-US", {
      month: "short", day: "numeric", year: "numeric",
      hour: "numeric", minute: "2-digit",
    });
  } catch {
    return "Just now";
  }
}