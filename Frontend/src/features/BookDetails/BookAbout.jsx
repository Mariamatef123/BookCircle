import { useOutletContext } from "react-router-dom";
import styles from "./styles/bookDetailsStyles";

export default function AboutTab() {
  const d = useOutletContext();

  return (
    <p style={styles.description}>
      {d.book.description || "No description has been added for this book yet."}
    </p>
  );
}