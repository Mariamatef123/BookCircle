// import { jwtDecode } from "jwt-decode";

// export const setAuthToken = (token) => {
//     localStorage.setItem("token", token);
// };

// export const decodeAuthToken = (token) => {
//     if (!token) return null;

//     try {
//         return jwtDecode(token);
//     } catch {
//         return null;
//     }
// };

// export const getAuthToken = () => {
//     const token = localStorage.getItem("token");
//     if (token) {
//         const decoded = decodeAuthToken(token);

//         if (!decoded || (decoded.exp && Date.now() >= decoded.exp * 1000)) {
//             removeAuthToken();
//             return null;
//         }

//         return token;
//     }

//     return null;
// };

// export const removeAuthToken = () => {
//     if (localStorage.getItem("token")) {
//         localStorage.removeItem("token");
//     }
// };
