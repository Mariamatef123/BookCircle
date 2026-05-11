

import apiClient from "../Api/api_client";
export const getBookComments = (bookId) =>
  apiClient.get(`/api/Comment/book-comments/${bookId}`);

export const addComment = (userId, bookId, content) =>
  apiClient.post(`/api/Comment/add`, JSON.stringify(content), {
    params: { userId, bookId },
    headers: { "Content-Type": "application/json" },
  });

export const replyToComment = (userId, parentId, content) =>
  apiClient.post(`/api/Comment/reply/${parentId}`, JSON.stringify(content), {
    params: { userId },
    headers: { "Content-Type": "application/json" },
  });

export const updateComment = (userId, commentId, content) =>
  apiClient.put(`/api/Comment/${commentId}`, null, {
    params: { userId, content },
  });

export const deleteComment = (userId, commentId) =>
  apiClient.delete(`/api/Comment/${commentId}`, {
    params: { userId },
  });
