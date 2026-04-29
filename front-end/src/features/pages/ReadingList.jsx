// import { useEffect, useState, useCallback } from "react";
// import {
//   getUserLists, createList, deleteList,
//   getListBooks, addBook, removeBook,
// } from "../../Service/ReadingListService";
// import { browseBooks } from "../../Service/BookService";

// export default function ReadingList() {
//   const user = JSON.parse(localStorage.getItem("user"));
//   const userId = user?.id;

//   const [lists, setLists] = useState([]);
//   const [activeTab, setActiveTab] = useState("lists");
//   const [selectedListId, setSelectedListId] = useState(null);
//   const [books, setBooks] = useState([]);
//   const [createModalOpen, setCreateModalOpen] = useState(false);
//   const [addBookModalOpen, setAddBookModalOpen] = useState(false);
//   const [newListName, setNewListName] = useState("");
//   const [newListDesc, setNewListDesc] = useState("");
//   const [results, setResults] = useState([]);
//   const [searching, setSearching] = useState(false);
//   const [searchError, setSearchError] = useState("");        // ✅ was missing
//   const [filterType, setFilterType] = useState("title");
//   const [filterValue, setFilterValue] = useState("");

//   // ─── Data loaders ────────────────────────────────────────────
//   const loadLists = async () => {
//     try {
//       const res = await getUserLists(userId);
//       setLists(res?.data ?? []);
//     } catch {
//       console.error("Failed to load lists");
//     }
//   };

//   const loadBooks = async (listId) => {
//     try {
//       const res = await getListBooks(listId);
//       setBooks(res?.data ?? []);
//     } catch {
//       console.error("Failed to load books");
//     }
//   };

//   useEffect(() => { if (userId) loadLists(); }, [userId]);

//   useEffect(() => {
//     if (activeTab === "books" && selectedListId) loadBooks(selectedListId);
//   }, [activeTab, selectedListId]);

//   // ─── Search ──────────────────────────────────────────────────
//   // ✅ Signature fixed: (type, value) to match how it's called below
// const handleSearch = useCallback(async (type, value) => {
//   setSearching(true);
//   setSearchError("");

//   try {
//     const res = await browseBooks({
//       title: type === "title" ? value : undefined,
//       genre: type === "genre" ? value : undefined,
//       language: type === "language" ? value : undefined,
//       maxPrice: type === "maxPrice" ? value : undefined,
//     });

//     // ✅ FIX: supports both res.data OR direct array response
//     const data = res?.data ?? res;

//     setResults(Array.isArray(data) ? data : []);
//   } catch (err) {
//     setResults([]);
//     setSearchError(err?.message || "Search failed");
//   } finally {
//     setSearching(false);
//   }
// }, []);
//   // Debounce: fires 400ms after user stops typing
//   useEffect(() => {
//     if (!addBookModalOpen) return;
//     const timer = setTimeout(() => {
//       handleSearch(filterType, filterValue);
//     }, 400);
//     return () => clearTimeout(timer);
//   }, [filterValue, filterType, addBookModalOpen, handleSearch]);

//   // Load all books immediately when modal opens
//   useEffect(() => {
//     if (addBookModalOpen) handleSearch(filterType, filterValue);
//   }, [addBookModalOpen]); // eslint-disable-line

//   // ─── Handlers ────────────────────────────────────────────────
//   const handleCreateList = async () => {
//     try {
//       await createList(userId, { name: newListName, description: newListDesc });
//       setCreateModalOpen(false);
//       setNewListName("");
//       setNewListDesc("");
//       await loadLists();
//     } catch {
//       console.error("Failed to create list");
//     }
//   };

//   const handleDeleteList = async (listId) => {
//     try {
//       await deleteList(listId);
//       await loadLists();
//     } catch {
//       console.error("Failed to delete list");
//     }
//   };

//   const handleAddBook = async (bookId) => {
//     try {
//       await addBook(selectedListId, bookId);
//       setAddBookModalOpen(false);
//       setResults([]);
//       await loadBooks(selectedListId);
//     } catch (err) {
//       alert(err?.response?.data?.message || "Failed to add book.");
//     }
//   };

//   const handleRemoveBook = async (bookId) => {
//     try {
//       await removeBook(selectedListId, bookId);
//       await loadBooks(selectedListId);
//     } catch {
//       console.error("Failed to remove book");
//     }
//   };

//   const viewBooks = (listId) => {
//     setSelectedListId(listId);
//     setActiveTab("books");
//   };

//   const closeAddModal = () => {
//     setAddBookModalOpen(false);
//     setResults([]);
//     setFilterValue("");
//     setFilterType("title");
//     setSearchError("");
//   };

//   const filterOptions = [
//         { value: "title",    label: "Title"     },
//     { value: "genre",    label: "Genre"     },
//     { value: "language", label: "Language"  },
//     { value: "maxPrice", label: "Max Price" },
//   ];

//   // ─── Render ──────────────────────────────────────────────────
//   return (
//     <div style={styles.wrapper}>

//       {/* Header */}
//       <div style={styles.header}>
//         <div>
//           <h1 style={styles.h1}>Reading Lists</h1>
//           <p style={styles.sub}>Manage your curated book collections</p>
//         </div>
//         {activeTab === "lists" && (
//           <button style={styles.btnPrimary} onClick={() => setCreateModalOpen(true)}>+ New List</button>
//         )}
//         {activeTab === "books" && (
//           <button style={styles.btnPrimary} onClick={() => setAddBookModalOpen(true)}>+ Add Book</button>
//         )}
//       </div>

//       {/* Tabs */}
//       <div style={styles.tabBar}>
//         {["lists", "books"].map((tab) => (
//           <button
//             key={tab}
//             style={{ ...styles.tab, ...(activeTab === tab ? styles.tabActive : {}) }}
//             onClick={() => setActiveTab(tab)}
//           >
//             {tab === "lists" ? "My Lists" : "Books in List"}
//           </button>
//         ))}
//       </div>

//       {/* LISTS TABLE */}
//       {activeTab === "lists" && (
//         <div style={styles.card}>
//           <table style={styles.table}>
//             <thead>
//               <tr>
//                 <th style={styles.th}>List Name</th>
//                 <th style={styles.th}>Books</th>
//                 <th style={styles.th}>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {lists.length === 0 ? (
//                 <tr><td colSpan={3} style={styles.empty}>No lists found</td></tr>
//               ) : lists.map((list) => (
//                 <tr key={list.id} style={styles.row}>
//                   <td style={styles.td}>
//                     <p style={styles.title}>{list.name}</p>
//                     <p style={styles.meta}>{list.description}</p>
//                   </td>
//                   <td style={styles.td}>{list.bookCount ?? "—"} books</td>
//                   <td style={styles.td}>
//                     <div style={styles.actions}>
//                       <button style={styles.btnView} onClick={() => viewBooks(list.id)}>View Books</button>
//                       <button style={styles.btnDelete} onClick={() => handleDeleteList(list.id)}>Delete</button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}

//       {/* BOOKS TABLE */}
//       {activeTab === "books" && (
//         <div style={styles.card}>
//           <div style={{ marginBottom: 12 }}>
//             <label style={{ fontSize: 12, color: "#6B7280", marginRight: 8 }}>Select list:</label>
//             <select
//               value={selectedListId || ""}
//               onChange={(e) => setSelectedListId(Number(e.target.value))}
//               style={styles.select}
//             >
//               {lists.map((l) => (
//                 <option key={l.id} value={l.id}>{l.name}</option>
//               ))}
//             </select>
//           </div>
//           <table style={styles.table}>
//             <thead>
//               <tr>
//                 <th style={styles.th}>Cover</th>
//                 <th style={styles.th}>Details</th>
//                 <th style={styles.th}>Description</th>
//                 <th style={styles.th}>Price</th>
//                 <th style={styles.th}>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {books.length === 0 ? (
//                 <tr><td colSpan={5} style={styles.empty}>No books in this list</td></tr>
//               ) : books.map((book) => (
//                 <tr key={book.id} style={styles.row}>
//                   <td style={styles.td}>
//                     <img
//                       src={`data:image/jpeg;base64,${book.coverImageBase64}`}
//                       alt={book.title}
//                       style={styles.img}
//                     />
//                   </td>
//                   <td style={styles.td}>
//                     <p style={styles.title}>{book.title}</p>
//                     <p style={styles.meta}>{book.genre} • {book.language}</p>
//                   </td>
//                   <td style={styles.td}>{book.description}</td>
//                   <td style={styles.td}>
//                     <span style={styles.price}>{book.borrowPrice} L.E</span>
//                   </td>
//                   <td style={styles.td}>
//                     <button style={styles.btnDelete} onClick={() => handleRemoveBook(book.id)}>Remove</button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}

//       {/* CREATE LIST MODAL */}
//       {createModalOpen && (
//         <div style={styles.overlay}>
//           <div style={styles.modal}>
//             <h2 style={styles.modalTitle}>Create New List</h2>
//             <label style={styles.label}>List Name</label>
//             <input
//               style={styles.input}
//               value={newListName}
//               onChange={(e) => setNewListName(e.target.value)}
//               placeholder="e.g. Summer Reads"
//             />
//             <label style={styles.label}>
//               Description <span style={{ color: "#9CA3AF" }}>(optional)</span>
//             </label>
//             <input
//               style={styles.input}
//               value={newListDesc}
//               onChange={(e) => setNewListDesc(e.target.value)}
//               placeholder="A short description..."
//             />
//             <div style={styles.modalActions}>
//               <button style={styles.btnView} onClick={() => setCreateModalOpen(false)}>Cancel</button>
//               <button style={styles.btnPrimary} onClick={handleCreateList}>Create</button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ADD BOOK MODAL */}
//       {addBookModalOpen && (
//         <div style={styles.overlay}>
//           <div style={{ ...styles.modal, width: 580 }}>
//             <h2 style={styles.modalTitle}>Add Book to List</h2>

//             {/* Filter pills + search input */}
//             <div style={styles.searchRow}>
//               <div style={styles.pillGroup}>
//                 {filterOptions.map((opt) => (
//                   <button
//                     key={opt.value}
//                     style={{ ...styles.pill, ...(filterType === opt.value ? styles.pillActive : {}) }}
//                     onClick={() => { setFilterType(opt.value); setFilterValue(""); setSearchError(""); }}
//                   >
//                     {opt.label}
//                   </button>
//                 ))}
//               </div>

//               <div style={styles.searchInputWrapper}>
//                 <span style={styles.searchIcon}>🔍</span>
//                 <input
//                   style={styles.searchInput}
//                   type={filterType === "maxPrice" ? "number" : "text"}
//                   placeholder={
//                        filterType === "title"    ? "Search by title e.g. Book 1..."  :
//                     filterType === "genre"    ? "Search by genre e.g. Fiction..."  :
//                     filterType === "language" ? "Search by language e.g. Arabic..." :
//                                                "Enter max price e.g. 50"
//                   }
//                   value={filterValue}
//                   min={filterType === "maxPrice" ? 0 : undefined}
//                   onChange={(e) => setFilterValue(e.target.value)}
//                   autoFocus
//                 />
//                 {filterValue && (
//                   <button style={styles.clearBtn} onClick={() => setFilterValue("")}>✕</button>
//                 )}
//               </div>
//             </div>

//             {/* Active filter badge */}
//             {filterValue && (
//               <div style={styles.activeBadge}>
//                 Filtering by <strong style={{ marginLeft: 4 }}>
//                   {filterOptions.find(o => o.value === filterType)?.label}
//                 </strong>: {filterValue}
//               </div>
//             )}

//             {/* ✅ Error box */}
//             {searchError && (
//               <div style={styles.errorBox}>⚠️ {searchError}</div>
//             )}

//             {/* Searching indicator */}
//             {searching && (
//               <p style={{ fontSize: 12, color: "#6B7280", margin: "8px 0" }}>Searching...</p>
//             )}

//             {/* Results */}
//   {/* Results */}
// <div style={{ maxHeight: 300, overflowY: "auto", marginTop: 8 }}>

//   {searching ? (
//     <p style={{ fontSize: 12, color: "#6B7280" }}>Searching...</p>

//   ) : searchError ? (
//     <div style={styles.errorBox}>⚠️ {searchError}</div>

//   ) : results?.length === 0 ? (
//     <div style={styles.emptyState}>
//       <p style={{ margin: 0, fontSize: 14, color: "#9CA3AF" }}>
//         {filterValue ? "No books match your search." : "No books available."}
//       </p>
//     </div>

//   ) : (
//     results.map((book) => (
//       <div key={book.id} style={styles.bookRow}>
//         <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
//           {book.coverImageBase64 && (
//             <img
//               src={`data:image/jpeg;base64,${book.coverImageBase64}`}
//               alt={book.title}
//               style={{ width: 40, height: 52, borderRadius: 4, objectFit: "cover", flexShrink: 0 }}
//             />
//           )}
//           <div>
//             <p style={styles.title}>{book.title}</p>
//             <p style={styles.meta}>
//               {book.genre} • {book.language} • {book.borrowPrice} L.E
//             </p>
//           </div>
//         </div>

//         <button
//           style={styles.btnPrimary}
//           onClick={() => handleAddBook(book.id)}
//         >
//           Add
//         </button>
//       </div>
//     ))
//   )}

// </div>
//             <div style={styles.modalActions}>
//               <button style={styles.btnView} onClick={closeAddModal}>Close</button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// const styles = {
//   wrapper: { padding: 32, background: "#F9FAFB", minHeight: "100vh", fontFamily: "Inter, sans-serif" },
//   header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
//   h1: { fontSize: 22, fontWeight: 600, color: "#111827", margin: 0 },
//   sub: { fontSize: 13, color: "#6B7280", marginTop: 2 },
//   tabBar: { display: "flex", gap: 4, marginBottom: 20, background: "#fff", borderRadius: 10, padding: 4, width: "fit-content", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" },
//   tab: { padding: "7px 18px", borderRadius: 8, border: "none", background: "transparent", fontSize: 13, fontWeight: 500, color: "#6B7280", cursor: "pointer" },
//   tabActive: { background: "#4F46E5", color: "#fff" },
//   card: { background: "#fff", borderRadius: 16, padding: 16, boxShadow: "0 1px 3px rgba(0,0,0,0.08)", overflowX: "auto" },
//   table: { width: "100%", borderCollapse: "collapse" },
//   th: { textAlign: "left", fontSize: 13, fontWeight: 600, color: "#6B7280", padding: "8px 12px", borderBottom: "1px solid #eee" },
//   td: { padding: 12, verticalAlign: "middle", fontSize: 14, color: "#111827", wordBreak: "break-word" },
//   row: { borderBottom: "1px solid #f5f5f5" },
//   title: { margin: 0, fontWeight: 600, fontSize: 14 },
//   meta: { margin: "3px 0 0", fontSize: 12, color: "#6B7280" },
//   price: { fontWeight: 600, color: "#4F46E5", fontSize: 14 },
//   img: { width: 80, height: 56, borderRadius: 8, objectFit: "cover" },
//   empty: { textAlign: "center", padding: 20, color: "#9CA3AF" },
//   actions: { display: "flex", gap: 8, flexWrap: "wrap" },
//   btnPrimary: { background: "#4F46E5", color: "#fff", border: "none", borderRadius: 8, padding: "8px 16px", fontSize: 13, fontWeight: 500, cursor: "pointer", whiteSpace: "nowrap" },
//   btnView: { background: "#F3F4F6", color: "#374151", border: "none", borderRadius: 6, padding: "5px 10px", cursor: "pointer", fontSize: 13 },
//   btnDelete: { background: "#FFEDD5", color: "#C2410C", border: "none", borderRadius: 6, padding: "5px 10px", cursor: "pointer", fontSize: 13 },
//   select: { border: "1px solid #E5E7EB", borderRadius: 6, padding: "5px 10px", fontSize: 13, color: "#111827" },
//   overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200 },
//   modal: { background: "#fff", borderRadius: 16, padding: 24, width: 380, maxWidth: "95%" },
//   modalTitle: { fontSize: 16, fontWeight: 600, marginBottom: 16 },
//   label: { fontSize: 13, color: "#6B7280", display: "block", marginBottom: 4 },
//   input: { width: "100%", border: "1px solid #E5E7EB", borderRadius: 8, padding: "8px 12px", fontSize: 14, marginBottom: 14, outline: "none", boxSizing: "border-box" },
//   modalActions: { display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 12 },
//   bookRow: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #eee" },
//   searchRow: { display: "flex", flexDirection: "column", gap: 10, marginBottom: 10 },
//   pillGroup: { display: "flex", gap: 6 },
//   pill: { padding: "5px 14px", borderRadius: 20, border: "1.5px solid #E5E7EB", background: "#F9FAFB", fontSize: 12, fontWeight: 500, color: "#6B7280", cursor: "pointer" },
//   pillActive: { background: "#EEF2FF", borderColor: "#4F46E5", color: "#4F46E5" },
//   searchInputWrapper: { display: "flex", alignItems: "center", border: "1.5px solid #E5E7EB", borderRadius: 10, padding: "8px 12px", gap: 8, background: "#fff" },
//   searchIcon: { fontSize: 14 },
//   searchInput: { flex: 1, border: "none", outline: "none", fontSize: 14, color: "#111827", background: "transparent" },
//   clearBtn: { background: "none", border: "none", color: "#9CA3AF", cursor: "pointer", fontSize: 14, padding: 0 },
//   activeBadge: { background: "#EEF2FF", color: "#4F46E5", borderRadius: 8, padding: "5px 10px", fontSize: 12, marginBottom: 8, display: "flex", alignItems: "center", gap: 2 },
//   emptyState: { textAlign: "center", padding: "24px 0" },
//   errorBox: { background: "#FEF2F2", color: "#DC2626", borderRadius: 8, padding: "8px 12px", fontSize: 13, marginBottom: 8 }, // ✅ was missing
// };