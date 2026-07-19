
import api from "../Api/axios";


import apiClient from "../Api/api_client";
export const Login = (user) =>
  api.post("/api/Auth/login", user);
export const Register = (user) =>
  api.post("/api/Auth/register", user);


export const getRoles = () => api.get("/api/Auth/roles");
export const getPendingOwners = (adminId) =>
  apiClient.get(`/api/User/${adminId}/pending-owners`);

export const acceptOwner = (adminId, ownerId) =>
  apiClient.post(`/api/User/${adminId}/accept-owner/${ownerId}`);

export const rejectOwner = (adminId, ownerId) =>
  apiClient.post(`/api/User/${adminId}/reject-owner/${ownerId}`);

