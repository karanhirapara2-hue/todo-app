import express from "express";
import validateTodo from "../middlewares/validateTodo.middleware.js";
import { protect } from "../middlewares/auth.middleware.js";
import {
  createTodo,
  getTodos,
  getTodoById,
  updateTodo,
  deleteTodo,
  deleteAllTodo
} from "../controllers/todo.controller.js";

const router = express.Router();

router.post("/", protect, validateTodo, createTodo);
router.get("/:completed", protect, getTodos);
router.get("/:id([0-9a-fA-F]{24})", protect, getTodoById);
router.put("/:id([0-9a-fA-F]{24})", protect, validateTodo, updateTodo);
router.delete("/:id([0-9a-fA-F]{24})", protect, deleteTodo);
router.delete("/",protect,deleteAllTodo);
export default router;