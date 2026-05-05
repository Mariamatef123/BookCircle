import { useState, useEffect, useCallback } from "react";
import {
  getUserLists, createList, deleteList,
  getListBooks, addBook, removeBook,
} from "../../../Service/ReadingListService";
import { browseBooks } from "../../../Service/BookService";

export default function useReadingList(userId) {
  const [lists, setLists] = useState([]);
  const [books, setBooks] = useState([]);
  const [results, setResults] = useState([]);

  const [activeTab, setActiveTab] = useState("lists");
  const [selectedListId, setSelectedListId] = useState(null);

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [addBookModalOpen, setAddBookModalOpen] = useState(false);

  const [newListName, setNewListName] = useState("");
  const [newListDesc, setNewListDesc] = useState("");

  const [filterType, setFilterType] = useState("title");
  const [filterValue, setFilterValue] = useState("");

  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState("");


  const loadLists = async () => {
    const res = await getUserLists(userId);
    setLists(res?.data ?? []);
  };

  const loadBooks = async (listId) => {
    const res = await getListBooks(listId);
    setBooks(res?.data ?? []);
  };

  useEffect(() => { if (userId) loadLists(); }, [userId]);

  useEffect(() => {
    if (activeTab === "books" && selectedListId) {
      loadBooks(selectedListId);
    }
  }, [activeTab, selectedListId]);

  const handleSearch = useCallback(async (type, value) => {
    setSearching(true);
    setSearchError("");

    try {
      const res = await browseBooks({
        title: type === "title" ? value : undefined,
        genre: type === "genre" ? value : undefined,
        language: type === "language" ? value : undefined,
        maxPrice: type === "maxPrice" ? value : undefined,
      });

      setResults(res?.data ?? res ?? []);
    } catch (err) {
      setResults([]);
      setSearchError(err?.message || "Search failed");
    } finally {
      setSearching(false);
    }
  }, []);


  useEffect(() => {
    if (!addBookModalOpen) return;
    const t = setTimeout(() => handleSearch(filterType, filterValue), 400);
    return () => clearTimeout(t);
  }, [filterValue, filterType, addBookModalOpen]);


  const createNewList = async () => {
    await createList(userId, { name: newListName, description: newListDesc });
    setCreateModalOpen(false);
    setNewListName("");
    setNewListDesc("");
    loadLists();
  };

  const removeList = async (id) => {
    await deleteList(id);
    loadLists();
  };

  const addBookToList = async (bookId) => {
    await addBook(selectedListId, bookId);
    setAddBookModalOpen(false);
    loadBooks(selectedListId);
  };

  const removeBookFromList = async (bookId) => {
    await removeBook(selectedListId, bookId);
    loadBooks(selectedListId);
  };

  return {
    lists,
    books,
    results,

    activeTab,
    setActiveTab,
    selectedListId,
    setSelectedListId,

    createModalOpen,
    setCreateModalOpen,
    addBookModalOpen,
    setAddBookModalOpen,

    newListName,
    setNewListName,
    newListDesc,
    setNewListDesc,

    filterType,
    setFilterType,
    filterValue,
    setFilterValue,

    searching,
    searchError,

    createNewList,
    removeList,
    addBookToList,
    removeBookFromList,
  };
}