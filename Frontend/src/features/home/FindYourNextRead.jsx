import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { browseBooks, getBooks } from "../../Service/BookService";

import Header from "./components/Header";
import FilterBar from "./components/FilterBar";
import BookGrid from "./components/BookGrid";
import styles from "./styles/homeStyles";

export default function FindYourNextRead() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [availableOnly, setAvailableOnly] = useState(true);
  const [wishlist, setWishlist] = useState({});
  const [sort, setSort] = useState("latest");

  // ─── Read URL params ─────────────────────────────
  const searchTerm = searchParams.get("q")?.trim().toLowerCase() ?? "";
  const genre = searchParams.get("genre")?.trim() ?? "";
  const language = searchParams.get("language")?.trim() ?? "";
  const maxPrice = searchParams.get("maxPrice")?.trim() ?? "";

  const hasSearchFilters = Boolean(
    searchTerm || genre || language || maxPrice
  );

  // ─── Fetch books ────────────────────────────────
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

        setBooks(Array.isArray(res?.data) ? res.data : []);
      } catch (err) {
        setBooks([]);
        setError(err?.message || "Failed to load books.");
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [searchTerm, genre, language, maxPrice, hasSearchFilters]);

  // ─── Wishlist toggle ────────────────────────────
  const toggleWishlist = (id) => {
    setWishlist((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // ─── FINAL PIPELINE (filter + sort) ─────────────
const safeDate = (book) => {
  const ts = new Date(book.publicationDate ).getTime();
  return Number.isNaN(ts) ? 0 : ts;
};

const finalBooks = [...books]
  .filter((b) => !availableOnly || (b.borrowStatus ?? "").trim().toLowerCase() === "available")
  .sort((a, b) => {
    const titleA = (a.title ??  "").trim();
    const titleB = (b.title ??"").trim();
    const priceA = Number(  a.borrowPrice ?? 0) || 0;
    const priceB = Number( b.borrowPrice ?? 0) || 0;

    switch (sort) {
      case "latest":   return safeDate(b) - safeDate(a);
      case "oldest":   return safeDate(a) - safeDate(b);
      case "title":    return titleA.localeCompare(titleB, undefined, { sensitivity: "base" });
      case "priceLow": return priceA - priceB;
      case "priceHigh":return priceB - priceA;
      default:         return 0;
    }
  });
  // ─── Active filters summary ─────────────────────
  const activeFilters = [
    searchTerm ? `Title: ${searchParams.get("q")?.trim()}` : null,
    genre ? `Genre: ${genre}` : null,
    language ? `Language: ${language}` : null,
    maxPrice ? `Max price: ${maxPrice} L.E` : null,
  ].filter(Boolean);

  // ─── Render ─────────────────────────────────────
  return (
    <div style={styles.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:wght@600;700&family=Nunito:wght@400;500;600;700;800&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .borrow-btn {
          transition: background 0.15s, transform 0.1s, box-shadow 0.15s;
        }

        .borrow-btn:hover {
          background: #4a4ac4 !important;
          box-shadow: 0 4px 16px rgba(91,91,214,0.35) !important;
          transform: translateY(-1px);
        }

        .book-card {
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .book-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 36px rgba(0,0,0,0.10) !important;
        }

        .heart-btn {
          transition: transform 0.15s;
        }

        .heart-btn:hover {
          transform: scale(1.2);
        }
      `}</style>

      <Header />

      <FilterBar
        availableOnly={availableOnly}
        setAvailableOnly={setAvailableOnly}
        sort={sort}
        setSort={setSort}
      />

      {/* Section header */}
      <div style={styles.sectionHeader}>
        <h2 style={styles.sectionTitle}>
          {hasSearchFilters
            ? `Search Results (${finalBooks.length})`
            : "Available Books"}
        </h2>


      </div>

      {/* Active filters */}
      {hasSearchFilters && activeFilters.length > 0 && (
        <p style={styles.resultInfo}>
          {activeFilters.join(" | ")}
        </p>
      )}

      {/* Error */}
      {error && <div style={styles.errorBox}>{error}</div>}

      {/* Content */}
      {loading ? (
        <div style={styles.stateBox}>Loading books...</div>
      ) : finalBooks.length === 0 ? (
        <div style={styles.stateBox}>
          {hasSearchFilters
            ? "No books match your search."
            : "No books available right now."}
        </div>
      ) : (
        <BookGrid
          books={finalBooks}
          wishlist={wishlist}
          toggleWishlist={toggleWishlist}
        />
      )}
    </div>
  );
}