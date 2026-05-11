
import apiClient from "../Api/api_client";
export const getNotifications = (userId) =>
  apiClient.get(`/api/Notification/${userId}`);

export const markAsRead = (notificationId,userId) =>
  apiClient.patch(`/api/Notification/${notificationId}/read/${userId}`);
