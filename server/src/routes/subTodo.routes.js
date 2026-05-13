import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import validateTodo from "../middlewares/validateTodo.middleware.js";
import {
  createSubTodo,
  getSubTodos,
  getSubTodoById,
  updateSubTodo,
  deleteSubTodo,
  deleteAllSubTodo,
  getAllSubTodos
} from "../controllers/subTodo.controller.js"; 

const router = express.Router();

router.get("/subtodos/:completed", protect, getAllSubTodos);

router.post("/:todoId/subtodos", protect, validateTodo, createSubTodo);

router.get("/:todoId/subtodos/:completed", protect, getSubTodos);

router.get("/:todoId/subtodos/:subTodoId([0-9a-fA-F]{24})", protect, getSubTodoById);

router.patch("/:todoId/subtodos/:subTodoId([0-9a-fA-F]{24})", protect, updateSubTodo);

router.delete("/:todoId/subtodos/:subTodoId([0-9a-fA-F]{24})", protect, deleteSubTodo);

router.delete("/subtodos", protect, deleteAllSubTodo);

export default router;