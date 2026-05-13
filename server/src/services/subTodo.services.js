import subTodo  from "../models/subTodo.model.js"; 
import Todo from "../models/todo.model.js";
import User from "../models/user.model.js";
import Role from '../models/role.model.js';
const isAdminUser = async (userId) => {
  const user = await User.findById(userId).populate("role");
  return user?.role?.name === "admin";
};
// ✅ Create Sub-todo
export const createSubTodo = async (data) => {
  return await subTodo.create(data); // parentTodo is already in data
};

// ✅ Get All Sub-todos (scoped to parent)
export const getSubTodos = async (parentTodoId,completed, userId,skip,limit) => {
  const isAdmin = await isAdminUser(userId);

  const query = isAdmin
    ? { parentTodoId: parentTodoId, completed: completed }
    : { parentTodoId: parentTodoId, user: userId, completed: completed };
  return await subTodo.find(query).skip(skip).limit(limit).sort({ createdAt: 1 });
};

// ✅ Get Sub-todo By ID
export const getSubTodoById = async (id, parentTodoId, userId) => {
  const isAdmin = await isAdminUser(userId);
  const query = isAdmin
    ? { _id: id, parentTodoId: parentTodoId }
    : { _id: id, parentTodoId: parentTodoId, user: userId };
  return await subTodo.findOne(query);
};

// ✅ Update Sub-todo
export const updateSubTodo = async (id, parentTodoId, data, userId) => {
  const isAdmin = await isAdminUser(userId);
  const query = isAdmin
    ? { _id: id, parentTodoId: parentTodoId }
    : { _id: id, parentTodoId: parentTodoId, user: userId };

  const updated = await subTodo.findOneAndUpdate(
    query,
    data,
    { new: true, runValidators: true }
  );
  
  // If marking sub-todo incomplete, ensure parent is also marked incomplete
  if (updated && data.completed === false) {
    const parentQuery = isAdmin
      ? { _id: parentTodoId, completed: true }
      : { _id: parentTodoId, user: userId, completed: true };
    await Todo.findOneAndUpdate(
      parentQuery,
      { $set: { completed: false } }
    );
  }

  return updated;
};

// ✅ Delete Sub-todo
export const deleteSubTodo = async (id, parentTodoId, userId) => {
  const isAdmin = await isAdminUser(userId);
  const query = isAdmin
    ? { _id: id, parentTodoId: parentTodoId }
    : { _id: id, parentTodoId: parentTodoId, user: userId };
  return await subTodo.findOneAndDelete(query);
};

export const getAllSubTodos = async (userId,completed,skip,limit) => {
  const isAdmin = false;
  const query = isAdmin ? { completed: completed } : { user: userId, completed: completed };
  return await subTodo.find(query).skip(skip).limit(limit).sort({ createdAt: -1 });
};

export const deleteAllSubTodo = async (userId) => {
  const isAdmin = false;
  const query = isAdmin ? { completed: true } : { completed: true, user: userId };
  return await subTodo.deleteMany(query);
};
