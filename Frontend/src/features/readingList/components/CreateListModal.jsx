import { styles } from "../../../styles/readingListStyles";

export default function CreateListModal({
  createModalOpen, setCreateModalOpen,
  newListName, setNewListName,
  newListDesc, setNewListDesc,
  createNewList,
}) {
  if (!createModalOpen) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h2 style={styles.modalTitle}>Create New List</h2>

        <label style={styles.label}>List Name</label>
        <input
          style={styles.input}
          value={newListName}
          onChange={(e) => setNewListName(e.target.value)}
          placeholder="e.g. Summer Reads"
        />

        <label style={styles.label}>
          Description <span style={{ color: "#9CA3AF" }}>(optional)</span>
        </label>
        <input
          style={styles.input}
          value={newListDesc}
          onChange={(e) => setNewListDesc(e.target.value)}
          placeholder="A short description..."
        />

        <div style={styles.modalActions}>
          <button style={styles.btnView} onClick={() => setCreateModalOpen(false)}>Cancel</button>
          <button style={styles.btnPrimary} onClick={createNewList}>Create</button>
        </div>
      </div>
    </div>
  );
}