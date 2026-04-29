import { headerStyles as styles } from "../../styles/headerStyles";

export default function HeaderActions({ role, activeTab, handleCreate }) {
  if (role !== "BOOK_OWNER" || activeTab !== "books") return null;

  return (
    <button style={styles.addBtn} onClick={handleCreate}>
      + Add Book
    </button>
  );
}