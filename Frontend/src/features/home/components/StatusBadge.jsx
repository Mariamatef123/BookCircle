export default function StatusBadge({ borrowStatus }) {
  const isAvailable = borrowStatus?.toUpperCase() === "AVAILABLE";

  return (
    <span style={{
      position: "absolute", top: 8, left: 8,
      background: isAvailable ? "#16a34a" : "#f97316",
      color: "white", fontSize: 10,
      padding: "2px 6px", borderRadius: 10,
    }}>
      {isAvailable ? "Available" : "Borrowed"}
    </span>
  );
}