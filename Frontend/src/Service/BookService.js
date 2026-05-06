import api from "../Api/axios";


// GET all books for user
export const getAllBooks = (userId) =>
  api.get(`/api/Book/${userId}/get-all-books`);

export const getBooks = () =>
  api.get(`/api/Book/get-accepted-books`);


// CREATE book
export const createBook = (userId, formData) =>
  api.post(`/api/Book/${userId}/create-post`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",  // ← explicitly set this
    },
  });




// DELETE book
export const deleteBook = (userId, bookId) =>
  api.delete(`/api/Book/${userId}/delete-book/${bookId}`);

// UPDATE book
export const updateBook = (userId, bookId, formData) =>
  api.put(`/api/Book/${userId}/update-book/${bookId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",  // ← explicitly set this
    },
  });


// BROWSE (public books)



export const browseBooks = ({ title, genre, language, maxPrice } = {}) => {
  const params = {};
  if (title?.trim()) params.title = title.trim();
  if (genre?.trim()) params.genre = genre.trim();
  if (language?.trim()) params.language = language.trim();
  if (maxPrice !== undefined && maxPrice !== null && maxPrice !== "") {
    params.maxPrice = maxPrice;
  }
  return api.get("/api/Book/browse", { params });
};


// ================================
// PENDING / MODERATION APIS
// ================================

// GET pending posts
export const getPendingPosts = (userId) =>
  api.get(`/api/Book/${userId}/pending-posts`);

// ACCEPT post
export const acceptPost = (userId, bookId) =>
  api.post(`/api/Book/${userId}/accept-post/${bookId}`);

// REJECT post
export const rejectPost = (userId, bookId) =>
  api.post(`/api/Book/${userId}/reject-post/${bookId}`);
