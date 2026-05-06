import { useEffect, useState } from "react";
import styles from "../../../../styles/bookFormStyles";
import ImageUpload from "./ImageUpload";
import BookFormFields from "./BookFormFields";
import Durations from "./Durations";
import { XIcon } from "../../../../components/icons/AppIcons";

export default function BookForm({ isOpen, onClose, onSubmit, editingBook, userId }) {
  const isEdit = !!editingBook;

  const emptyForm = {
    Title: "", Genre: "", ISBN: "", Language: "",
    BorrowPrice: "", PublicationDate: "", Description: "",
    ownerId: userId || "",
    AvailabilityDates: [{ duration: "" }],
    CoverImage: null,
  };

  const [form, setForm] = useState(emptyForm);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    if (editingBook) {
      setForm({
        Title:           editingBook.title           || "",
        Genre:           editingBook.genre           || "",
        ISBN:            editingBook.isbn            || "",
        Language:        editingBook.language        || "",
        BorrowPrice:     editingBook.borrowPrice     || "",
        PublicationDate: editingBook.publicationDate
          ? editingBook.publicationDate.slice(0, 10) : "",
        Description:     editingBook.description    || "",
        ownerId:         userId                     || "",
        AvailabilityDates: editingBook.availabilityDates?.length
          ? editingBook.availabilityDates
          : [{ duration: "" }],
        CoverImage: null,
      });
      setPreview(
        editingBook.coverImageBase64
          ? `data:image/jpeg;base64,${editingBook.coverImageBase64}`
          : null
      );
    } else {
      setForm({ ...emptyForm, ownerId: userId || "" });
      setPreview(null);
    }
  }, [editingBook, isOpen, userId]);

  if (!isOpen) return null;

  const buildFormData = () => {
    const fd = new FormData();
    fd.append("Title",       form.Title);
    fd.append("Genre",       form.Genre);
    fd.append("ISBN",        form.ISBN);
    fd.append("Language",    form.Language);
    fd.append("BorrowPrice", form.BorrowPrice);
    fd.append("PublicationDate",
      form.PublicationDate ? new Date(form.PublicationDate).toISOString() : ""
    );
    fd.append("Description", form.Description);
    fd.append("ownerId",     form.ownerId);
    form.AvailabilityDates.forEach((d, i) => {
      fd.append(`AvailabilityDates[${i}][duration]`, d.duration);
    });
    if (form.CoverImage) fd.append("CoverImage", form.CoverImage);
    return fd;
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const fd = buildFormData();
      await onSubmit(fd, isEdit ? editingBook.id : null);
      onClose();
    } catch (err) {
      console.error("BookForm submit error:", err);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>

  
        <div style={styles.header}>
          <h3 style={styles.title}>{isEdit ? "Edit Book" : "Add New Book"}</h3>
          <button style={styles.closeBtn} onClick={onClose}>
            <XIcon size={16} />
          </button>
        </div>

        <div style={styles.body}>
          <ImageUpload
            preview={preview}
            setPreview={setPreview}
            setForm={setForm}
          />

          <BookFormFields
            form={form}
            setForm={setForm}
          />

          <Durations
            form={form}
            setForm={setForm}
          />
        </div>

    
        <div style={styles.footer}>
          <button style={styles.cancelBtn} onClick={onClose}>Cancel</button>
          <button
            style={loading ? styles.submitBtnDisabled : styles.submitBtn}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Saving..." : isEdit ? "Save Changes" : "Create Book"}
          </button>
        </div>

      </div>
    </div>
  );
}
