import api from "../Api/axios";

import apiClient from "../Api/api_client";
export const likeBook = (userId, bookId) =>
  apiClient.post(`/api/Reaction/${userId}/like/${bookId}`);

export const dislikeBook = (userId, bookId) =>
  apiClient.post(`/api/Reaction/${userId}/dislike/${bookId}`);

export const getBookReactions = (bookId) =>
  api.get(`/api/Reaction/book/${bookId}`);
