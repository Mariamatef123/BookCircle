import styles from "../styles/profileStyles";
import { BooksIcon } from "../../../components/icons/AppIcons";

export default function ProfileEmpty() {
  return (
    <div style={styles.emptyWrap}>
      <div style={styles.emptyIcon}>
        <BooksIcon size={48} />
      </div>
      <p style={styles.emptyText}>No books listed yet</p>
      <p style={styles.emptySubText}>This user hasn't added any books to the platform.</p>
    </div>
  );
}
