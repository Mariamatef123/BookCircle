import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { browseBooks, getBooks } from "../../Service/BookService";
import BookGrid from "../../components/BookGrid";
import FilterBar from "../../components/FilterBar";
import Header from "../../components/Header";
import HeartIcon from "../../components/heartIcon";

export default function FindYourNextRead() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [availableOnly, setAvailableOnly] = useState(true);
  const [wishlist, setWishlist] = useState({});
  const searchTerm = searchParams.get("q")?.trim().toLowerCase() ?? "";
  const genre = searchParams.get("genre")?.trim() ?? "";
  const language = searchParams.get("language")?.trim() ?? "";
  const maxPrice = searchParams.get("maxPrice")?.trim() ?? "";
  const hasSearchFilters = Boolean(searchTerm || genre || language || maxPrice);

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      setError("");

      try {
        const res = hasSearchFilters
          ? await browseBooks({
              title: searchTerm || undefined,
              genre: genre || undefined,
              language: language || undefined,
              maxPrice: maxPrice || undefined,
            })
          : await getBooks();

        const data = Array.isArray(res?.data) ? res.data : [];
        setBooks(data);
      } catch (err) {
        setBooks([]);
        setError(err?.message || "Failed to load books.");
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [genre, hasSearchFilters, language, maxPrice, searchTerm]);

  const toggleWishlist = (id) =>
    setWishlist((prev) => ({ ...prev, [id]: !prev[id] }));

  const filteredBooks = books.filter(
    (book) => !availableOnly || book.borrowStatus?.toLowerCase() === "available"
  );

  const activeFilters = [
    searchTerm ? `Title: ${searchParams.get("q")?.trim()}` : null,
    genre ? `Genre: ${genre}` : null,
    language ? `Language: ${language}` : null,
    maxPrice ? `Max price: ${maxPrice} L.E` : null,
  ].filter(Boolean);

  return (
    <div style={styles.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:wght@600;700&family=Nunito:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .borrow-btn { transition: background 0.15s, transform 0.1s, box-shadow 0.15s; }
        .borrow-btn:hover { background: #4a4ac4 !important; box-shadow: 0 4px 16px rgba(91,91,214,0.35) !important; transform: translateY(-1px); }
        // .details-btn:hover { background: #f5f5fa !important; }
        .book-card { transition: transform 0.2s, box-shadow 0.2s; }
        .book-card:hover { transform: translateY(-4px); box-shadow: 0 12px 36px rgba(0,0,0,0.10) !important; }
        .heart-btn { transition: transform 0.15s; }
        .heart-btn:hover { transform: scale(1.2); }
      `}</style>

      <Header {...{ styles }} />
      <FilterBar {...{ availableOnly, setAvailableOnly, styles }} />

      <div style={styles.sectionHeader}>
        <h2 style={styles.sectionTitle}>
          {hasSearchFilters ? `Search Results (${filteredBooks.length})` : "Available Books"}
        </h2>
        <button
          style={{
            ...styles.viewAll,
            opacity: hasSearchFilters ? 1 : 0.5,
            cursor: hasSearchFilters ? "pointer" : "default",
          }}
          onClick={() => hasSearchFilters && navigate("/")}
          type="button"
        >
          View all
        </button>
      </div>

      {hasSearchFilters && activeFilters.length > 0 && (
        <p style={styles.resultInfo}>{activeFilters.join(" | ")}</p>
      )}

      {error && <div style={styles.errorBox}>{error}</div>}

      {loading ? (
        <div style={styles.stateBox}>Loading search results...</div>
      ) : filteredBooks.length === 0 ? (
        <div style={styles.stateBox}>
          {hasSearchFilters
            ? "No books match your search."
            : "No books available right now."}
        </div>
      ) : (
        <BookGrid
          books={filteredBooks}
          wishlist={wishlist}
          toggleWishlist={toggleWishlist}
          HeartIcon={HeartIcon}
          styles={styles}
        />
      )}
    </div>
  );
}

const styles = {
  page: {
    fontFamily: "'Nunito', sans-serif",
    background: "#f9f9fc",
    minHeight: "100vh",
    padding: "32px 28px",
    margin: "0 auto",
  },
  header: { marginBottom: 24 },
  title: {
    fontFamily: "'Lora', serif",
    fontSize: 26,
    fontWeight: 700,
    color: "#1a1a2e",
    marginBottom: 4,
  },
  subtitle: { fontSize: 13.5, color: "#888", fontWeight: 500 },
  filters: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 28,
  },
  filterLeft: { display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" },
  filterRight: { display: "flex", alignItems: "center", gap: 10 },
  toggleWrap: { display: "flex", alignItems: "center", gap: 8, cursor: "pointer" },
  toggle: {
    width: 44,
    height: 24,
    borderRadius: 12,
    position: "relative",
    cursor: "pointer",
    transition: "background 0.2s",
  },
  toggleThumb: {
    position: "absolute",
    top: 3,
    width: 18,
    height: 18,
    borderRadius: "50%",
    background: "white",
    boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
    transition: "transform 0.2s",
  },
  toggleLabel: { fontSize: 13, fontWeight: 600, color: "#444" },
  sectionHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  sectionTitle: {
    fontFamily: "'Lora', serif",
    fontSize: 18,
    fontWeight: 700,
    color: "#1a1a2e",
  },
  viewAll: {
    fontSize: 13,
    fontWeight: 700,
    color: "#5b5bd6",
    background: "none",
    border: "none",
    fontFamily: "inherit",
  },
  resultInfo: {
    marginBottom: 16,
    fontSize: 13,
    color: "#6b7280",
  },
  stateBox: {
    background: "#fff",
    borderRadius: 16,
    boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
    padding: "28px 20px",
    textAlign: "center",
    color: "#6b7280",
    fontSize: 14,
  },
  errorBox: {
    background: "#fef2f2",
    color: "#dc2626",
    borderRadius: 12,
    padding: "12px 14px",
    marginBottom: 16,
    fontSize: 13,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))",
    gap: 20,
  },
  card: {
    background: "white",
    borderRadius: 16,
    overflow: "hidden",
    boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
  },
  coverWrap: {
    position: "relative",
    height: 190,
    overflow: "hidden",
  }, img: {
  width: "100%",
  height: "100%",
  objectFit: "cover"
  }
  ,
  heartBtn: {
    position: "absolute",
    top: 10,
    right: 10,
    background: "white",
    border: "none",
    borderRadius: "50%",
    width: 30,
    height: 30,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
  },
  cardBody: { padding: "14px 14px 14px" },
  bookTitle: { fontSize: 14, fontWeight: 800, color: "#1a1a2e", marginBottom: 2 },
  bookAuthor: { fontSize: 12, color: "#666", marginBottom: 2 },
  bookMeta: { fontSize: 11, color: "#aaa", marginBottom: 8 },
  bookPrice: { fontSize: 14, fontWeight: 800, color: "#1a1a2e", marginBottom: 10 },
  ownerRow: { display: "flex", alignItems: "center", gap: 6, marginBottom: 12 },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 9,
    fontWeight: 800,
    color: "white",
    flexShrink: 0,
  },
  ownerName: { fontSize: 11, color: "#888" },
  actions: { display: "flex", alignItems: "center", gap: 8 },
  btn: {
    flex: 1,
    padding: "9px 0",
    borderRadius: 10,
    fontSize: 12,
    fontWeight: 700,
    cursor: "pointer",
    border: "none",
    fontFamily: "inherit",
  },
  borrowBtn: {

  },
  detailsBtn: {
    // background: "#f5f5fa",
    // color: "#333",
    // border: "1px solid #e5e7eb",
        background: "#5b5bd6",
    color: "white",
    boxShadow: "0 3px 12px rgba(91,91,214,0.25)",
  },
  actionHeart: {
    width: 36,
    height: 36,
    borderRadius: 10,
    border: "1px solid #e5e7eb",
    background: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    flexShrink: 0,
  },
};
