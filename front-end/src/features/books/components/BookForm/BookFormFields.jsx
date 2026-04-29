import styles from "../../../../styles/bookFormStyles";

export default function BookFormFields({ form, setForm }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  return (
    <>
      {/* 2-column grid fields */}
      <div style={styles.grid}>
        <div style={styles.section}>
          <label style={styles.label}>Title</label>
          <input style={styles.input} name="Title" value={form.Title}
            onChange={handleChange} placeholder="Book title" />
        </div>

        <div style={styles.section}>
          <label style={styles.label}>Genre</label>
          <input style={styles.input} name="Genre" value={form.Genre}
            onChange={handleChange} placeholder="e.g. Fiction" />
        </div>

        <div style={styles.section}>
          <label style={styles.label}>ISBN</label>
          <input style={styles.input} name="ISBN" value={form.ISBN}
            onChange={handleChange} placeholder="978-3-16-148410-0" />
        </div>

        <div style={styles.section}>
          <label style={styles.label}>Language</label>
          <input style={styles.input} name="Language" value={form.Language}
            onChange={handleChange} placeholder="e.g. English" />
        </div>

        <div style={styles.section}>
          <label style={styles.label}>Borrow Price (L.E / day)</label>
          <input style={styles.input} name="BorrowPrice" type="number"
            min="0" step="0.01" value={form.BorrowPrice}
            onChange={handleChange} placeholder="0.00" />
        </div>

        <div style={styles.section}>
          <label style={styles.label}>Publication Date</label>
          <input style={styles.input} name="PublicationDate" type="date"
            value={form.PublicationDate} onChange={handleChange} />
        </div>
      </div>

      {/* Description — full width */}
      <div style={styles.section}>
        <label style={styles.label}>Description</label>
        <textarea
          style={styles.textarea}
          name="Description"
          value={form.Description}
          onChange={handleChange}
          placeholder="Write a short description..."
          rows={3}
        />
      </div>
    </>
  );
}