import api from "../Api/Axios";

import apiClient from "../Api/api_client";
// CREATE LIST (needs body!)
export const createList = (userId, data) =>
  apiClient.post(`/api/ReadingList/create-readinglist/${userId}`, data);

// ADD BOOK TO LIST
export const addBook = (listId, bookId) =>
  apiClient.post(`/api/ReadingList/add-books/${listId}/${bookId}`);

// REMOVE BOOK FROM LIST (query params)
export const removeBook = (listId, bookId) =>
  apiClient.delete(`/api/ReadingList/remove-book`, {
    params: { readingListId: listId, bookId: bookId }
  });

// DELETE LIST
export const deleteList = (listId) =>
  apiClient.delete(`/api/ReadingList/remove-list`, {
    params: { readingListId: listId }
  });

// GET USER LISTS
export const getUserLists = (userId) =>
  apiClient.get(`/api/ReadingList/user/${userId}`);

// GET BOOKS IN A LIST
export const getListBooks = (listId) =>
  apiClient.get(`/api/ReadingList/${listId}/books`);
