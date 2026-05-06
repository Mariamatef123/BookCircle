import { useState, useEffect } from "react";

import {
  getAllBooks,
  getPendingPosts,
  acceptPost,
  rejectPost,
  createBook,
  updateBook,
  deleteBook,
} from "../../../Service/BookService";

import {
  getPendingOwners,
  acceptOwner,
  rejectOwner,
} from "../../../Service/UserService";

import {
  acceptRequest,
  rejectRequest,
  getPendingRequests,
} from "../../../Service/BorrowService";

export default function useDashboard(userId, role) {
  const [books, setBooks] = useState([]);
  const [owners, setOwners] = useState([]);
  const [borrows, setBorrows] = useState([]);
  const [activeTab, setActiveTab] = useState("books");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);

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

      if (role === "BOOK_OWNER" && activeTab === "books") {
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

  // Actions
  const refresh = async () => await loadData();

  const handleAcceptBook = async (uId, bookId) => {
    await acceptPost(uId, bookId);
    refresh();
  };

  const handleRejectBook = async (uId, bookId) => {
    await rejectPost(uId, bookId);
    refresh();
  };

  const handleDeleteBook = async (bookId) => {
    await deleteBook(userId, bookId);
    refresh();
  };

  const handleAcceptOwner = async (ownerId) => {
    await acceptOwner(userId, ownerId);
    refresh();
  };

  const handleRejectOwner = async (ownerId) => {
    await rejectOwner(userId, ownerId);
    refresh();
  };

  const handleAcceptBorrow = async (ownerId, requestId) => {
    await acceptRequest(ownerId, requestId);
    refresh();
  };

  const handleRejectBorrow = async (ownerId, requestId) => {
    await rejectRequest(ownerId, requestId);
    refresh();
  };

  const handleFormSubmit = async (formData, bookId) => {
    if (bookId) {
      await updateBook(userId, bookId, formData);
    } else {
      await createBook(userId, formData);
    }
    refresh();
  };

  const handleEdit = (book) => {
    setEditingBook(book);
    setModalOpen(true);
  };

  const handleCreate = () => {
    setEditingBook(null);
    setModalOpen(true);
  };

  return {
    books,
    owners,
    borrows,
    activeTab,
    setActiveTab,
    modalOpen,
    setModalOpen,
    editingBook,
    handleEdit,
    handleCreate,
    handleFormSubmit,
    handleAcceptBook,
    handleRejectBook,
    handleDeleteBook,
    handleAcceptOwner,
    handleRejectOwner,
    handleAcceptBorrow,
    handleRejectBorrow,
  };
}
