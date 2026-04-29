import api from "../Api/axios";

export const getBookComments = (bookId) =>
  api.get(`/api/Comment/book-comments/${bookId}`);

export const addComment = (userId, bookId, content) =>
  api.post(`/api/Comment/add`, JSON.stringify(content), {
    params: { userId, bookId },
    headers: { "Content-Type": "application/json" },
  });

export const replyToComment = (userId, parentId, content) =>
  api.post(`/api/Comment/reply/${parentId}`, JSON.stringify(content), {
    params: { userId },
    headers: { "Content-Type": "application/json" },
  });

export const updateComment = (userId, commentId, content) =>
  api.put(`/api/Comment/${commentId}`, null, {
    params: { userId, content },
  });

export const deleteComment = (userId, commentId) =>
  api.delete(`/api/Comment/${commentId}`, {
    params: { userId },
  });
