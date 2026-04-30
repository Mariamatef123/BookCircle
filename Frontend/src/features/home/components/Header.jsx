import styles from "../styles/homeStyles";

export default function Header() {
  return (
    <div style={styles.header}>
      <h1 style={styles.title}>Find Your Next Read</h1>
      <p style={styles.subtitle}>Borrow books from your community and discover new favorites.</p>
    </div>
  );
}