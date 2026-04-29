export function ArrowLeftIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

export function BookmarkIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
  );
}

export function HeartSmallIcon({ filled }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24"
      fill={filled ? "#ef4444" : "none"}
      stroke={filled ? "#ef4444" : "currentColor"} strokeWidth="2">
      <path d="M12 21s-6.716-4.35-9.192-8.067C.67 9.68 2.458 5.25 6.773 5.25c2.106 0 3.362 1.206 4.227 2.298.865-1.092 2.121-2.298 4.227-2.298 4.315 0 6.103 4.43 3.965 7.683C18.716 16.65 12 21 12 21z" />
    </svg>
  );
}

export function DislikeIcon({ filled }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24"
      fill={filled ? "#f97316" : "none"}
      stroke={filled ? "#f97316" : "currentColor"} strokeWidth="2">
      <path d="M10 14V5.236a2 2 0 0 0-.586-1.414l-.236-.236A2 2 0 0 0 7.764 3H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h5zm0 0 2.293 5.352A1 1 0 0 0 13.214 20H15a2 2 0 0 0 2-2v-4h2.764a2 2 0 0 0 1.952-2.436l-1.4-6A2 2 0 0 0 18.367 4H10" />
    </svg>
  );
}