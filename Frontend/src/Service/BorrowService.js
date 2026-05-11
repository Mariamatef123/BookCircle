
import apiClient from "../Api/api_client";
export const sendRequest = (readerId, bookId, chosenDuration) =>
  apiClient.post(`/api/BorrowRequest/${readerId}/send-request/${bookId}`, null, {
    params: { chosenDuration },
  });

export const acceptRequest = (ownerId, requestId) =>
  apiClient.post(`/api/BorrowRequest/${ownerId}/accept-request/${requestId}`);

export const rejectRequest = (ownerId, requestId) =>
  apiClient.post(`/api/BorrowRequest/${ownerId}/reject-request/${requestId}`);
export const getPendingRequests = (ownerId) =>
  apiClient.get(`/api/BorrowRequest/${ownerId}/get-pending-borrow-requests`);
export const getMyRequests = (userId) =>
  apiClient.get(`/api/BorrowRequest/myRequests`, { params: { userId } });

export const cancelRequest = (userId, requestId) =>
  apiClient.put(`/api/BorrowRequest/${requestId}/cancel`, null, { params: { userId } });


export const checkBorrowRequestExists = async (readerId, bookId) => {
  const res = apiClient.get(
    `/api/borrowRequest/borrow-request-exists`,
    {
      params: { readerId, bookId },
    }
  );

  return res;
};