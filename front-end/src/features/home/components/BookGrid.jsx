import BookCard from "./BookCard";
import styles from "../styles/homeStyles";

export default function BookGrid({ books, wishlist, toggleWishlist }) {
  return (
    <div style={styles.grid}>
      
      {books.map((book) => (
        <BookCard
          key={book.id}
          book={book}
          wishlist={wishlist}
          toggleWishlist={toggleWishlist}
        />
      ))}
    </div>
  );
}