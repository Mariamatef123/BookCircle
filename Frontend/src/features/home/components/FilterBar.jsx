import { useState } from "react";
import styles from "../styles/homeStyles";

const ChevronDown = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

// ✅ Dropdown (safe + reusable)
function FilterDropdown({ label, options, value, onChange }) {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: "8px 14px",
          borderRadius: 8,
          border: "1px solid #e5e7eb",
          background: "white",
          fontSize: 13,
          cursor: "pointer",
        }}
      >
        {options.find(o => o.value === value)?.label || label}
        <ChevronDown />
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            top: "110%",
            left: "-27px",
            background: "white",
            border: "1px solid #e5e7eb",
            borderRadius: 8,
            minWidth: 140,
            zIndex: 10,
          }}
        >
          {options.map(opt => (
            <div
              key={opt.value}
              onClick={() => {
                if (onChange) onChange(opt.value); // ✅ prevent crash
                setOpen(false);
              }}
              style={{
                padding: "8px 12px",
                cursor: "pointer",
                fontSize: 13,
              }}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ✅ FINAL FilterBar (clean)
export default function FilterBar({
  availableOnly,
  setAvailableOnly,
  sort,
  setSort
}) {
  return (
    <div style={styles.filters}>
      
      {/* LEFT SIDE */}
      <div style={styles.filterLeft}>
        <div style={styles.toggleWrap}>
          <div
            onClick={() => setAvailableOnly(!availableOnly)}
            style={{
              ...styles.toggle,
              background: availableOnly ? "#5b5bd6" : "#d1d5db",
            }}
          >
            <div
              style={{
                ...styles.toggleThumb,
                transform: availableOnly
                  ? "translateX(20px)"
                  : "translateX(2px)",
              }}
            />
          </div>
          <span style={styles.toggleLabel}>Available Only</span>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div style={styles.filterRight}>
        <span style={{ fontSize: 13, color: "#888" }}>Sort by</span>

        <FilterDropdown
          value={sort}
          onChange={setSort} 
          options={[
            { label: "Latest", value: "latest" },
            { label: "Oldest", value: "oldest" },
            { label: "Title A-Z", value: "title" },
            { label: "Price Low → High", value: "priceLow" },
            { label: "Price High → Low", value: "priceHigh" },
          ]}
        />
      </div>
    </div>
  );
}