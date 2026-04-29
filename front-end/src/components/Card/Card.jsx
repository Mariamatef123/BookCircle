import BookRow from "../../features/books/components/BookRow";
import PendingUserRow from "../../features/users/components/PendingUserRow";
import BorrowRequestRow from "../../features/borrow/components/BorrowRequestRow";

export default function Card(props) {
  const { activeTab, role } = props;

  if (activeTab === "books") return <BookRow {...props} />;

  if (activeTab === "pending" && role === "ADMIN")
    return <PendingUserRow {...props} />;

  if (activeTab === "pending" && role === "BOOK_OWNER")
    return <BorrowRequestRow {...props} />;

  return null;
}