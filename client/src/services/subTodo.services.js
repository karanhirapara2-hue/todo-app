import api from "../utils/api";


export const getSubTodos = (todoId, completed, page = 1, limit = 3) =>
  api.get(`/todos/${todoId}/subtodos/${completed}?page=${page}&limit=${limit}`);


export const createSubTodo = (todoId, data) =>
  api.post(`/todos/${todoId}/subtodos`, data);

export const getAllSubTodo = (completed, page = 1, limit = 3) => 
  api.get(`/todos/subtodos/${completed}?page=${page}&limit=${limit}`);


export const getSubTodoById = (todoId, subTodoId) =>
  api.get(`/todos/${todoId}/subtodos/${subTodoId}`);


// 🔹 Update subtodo
export const updateSubTodo = (todoId, subTodoId, data) =>
  api.patch(`/todos/${todoId}/subtodos/${subTodoId}`, data);


// 🔹 Delete subtodo
export const deleteSubTodo = (todoId, subTodoId) =>
  api.delete(`/todos/${todoId}/subtodos/${subTodoId}`);

export const deleteAllSubTodo = () =>
  api.delete(`/todos/subtodos`);
