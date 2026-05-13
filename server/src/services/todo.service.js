import Todo from "../models/todo.model.js";
import subTodo from "../models/subTodo.model.js";
import User from "../models/user.model.js";

const isAdminUser = async (userId) => {
  const user = await User.findById(userId).populate("role");
  return user?.role?.name === "admin";
};
// ✅ Create Todo
export const createTodo = async (data) => {
  const todo = await Todo.create(data); // user is already in data from controller
  return todo;
};

// ✅ Get All Todos (scoped to user)

export const getTodos = async (userId, completed, skip, limit) => {
  const isAdmin = false;

  if (completed == 3) {
    const query = isAdmin
      ? { parentTodoId: null }
      : {
          $or: [{ user: userId }, { parentUser: userId }],
          parentTodoId: null,
        };
    return await Todo.find(query).sort({ createdAt: -1 });
  } else {
    const query = isAdmin
      ? { parentTodoId: null, completed: completed }
      : {
          $or: [{ user: userId }, { parentUser: userId }],
          parentTodoId: null,
          completed: completed,
        };
    return await Todo.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
  }
};

// ✅ Get Todo By ID (scoped to user)
// ✅ Get Todo By ID (scoped to user) - also fetch its sub-todos
export const getTodoById = async (id, userId) => {
  const isAdmin = await isAdminUser(userId);
  const query = isAdmin ? { _id: id } : { _id: id, user: userId };
  return await Todo.findOne(query);
};

// ✅ Update Todo (scoped to user)
// todo.service.js
export const updateTodo = async (id, data, userId) => {
  const isAdmin = await isAdminUser(userId);
  const findQuery = isAdmin ? { _id: id } : { _id: id, user: userId };
  const todo = await Todo.findOne(findQuery);
  if (!todo) throw new Error("Todo not found");

  // If trying to mark as completed, bulk-complete all sub-todos
  if (data.completed === true) {
    await subTodo.updateMany(
      { parentTodoId: id },
      { $set: { completed: true } },
    );
  }

  const updatedTodo = await Todo.findByIdAndUpdate(
    todo._id,
    { $set: data },
    { new: true },
  );

  return updatedTodo;
};

// ✅ Delete Todo (scoped to user)
export const deleteTodo = async (id, userId) => {
  const isAdmin = await isAdminUser(userId);
  const query = isAdmin ? { _id: id } : { _id: id, user: userId };
  const todo = await Todo.findOneAndDelete(query);

  if (todo) {
    await subTodo.deleteMany({ parentTodoId: id });
  }

  return todo;
};

export const deleteAllTodo = async (userId) => {
  const isAdmin = false;
  const query = isAdmin
    ? { completed: true }
    : { completed: true, user: userId };
  return await Todo.deleteMany(query);
};
