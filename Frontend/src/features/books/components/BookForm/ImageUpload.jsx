import { useRef } from "react";
import styles from "../../../../styles/bookFormStyles";

export default function ImageUpload({ preview, setPreview, setForm }) {
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setForm((prev) => ({ ...prev, CoverImage: file }));
    setPreview(URL.createObjectURL(file));
  };

  return (
    <div style={styles.uploadBox}>
   
      {preview ? (
        <img src={preview} alt="cover" style={styles.image} />
      ) : (
        <div style={styles.placeholder}>No Cover</div>
      )}

 
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <label style={styles.uploadBtn}>
          {preview ? "Change Cover" : "Upload Cover"}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleImageChange}
          />
        </label>

        {preview && (
          <button
            style={styles.removeImgBtn}
            onClick={() => {
              setPreview(null);
              setForm((p) => ({ ...p, CoverImage: null }));
              if (fileInputRef.current) fileInputRef.current.value = "";
            }}
          >
            Remove
          </button>
        )}
      </div>
    </div>
  );
}