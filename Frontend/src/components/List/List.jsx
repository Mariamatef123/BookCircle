import { listStyles as styles } from "../../styles/tableStyles";

import BooksTable from "../../features/books/components/BooksTable";
import PendingOwnersTable from "../../features/users/components/PendingOwnersTable";
import BorrowRequestsTable from "../../features/borrow/components/BorrowRequestsTable";

export default function List(props) {
  const { activeTab, role } = props;

  return (
    <div style={styles.container}>

      {activeTab === "books" && (
        <BooksTable {...props} />
      )}

      {activeTab === "pending" && role === "ADMIN" && (
        <PendingOwnersTable {...props} />
      )}

      {activeTab === "pending" && role === "BOOK_OWNER" && (
        <BorrowRequestsTable {...props} />
      )}

    </div>
  );
}