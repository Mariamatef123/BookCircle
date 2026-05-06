import { useEffect, useState } from "react";
import { getUser } from "../../utils/auth";

import Header from "../components/DashBoard/PendingBooks/Header";
import Tabs from "../components/DashBoard/PendingBooks/Tabs";
import List from "../components/DashBoard/PendingBooks/List";
import BookFormModal from "../components/DashBoard/PendingBooks/BookForm";

import {
  getAllBooks,
  getPendingPosts,
  acceptPost,
  rejectPost,
  createBook,
  updateBook,
  deleteBook,

} from "../../Service/BookService";

import {
  getPendingOwners,
  acceptOwner,
  rejectOwner,
} from "../../Service/UserService";

import{
    acceptRequest,rejectRequest,getPendingRequests
}
from "../../Service/BorrowService"

export default function Dashboard() {
  const [books, setBooks] = useState([]);
  const [owners, setOwners] = useState([]);
   const [borrows, setBorrows] = useState([]);
  const [activeTab, setActiveTab] = useState("books");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);

  const user = getUser();
  const userId = user?.id;
  const role = user?.role;

  // =========================
  // LOAD DATA  (defined outside useEffect so it can be reused)
  // =========================
  const loadData = async () => {
    try {
      if (role === "ADMIN" && activeTab === "books") {
        const res = await getPendingPosts(userId);
        setBooks(res.data);
        setOwners([]);
      }

      if (role === "ADMIN" && activeTab === "pending") {
        const res = await getPendingOwners(userId);
        setOwners(res.data);
        setBooks([]);
      }

      if (role === "BOOK_OWNER"  && activeTab === "books") {
        const res = await getAllBooks(userId);
        setBooks(res.data);
      }
            if (role === "BOOK_OWNER" && activeTab === "pending") {
        const res = await getPendingRequests(userId);
        setBorrows(res.data);
        setBooks([]);
      }

    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (!userId) return;
    loadData();
  }, [userId, role, activeTab]);

  // =========================
  // MODAL HANDLERS
  // =========================
  const handleEdit = (book) => {
    setEditingBook(book);
    setModalOpen(true);
  };

  const handleCreate = () => {
    setEditingBook(null);
    setModalOpen(true);
  };

  const handleFormSubmit = async (formData, bookId) => {
    try {
      if (bookId) {
        await updateBook(userId, bookId, formData);
      } else {
        await createBook(userId, formData);
      }
      await loadData();
    } catch (err) {
      console.log(err);
    }
  };

  // =========================
  // BOOK ACTIONS
  // =========================
  const handleAcceptBook = async (userId, bookId) => {
    await acceptPost(userId, bookId);
    await loadData();
  };
  const handleAcceptBorrow=async(ownerId,requestId)=>{
    await acceptRequest(ownerId,requestId);
     await loadData();
  };

  const handleRejectBook = async (uId, bookId) => {
    await rejectPost(uId, bookId);
    await loadData();
  };
  const handleRejectBorrow=async(ownerId,requestId)=>{
    await rejectRequest(ownerId,requestId);
     await loadData();
  };
  const handleDeleteBook = async (bookId) => {
    await deleteBook(userId, bookId);
    await loadData();
  };

  // =========================
  // OWNER ACTIONS
  // =========================
  const handleAcceptOwner = async (ownerId) => {
    await acceptOwner(userId, ownerId);
    await loadData();
  };

  const handleRejectOwner = async (ownerId) => {
    await rejectOwner(userId, ownerId);
    await loadData();
  };

  return (
    <div style={styles.wrapper}>
      <Header 
       activeTab={activeTab}
        role={role}
        handleCreate={handleCreate}
        />


      {/* Add Book button — only for BOOK_OWNER */}


      <Tabs
        role={role}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <List
        books={books}
        owners={owners}
        role={role}
        borrows={borrows}
        userId={userId}
        activeTab={activeTab}
        onAccept={handleAcceptBook}
        onReject={handleRejectBook}
        onAcceptOwner={handleAcceptOwner}
        onRejectOwner={handleRejectOwner}
        onEdit={handleEdit}
        onDelete={handleDeleteBook}
        onAcceptRequest={handleAcceptBorrow}
        onRejectRequest={handleRejectBorrow}
      />

      <BookFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleFormSubmit}
        editingBook={editingBook}
          userId={userId} 
      />
    </div>
  );
}

const styles = {
  wrapper: {
    padding: 32,
    background: "#F9FAFB",
    minHeight: "100vh",
    fontFamily: "Inter, sans-serif",
  },
  topBar: {
    display: "flex",
    justifyContent: "flex-end",
    marginBottom: 12,
  },

};
