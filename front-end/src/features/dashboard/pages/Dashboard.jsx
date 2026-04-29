import useUser from "../../../hooks/useUser";
import useDashboard from "../hooks/useDashboard";

import Header from "../../../components/Header/Header";
import Tabs from "../../../components/Tabs/Tabs";
import List from "../../../components/List/List";
import BookFormModal from "../../books/components/BookForm/BookForm";

export default function Dashboard() {
  const user = useUser();
  const userId = user?.id;
  const role = user?.role;

  const dashboard = useDashboard(userId, role);

  return (
    <div style={{ padding: 32 }}>

      <Header
        activeTab={dashboard.activeTab}
        role={role}
        handleCreate={dashboard.handleCreate}
      />

      <Tabs
        role={role}
        activeTab={dashboard.activeTab}
        setActiveTab={dashboard.setActiveTab}
      />

      <List
        books={dashboard.books}
        owners={dashboard.owners}
        borrows={dashboard.borrows}
        role={role}
        userId={userId}
        activeTab={dashboard.activeTab}
        onAccept={dashboard.handleAcceptBook}
        onReject={dashboard.handleRejectBook}
        onAcceptOwner={dashboard.handleAcceptOwner}
        onRejectOwner={dashboard.handleRejectOwner}
        onEdit={dashboard.handleEdit}
        onDelete={dashboard.handleDeleteBook}
        onAcceptRequest={dashboard.handleAcceptBorrow}
        onRejectRequest={dashboard.handleRejectBorrow}
      />

      <BookFormModal
        isOpen={dashboard.modalOpen}
        onClose={() => dashboard.setModalOpen(false)}
        onSubmit={dashboard.handleFormSubmit}
        editingBook={dashboard.editingBook}
        userId={userId}
      />
    </div>
  );
}