import api from "../Api/Axios";

import apiClient from "../Api/api_client";

export const createList = (userId, data) =>
  apiClient.post(`/api/ReadingList/create-readinglist/${userId}`, data);


export const addBook = (listId, bookId) =>
  apiClient.post(`/api/ReadingList/add-books/${listId}/${bookId}`);

export const removeBook = (listId, bookId) =>
  apiClient.delete(`/api/ReadingList/remove-book`, {
    params: { readingListId: listId, bookId: bookId }
  });


export const deleteList = (listId) =>
  apiClient.delete(`/api/ReadingList/remove-list`, {
    params: { readingListId: listId }
  });


export const getUserLists = (userId) =>
  apiClient.get(`/api/ReadingList/user/${userId}`);


export const getListBooks = (listId) =>
  apiClient.get(`/api/ReadingList/${listId}/books`);
