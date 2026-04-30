
import api from "../Api/axios";


export const Login = (user) =>
  api.post("/api/Auth/login", user);
export const Register = (user) =>
  api.post("/api/Auth/register", user);


export const getPendingOwners = (adminId) =>
  api.get(`/api/User/${adminId}/pending-owners`);

export const acceptOwner = (adminId, ownerId) =>
  api.post(`/api/User/${adminId}/accept-owner/${ownerId}`);

export const rejectOwner = (adminId, ownerId) =>
  api.post(`/api/User/${adminId}/reject-owner/${ownerId}`);

