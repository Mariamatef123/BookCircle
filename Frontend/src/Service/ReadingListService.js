import api from "../Api/Axios";

// CREATE LIST (needs body!)
export const createList = (userId, data) =>
  api.post(`/api/ReadingList/create-readinglist/${userId}`, data);

// ADD BOOK TO LIST
export const addBook = (listId, bookId) =>
  api.post(`/api/ReadingList/add-books/${listId}/${bookId}`);

// REMOVE BOOK FROM LIST (query params)
export const removeBook = (listId, bookId) =>
  api.delete(`/api/ReadingList/remove-book`, {
    params: { readingListId: listId, bookId: bookId }
  });

// DELETE LIST
export const deleteList = (listId) =>
  api.delete(`/api/ReadingList/remove-list`, {
    params: { readingListId: listId }
  });

// GET USER LISTS
export const getUserLists = (userId) =>
  api.get(`/api/ReadingList/user/${userId}`);

// GET BOOKS IN A LIST
export const getListBooks = (listId) =>
  api.get(`/api/ReadingList/${listId}/books`);
