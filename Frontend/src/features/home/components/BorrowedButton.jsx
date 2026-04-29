import { useNavigate } from "react-router-dom";
import styles from "../styles/homeStyles";

export default function BorrowedButton({ book }) {
  const navigate = useNavigate();

  return (
    <button
      className="details-btn"
      style={{ ...styles.btn, ...styles.detailsBtn }}
      onClick={() => navigate(`/book/${book.id}`)}
    >
      Details
    </button>
  );
}