import api from "../Api/axios";

export const getNotifications = (userId) =>
  api.get(`/api/Notification/${userId}`);

export const markAsRead = (notificationId,userId) =>
  api.patch(`/api/Notification/${notificationId}/read/${userId}`);
