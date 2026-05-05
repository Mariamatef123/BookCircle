import styles from "../styles/profileStyles";

function getInitials(name) {
  if (!name) return "?";
  return name.split(" ").filter(Boolean).slice(0, 2)
    .map((p) => p[0]?.toUpperCase()).join("");
}

export default function ProfileHero({ owner, totalBooks, availableCount, borrowedCount }) {
  return (
    <div style={styles.heroCard}>
   
      <div style={styles.avatar}>
        {getInitials(owner?.name)}
      </div>

      <div style={styles.heroInfo}>
        <h1 style={styles.heroName}>{owner?.name || "Unknown User"}</h1>
        <p style={styles.heroRole}>{owner?.role?.replaceAll("_", " ") || "Member"}</p>

      
        <div style={styles.heroStats}>
          <div style={styles.statChip}>
            <span style={styles.statNumber}>{totalBooks}</span>
            <span style={styles.statLabel}>Books</span>
          </div>
          <div style={styles.statChip}>
            <span style={styles.statNumber}>{availableCount}</span>
            <span style={styles.statLabel}>Available</span>
          </div>
          <div style={styles.statChip}>
            <span style={styles.statNumber}>{borrowedCount}</span>
            <span style={styles.statLabel}>Borrowed</span>
          </div>
        </div>
      </div>
    </div>
  );
}