import * as subTodoService from "../services/subTodo.services.js";
import * as todoService from "../services/todo.service.js";
import ApiResponse from "../utils/apiResponse.js";
import ApiError from "../utils/apiError.js";
import logger from "../config/logger.js"
// POST /api/todos/:todoId/subtodos
export const createSubTodo = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { todoId } = req.params;
    

    // check parent todo exists and belongs to user
    const parentTodo = await todoService.getTodoById(todoId, userId);
    
    if (!parentTodo) {
      throw new ApiError(404, "Parent todo not found");
    }

    const subTodo = await subTodoService.createSubTodo({
      ...req.body,
      user: userId,
      parentTodoId: todoId,
    });
   

     logger.info("SubTodo created", {
      type: "activity",
      userId: userId,
      todoId: todoId,
    });

    res.status(201).json(
      new ApiResponse(true, "Sub-todo created successfully", subTodo)
    );
  } catch (error) {
    next(error);
  }
};

// GET /api/todos/:todoId/subtodos
export const getSubTodos = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { todoId, completed } = req.params;
    const { page = 1, limit = 10 } = req.query;
   
    const skip=(page - 1) * limit;
    // check parent todo exists and belongs to user
    const parentTodo = await todoService.getTodoById(todoId, userId);
    if (!parentTodo) {
      throw new ApiError(404, "Parent todo not found");
    }

    const subTodos = await subTodoService.getSubTodos(todoId, completed, userId, parseInt(skip), parseInt(limit));
    
    const totalSubTodos=await subTodoService.getAllSubTodos(userId, completed,0, 1000);
   const totalPage =Math.ceil(totalSubTodos.length/limit);
     
    res.status(200).json(
      new ApiResponse(true, "Sub-todos fetched successfully", {
        count: subTodos.length,
        subTodos,
        page:page,
        limit:limit,
        totalPage:totalPage
      })
    );
  } catch (error) {
    next(error);
  }
};

// GET /api/todos/:todoId/subtodos/:subTodoId
export const getSubTodoById = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { todoId, subTodoId } = req.params;

    const subTodo = await subTodoService.getSubTodoById(subTodoId, todoId, userId);
    if (!subTodo) {
      throw new ApiError(404, "Sub-todo not found");
    }

    res.status(200).json(
      new ApiResponse(true, "Sub-todo fetched successfully", subTodo)
    );
  } catch (error) {
    next(error);
  }
};

// PATCH /api/todos/:todoId/subtodos/:subTodoId
export const updateSubTodo = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { todoId, subTodoId } = req.params;

    const subTodo = await subTodoService.updateSubTodo(subTodoId, todoId, req.body, userId);
    if (!subTodo) {
      throw new ApiError(404, "Sub-todo not found");
    }
   
     logger.info("subTodo updated", {   // ✅ plain English, consistent
     type: "activity",
     userId: userId,
    todoId: todoId,
    subTodoId:subTodoId,
    });
    res.status(200).json(
      new ApiResponse(true, "Sub-todo updated successfully", subTodo)
    );
  } catch (error) {
    next(error);
  }
};

// DELETE /api/todos/:todoId/subtodos/:subTodoId
export const deleteSubTodo = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { todoId, subTodoId } = req.params;

    const subTodo = await subTodoService.deleteSubTodo(subTodoId, todoId, userId);
    if (!subTodo) {
      throw new ApiError(404, "Sub-todo not found");
    }
    
     logger.info("subTodo deleted", {   // ✅ plain English, consistent
     type: "activity",
     userId: userId,
    todoId: todoId,
    subTodoId:subTodoId,
    });

    res.status(200).json(
      new ApiResponse(true, "Sub-todo deleted successfully")
    );
  } catch (error) {
    next(error);
  }
};
export const deleteAllSubTodo = async (req, res, next) => {
  try {
    const userId = req.user.id;
  

    const subTodo = await subTodoService.deleteAllSubTodo(userId);
    if (!subTodo) {
      throw new ApiError(404, "Sub-todos not found");
    }

    logger.info("AllsubTodo deleted", {   // ✅ plain English, consistent
     type: "activity",
     userId: userId,
    });

    res.status(200).json(
      new ApiResponse(true, "All Sub-todo deleted successfully")
    );
  } catch (error) {
    next(error);
  }
};

export const getAllSubTodos = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { completed } = req.params;
    const { page = 1, limit = 3 } = req.query;
     const skip=(page - 1) * limit;
    
    const subTodos = await subTodoService.getAllSubTodos(userId, completed, parseInt(skip), parseInt(limit));
    const totalSubTodos=await subTodoService.getAllSubTodos(userId, completed,0, 1000);
   const totalPage =Math.ceil(totalSubTodos.length/limit);
    res.status(200).json(
      new ApiResponse(true, "Sub-todos fetched successfully", {
        count: subTodos.length,
        subTodos,
        page:page,
        limit:limit,
        totalPage:totalPage,
      })
    );
  } catch (error) {
    next(error);
  }
};
