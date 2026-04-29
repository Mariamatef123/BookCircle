import { STATUS_STYLES, baseStyle } from "./statusStyles";

export default function StatusBadge({ status }) {
  const config = STATUS_STYLES[status?.trim()] || {
    background: "#E5E7EB",
    color: "#374151",
    label: status || "Unknown",
  };

  return (
    <span
      style={{
        ...baseStyle,
        background: config.background,
        color: config.color,
      }}
    >
      {config.label}
    </span>
  );
}