import api from "../Api/axios";

export const sendRequest = (readerId, bookId, chosenDuration) =>
  api.post(`/api/BorrowRequest/${readerId}/send-request/${bookId}`, null, {
    params: { chosenDuration },
  });

export const acceptRequest = (ownerId, requestId) =>
  api.post(`/api/BorrowRequest/${ownerId}/accept-request/${requestId}`);

export const rejectRequest = (ownerId, requestId) =>
  api.post(`/api/BorrowRequest/${ownerId}/reject-request/${requestId}`);
export const getPendingRequests = (ownerId) =>
  api.get(`/api/BorrowRequest/${ownerId}/get-pending-borrow-requests`);
export const getMyRequests = (userId) =>
  api.get(`/api/BorrowRequest/myRequests`, { params: { userId } });

export const cancelRequest = (userId, requestId) =>
  api.put(`/api/BorrowRequest/${requestId}/cancel`, null, { params: { userId } });