import { jwtDecode } from "jwt-decode";

const CLAIMS = {
  id: "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier",
  email: "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress",
  name: "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name",
  role: "http://schemas.microsoft.com/ws/2008/06/identity/claims/role",
};

export const setAuthToken = (token) => {
  localStorage.setItem("token", token);
  localStorage.removeItem("user");
};

export const getAuthToken = () => {
  const token = localStorage.getItem("token");
  if (token) {
    try {
      const decoded = jwtDecode(token);
      if (decoded.exp && Date.now() >= decoded.exp * 1000) {
        removeAuthToken();
        return null;
      }
      return token;
    } catch {
      return null;
    }
  }
  return null;
};

export const removeAuthToken = () => {
  if (localStorage.getItem("token")) {
    localStorage.removeItem("token");
  }
};

export const decodeAuthToken = (token = getAuthToken()) => {
  if (!token) return null;

  try {
    return jwtDecode(token);
  } catch {
    return null;
  }
};

export const getDecodedAuthToken = () => decodeAuthToken();

const getClaim = (claims, ...keys) =>
  keys.map((key) => claims?.[key]).find((value) => value !== undefined && value !== null);

export const getUser = () => {
  const claims = getDecodedAuthToken();
  if (!claims) return null;

  return {
    id: getClaim(claims, CLAIMS.id, "nameid", "sub", "id", "userId"),
    email: getClaim(claims, CLAIMS.email, "email"),
    name: getClaim(claims, CLAIMS.name, "name", "unique_name"),
    role: getClaim(claims, CLAIMS.role, "role"),
  };
};

export const isLoggedIn = () => Boolean(getAuthToken());

export const logout = () => {
  removeAuthToken();
  localStorage.removeItem("user");
};
