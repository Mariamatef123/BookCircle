export default function HeartIcon({ filled }) {
  return (
    <svg
      width="16" height="16" viewBox="0 0 24 24"
      fill={filled ? "#e94057" : "none"}
      stroke={filled ? "#e94057" : "#aaa"}
      strokeWidth="2"
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}