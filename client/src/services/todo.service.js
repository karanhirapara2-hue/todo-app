import api from "../utils/api";

export const getTodos = (completed,page,limit) => api.get(`/todos/${completed}?page=${page}&limit=${limit}`);

export const createTodo = (data) => api.post("/todos", data);

export const updateTodo = (id, data) =>
  api.put(`/todos/${id}`, data);

export const deleteTodo = (id) =>
  api.delete(`/todos/${id}`);

export const deleteAllTodo =()=>api.delete("/todos");