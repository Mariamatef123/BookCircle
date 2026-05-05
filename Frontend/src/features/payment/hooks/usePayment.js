import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getBooks } from "../../../Service/BookService";

export default function usePayment() {
  const location = useLocation();
  const navigate = useNavigate();
  const bookId   = location.state?.bookId;

  const [book,    setBook]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [focusedField, setFocusedField] = useState("");

  const [form, setForm] = useState({
    cardName:   "",
    cardNumber: "",
    expiry:     "",
    cvv:        "",
  });

 
  useEffect(() => {
    const fetchBook = async () => {
      setLoading(true);
      setError("");
      try {
        if (!bookId) { setError("No book selected for payment."); return; }
        const res   = await getBooks();
        const books = Array.isArray(res?.data) ? res.data : [];
        const found = books.find((b) => String(b.id) === String(bookId));
        if (!found) { setError("Book not found."); return; }
        setBook(found);
      } catch (err) {
        setError(err?.message || "Failed to load book.");
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [bookId]);


  const handleChange = (e) => {
    const { name, value } = e.target;


    if (name === "cardNumber") {
      const digits = value.replace(/\D/g, "").slice(0, 16);
      const formatted = digits.replace(/(.{4})/g, "$1 ").trim();
      setForm((prev) => ({ ...prev, cardNumber: formatted }));
      return;
    }

 
    if (name === "expiry") {
      const digits = value.replace(/\D/g, "").slice(0, 4);
      const formatted = digits.length > 2
        ? `${digits.slice(0, 2)}/${digits.slice(2)}`
        : digits;
      setForm((prev) => ({ ...prev, expiry: formatted }));
      return;
    }


    if (name === "cvv") {
      setForm((prev) => ({ ...prev, cvv: value.replace(/\D/g, "").slice(0, 4) }));
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };


  const validate = () => {
    if (!form.cardName.trim())          return "Cardholder name is required.";
    const digits = form.cardNumber.replace(/\s/g, "");
    if (digits.length < 16)             return "Card number must be 16 digits.";
    if (!/^\d{2}\/\d{2}$/.test(form.expiry)) return "Expiry must be MM/YY.";
    if (form.cvv.length < 3)            return "CVV must be 3–4 digits.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const validationError = validate();
    if (validationError) { setError(validationError); return; }

    setSubmitting(true);
    try {

      await new Promise((r) => setTimeout(r, 1600));
      setSuccess(`Payment successful for "${book.title}" `);
      setTimeout(() => navigate("/"), 2200);
    } catch {
      setError("Payment failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };


  const maskedNumber = (() => {
    const digits = form.cardNumber.replace(/\s/g, "");
    if (!digits) return "**** **** **** ****";
    const padded = digits.padEnd(16, "*");
    return padded.replace(/(.{4})/g, "$1 ").trim();
  })();

  return {
    book, loading, error, success, submitting, form,
    focusedField, setFocusedField,
    maskedNumber,
    handleChange, handleSubmit, navigate,
  };
}