import api from "../utils/api";

export const register = (data) => api.post("/users/register", data);

export const login = (data) => api.post("/users/login", data);

export const logout = () => api.post("/users/logout");

export const uploadProfilePhoto = (userId, file) => {
  const formData = new FormData();
  formData.append("profilePhoto", file);
  return api.post(`/users/uploadPhoto/${userId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const update = (data) => api.put("/users/update", data);

export const getCurrentUser = () => api.get("/users/me");

export const resetPassword=(token,data)=> api.post(`/users/reset-password/${token}`,data);

export const forgotpassword =(data)=>api.post("/users/forgot-password",data);

export const setUserCredentialService = (data) =>
  api.put(`/users/setCredential`, data);