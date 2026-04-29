import styles from "../../../../styles/bookFormStyles";

export default function Durations({ form, setForm }) {
  const handleChange = (i, value) => {
    const updated = [...form.AvailabilityDates];
    updated[i] = { ...updated[i], duration: value };
    setForm((p) => ({ ...p, AvailabilityDates: updated }));
  };

  const add = () => {
    setForm((p) => ({
      ...p,
      AvailabilityDates: [...p.AvailabilityDates, { duration: "" }],
    }));
  };

  const remove = (i) => {
    setForm((p) => ({
      ...p,
      AvailabilityDates: p.AvailabilityDates.filter((_, idx) => idx !== i),
    }));
  };

  return (
    <div style={styles.section}>
      <label style={styles.label}>Availability Durations (days)</label>

      {form.AvailabilityDates.map((d, i) => (
        <div key={i} style={styles.row}>
          <input
            style={{ ...styles.input, margin: 0 }}
            type="number"
            min="1"
            value={d.duration}
            onChange={(e) => handleChange(i, e.target.value)}
            placeholder={`Duration ${i + 1} (days)`}
          />
          {form.AvailabilityDates.length > 1 && (
            <button style={styles.removeBtn} onClick={() => remove(i)}>✕</button>
          )}
        </div>
      ))}

      <button style={styles.addBtn} onClick={add}>+ Add Duration</button>
    </div>
  );
}