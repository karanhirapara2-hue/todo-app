import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import {
  getAllUsers,
  getUserById,
  deleteUser,
  getTodosAdmin,
  deleteAllTodoAdmin,
  getAllOrdersAdmin,
  getAllSubTodosAdmin,
  deleteAllSubTodoAdmin,
  createOrderAdmin,
  createTodoAdmin,
  createSubTodoAdmin,
  updateUserAdmin,
  updateStatusAdmin,
  updateUserAccessAdmin,
  setPassword,
  getAllAdmins,
} from "../controllers/admin.controller.js";

const router = express.Router();

// Users
router.get("/users", protect, getAllUsers);
router.get("/admins", protect, getAllAdmins);
router.get("/users/:userId", protect, getUserById);
router.delete("/users/:userId", protect, deleteUser);
router.put('/user/update', protect,updateUserAdmin);
router.put('/user/updateStatus',protect,updateStatusAdmin);
router.put('/user/updateAccess', protect, updateUserAccessAdmin);
router.post('/user/set-password',protect,setPassword);
// Todos
router.get("/todos/:completed", protect, getTodosAdmin);
router.delete("/todos/completed/all", protect, deleteAllTodoAdmin);
router.post("/todos", protect, createTodoAdmin);

// Orders
router.get("/orders", protect, getAllOrdersAdmin);
router.post("/orders", protect, createOrderAdmin);

// SubTodos
router.get("/subtodos/:completed", protect, getAllSubTodosAdmin);
router.delete("/subtodos/completed/all", protect, deleteAllSubTodoAdmin);
router.post("/:todoId/subtodos", protect, createSubTodoAdmin);

export default router;
