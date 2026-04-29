// import { useEffect, useState } from "react";
// import { useNavigate, useParams, useSearchParams } from "react-router-dom";
// import { getBooks } from "../../Service/BookService";
// import { sendRequest } from "../../Service/BorrowService";
// import { addBook, getUserLists } from "../../Service/ReadingListService";
// import { likeBook, dislikeBook, getBookReactions } from "../../Service/ReactionService";
// import {
//   addComment,
//   deleteComment,
//   getBookComments,
//   replyToComment,
//   updateComment,
// } from "../../Service/CommentService";
// import { getUser } from "../../utils/auth";

// export default function BookDetails() {
//   const navigate = useNavigate();
//   const { bookId } = useParams();
//   const [searchParams] = useSearchParams();
//   const user = getUser();
//   const userId = user?.id;
//   const requestedTab = searchParams.get("tab") === "comments" ? "comments" : "about";

//   const [books, setBooks] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [message, setMessage] = useState(null);
//   const [activeTab, setActiveTab] = useState(requestedTab);

//   const [borrowModalOpen, setBorrowModalOpen] = useState(false);
//   const [selectedAvailabilityKey, setSelectedAvailabilityKey] = useState("");
//   const [borrowing, setBorrowing] = useState(false);

//   const [lists, setLists] = useState([]);
//   const [listModalOpen, setListModalOpen] = useState(false);
//   const [listsLoading, setListsLoading] = useState(false);
//   const [addingToList, setAddingToList] = useState(false);

//   const [reactions, setReactions] = useState([]);
//   const [reactionsLoading, setReactionsLoading] = useState(false);
//   const [reactionBusy, setReactionBusy] = useState("");

//   const [comments, setComments] = useState([]);
//   const [commentsLoading, setCommentsLoading] = useState(false);
//   const [commentText, setCommentText] = useState("");
//   const [commentBusy, setCommentBusy] = useState(false);
//   const [replyFor, setReplyFor] = useState(null);
//   const [replyDrafts, setReplyDrafts] = useState({});
//   const [editingCommentId, setEditingCommentId] = useState(null);
//   const [editingText, setEditingText] = useState("");
//   const [commentActionId, setCommentActionId] = useState(null);

//   useEffect(() => {
//     const fetchBooks = async () => {
//       setLoading(true);
//       setError("");

//       try {
//         const res = await getBooks();
//         setBooks(Array.isArray(res?.data) ? res.data : []);
//       } catch (err) {
//         setError(err?.message || "Failed to load book details.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchBooks();
//   }, []);

//   /* eslint-disable react-hooks/set-state-in-effect */
//   useEffect(() => {
//     window.scrollTo({ top: 0, behavior: "smooth" });
//     setActiveTab(requestedTab);
//     setMessage(null);
//     setBorrowModalOpen(false);
//     setListModalOpen(false);
//     setReplyFor(null);
//     setEditingCommentId(null);
//     setEditingText("");
//     setCommentText("");
//   }, [bookId, requestedTab]);
//   /* eslint-enable react-hooks/set-state-in-effect */

//   useEffect(() => {
//     if (!message) return;
//     const timer = setTimeout(() => setMessage(null), 3200);
//     return () => clearTimeout(timer);
//   }, [message]);

//   const book = books.find((item) => String(item.id) === String(bookId));
//   const availabilityOptions = normalizeAvailabilityOptions(book?.availabilityDates);
//   const selectedAvailability =
//     availabilityOptions.find((item) => item.key === selectedAvailabilityKey) || availabilityOptions[0];
//   const relatedBooks = book
//     ? books
//         .filter(
//           (item) =>
//             item.id !== book.id &&
//             (item.genre === book.genre || item.language === book.language)
//         )
//         .slice(0, 3)
//     : [];
//   const isAvailable = book?.borrowStatus?.toUpperCase() === "AVAILABLE";
//   const reactionSummary = getReactionSummary(reactions, userId);
//   const totalComments = comments.reduce(
//     (sum, comment) => sum + 1 + (comment.replies?.length || 0),
//     0
//   );

//   async function loadReactions(targetBookId = bookId) {
//     setReactionsLoading(true);

//     try {
//       const res = await getBookReactions(targetBookId);
//       const data = Array.isArray(res?.data) ? res.data : [];
//       setReactions(data.map(normalizeReaction));
//     } catch {
//       setReactions([]);
//     } finally {
//       setReactionsLoading(false);
//     }
//   }

//   async function loadComments(targetBookId = bookId) {
//     setCommentsLoading(true);

//     try {
//       const res = await getBookComments(targetBookId);
//       const data = Array.isArray(res?.data) ? res.data : [];
//       setComments(data.map(normalizeComment));
//     } catch {
//       setComments([]);
//     } finally {
//       setCommentsLoading(false);
//     }
//   }

//   /* eslint-disable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */
//   useEffect(() => {
//     if (!bookId) return;

//     loadReactions(bookId);
//     loadComments(bookId);
//   }, [bookId]);
//   /* eslint-enable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */

//   const ensureSignedIn = () => {
//     if (userId) return true;
//     navigate("/login");
//     return false;
//   };

//   const handleOpenBorrowModal = () => {
//     if (!ensureSignedIn() || !isAvailable || !availabilityOptions.length) return;
//     setBorrowModalOpen(true);
//   };

//   const handleBorrowRequest = async () => {
//     if (!ensureSignedIn() || !book || !selectedAvailability) return;

//     setBorrowing(true);
//     try {
//       await sendRequest(userId, book.id, selectedAvailability.duration);
//       setBorrowModalOpen(false);
//       setMessage({ type: "success", text: "Borrow request sent successfully." });
//     } catch (err) {
//       setMessage({
//         type: "error",
//         text: err?.response?.data?.message || "Failed to send borrow request.",
//       });
//     } finally {
//       setBorrowing(false);
//     }
//   };

//   const handleOpenReadingLists = async () => {
//     if (!ensureSignedIn()) return;

//     setListModalOpen(true);
//     setListsLoading(true);

//     try {
//       const res = await getUserLists(userId);
//       setLists(Array.isArray(res?.data) ? res.data : []);
//     } catch (err) {
//       setLists([]);
//       setMessage({
//         type: "error",
//         text: err?.response?.data?.message || "Failed to load your reading lists.",
//       });
//     } finally {
//       setListsLoading(false);
//     }
//   };

//   const handleAddToList = async (listId) => {
//     if (!book) return;

//     setAddingToList(true);
//     try {
//       await addBook(listId, book.id);
//       setListModalOpen(false);
//       setMessage({ type: "success", text: "Book added to your reading list." });
//     } catch (err) {
//       setMessage({
//         type: "error",
//         text: err?.response?.data?.message || "Could not add this book to the selected list.",
//       });
//     } finally {
//       setAddingToList(false);
//     }
//   };

//   const handleReaction = async (type) => {
//     if (!ensureSignedIn() || !book) return;

//     setReactionBusy(type);
//     try {
//       if (type === "LIKE") {
//         await likeBook(userId, book.id);
//       } else {
//         await dislikeBook(userId, book.id);
//       }
//       await loadReactions();
//     } catch (err) {
//       setMessage({
//         type: "error",
//         text: err?.response?.data?.message || "Failed to update your reaction.",
//       });
//     } finally {
//       setReactionBusy("");
//     }
//   };

//   const handleCommentSubmit = async () => {
//     if (!ensureSignedIn() || !book || !commentText.trim()) return;

//     setCommentBusy(true);
//     try {
//       await addComment(userId, book.id, commentText.trim());
//       setCommentText("");
//       setActiveTab("comments");
//       await loadComments();
//       setMessage({ type: "success", text: "Comment added." });
//     } catch (err) {
//       setMessage({
//         type: "error",
//         text: err?.response?.data?.message || "Failed to post your comment.",
//       });
//     } finally {
//       setCommentBusy(false);
//     }
//   };

//   const handleReplySubmit = async (parentId) => {
//     const replyText = replyDrafts[parentId]?.trim();
//     if (!ensureSignedIn() || !replyText) return;

//     setCommentActionId(parentId);
//     try {
//       await replyToComment(userId, parentId, replyText);
//       setReplyDrafts((prev) => ({ ...prev, [parentId]: "" }));
//       setReplyFor(null);
//       await loadComments();
//       setMessage({ type: "success", text: "Reply added." });
//     } catch (err) {
//       setMessage({
//         type: "error",
//         text: err?.response?.data?.message || "Failed to post your reply.",
//       });
//     } finally {
//       setCommentActionId(null);
//     }
//   };

//   const handleStartEdit = (comment) => {
//     setEditingCommentId(comment.id);
//     setEditingText(comment.content);
//   };

//   const handleSaveEdit = async (commentId) => {
//     if (!ensureSignedIn() || !editingText.trim()) return;

//     setCommentActionId(commentId);
//     try {
//       await updateComment(userId, commentId, editingText.trim());
//       setEditingCommentId(null);
//       setEditingText("");
//       await loadComments();
//       setMessage({ type: "success", text: "Comment updated." });
//     } catch (err) {
//       setMessage({
//         type: "error",
//         text: err?.response?.data?.message || "Failed to update the comment.",
//       });
//     } finally {
//       setCommentActionId(null);
//     }
//   };

//   const handleDeleteComment = async (commentId) => {
//     if (!ensureSignedIn()) return;
//     if (!window.confirm("Delete this comment?")) return;

//     setCommentActionId(commentId);
//     try {
//       await deleteComment(userId, commentId);
//       await loadComments();
//       setMessage({ type: "success", text: "Comment deleted." });
//     } catch (err) {
//       setMessage({
//         type: "error",
//         text: err?.response?.data?.message || "Failed to delete the comment.",
//       });
//     } finally {
//       setCommentActionId(null);
//     }
//   };

//   if (loading) {
//     return <StatePanel text="Loading book details..." />;
//   }

//   if (error) {
//     return <StatePanel text={error} isError />;
//   }

//   if (!book) {
//     return (
//       <StatePanel
//         text="We could not find this book."
//         actionLabel="Back to Home"
//         onAction={() => navigate("/")}
//       />
//     );
//   }

//   return (
//     <div style={styles.page} className="book-details-page">
//       <style>{`
//         @media (max-width: 980px) {
//           .book-details-hero {
//             grid-template-columns: 1fr !important;
//           }

//           .book-details-content {
//             grid-template-columns: 1fr !important;
//           }

//           .book-details-cover {
//             max-width: 320px;
//           }
//         }

//         @media (max-width: 720px) {
//           .book-details-page {
//             padding: 16px !important;
//           }

//           .book-details-surface {
//             padding: 18px !important;
//           }

//           .book-details-meta {
//             grid-template-columns: 1fr !important;
//           }

//           .book-details-title-row,
//           .book-details-owner-card,
//           .book-details-comment-footer {
//             flex-direction: column !important;
//             align-items: flex-start !important;
//           }

//           .book-details-title {
//             font-size: 30px !important;
//           }
//         }
//       `}</style>

//       {message && (
//         <div
//           style={{
//             ...styles.toast,
//             background: message.type === "success" ? "#16a34a" : "#dc2626",
//           }}
//         >
//           {message.text}
//         </div>
//       )}

//       <div style={styles.surface} className="book-details-surface">
//         <button type="button" style={styles.backButton} onClick={() => navigate("/")}>
//           <ArrowLeftIcon />
//           Back to Home
//         </button>

//         <div style={styles.heroGrid} className="book-details-hero">
//           <div style={styles.coverColumn} className="book-details-cover">
//             {book.coverImageBase64 ? (
//               <img
//                 src={`data:image/jpeg;base64,${book.coverImageBase64}`}
//                 alt={book.title}
//                 style={styles.coverImage}
//               />
//             ) : (
//               <div style={styles.coverFallback}>No Cover</div>
//             )}
//           </div>

//           <div style={styles.infoColumn}>
//             <div style={styles.titleRow} className="book-details-title-row">
//               <div>
//                 <h1 style={styles.title} className="book-details-title">
//                   {book.title}
//                 </h1>
//                 <p style={styles.author}>by {book.owner?.name || "Unknown owner"}</p>
//               </div>

//               <span
//                 style={{
//                   ...styles.statusPill,
//                   background: isAvailable ? "#ecfdf3" : "#fff7ed",
//                   color: isAvailable ? "#15803d" : "#c2410c",
//                 }}
//               >
//                 {isAvailable ? "Available" : "Borrowed"}
//               </span>
//             </div>

//             <div style={styles.ownerCard} className="book-details-owner-card">
//               <div style={styles.ownerInfo}>
//                 <div style={styles.ownerAvatar}>{getOwnerInitials(book.owner?.name)}</div>
//                 <div>
//                   <p style={styles.ownerName}>{book.owner?.name || "Book Owner"}</p>
//                   <p style={styles.ownerMeta}>
//                     {book.owner?.createdAt
//                       ? `Member since ${formatMonthYear(book.owner.createdAt)}`
//                       : "Community member"}
//                   </p>
//                 </div>
//               </div>

//               <button type="button" style={styles.secondaryButton} >
//                 View Profile
//               </button>
//             </div>

//             <div style={styles.metaGrid} className="book-details-meta">
//               <InfoCard label="ISBN" value={book.isbn || "Not available"} />
//               <InfoCard label="Language" value={book.language || "Not available"} />
//               <InfoCard label="Genre" value={book.genre || "Not available"} />
//               <InfoCard
//                 label="Publication Date"
//                 value={book.publicationDate ? formatDate(book.publicationDate) : "Not available"}
//               />
//               <InfoCard
//                 label="Availability"
//                 value={getAvailabilityLabel(availabilityOptions)}
//               />
//               <InfoCard
//                 label="Borrow Price"
//                 value={
//                   book.borrowPrice != null ? `${book.borrowPrice} L.E / day` : "Not available"
//                 }
//               />
//             </div>

//             <div style={styles.actionRow}>
//               <button
//                 type="button"
//                 style={{
//                   ...styles.primaryButton,
//                   ...((!isAvailable || !availabilityOptions.length) && styles.primaryButtonDisabled),
//                 }}
//                 onClick={handleOpenBorrowModal}
//                 disabled={!isAvailable || !availabilityOptions.length}
//               >
//                 Request Borrow
//               </button>

//               <button type="button" style={styles.readingListButton} onClick={handleOpenReadingLists}>
//                 <BookmarkIcon />
//                 Add to Reading List
//               </button>
//             </div>

//             <div style={styles.reactionRow}>
//               <button
//                 type="button"
//                 style={{
//                   ...styles.reactionButton,
//                   ...(reactionSummary.currentReaction === "LIKE" ? styles.reactionButtonActive : {}),
//                 }}
//                 onClick={() => handleReaction("LIKE")}
//                 disabled={reactionBusy === "LIKE"}
//               >
//                 <HeartSmallIcon filled={reactionSummary.currentReaction === "LIKE"} />
//                 Like ({reactionSummary.likeCount})
//               </button>

//               <button
//                 type="button"
//                 style={{
//                   ...styles.reactionButton,
//                   ...(reactionSummary.currentReaction === "DISLIKE" ? styles.reactionButtonDanger : {}),
//                 }}
//                 onClick={() => handleReaction("DISLIKE")}
//                 disabled={reactionBusy === "DISLIKE"}
//               >
//                 <DislikeIcon filled={reactionSummary.currentReaction === "DISLIKE"} />
//                 Dislike ({reactionSummary.dislikeCount})
//               </button>

//               {reactionsLoading && <span style={styles.helperText}>Updating reactions...</span>}
//             </div>
//           </div>
//         </div>

//         <div style={styles.contentGrid} className="book-details-content">
//           <div>
//             <div style={styles.tabs}>
//               <button
//                 type="button"
//                 style={{
//                   ...styles.tabButton,
//                   ...(activeTab === "about" ? styles.tabButtonActive : {}),
//                 }}
//                 onClick={() => setActiveTab("about")}
//               >
//                 About
//               </button>
//               <button
//                 type="button"
//                 style={{
//                   ...styles.tabButton,
//                   ...(activeTab === "comments" ? styles.tabButtonActive : {}),
//                 }}
//                 onClick={() => setActiveTab("comments")}
//               >
//                 Comments ({totalComments})
//               </button>
//             </div>

//             <div style={styles.tabPanel}>
//               {activeTab === "about" ? (
//                 <p style={styles.description}>
//                   {book.description || "No description has been added for this book yet."}
//                 </p>
//               ) : (
//                 <div>
//                   <div style={styles.commentComposer}>
//                     <textarea
//                       style={styles.commentTextarea}
//                       rows={4}
//                       value={commentText}
//                       onChange={(e) => setCommentText(e.target.value)}
//                       placeholder={
//                         userId ? "Write a comment about this book..." : "Login to add a comment."
//                       }
//                       disabled={!userId || commentBusy}
//                     />
//                     <div style={styles.commentComposerFooter} className="book-details-comment-footer">
//                       <span style={styles.helperText}>
//                         Join the conversation about this book.
//                       </span>
//                       <button
//                         type="button"
//                         style={{
//                           ...styles.primaryButton,
//                           ...((!userId || !commentText.trim() || commentBusy) && styles.primaryButtonDisabled),
//                         }}
//                         onClick={handleCommentSubmit}
//                         disabled={!userId || !commentText.trim() || commentBusy}
//                       >
//                         {commentBusy ? "Posting..." : "Post Comment"}
//                       </button>
//                     </div>
//                   </div>

//                   {commentsLoading ? (
//                     <div style={styles.commentState}>Loading comments...</div>
//                   ) : comments.length === 0 ? (
//                     <div style={styles.commentState}>No comments yet for this book.</div>
//                   ) : (
//                     <div style={styles.commentsList}>
//                       {comments.map((comment) => (
//                         <CommentCard
//                           key={comment.id}
//                           comment={comment}
//                           currentUserId={userId}
//                           replyFor={replyFor}
//                           setReplyFor={setReplyFor}
//                           replyDraft={replyDrafts[comment.id] || ""}
//                           setReplyDraft={(value) =>
//                             setReplyDrafts((prev) => ({ ...prev, [comment.id]: value }))
//                           }
//                           editingCommentId={editingCommentId}
//                           editingText={editingText}
//                           setEditingText={setEditingText}
//                           commentActionId={commentActionId}
//                           onReplySubmit={() => handleReplySubmit(comment.id)}
//                           onEditStart={handleStartEdit}
//                           onEditSave={handleSaveEdit}
//                           onEditCancel={() => {
//                             setEditingCommentId(null);
//                             setEditingText("");
//                           }}
//                           onDelete={handleDeleteComment}
//                         />
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               )}
//             </div>
//           </div>

//           <aside style={styles.relatedPanel}>
//             <h3 style={styles.relatedTitle}>You may also like</h3>

//             {relatedBooks.length === 0 ? (
//               <p style={styles.relatedEmpty}>No similar books yet.</p>
//             ) : (
//               relatedBooks.map((item) => (
//                 <button
//                   key={item.id}
//                   type="button"
//                   style={styles.relatedItem}
//                   onClick={() => navigate(`/book/${item.id}`)}
//                 >
//                   {item.coverImageBase64 ? (
//                     <img
//                       src={`data:image/jpeg;base64,${item.coverImageBase64}`}
//                       alt={item.title}
//                       style={styles.relatedImage}
//                     />
//                   ) : (
//                     <div style={styles.relatedImageFallback}>Book</div>
//                   )}

//                   <div style={styles.relatedMeta}>
//                     <p style={styles.relatedBookTitle}>{item.title}</p>
//                     <p style={styles.relatedBookAuthor}>{item.owner?.name || "Unknown owner"}</p>
//                     <p style={styles.relatedBookPrice}>
//                       {item.borrowPrice != null ? `${item.borrowPrice} L.E / day` : "Price not set"}
//                     </p>
//                   </div>
//                 </button>
//               ))
//             )}
//           </aside>
//         </div>
//       </div>

//       {borrowModalOpen && (
//         <div style={styles.modalOverlay} onClick={() => setBorrowModalOpen(false)}>
//           <div style={styles.modalCard} onClick={(e) => e.stopPropagation()}>
//             <div style={styles.modalHeader}>
//               <h2 style={styles.modalTitle}>Choose Availability Date</h2>
//               <button
//                 type="button"
//                 style={styles.closeButton}
//                 onClick={() => setBorrowModalOpen(false)}
//               >
//                 x
//               </button>
//             </div>

//             <div style={styles.optionList}>
//               {availabilityOptions.map((option) => (
//                 <button
//                   key={option.key}
//                   type="button"
//                   style={{
//                     ...styles.optionCard,
//                     ...(selectedAvailability?.key === option.key ? styles.optionCardActive : {}),
//                   }}
//                   onClick={() => setSelectedAvailabilityKey(option.key)}
//                 >
//                   <div>
//                     <p style={styles.optionTitle}>{option.label}</p>
//                     <p style={styles.optionMeta}>
//                       {option.rangeLabel || "Available to request"}
//                     </p>
//                   </div>
//                   <span style={styles.optionSelect}>
//                     {selectedAvailability?.key === option.key ? "Selected" : "Select"}
//                   </span>
//                 </button>
//               ))}
//             </div>

//             <div style={styles.modalFooter}>
//               <button
//                 type="button"
//                 style={styles.secondaryButton}
//                 onClick={() => setBorrowModalOpen(false)}
//               >
//                 Cancel
//               </button>
//               <button
//                 type="button"
//                 style={{
//                   ...styles.primaryButton,
//                   ...((!selectedAvailability || borrowing) && styles.primaryButtonDisabled),
//                 }}
//                 onClick={handleBorrowRequest}
//                 disabled={!selectedAvailability || borrowing}
//               >
//                 {borrowing ? "Sending..." : "Confirm Request"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {listModalOpen && (
//         <div style={styles.modalOverlay} onClick={() => setListModalOpen(false)}>
//           <div style={styles.modalCard} onClick={(e) => e.stopPropagation()}>
//             <div style={styles.modalHeader}>
//               <h2 style={styles.modalTitle}>Add to Reading List</h2>
//               <button
//                 type="button"
//                 style={styles.closeButton}
//                 onClick={() => setListModalOpen(false)}
//               >
//                 x
//               </button>
//             </div>

//             {listsLoading ? (
//               <div style={styles.modalState}>Loading your lists...</div>
//             ) : lists.length === 0 ? (
//               <div style={styles.modalState}>
//                 <p style={{ marginTop: 0 }}>You do not have a reading list yet.</p>
//                 <button
//                   type="button"
//                   style={styles.primaryButton}
//                   onClick={() => navigate("/readingList")}
//                 >
//                   Create Reading List
//                 </button>
//               </div>
//             ) : (
//               <div style={styles.optionList}>
//                 {lists.map((list) => (
//                   <button
//                     key={list.id}
//                     type="button"
//                     style={styles.optionCard}
//                     onClick={() => handleAddToList(list.id)}
//                     disabled={addingToList}
//                   >
//                     <div>
//                       <p style={styles.optionTitle}>{list.name}</p>
//                       <p style={styles.optionMeta}>{list.description || "No description"}</p>
//                     </div>
//                     <span style={styles.optionSelect}>{addingToList ? "Saving..." : "Add"}</span>
//                   </button>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// function CommentCard({
//   comment,
//   currentUserId,
//   replyFor,
//   setReplyFor,
//   replyDraft,
//   setReplyDraft,
//   editingCommentId,
//   editingText,
//   setEditingText,
//   commentActionId,
//   onReplySubmit,
//   onEditStart,
//   onEditSave,
//   onEditCancel,
//   onDelete,
// }) {
//   const canManage = String(comment.userId) === String(currentUserId);

//   return (
//     <div style={styles.commentCard}>
//       <div style={styles.commentHeader}>
//         <div>
//           <p style={styles.commentAuthor}>{getCommentAuthor(comment, currentUserId)}</p>
//           <p style={styles.commentTime}>{formatDateTime(comment.createdAt)}</p>
//         </div>

//         <div style={styles.commentActions}>
//           <button
//             type="button"
//             style={styles.linkButton}
//             onClick={() => setReplyFor(replyFor === comment.id ? null : comment.id)}
//           >
//             Reply
//           </button>
//           {canManage && (
//             <>
//               <button type="button" style={styles.linkButton} onClick={() => onEditStart(comment)}>
//                 Edit
//               </button>
//               <button type="button" style={styles.linkButtonDanger} onClick={() => onDelete(comment.id)}>
//                 Delete
//               </button>
//             </>
//           )}
//         </div>
//       </div>

//       {editingCommentId === comment.id ? (
//         <div>
//           <textarea
//             rows={3}
//             style={styles.commentTextarea}
//             value={editingText}
//             onChange={(e) => setEditingText(e.target.value)}
//           />
//           <div style={styles.inlineActionRow}>
//             <button
//               type="button"
//               style={{
//                 ...styles.primaryButton,
//                 ...(commentActionId === comment.id && styles.primaryButtonDisabled),
//               }}
//               onClick={() => onEditSave(comment.id)}
//               disabled={commentActionId === comment.id}
//             >
//               {commentActionId === comment.id ? "Saving..." : "Save"}
//             </button>
//             <button type="button" style={styles.secondaryButton} onClick={onEditCancel}>
//               Cancel
//             </button>
//           </div>
//         </div>
//       ) : (
//         <p style={styles.commentBody}>{comment.content}</p>
//       )}

//       {replyFor === comment.id && (
//         <div style={styles.replyComposer}>
//           <textarea
//             rows={3}
//             style={styles.commentTextarea}
//             value={replyDraft}
//             onChange={(e) => setReplyDraft(e.target.value)}
//             placeholder="Write a reply..."
//           />
//           <div style={styles.inlineActionRow}>
//             <button
//               type="button"
//               style={{
//                 ...styles.primaryButton,
//                 ...((!replyDraft.trim() || commentActionId === comment.id) && styles.primaryButtonDisabled),
//               }}
//               onClick={onReplySubmit}
//               disabled={!replyDraft.trim() || commentActionId === comment.id}
//             >
//               {commentActionId === comment.id ? "Posting..." : "Reply"}
//             </button>
//             <button type="button" style={styles.secondaryButton} onClick={() => setReplyFor(null)}>
//               Cancel
//             </button>
//           </div>
//         </div>
//       )}

//       {comment.replies?.length > 0 && (
//         <div style={styles.replyList}>
//           {comment.replies.map((reply) => {
//             const canManageReply = String(reply.userId) === String(currentUserId);

//             return (
//               <div key={reply.id} style={styles.replyCard}>
//                 <div style={styles.commentHeader}>
//                   <div>
//                     <p style={styles.commentAuthor}>{getCommentAuthor(reply, currentUserId)}</p>
//                     <p style={styles.commentTime}>{formatDateTime(reply.createdAt)}</p>
//                   </div>

//                   {canManageReply && (
//                     <div style={styles.commentActions}>
//                       <button
//                         type="button"
//                         style={styles.linkButton}
//                         onClick={() => onEditStart(reply)}
//                       >
//                         Edit
//                       </button>
//                       <button
//                         type="button"
//                         style={styles.linkButtonDanger}
//                         onClick={() => onDelete(reply.id)}
//                       >
//                         Delete
//                       </button>
//                     </div>
//                   )}
//                 </div>

//                 {editingCommentId === reply.id ? (
//                   <div>
//                     <textarea
//                       rows={3}
//                       style={styles.commentTextarea}
//                       value={editingText}
//                       onChange={(e) => setEditingText(e.target.value)}
//                     />
//                     <div style={styles.inlineActionRow}>
//                       <button
//                         type="button"
//                         style={{
//                           ...styles.primaryButton,
//                           ...(commentActionId === reply.id && styles.primaryButtonDisabled),
//                         }}
//                         onClick={() => onEditSave(reply.id)}
//                         disabled={commentActionId === reply.id}
//                       >
//                         {commentActionId === reply.id ? "Saving..." : "Save"}
//                       </button>
//                       <button type="button" style={styles.secondaryButton} onClick={onEditCancel}>
//                         Cancel
//                       </button>
//                     </div>
//                   </div>
//                 ) : (
//                   <p style={styles.commentBody}>{reply.content}</p>
//                 )}
//               </div>
//             );
//           })}
//         </div>
//       )}
//     </div>
//   );
// }

// function StatePanel({ text, isError = false, actionLabel, onAction }) {
//   return (
//     <div style={styles.page}>
//       <div style={styles.statePanel}>
//         <p style={{ ...styles.stateText, color: isError ? "#dc2626" : "#374151" }}>{text}</p>
//         {actionLabel && (
//           <button type="button" style={styles.primaryButton} onClick={onAction}>
//             {actionLabel}
//           </button>
//         )}
//       </div>
//     </div>
//   );
// }

// function InfoCard({ label, value }) {
//   return (
//     <div style={styles.infoCard}>
//       <p style={styles.infoLabel}>{label}</p>
//       <p style={styles.infoValue}>{value}</p>
//     </div>
//   );
// }

// function ArrowLeftIcon() {
//   return (
//     <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//       <path d="M15 18l-6-6 6-6" />
//     </svg>
//   );
// }

// function BookmarkIcon() {
//   return (
//     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//       <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
//     </svg>
//   );
// }

// function HeartSmallIcon({ filled }) {
//   return (
//     <svg
//       width="16"
//       height="16"
//       viewBox="0 0 24 24"
//       fill={filled ? "#ef4444" : "none"}
//       stroke={filled ? "#ef4444" : "currentColor"}
//       strokeWidth="2"
//     >
//       <path d="M12 21s-6.716-4.35-9.192-8.067C.67 9.68 2.458 5.25 6.773 5.25c2.106 0 3.362 1.206 4.227 2.298.865-1.092 2.121-2.298 4.227-2.298 4.315 0 6.103 4.43 3.965 7.683C18.716 16.65 12 21 12 21z" />
//     </svg>
//   );
// }

// function DislikeIcon({ filled }) {
//   return (
//     <svg
//       width="16"
//       height="16"
//       viewBox="0 0 24 24"
//       fill={filled ? "#f97316" : "none"}
//       stroke={filled ? "#f97316" : "currentColor"}
//       strokeWidth="2"
//     >
//       <path d="M10 14V5.236a2 2 0 0 0-.586-1.414l-.236-.236A2 2 0 0 0 7.764 3H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h5zm0 0 2.293 5.352A1 1 0 0 0 13.214 20H15a2 2 0 0 0 2-2v-4h2.764a2 2 0 0 0 1.952-2.436l-1.4-6A2 2 0 0 0 18.367 4H10" />
//     </svg>
//   );
// }

// function normalizeAvailabilityOptions(items = []) {
//   return items.map((item, index) => {
//     const id = item?.id ?? item?.Id ?? item?.availabilityDateId ?? item?.AvailabilityDateId;
//     const duration = item?.duration ?? item?.Duration;
//     const startDate = item?.startDate ?? item?.StartDate;
//     const endDate = item?.endDate ?? item?.EndDate;

//     return {
//       key: String(id ?? `availability-${index}`),
//       id,
//       duration,
//       startDate,
//       endDate,
//       label: duration ? `${duration} days` : `Option ${index + 1}`,
//       rangeLabel:
//         startDate && endDate ? `${formatDate(startDate)} - ${formatDate(endDate)}` : "",
//     };
//   });
// }

// function normalizeReaction(reaction) {
//   return {
//     id: reaction?.id ?? reaction?.Id,
//     userId: reaction?.userId ?? reaction?.UserId,
//     type: String(reaction?.type ?? reaction?.Type ?? "").toUpperCase(),
//   };
// }

// function normalizeComment(comment) {
//   return {
//     id: comment?.id ?? comment?.Id,
//     userId: comment?.userId ?? comment?.UserId,
//     content: comment?.content ?? comment?.Content ?? "",
//     createdAt: comment?.createdAt ?? comment?.CreatedAt,
//     replies: (comment?.replies ?? comment?.Replies ?? []).map((reply) => ({
//       id: reply?.id ?? reply?.Id,
//       userId: reply?.userId ?? reply?.UserId,
//       content: reply?.content ?? reply?.Content ?? "",
//       createdAt: reply?.createdAt ?? reply?.CreatedAt,
//     })),
//   };
// }

// function getReactionSummary(reactions, currentUserId) {
//   const likeCount = reactions.filter((reaction) => reaction.type === "LIKE").length;
//   const dislikeCount = reactions.filter((reaction) => reaction.type === "DISLIKE").length;
//   const currentReaction =
//     reactions.find((reaction) => String(reaction.userId) === String(currentUserId))?.type || "";

//   return { likeCount, dislikeCount, currentReaction };
// }

// function getAvailabilityLabel(options) {
//   if (!options.length) return "Not specified";
//   return options.map((item) => item.label).join(" | ");
// }

// function getOwnerInitials(name) {
//   if (!name) return "BC";
//   return name
//     .split(" ")
//     .filter(Boolean)
//     .slice(0, 2)
//     .map((part) => part[0]?.toUpperCase())
//     .join("");
// }

// function getCommentAuthor(comment, currentUserId) {
//   return String(comment.userId) === String(currentUserId)
//     ? "You"
//     : `Reader #${comment.userId || "Unknown"}`;
// }

// function formatMonthYear(value) {
//   try {
//     return new Date(value).toLocaleDateString("en-US", {
//       month: "short",
//       year: "numeric",
//     });
//   } catch {
//     return "recently";
//   }
// }

// function formatDate(value) {
//   try {
//     return new Date(value).toLocaleDateString("en-US", {
//       month: "long",
//       day: "numeric",
//       year: "numeric",
//     });
//   } catch {
//     return value;
//   }
// }

// function formatDateTime(value) {
//   try {
//     return new Date(value).toLocaleString("en-US", {
//       month: "short",
//       day: "numeric",
//       year: "numeric",
//       hour: "numeric",
//       minute: "2-digit",
//     });
//   } catch {
//     return "Just now";
//   }
// }

// const styles = {
//   page: {
//     minHeight: "100vh",
//     background: "#f6f7fd",
//     padding: 28,
//     fontFamily: "'Nunito', sans-serif",
//   },
//   surface: {
//     background: "#ffffff",
//     borderRadius: 24,
//     padding: 28,
//     boxShadow: "0 8px 30px rgba(99, 102, 241, 0.08)",
//     border: "1px solid #eef0ff",
//     maxWidth: 1280,
//     margin: "0 auto",
//   },
//   backButton: {
//     display: "inline-flex",
//     alignItems: "center",
//     gap: 8,
//     border: "none",
//     background: "transparent",
//     color: "#5b5bd6",
//     fontSize: 14,
//     fontWeight: 600,
//     cursor: "pointer",
//     padding: 0,
//     marginBottom: 24,
//   },
//   heroGrid: {
//     display: "grid",
//     gridTemplateColumns: "220px minmax(0, 1fr)",
//     gap: 28,
//     alignItems: "start",
//   },
//   coverColumn: {
//     width: "100%",
//   },
//   coverImage: {
//     width: "100%",
//     aspectRatio: "3 / 4.2",
//     objectFit: "cover",
//     borderRadius: 16,
//     boxShadow: "0 10px 25px rgba(15, 23, 42, 0.14)",
//     display: "block",
//   },
//   coverFallback: {
//     width: "100%",
//     aspectRatio: "3 / 4.2",
//     borderRadius: 16,
//     background: "#eef2ff",
//     color: "#6366f1",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     fontWeight: 700,
//     fontSize: 18,
//   },
//   infoColumn: {
//     minWidth: 0,
//   },
//   titleRow: {
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "flex-start",
//     gap: 16,
//     marginBottom: 18,
//   },
//   title: {
//     margin: 0,
//     fontSize: 40,
//     lineHeight: 1.08,
//     color: "#111827",
//     fontWeight: 800,
//   },
//   author: {
//     margin: "8px 0 0",
//     fontSize: 18,
//     color: "#4b5563",
//   },
//   statusPill: {
//     flexShrink: 0,
//     padding: "8px 14px",
//     borderRadius: 999,
//     fontSize: 13,
//     fontWeight: 700,
//   },
//   ownerCard: {
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//     gap: 16,
//     padding: 16,
//     borderRadius: 16,
//     border: "1px solid #eceef8",
//     background: "#fbfbff",
//     marginBottom: 18,
//   },
//   ownerInfo: {
//     display: "flex",
//     alignItems: "center",
//     gap: 12,
//     minWidth: 0,
//   },
//   ownerAvatar: {
//     width: 42,
//     height: 42,
//     borderRadius: "50%",
//     background: "linear-gradient(135deg, #5b5bd6, #8b5cf6)",
//     color: "#fff",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     fontWeight: 800,
//     fontSize: 14,
//     flexShrink: 0,
//   },
//   ownerName: {
//     margin: 0,
//     fontWeight: 700,
//     fontSize: 15,
//     color: "#111827",
//   },
//   ownerMeta: {
//     margin: "4px 0 0",
//     fontSize: 13,
//     color: "#6b7280",
//   },
//   secondaryButton: {
//     border: "1px solid #d9ddf4",
//     background: "#fff",
//     color: "#4f46e5",
//     borderRadius: 12,
//     padding: "10px 16px",
//     fontSize: 14,
//     fontWeight: 700,
//     cursor: "pointer",
//     whiteSpace: "nowrap",
//   },
//   metaGrid: {
//     display: "grid",
//     gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
//     gap: 12,
//     marginBottom: 18,
//   },
//   infoCard: {
//     border: "1px solid #eceef8",
//     borderRadius: 14,
//     padding: "14px 16px",
//     background: "#fff",
//     minHeight: 84,
//   },
//   infoLabel: {
//     margin: 0,
//     fontSize: 12,
//     fontWeight: 700,
//     color: "#9ca3af",
//     textTransform: "uppercase",
//     letterSpacing: 0.4,
//   },
//   infoValue: {
//     margin: "8px 0 0",
//     fontSize: 15,
//     color: "#111827",
//     lineHeight: 1.4,
//     fontWeight: 600,
//   },
//   actionRow: {
//     display: "flex",
//     alignItems: "center",
//     gap: 12,
//     flexWrap: "wrap",
//   },
//   primaryButton: {
//     border: "none",
//     background: "linear-gradient(135deg, #4f46e5, #6d5ef4)",
//     color: "#fff",
//     borderRadius: 14,
//     padding: "14px 24px",
//     fontSize: 15,
//     fontWeight: 800,
//     cursor: "pointer",
//     boxShadow: "0 10px 22px rgba(79, 70, 229, 0.24)",
//   },
//   primaryButtonDisabled: {
//     opacity: 0.55,
//     boxShadow: "none",
//     cursor: "not-allowed",
//   },
//   readingListButton: {
//     display: "inline-flex",
//     alignItems: "center",
//     gap: 10,
//     border: "1px solid #e5e7eb",
//     background: "#fff",
//     color: "#111827",
//     borderRadius: 14,
//     padding: "14px 18px",
//     fontSize: 15,
//     fontWeight: 700,
//     cursor: "pointer",
//   },
//   reactionRow: {
//     display: "flex",
//     alignItems: "center",
//     gap: 10,
//     flexWrap: "wrap",
//     marginTop: 16,
//   },
//   reactionButton: {
//     display: "inline-flex",
//     alignItems: "center",
//     gap: 8,
//     border: "1px solid #e5e7eb",
//     background: "#fff",
//     color: "#111827",
//     borderRadius: 999,
//     padding: "10px 14px",
//     fontSize: 14,
//     fontWeight: 700,
//     cursor: "pointer",
//   },
//   reactionButtonActive: {
//     background: "#fef2f2",
//     borderColor: "#fecaca",
//     color: "#dc2626",
//   },
//   reactionButtonDanger: {
//     background: "#fff7ed",
//     borderColor: "#fdba74",
//     color: "#c2410c",
//   },
//   helperText: {
//     fontSize: 13,
//     color: "#6b7280",
//   },
//   contentGrid: {
//     display: "grid",
//     gridTemplateColumns: "minmax(0, 1fr) 300px",
//     gap: 24,
//     marginTop: 32,
//   },
//   tabs: {
//     display: "flex",
//     gap: 20,
//     borderBottom: "1px solid #eceef8",
//     marginBottom: 18,
//   },
//   tabButton: {
//     border: "none",
//     background: "transparent",
//     color: "#6b7280",
//     fontSize: 15,
//     fontWeight: 700,
//     padding: "0 2px 12px",
//     cursor: "pointer",
//     borderBottom: "2px solid transparent",
//   },
//   tabButtonActive: {
//     color: "#4f46e5",
//     borderBottomColor: "#4f46e5",
//   },
//   tabPanel: {
//     background: "#fff",
//     minHeight: 220,
//   },
//   description: {
//     margin: 0,
//     fontSize: 16,
//     lineHeight: 1.85,
//     color: "#374151",
//     maxWidth: 720,
//   },
//   commentComposer: {
//     border: "1px solid #eceef8",
//     borderRadius: 18,
//     padding: 16,
//     background: "#fbfbff",
//     marginBottom: 16,
//   },
//   commentTextarea: {
//     width: "100%",
//     border: "1px solid #dbe1ff",
//     borderRadius: 14,
//     padding: "12px 14px",
//     fontSize: 14,
//     lineHeight: 1.6,
//     fontFamily: "inherit",
//     color: "#111827",
//     outline: "none",
//     resize: "vertical",
//     boxSizing: "border-box",
//     background: "#fff",
//   },
//   commentComposerFooter: {
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//     gap: 12,
//     marginTop: 12,
//   },
//   commentState: {
//     border: "1px dashed #d9ddf4",
//     borderRadius: 16,
//     padding: 24,
//     color: "#6b7280",
//     fontSize: 14,
//     background: "#fbfbff",
//   },
//   commentsList: {
//     display: "grid",
//     gap: 14,
//   },
//   commentCard: {
//     border: "1px solid #eceef8",
//     borderRadius: 18,
//     padding: 16,
//     background: "#fff",
//   },
//   replyCard: {
//     border: "1px solid #eceef8",
//     borderRadius: 16,
//     padding: 14,
//     background: "#f8faff",
//   },
//   replyList: {
//     display: "grid",
//     gap: 10,
//     marginTop: 14,
//     marginLeft: 18,
//   },
//   commentHeader: {
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "flex-start",
//     gap: 12,
//   },
//   commentAuthor: {
//     margin: 0,
//     fontSize: 14,
//     fontWeight: 700,
//     color: "#111827",
//   },
//   commentTime: {
//     margin: "4px 0 0",
//     fontSize: 12,
//     color: "#9ca3af",
//   },
//   commentBody: {
//     margin: "12px 0 0",
//     fontSize: 14,
//     color: "#374151",
//     lineHeight: 1.8,
//   },
//   commentActions: {
//     display: "flex",
//     alignItems: "center",
//     gap: 10,
//     flexWrap: "wrap",
//   },
//   linkButton: {
//     border: "none",
//     background: "transparent",
//     color: "#4f46e5",
//     fontSize: 13,
//     fontWeight: 700,
//     cursor: "pointer",
//     padding: 0,
//   },
//   linkButtonDanger: {
//     border: "none",
//     background: "transparent",
//     color: "#dc2626",
//     fontSize: 13,
//     fontWeight: 700,
//     cursor: "pointer",
//     padding: 0,
//   },
//   replyComposer: {
//     marginTop: 14,
//     paddingTop: 14,
//     borderTop: "1px solid #eef2ff",
//   },
//   inlineActionRow: {
//     display: "flex",
//     gap: 10,
//     flexWrap: "wrap",
//     marginTop: 10,
//   },
//   relatedPanel: {
//     border: "1px solid #eceef8",
//     borderRadius: 18,
//     padding: 18,
//     background: "#fbfbff",
//     alignSelf: "start",
//   },
//   relatedTitle: {
//     margin: "0 0 16px",
//     fontSize: 18,
//     fontWeight: 800,
//     color: "#111827",
//   },
//   relatedEmpty: {
//     margin: 0,
//     fontSize: 14,
//     color: "#6b7280",
//   },
//   relatedItem: {
//     display: "grid",
//     gridTemplateColumns: "74px minmax(0, 1fr)",
//     gap: 12,
//     width: "100%",
//     padding: 0,
//     border: "none",
//     background: "transparent",
//     textAlign: "left",
//     cursor: "pointer",
//     marginBottom: 14,
//   },
//   relatedImage: {
//     width: 74,
//     height: 104,
//     objectFit: "cover",
//     borderRadius: 12,
//     display: "block",
//   },
//   relatedImageFallback: {
//     width: 74,
//     height: 104,
//     borderRadius: 12,
//     background: "#eef2ff",
//     color: "#6366f1",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     fontWeight: 700,
//     fontSize: 13,
//   },
//   relatedMeta: {
//     minWidth: 0,
//   },
//   relatedBookTitle: {
//     margin: 0,
//     fontSize: 15,
//     fontWeight: 800,
//     color: "#111827",
//     lineHeight: 1.4,
//   },
//   relatedBookAuthor: {
//     margin: "6px 0 0",
//     fontSize: 13,
//     color: "#6b7280",
//   },
//   relatedBookPrice: {
//     margin: "10px 0 0",
//     fontSize: 14,
//     color: "#4f46e5",
//     fontWeight: 700,
//   },
//   modalOverlay: {
//     position: "fixed",
//     inset: 0,
//     background: "rgba(17, 24, 39, 0.38)",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     padding: 20,
//     zIndex: 2000,
//   },
//   modalCard: {
//     width: "100%",
//     maxWidth: 560,
//     background: "#fff",
//     borderRadius: 22,
//     padding: 22,
//     boxShadow: "0 24px 60px rgba(15, 23, 42, 0.22)",
//   },
//   modalHeader: {
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "space-between",
//     gap: 12,
//     marginBottom: 18,
//   },
//   modalTitle: {
//     margin: 0,
//     fontSize: 22,
//     fontWeight: 800,
//     color: "#111827",
//   },
//   closeButton: {
//     border: "none",
//     background: "#f3f4f6",
//     width: 34,
//     height: 34,
//     borderRadius: 10,
//     cursor: "pointer",
//     color: "#6b7280",
//     fontSize: 16,
//     fontWeight: 700,
//   },
//   modalState: {
//     border: "1px dashed #d9ddf4",
//     borderRadius: 16,
//     padding: 20,
//     textAlign: "center",
//     color: "#6b7280",
//   },
//   optionList: {
//     display: "grid",
//     gap: 10,
//   },
//   optionCard: {
//     border: "1px solid #eceef8",
//     borderRadius: 16,
//     padding: "14px 16px",
//     background: "#fff",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "space-between",
//     gap: 16,
//     cursor: "pointer",
//     textAlign: "left",
//   },
//   optionCardActive: {
//     borderColor: "#818cf8",
//     background: "#eef2ff",
//   },
//   optionTitle: {
//     margin: 0,
//     fontSize: 15,
//     fontWeight: 800,
//     color: "#111827",
//   },
//   optionMeta: {
//     margin: "4px 0 0",
//     fontSize: 13,
//     color: "#6b7280",
//   },
//   optionSelect: {
//     color: "#4f46e5",
//     fontSize: 14,
//     fontWeight: 800,
//     whiteSpace: "nowrap",
//   },
//   modalFooter: {
//     display: "flex",
//     justifyContent: "flex-end",
//     gap: 10,
//     marginTop: 18,
//     flexWrap: "wrap",
//   },
//   statePanel: {
//     background: "#fff",
//     borderRadius: 24,
//     padding: 28,
//     minHeight: 260,
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//     justifyContent: "center",
//     gap: 16,
//     boxShadow: "0 8px 30px rgba(99, 102, 241, 0.08)",
//     border: "1px solid #eef0ff",
//   },
//   stateText: {
//     margin: 0,
//     fontSize: 16,
//     fontWeight: 700,
//   },
//   toast: {
//     position: "fixed",
//     top: 18,
//     right: 22,
//     color: "#fff",
//     padding: "12px 16px",
//     borderRadius: 14,
//     fontSize: 14,
//     fontWeight: 700,
//     zIndex: 2500,
//     boxShadow: "0 14px 30px rgba(15, 23, 42, 0.2)",
//   },
// };
