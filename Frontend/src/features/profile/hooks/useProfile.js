import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getBooks } from "../../../Service/BookService";

export default function useProfile() {
  const { userId } = useParams();

  const [books,   setBooks]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await getBooks();
        setBooks(Array.isArray(res?.data) ? res.data : []);
      } catch (err) {
        setError(err?.message || "Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, [userId]);

  // ── Derived data ──────────────────────────────────────────────
  const userBooks = books.filter(
    (item) => String(item.owner?.id) === String(userId)
  );

  const owner = userBooks[0]?.owner ?? null;

  const availableCount = userBooks.filter(
    (b) => b.borrowStatus?.toUpperCase() === "AVAILABLE"
  ).length;

  const borrowedCount = userBooks.filter(
    (b) => b.borrowStatus?.toUpperCase() !== "AVAILABLE"
  ).length;

  return {
    userId,
    owner,
    userBooks,
    availableCount,
    borrowedCount,
    loading,
    error,
  };
}