import api from "../Api/axios";

import apiClient from "../Api/api_client";
// GET all books for user
export const getAllBooks = (userId) =>
  apiClient.get(`/api/Book/${userId}/get-all-books`);

export const getBooks = () =>
  api.get(`/api/Book/get-accepted-books`);


// CREATE book
export const createBook = (userId, formData) =>
  apiClient.post(`/api/Book/${userId}/create-post`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",  
    },
  });


export const getBooksPaged = (
  pageNumber = 1,
  pageSize = 10,
  availableOnly = false
) =>
  api.get(`/api/Book/pagination`, {
    params: { pageNumber, pageSize, availableOnly },
  });

export const deleteBook = (userId, bookId) =>
  apiClient.delete(`/api/Book/${userId}/delete-book/${bookId}`);

export const updateBook = (userId, bookId, formData) =>
  apiClient.put(`/api/Book/${userId}/update-book/${bookId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",  
    },
  });






export const browseBooks = (
  { title, genre, language, maxPrice } = {},
  pageNumber = 1,
  pageSize = 10,
  availableOnly = true
) => {
  const params = {
    pageNumber,
    pageSize,
    availableOnly,
  };

  if (title?.trim()) params.title = title.trim();
  if (genre?.trim()) params.genre = genre.trim();
  if (language?.trim()) params.language = language.trim();

  if (maxPrice !== undefined && maxPrice !== null && maxPrice !== "") {
    params.maxPrice = maxPrice;
  }

  return api.get("/api/Book/browse", { params });
};


export const getPendingPosts = (userId) =>
  apiClient.get(`/api/Book/${userId}/pending-posts`);


export const acceptPost = (userId, bookId) =>
  apiClient.post(`/api/Book/${userId}/accept-post/${bookId}`);


export const rejectPost = (userId, bookId) =>
  apiClient.post(`/api/Book/${userId}/reject-post/${bookId}`);
