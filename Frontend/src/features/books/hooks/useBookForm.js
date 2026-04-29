import { useState, useEffect } from "react";

export default function useBookForm(editingBook, userId, isOpen) {
  const emptyForm = {
    Title: "",
    Genre: "",
    ISBN: "",
    Language: "",
    BorrowPrice: "",
    PublicationDate: "",
    Description: "",
    ownerId: userId || "",
    AvailabilityDates: [{ duration: "" }],
    CoverImage: null,
  };

  const [form, setForm] = useState(emptyForm);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (!isOpen) return;

    if (editingBook) {
      setForm({
        Title: editingBook.title || "",
        Genre: editingBook.genre || "",
        ISBN: editingBook.isbn || "",
        Language: editingBook.language || "",
        BorrowPrice: editingBook.borrowPrice || "",
        PublicationDate: editingBook.publicationDate?.slice(0, 10) || "",
        Description: editingBook.description || "",
        ownerId: userId || "",
        AvailabilityDates: editingBook.availabilityDates?.length
          ? editingBook.availabilityDates
          : [{ duration: "" }],
        CoverImage: null,
      });

      if (editingBook.coverImageBase64) {
        setPreview(`data:image/jpeg;base64,${editingBook.coverImageBase64}`);
      }
    } else {
      setForm({ ...emptyForm, ownerId: userId || "" });
      setPreview(null);
    }
  }, [editingBook, isOpen, userId]);

  return { form, setForm, preview, setPreview };
}