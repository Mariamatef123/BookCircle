import { styles } from "../../../styles/readingListStyles";
import { AlertTriangleIcon, SearchIcon, XIcon } from "../../../components/icons/AppIcons";

const filterOptions = [
  { value: "title",    label: "Title"     },
  { value: "genre",    label: "Genre"     },
  { value: "language", label: "Language"  },
  { value: "maxPrice", label: "Max Price" },
];

export default function AddBookModal({
  addBookModalOpen,
  filterType, setFilterType,
  filterValue, setFilterValue,
  searching, searchError, setSearchError,
  results,
  addBookToList,
  closeAddModal,
}) {
  if (!addBookModalOpen) return null;

  return (
    <div style={styles.overlay}>
      <div style={{ ...styles.modal, width: 580 }}>
        <h2 style={styles.modalTitle}>Add Book to List</h2>

        <div style={styles.searchRow}>
          <div style={styles.pillGroup}>
            {filterOptions.map((opt) => (
              <button
                key={opt.value}
                style={{ ...styles.pill, ...(filterType === opt.value ? styles.pillActive : {}) }}
                onClick={() => { setFilterType(opt.value); setFilterValue(""); setSearchError(""); }}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <div style={styles.searchInputWrapper}>
            <span style={styles.searchIcon}><SearchIcon size={14} /></span>
            <input
              style={styles.searchInput}
              type={filterType === "maxPrice" ? "number" : "text"}
              placeholder={
                filterType === "title"    ? "Search by title e.g. Book 1..."    :
                filterType === "genre"    ? "Search by genre e.g. Fiction..."   :
                filterType === "language" ? "Search by language e.g. Arabic..." :
                                           "Enter max price e.g. 50"
              }
              value={filterValue}
              min={filterType === "maxPrice" ? 0 : undefined}
              onChange={(e) => setFilterValue(e.target.value)}
              autoFocus
            />
            {filterValue && (
              <button style={styles.clearBtn} onClick={() => setFilterValue("")}>
                <XIcon size={14} />
              </button>
            )}
          </div>
        </div>

  
        {filterValue && (
          <div style={styles.activeBadge}>
            Filtering by <strong style={{ marginLeft: 4 }}>
              {filterOptions.find(o => o.value === filterType)?.label}
            </strong>: {filterValue}
          </div>
        )}


        <div style={{ maxHeight: 300, overflowY: "auto", marginTop: 8 }}>
          {searching ? (
            <p style={{ fontSize: 12, color: "#6B7280", margin: "8px 0" }}>Searching...</p>
          ) : searchError ? (
            <div style={{ ...styles.errorBox, display: "flex", alignItems: "center", gap: 6 }}>
              <AlertTriangleIcon size={14} /> {searchError}
            </div>
          ) : results.length === 0 ? (
            <div style={styles.emptyState}>
              <p style={{ margin: 0, fontSize: 14, color: "#9CA3AF" }}>
                {filterValue ? "No books match your search." : "No books available."}
              </p>
            </div>
          ) : (
            results.map((book) => (
              <div key={book.id} style={styles.bookRow}>
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  {book.coverImageBase64 && (
                    <img
                      src={`data:image/jpeg;base64,${book.coverImageBase64}`}
                      alt={book.title}
                      style={{ width: 40, height: 52, borderRadius: 4, objectFit: "cover", flexShrink: 0 }}
                    />
                  )}
                  <div>
                    <p style={styles.title}>{book.title}</p>
                    <p style={styles.meta}>{book.genre} • {book.language} • {book.borrowPrice} L.E</p>
                  </div>
                </div>
                <button style={styles.btnPrimary} onClick={() => addBookToList(book.id)}>
                  Add
                </button>
              </div>
            ))
          )}
        </div>

        <div style={styles.modalActions}>
          <button style={styles.btnView} onClick={closeAddModal}>Close</button>
        </div>
      </div>
    </div>
  );
}
