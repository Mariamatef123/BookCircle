import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getBooks } from "../../Service/BookService";

export default function Payment() {
  const location = useLocation();
  const bookId = location.state?.bookId;

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
const [form, setForm] = useState({
  cardName: "",
  cardNumber: "",
  expiry: "",
  cvv: "",
});
  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true);
        setError("");

        if (!bookId) {
          setError("No book selected");
          return;
        }

        const res = await getBooks(); // 🔥 get ALL books
        const books = Array.isArray(res?.data) ? res.data : [];

        const foundBook = books.find(
          (b) => String(b.id) === String(bookId)
        );

        if (!foundBook) {
          setError("Book not found");
          return;
        }

        setBook(foundBook);
      } catch (err) {
        console.error(err);
        setError("Failed to load books");
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [bookId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!book) return <p>No book found</p>;
  // ─── if no book ─────────────────────────────
  if (!book) {
    return (
      <div style={styles.center}>
        <h3>No book selected for payment</h3>
        <button onClick={() => navigate("/dashboard")}>
          Go Back
        </button>
      </div>
    );
  }

  // ─── form change ────────────────────────────
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ─── validation ─────────────────────────────
  const validate = () => {
    if (
      !form.cardName ||
      !form.cardNumber ||
      !form.expiry ||
      !form.cvv
    ) {
      return "All fields are required";
    }

    if (form.cardNumber.length < 12) {
      return "Invalid card number";
    }

    if (form.cvv.length < 3) {
      return "Invalid CVV";
    }

    return null;
  };

  // ─── submit payment ─────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();

    const err = validate();
    if (err) {
      setError(err);
      return;
    }

    setError("");
    setLoading(true);

    try {
      // 🔥 HERE CALL YOUR BACKEND
      // await api.post("/payment", { bookId: book.id, ...form });

      await new Promise((r) => setTimeout(r, 1500));

      alert(`Payment successful for "${book.title}" 🎉`);

      navigate("/dashboard");
    } catch (err) {
      setError("Payment failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // ─── UI ─────────────────────────────────────
  return (
    <div style={styles.page}>
      <div style={styles.container}>

        {/* ─── BOOK INFO ─── */}
        <div style={styles.bookCard}>
          <img
            src={book.image}
            alt={book.title}
            style={styles.bookImg}
          />

          <div>
            <h3>{book.title}</h3>
            <p>Author: {book.author}</p>
            <p style={styles.price}>${book.price}</p>
          </div>
        </div>

        {/* ─── PAYMENT FORM ─── */}
        <div style={styles.card}>
          <h2>Payment</h2>
          <p style={{ color: "#777" }}>
            Complete payment for borrowed book
          </p>

          <form onSubmit={handleSubmit} style={styles.form}>
            <input
              name="cardName"
              placeholder="Card Holder Name"
              value={form.cardName}
              onChange={handleChange}
              style={styles.input}
            />

            <input
              name="cardNumber"
              placeholder="Card Number"
              value={form.cardNumber}
              onChange={handleChange}
              maxLength={16}
              style={styles.input}
            />

            <input
              name="expiry"
              placeholder="MM/YY"
              value={form.expiry}
              onChange={handleChange}
              style={styles.input}
            />

            <input
              name="cvv"
              placeholder="CVV"
              value={form.cvv}
              onChange={handleChange}
              maxLength={4}
              style={styles.input}
            />

            {/* Auto price from book */}
            <div style={styles.amountBox}>
              Amount: <b>${book.price}</b>
            </div>

            {error && <p style={styles.error}>{error}</p>}

            <button type="submit" disabled={loading} style={styles.button}>
              {loading ? "Processing..." : "Pay Now"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

/* ---------------- STYLES ---------------- */

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f5f6ff",
    fontFamily: "Nunito, sans-serif",
  },

  container: {
    display: "flex",
    gap: "20px",
    alignItems: "flex-start",
  },

  bookCard: {
    width: "260px",
    background: "#fff",
    borderRadius: "12px",
    padding: "16px",
    boxShadow: "0 5px 20px rgba(0,0,0,0.08)",
    textAlign: "center",
  },

  bookImg: {
    width: "100%",
    height: "180px",
    objectFit: "cover",
    borderRadius: "8px",
    marginBottom: "10px",
  },

  price: {
    color: "#5b5bd6",
    fontWeight: "bold",
    marginTop: "5px",
  },

  card: {
    width: "350px",
    padding: "24px",
    background: "#fff",
    borderRadius: "12px",
    boxShadow: "0 5px 20px rgba(0,0,0,0.1)",
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    marginTop: "12px",
  },

  input: {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    outline: "none",
  },

  button: {
    padding: "10px",
    borderRadius: "8px",
    border: "none",
    background: "#5b5bd6",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "bold",
  },

  error: {
    color: "red",
    fontSize: "13px",
  },

  amountBox: {
    padding: "10px",
    background: "#f3f4ff",
    borderRadius: "8px",
    fontWeight: "bold",
  },

  center: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: "10px",
  },
};