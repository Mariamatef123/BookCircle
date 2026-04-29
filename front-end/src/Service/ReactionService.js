import api from "../Api/axios";

export const likeBook = (userId, bookId) =>
  api.post(`/api/Reaction/${userId}/like/${bookId}`);

export const dislikeBook = (userId, bookId) =>
  api.post(`/api/Reaction/${userId}/dislike/${bookId}`);

export const getBookReactions = (bookId) =>
  api.get(`/api/Reaction/book/${bookId}`);
