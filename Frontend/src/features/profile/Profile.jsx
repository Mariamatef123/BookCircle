import { useNavigate } from "react-router-dom";
import useProfile      from "./hooks/useProfile";
import ProfileHero     from "./components/ProfileHero";
// import ProfileBookCard from "./components/ProfileBookCard";
import ProfileEmpty    from "./components/ProfileEmpty";
import styles          from "./styles/profileStyles";
import BookCard from "../home/components/BookCard";
import { AlertTriangleIcon, ClockIcon } from "../../components/icons/AppIcons";

export default function Profile() {
  const navigate = useNavigate();
  const { owner, userBooks, availableCount, borrowedCount, loading, error } = useProfile();

  // ── Loading ───────────────────────────────────────────────────
  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.stateWrap}>
          <span style={{ fontSize: 36 }}><ClockIcon size={36} /></span>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  // ── Error ─────────────────────────────────────────────────────
  if (error) {
    return (
      <div style={styles.page}>
        <div style={styles.stateWrap}>
          <span style={{ fontSize: 36 }}><AlertTriangleIcon size={36} /></span>
          <p style={styles.errorText}>{error}</p>
          <button
            type="button"
            onClick={() => navigate("/")}
            style={{ border: "none", background: "#4f46e5", color: "#fff", borderRadius: 12, padding: "10px 20px", cursor: "pointer", fontWeight: 700 }}
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  // ── Page ──────────────────────────────────────────────────────
  return (
    <div style={styles.page} className="profile-page">
      <style>{`
        @media (max-width: 720px) {
          .profile-page .hero-card { flex-direction: column !important; }
          .profile-page .profile-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 480px) {
          .profile-page .profile-grid { grid-template-columns: 1fr !important; }
        }
        .profile-book-card:hover {
          transform: translateY(-4px) !important;
          box-shadow: 0 12px 32px rgba(99,102,241,0.14) !important;
        }
      `}</style>

      <div style={styles.surface}>

        {/* Hero */}
        <ProfileHero
          owner={owner}
          totalBooks={userBooks.length}
          availableCount={availableCount}
          borrowedCount={borrowedCount}
        />

        {/* Books section */}
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Listed Books</h2>
          <span style={styles.sectionCount}>{userBooks.length} book{userBooks.length !== 1 ? "s" : ""}</span>
        </div>

        <div style={{ ...styles.grid }} className="profile-grid">
          {userBooks.length === 0 ? (
            <ProfileEmpty />
          ) : (
            userBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))
          )}
        </div>

      </div>
    </div>
  );
}
