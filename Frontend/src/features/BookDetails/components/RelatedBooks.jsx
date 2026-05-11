import { useNavigate } from "react-router-dom";
import styles from "../styles/bookDetailsStyles";

export default function RelatedBooks({ relatedBooks }) {
  const navigate = useNavigate();
  return (
    <aside style={styles.relatedPanel}>
      <h3 style={styles.relatedTitle}>You may also like</h3>
      {relatedBooks.length === 0 ? (
        <p style={styles.relatedEmpty}>No similar books yet.</p>
      ) : relatedBooks.map((item) => (
        <button key={item.id} type="button" style={styles.relatedItem} onClick={() => navigate(`/book/${item.id}`)}>
          {item.coverImage ? (

             <img
              src={`https://localhost:7071/${item.coverImage?.replace(/\\/g, "/")}`}
              alt={item.title}
              style={styles.relatedImage}
            />
          ) : (
            <div style={styles.relatedImageFallback}>Book</div>
          )}
          <div style={styles.relatedMeta}>
            <p style={styles.relatedBookTitle}>{item.title}</p>
            <p style={styles.relatedBookAuthor}>{item.owner?.name || "Unknown owner"}</p>
            <p style={styles.relatedBookPrice}>{item.borrowPrice != null ? `${item.borrowPrice} L.E / day` : "Price not set"}</p>
          </div>
        </button>
      ))}
    </aside>
  );
}