// services/adminService.js
import api from "../utils/api";
import { update } from "./user.sevices";

// ─── Users ───────────────────────────────────────────────
export const getAllUsers = (page, limit) =>
  api.get(`/admin/users?page=${page}&limit=${limit}`);

export const getAllAdmins = (page, limit) =>
  api.get(`/admin/admins?page=${page}&limit=${limit}`);

export const getUserById = (userId) =>
  api.get(`/admin/users/${userId}`);

export const deleteUser = (userId) =>
  api.delete(`/admin/users/${userId}`);


// ─── Todos ────────────────────────────────────────────────
export const getTodosAdmin = (completed, page, limit,userId) => 
  api.get(`/admin/todos/${completed}?page=${page}&limit=${limit}&userId=${userId}`);

export const deleteAllCompletedTodosAdmin = (userId) =>
  api.delete(`/admin/todos/completed/all?userId=${userId}`);

export const createTodoAdmin = (data,userId) =>
  api.post(`/admin/todos?userId=${userId}`, data);


// ─── Orders ───────────────────────────────────────────────
export const getAllOrdersAdmin = (page, limit,userId) =>
  api.get(`/admin/orders?page=${page}&limit=${limit}&userId=${userId}`);

export const createOrderAdmin = (data,userId) =>
  api.post(`/admin/orders?userId=${userId}`, data);


// ─── SubTodos ─────────────────────────────────────────────
export const getAllSubTodosAdmin = (completed, page, limit,userId) =>
  api.get(`/admin/subtodos/${completed}?page=${page}&limit=${limit}&userId=${userId}`);

export const deleteAllCompletedSubTodosAdmin = (userId) =>
  api.delete(`/admin/subtodos/completed/all?userId=${userId}`);

export const createSubTodoAdmin = (todoId,data,userId) =>
  api.post(`/admin/${todoId}/subtodos?userId=${userId}`, data);

export const updateUserAdmin = (data,userId) =>
  api.put(`/admin/user/update?userId=${userId}`, data);

export const updateUserStatusAdmin = (data,userId) => 
  api.put(`/admin/user/updateStatus?userId=${userId}`,{update:data});

export const updateUserAccessAdmin = (accessIds, userId) =>
  api.put(`/admin/user/updateAccess?userId=${userId}`, { access: accessIds });

export const setPassword = (data) => api.post("/admin/user/set-password", data);