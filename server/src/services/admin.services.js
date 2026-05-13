import User from "../models/user.model.js";
import ApiError from "../utils/apiError.js";
import Role from "../models/role.model.js";
import Order from "../models/order.model.js";
import Todo from "../models/todo.model.js";
import subTodo from "../models/subTodo.model.js";
// ✅ Get all users (admin only)
export const getAllUsers = async (adminUserId, skip = 0, limit = 10) => {
  try {
    // First, get the requesting user to check if they're admin
    const requestingUser = await User.findById(adminUserId).populate("role");

    if (!requestingUser) {
      throw new ApiError(404, "User not found");
    }

    // Check if user has admin role
    if (!requestingUser.role || requestingUser.role.name !== "admin") {
      throw new ApiError(403, "Access denied. Admin privileges required.");
    }

    // If user is admin, return all users with their roles populated

    const excludedRoles = await Role.find({
      name: { $in: ["masterAdmin", "admin"] },
    }).select("_id");
    const excludedRoleIds = excludedRoles.map((r) => r._id);

    const users = await User.find({parentUser:adminUserId})
      .select("-password -role")
      .sort({ createdAt: -1 })
      .skip(parseInt(skip))
      .limit(parseInt(limit));

    return users;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, "Failed to fetch users");
  }
};

export const getAllAdmins = async (adminUserId, skip = 0, limit = 10) => {
  try {
    const requestingUser = await User.findById(adminUserId).populate("role");

    if (!requestingUser) {
      throw new ApiError(404, "User not found");
    }

    if (!requestingUser.role || requestingUser.role.name !== "masterAdmin") {
      throw new ApiError(403, "Access denied. Master admin privileges required.");
    }

    const adminRole = await Role.findOne({ name: "admin" }).select("_id");

    if (!adminRole) {
      throw new ApiError(404, "Admin role not found");
    }

    const admins = await User.find({ role: adminRole._id })
      .select("-password -role")
      .sort({ createdAt: -1 })
      .skip(parseInt(skip))
      .limit(parseInt(limit));

    return admins;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, "Failed to fetch admins");
  }
};
// ✅ Get user by ID (admin only)
export const getUserById = async (adminUserId, targetUserId) => {
  try {
    // Check if requesting user is admin
    const adminUser = await User.findById(adminUserId).populate("role");

    if (!adminUser) {
      throw new ApiError(404, "Admin user not found");
    }
    
    if (!adminUser.role && (adminUser.role.name === "admin" || adminUser.role.name === "masterAdmin")) {
      throw new ApiError(403, "Access denied. Admin privileges required.");
    }

    // Get the target user
    const targetUser = await User.findById(targetUserId)
      .select("-password")
      .populate("role", "name permissions");

    if (!targetUser) {
      throw new ApiError(404, "User not found");
    }

    return targetUser;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, "Failed to fetch user");
  }
};

// ✅ Delete user (admin only)
export const deleteUser = async (adminUserId, targetUserId) => {
  try {
    // Check if requesting user is admin
    const adminUser = await User.findById(adminUserId).populate("role");

    if (!adminUser) {
      throw new ApiError(404, "Admin user not found");
    }

    if (!adminUser.role || adminUser.role.name !== "admin") {
      throw new ApiError(403, "Access denied. Admin privileges required.");
    }

    // Prevent admin from deleting themselves
    if (adminUserId === targetUserId) {
      throw new ApiError(400, "Cannot delete your own account");
    }

    // Delete the target user
    const deletedUser = await User.findByIdAndDelete(targetUserId);

    if (!deletedUser) {
      throw new ApiError(404, "User not found");
    }

    return deletedUser;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, "Failed to delete user");
  }
};

export const getTodosAdmin = async (userId, completed, skip, limit) => {
  const isAdmin = false;
  //   console.log(userId,completed,skip,limit);
  if (completed == 3) {
    const query = isAdmin
      ? { parentTodoId: null }
      : { user: userId, parentTodoId: null ,parentUser:userId};
    return await Todo.find(query).sort({ createdAt: -1 });
  } else {
    const query = isAdmin
      ? { parentTodoId: null, completed: completed }
      : { user: userId, parentTodoId: null, completed: completed ,parentUser:userId};
    return await Todo.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
  }
};

export const deleteAllTodoAdmin = async (userId) => {
  const isAdmin = false;
  const query = isAdmin
    ? { completed: true }
    : { completed: true, user: userId };
  return await Todo.deleteMany(query);
};

export const getAllOrdersAdmin = async (skip, limit, userId) => {
  const isAdmin = false;
  const query = isAdmin ? {} : { userId };
  return await Order.find(query)
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });
};

export const getAllSubTodosAdmin = async (userId, completed, skip, limit) => {
  const isAdmin = false;
  const query = isAdmin
    ? { completed: completed }
    : { user: userId, completed: completed };
  return await subTodo
    .find(query)
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });
};

export const deleteAllSubTodoAdmin = async (userId) => {
  const isAdmin = false;
  const query = isAdmin
    ? { completed: true }
    : { completed: true, user: userId };
  return await subTodo.deleteMany(query);
};

export const createOrderAdmin = async (data, userId) => {
  const order = await Order.create({ ...data, userId: userId });
  return order;
};

export const createTodoAdmin = async (data, userId) => {
  const todo = await Todo.create({ ...data, user: userId }); // user is already in data from controller
  return todo;
};

export const createSubTodoAdmin = async (data, userId) => {
  return await subTodo.create({ ...data, user: userId }); // parentTodo is already in data
};

export const updateUserDetailsAdmin = async (userId, updates) => {
  const { email, name } = updates;
  //console.log('Received updates:', updates);

  const user = await User.findById(userId).select("-password");
  if (!user) {
    throw new Error("User not found");
  }

  if (!email && !name) {
    throw new Error("No updates provided");
  }

  if (email) {
    user.email = email;
  }

  if (name) {
    user.name = name;
  }

  await user.save();

  return user;
};

export const updateStatusAdmin = async (userId, updates) => {
  //console.log('Received updates:', updates);

  const user = await User.findById(userId).select("-password");
  if (!user) {
    throw new Error("User not found");
  }

  user.is_banned = updates;

  await user.save();

  return user;
};

export const updateUserAccessAdmin = async (userId, accessIds) => {
  const user = await User.findById(userId).select("-password");
  if (!user) {
    throw new Error("User not found");
  }

  if (!accessIds) {
    throw new Error("No access provided");
  }

  user.access = accessIds;

  await user.save();

  return user;
};
