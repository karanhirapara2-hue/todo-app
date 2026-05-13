import * as adminService from "../services/admin.services.js";
import ApiResponse from "../utils/apiResponse.js";
import ApiError from "../utils/apiError.js";
import User from "../models/user.model.js"
import {sendMail} from "../utils/mailServiceAdmin.js"
import crypto from "crypto";
const getRequestingUserId = (req) => {
  const userId = req?.body?.userId;

  if (!userId) {
    throw new ApiError(400, "userId is required in request body");
  }
  return userId;
};

export const getAllUsers = async (req, res, next) => {
  try {
    const userId = req.user.id;// intentionally from req.body
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;
    
    const users = await adminService.getAllUsers(userId, skip, limit);
    const totalusers = await adminService.getAllUsers(userId, 0, 1000);
    const totalPage =Math.ceil(totalusers.length/limit);
    res.status(200).json(
      new ApiResponse(true, "Users fetched successfully", {
        count: users.length,
        users,
        page,
        limit,
        totalPage,
      })
    );
  } catch (error) {
    next(error);
  }
};

export const getAllAdmins = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const admins = await adminService.getAllAdmins(userId, skip, limit);
    const totalAdmins = await adminService.getAllAdmins(userId, 0, 1000);
    const totalPage = Math.ceil(totalAdmins.length / limit);

    res.status(200).json(
      new ApiResponse(true, "Admins fetched successfully", {
        count: admins.length,
        admins,
        page,
        limit,
        totalPage,
      })
    );
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const userId = req.user.id; // intentionally from req.body
    const targetUserId = req.params.userId || req.body.targetUserId;

    if (!targetUserId) {
      throw new ApiError(400, "targetUserId is required");
    }

    const user = await adminService.getUserById(userId, targetUserId);
    res.status(200).json(new ApiResponse(true, "User fetched successfully", user));
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const userId = req.user.id; // intentionally from req.body
    const targetUserId = req.params.userId || req.body.targetUserId;

    if (!targetUserId) {
      throw new ApiError(400, "targetUserId is required");
    }

    await adminService.deleteUser(userId, targetUserId);
    res.status(200).json(new ApiResponse(true, "User deleted successfully"));
  } catch (error) {
    next(error);
  }
};

export const getTodosAdmin = async (req, res, next) => {
  try {
    
   // intentionally from req.body
    const { completed} = req.params;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
     const userId=req.query.userId;
     
    const skip = (page - 1) * limit;

    const todos = await adminService.getTodosAdmin(userId, completed, skip, limit);
    const totalTodos = await adminService.getTodosAdmin(userId, completed, 0, 1000);
    const totalPage = Math.ceil(totalTodos.length / limit);

    res.status(200).json(
      new ApiResponse(true, "Todos fetched successfully", {
        count: todos.length,
        todos,
        page,
        limit,
        totalPage,
      })
    );
  } catch (error) {
    next(error);
  }
};

export const deleteAllTodoAdmin = async (req, res, next) => {
  try {
    const {userId} = req.query; // intentionally from req.body
    
    const deleted = await adminService.deleteAllTodoAdmin(userId);
    res
      .status(200)
      .json(new ApiResponse(true, "Completed todos deleted successfully", deleted));
  } catch (error) {
    next(error);
  }
};

export const getAllOrdersAdmin = async (req, res, next) => {
  try {
    const {userId }= req.query;
    
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;
   
    const orders = await adminService.getAllOrdersAdmin(skip, limit, userId);
 
    const totalOrders = await adminService.getAllOrdersAdmin(0, 1000, userId);
    const totalPage = Math.ceil(totalOrders.length / limit);
    
    res.status(200).json(
      new ApiResponse(true, "Orders fetched successfully", {
        count: orders.length,
        orders,
        page,
        limit,
        totalPage,
      })
    );
  } catch (error) {
    next(error);
  }
};

export const getAllSubTodosAdmin = async (req, res, next) => {
  try {
    const {userId} = req.query;
    
    const { completed } = req.params;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const subTodos = await adminService.getAllSubTodosAdmin(
      userId,
      completed,
      skip,
      limit
    );
    const totalSubTodos = await adminService.getAllSubTodosAdmin(
      userId,
      completed,
      0,
      1000
    );
    const totalPage = Math.ceil(totalSubTodos.length / limit);

    res.status(200).json(
      new ApiResponse(true, "Sub-todos fetched successfully", {
        count: subTodos.length,
        subTodos,
        page,
        limit,
        totalPage,
      })
    );
  } catch (error) {
    next(error);
  }
};

export const deleteAllSubTodoAdmin = async (req, res, next) => {
  try {
    const {userId} = req.query;
    
    const deleted = await adminService.deleteAllSubTodoAdmin(userId);
    res
      .status(200)
      .json(new ApiResponse(true, "Completed sub-todos deleted successfully", deleted));
  } catch (error) {
    next(error);
  }
};

export const createOrderAdmin = async (req, res, next) => {
  try {
    const {userId} = req.query;
    console.log(userId);
    const order = await adminService.createOrderAdmin(req.body, userId);
    res.status(201).json(new ApiResponse(true, "Order created successfully", order));
  } catch (error) {
    next(error);
  }
};

export const createTodoAdmin = async (req, res, next) => {
  try {
    const { userId } = req.query;
    
   
    const todo = await adminService.createTodoAdmin(req.body, userId);
    res.status(201).json(new ApiResponse(true, "Todo created successfully", todo));
  } catch (error) {
    next(error);
  }
};

export const createSubTodoAdmin = async (req, res, next) => {
  try {
    const {userId} = req.query;
    const {todoId} = req.params;
   
    const subTodo = await adminService.createSubTodoAdmin({...req.body,parentTodoId: todoId}, userId);
    
    res
      .status(201)
      .json(new ApiResponse(true, "Sub-todo created successfully", subTodo));
  } catch (error) {
    next(error);
  }
};

export const  updateUserAdmin= async (req, res, next) => {
  try {
    const {userId} = req.query;
    
    const {email, name} = req.body;
    
    const user = await adminService.updateUserDetailsAdmin(userId,{email,name});

    res
      .status(201)
      .json(new ApiResponse(true, "Sub-todo created successfully", user));
  } catch (error) {
    next(error);
  }
};

export const  updateStatusAdmin= async (req, res, next) => {
  try {
    const {userId} = req.query;
    
    const {update} = req.body;
     
    
    const user = await adminService.updateStatusAdmin(userId,update);

    res
      .status(201)
      .json(new ApiResponse(true, "Sub-todo created successfully", user));
  } catch (error) {
    next(error);
  }
};

export const updateUserAccessAdmin = async (req, res, next) => {
  try {
    const { userId } = req.query;

    const { access } = req.body;  // access: ["64abc1", "64abc2"]
  
    const user = await adminService.updateUserAccessAdmin(userId, access);

    res
      .status(200)
      .json(new ApiResponse(true, "User access updated successfully", user));
  } catch (error) {
    next(error);
  }
};

export const setPassword = async (req, res) => {
  try {
    const { email } = req.body;
   
    const user = await User.findOne({ email });
  
    if (!user) {
      return res.status(404).json({ message: "No user with that email" });
    }
     
   const admin = await User.findById(req.user.id);
   
   
   if (!admin) {
  return res.status(404).json({ message: "User not found" });
}
    
    const resetToken = crypto.randomBytes(32).toString("hex");
   
    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordExpire = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

    await user.save({ validateBeforeSave: false });
  
    const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;
     console.log(user)
  await sendMail(
  {
    to: user.email,
    subject: "Password set Request",
    html: `
      <h2>Password Reset</h2>
      <p>You requested a password reset. Click the link below:</p>
      <a href="${resetUrl}">set Password</a>
      <p>This link expires in 24 hours.</p>
      <p>If you didn't request this, ignore this email.</p>
    `,
  },
  {
    email: admin.credentialMail,
    password: admin.credentialPassword,
  }
);

  res.status(200).json(new ApiResponse(true, "Reset link sent to your email"));

  } catch (err) {
    res.status(500).json({ message: "Something went wrong", error: err.message });
  }
};

