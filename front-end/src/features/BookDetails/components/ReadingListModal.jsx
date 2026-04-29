import { useNavigate } from "react-router-dom";
import styles from "../styles/bookDetailsStyles";

export default function ReadingListModal({ open, onClose, lists, listsLoading, addingToList, onAdd }) {
  const navigate = useNavigate();
  if (!open) return null;
  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={styles.modalCard} onClick={(e) => e.stopPropagation()}>
        <div style={styles.modalHeader}>
          <h2 style={styles.modalTitle}>Add to Reading List</h2>
          <button type="button" style={styles.closeButton} onClick={onClose}>x</button>
        </div>
        {listsLoading ? (
          <div style={styles.modalState}>Loading your lists...</div>
        ) : lists.length === 0 ? (
          <div style={styles.modalState}>
            <p style={{ marginTop: 0 }}>You do not have a reading list yet.</p>
            <button type="button" style={styles.primaryButton} onClick={() => navigate("/readingList")}>
              Create Reading List
            </button>
          </div>
        ) : (
          <div style={styles.optionList}>
            {lists.map((list) => (
              <button
                key={list.id} type="button"
                style={styles.optionCard}
                onClick={() => onAdd(list.id)}
                disabled={addingToList}
              >
                <div>
                  <p style={styles.optionTitle}>{list.name}</p>
                  <p style={styles.optionMeta}>{list.description || "No description"}</p>
                </div>
                <span style={styles.optionSelect}>{addingToList ? "Saving..." : "Add"}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}