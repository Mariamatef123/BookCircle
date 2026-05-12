import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { getBooks } from "../../../Service/BookService";
import { sendRequest } from "../../../Service/BorrowService";
import { addBook, getUserLists } from "../../../Service/ReadingListService";
import { likeBook, dislikeBook, getBookReactions } from "../../../Service/ReactionService";
import { addComment, deleteComment, getBookComments, replyToComment, updateComment } from "../../../Service/CommentService";
import { getUser } from "../../../utils/auth";
import { normalizeAvailabilityOptions, normalizeReaction, normalizeComment, getReactionSummary } from "../utils/normalizers";
import { checkBorrowRequestExists } from "../../../Service/BorrowService";
export default function useBookDetails() {
  const navigate = useNavigate();
  const { bookId } = useParams();//url path
  const [searchParams] = useSearchParams();//query ?tab=...
  const user   = getUser();
  const userId = user?.id;
  const requestedTab = searchParams.get("tab") === "comments" ? "comments" : "about";

  const [books,   setBooks]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");
  const [message, setMessage] = useState(null);
  const [activeTab, setActiveTab] = useState(requestedTab);

  const [borrowModalOpen,        setBorrowModalOpen]        = useState(false);
  const [selectedAvailabilityKey, setSelectedAvailabilityKey] = useState("");
  const [borrowing,              setBorrowing]              = useState(false);

  const [lists,        setLists]        = useState([]);
  const [listModalOpen, setListModalOpen] = useState(false);
  const [listsLoading, setListsLoading] = useState(false);
  const [addingToList, setAddingToList] = useState(false);

  const [reactions,        setReactions]        = useState([]);
  const [reactionsLoading, setReactionsLoading] = useState(false);
  const [reactionBusy,     setReactionBusy]     = useState("");//for type

  const [comments,          setComments]          = useState([]);
  const [commentsLoading,   setCommentsLoading]   = useState(false);
  const [commentText,       setCommentText]       = useState("");
  const [commentBusy,       setCommentBusy]       = useState(false);//for loading to disable button
  const [replyFor,          setReplyFor]          = useState(null);//reply input
  const [replyDrafts,       setReplyDrafts]       = useState({});//for parent
  const [editingCommentId,  setEditingCommentId]  = useState(null);
  const [editingText,       setEditingText]       = useState("");
  const [commentActionId,   setCommentActionId]   = useState(null);
const [exists, setExists] = useState(false);


  // ── Derived ───────────────────────────────────────────────────
  const book = books.find((item) => String(item.id) === String(bookId));//give the book from list
  const availabilityOptions  = normalizeAvailabilityOptions(book?.availabilityDates);//for ui
  const selectedAvailability = availabilityOptions.find((i) => i.key === selectedAvailabilityKey) || availabilityOptions[0];// select first option in begining
  const relatedBooks = book
    ? books.filter((i) => i.id !== book.id && (i.genre === book.genre || i.language === book.language)).slice(0, 3)
    : [];//same genre or same language and excludes current book
  const isAvailable    = book?.borrowStatus?.toUpperCase() === "AVAILABLE";
  const reactionSummary = getReactionSummary(reactions, userId);//total likes total dislikes user’s own reaction
  const totalComments   = comments.reduce((sum, c) => sum + 1 + (c.replies?.length || 0), 0);//main comments replies


  useEffect(() => {
    const fetch = async () => {
      setLoading(true); setError("");
      try {
        const res = await getBooks();
        setBooks(Array.isArray(res?.data) ? res.data : []);
      } catch (err) {
        setError(err?.message || "Failed to load book details.");
      } finally { setLoading(false); }
    };
    fetch();
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setActiveTab(requestedTab);
    setMessage(null);
    setBorrowModalOpen(false);
    setListModalOpen(false);
    setReplyFor(null);
    setEditingCommentId(null);
    setEditingText("");
    setCommentText("");
  }, [bookId, requestedTab]);//When user changes book: reset UI scroll to top

  useEffect(() => {
    if (!message) return;
    const t = setTimeout(() => setMessage(null), 3200);//auto hide message
    return () => clearTimeout(t);
  }, [message]);

  const loadReactions = async (id = bookId) => {
    setReactionsLoading(true);
    try {
      const res  = await getBookReactions(id);
      const data = Array.isArray(res?.data) ? res.data : [];
      setReactions(data.map(normalizeReaction));
    } catch { setReactions([]); }
    finally { setReactionsLoading(false); }
  };

  const loadComments = async (id = bookId) => {
    setCommentsLoading(true);
    try {
      const res  = await getBookComments(id);
      const data = Array.isArray(res?.data) ? res.data : [];
      setComments(data.map(normalizeComment));
    } catch { setComments([]); }
    finally { setCommentsLoading(false); }
  };
useEffect(() => {
  if (!bookId) return;

  // eslint-disable-next-line react-hooks/set-state-in-effect
  loadComments(bookId);
  loadReactions(bookId);
   
}, [bookId]);
useEffect(() => {
  const check = async () => {
    if (!userId || !bookId) return;

    const result = await checkBorrowRequestExists(userId, bookId);
   
    setExists(result.data);

  
    console.log(result.data)
  };

  check();
}, [userId, bookId]);  
  const ensureSignedIn = () => { if (userId) return true; navigate("/login"); return false; };//Used before ANY action: borrow comment like add to list


  const handleOpenBorrowModal = () => {
    if (!ensureSignedIn() || !isAvailable || !availabilityOptions.length) return;
    setBorrowModalOpen(true);
  };

  const handleBorrowRequest = async () => {
    if (!ensureSignedIn() || !book || !selectedAvailability) return;
    setBorrowing(true);
    try {
      await sendRequest(userId, book.id, selectedAvailability.duration);
      setBorrowModalOpen(false);
      setMessage({ type: "success", text: "Borrow request sent successfully." });
    } catch (err) {
      setMessage({ type: "error", text: err?.response?.data?.message || "Failed to send borrow request." });
    } finally { setBorrowing(false); }
  };


  const handleOpenReadingLists = async () => {
    if (!ensureSignedIn()) return;
    setListModalOpen(true); setListsLoading(true);
    try {
      const res = await getUserLists(userId);
      setLists(Array.isArray(res?.data) ? res.data : []);
    } catch (err) {
      setLists([]);
      setMessage({ type: "error", text: err?.response?.data?.message || "Failed to load your reading lists." });
    } finally { setListsLoading(false); }
  };

  const handleAddToList = async (listId) => {
    if (!book) return;
    setAddingToList(true);
    try {
      await addBook(listId, book.id);
      setListModalOpen(false);
      setMessage({ type: "success", text: "Book added to your reading list." });
    } catch (err) {
      setMessage({ type: "error", text: err?.response?.data?.message || "Could not add this book to the selected list." });
    } finally { setAddingToList(false); }
  };

  const handleReaction = async (type) => {
    if (!ensureSignedIn() || !book) return;
    setReactionBusy(type);
    try {
      if (type === "LIKE") await likeBook(userId, book.id);
      else await dislikeBook(userId, book.id);
      await loadReactions();
    } catch (err) {
      setMessage({ type: "error", text: err?.response?.data?.message || "Failed to update your reaction." });
    } finally { setReactionBusy(""); }
  };

  const handleCommentSubmit = async () => {
    if (!ensureSignedIn() || !book || !commentText.trim()) return;
    setCommentBusy(true);
    try {
      await addComment(userId, book.id, commentText.trim());
      setCommentText("");
      setActiveTab("comments");
      await loadComments();
      setMessage({ type: "success", text: "Comment added." });
    } catch (err) {
      setMessage({ type: "error", text: err?.response?.data?.message || "Failed to post your comment." });
    } finally { setCommentBusy(false); }
  };

  const handleReplySubmit = async (parentId) => {
    const replyText = replyDrafts[parentId]?.trim();
    if (!ensureSignedIn() || !replyText) return;
    setCommentActionId(parentId);
    try {
      await replyToComment(userId, parentId, replyText);
      setReplyDrafts((prev) => ({ ...prev, [parentId]: "" }));
      setReplyFor(null);
      await loadComments();
      setMessage({ type: "success", text: "Reply added." });
    } catch (err) {
      setMessage({ type: "error", text: err?.response?.data?.message || "Failed to post your reply." });
    } finally { setCommentActionId(null); }
  };

  const handleStartEdit = (comment) => { setEditingCommentId(comment.id); setEditingText(comment.content); };

  const handleSaveEdit = async (commentId) => {
    if (!ensureSignedIn() || !editingText.trim()) return;
    setCommentActionId(commentId);
    try {
      await updateComment(userId, commentId, editingText.trim());
      setEditingCommentId(null);
       setEditingText("");
      await loadComments();
      setMessage({ type: "success", text: "Comment updated." });
    } catch (err) {
      setMessage({ type: "error", text: err?.response?.data?.message || "Failed to update the comment." });
    } finally { setCommentActionId(null); }
  };

  const handleDeleteComment = async (commentId) => {
    if (!ensureSignedIn()) return;
    if (!window.confirm("Delete this comment?")) return;
    setCommentActionId(commentId);
    try {
      await deleteComment(userId, commentId);
      await loadComments();
      setMessage({ type: "success", text: "Comment deleted." });
    } catch (err) {
      setMessage({ type: "error", text: err?.response?.data?.message || "Failed to delete the comment." });
    } finally { setCommentActionId(null); }
  };

  return {
    book, books, loading, error, message, navigate, userId,
    activeTab, setActiveTab,
    availabilityOptions, selectedAvailability, selectedAvailabilityKey, setSelectedAvailabilityKey,
    borrowModalOpen, setBorrowModalOpen, borrowing,
    lists, listModalOpen, setListModalOpen, listsLoading, addingToList,
    reactions, reactionsLoading, reactionBusy, reactionSummary,
    comments, commentsLoading, commentText, setCommentText, commentBusy,
    replyFor, setReplyFor, replyDrafts, setReplyDrafts,
    editingCommentId, editingText, setEditingText, commentActionId,
    relatedBooks, isAvailable, totalComments,
    handleOpenBorrowModal, handleBorrowRequest,
    handleOpenReadingLists, handleAddToList,
    handleReaction,
    handleCommentSubmit, handleReplySubmit,
    handleStartEdit, handleSaveEdit,
    handleDeleteComment,exists,setExists,
    onEditCancel: () => { setEditingCommentId(null); setEditingText(""); },
  };
}