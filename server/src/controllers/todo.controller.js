import * as todoService from "../services/todo.service.js";
import ApiResponse from "../utils/apiResponse.js";
import ApiError from "../utils/apiError.js";
import logger from "../config/logger.js"
import { getIO } from "../config/socket.js";

export const createTodo = async (req, res, next) => {
  try {
    const userId = req.user.id;
      console.log(req.body);
    const todo = await todoService.createTodo({ ...req.body, user: userId });
    logger.info("Todo created", {
      type: "activity",
      userId: userId,
      todoId: todo._id,
    });
   getIO().to("12345").emit("todoCreated"); 
    res.status(201).json(
      new ApiResponse(true, "Todo created successfully", todo)
    );
  } catch (error) {
    next(error);
  }
};

export const getTodos = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const {completed} = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

    //console.log({ user: userId });

    const todos = await todoService.getTodos(userId,completed,skip,limit);
    const totalTodos=await todoService.getTodos(userId,completed,0,1000);
    const totalPage =Math.ceil(totalTodos.length/limit);
    res.status(200).json(
      new ApiResponse(true, "Todos fetched successfully", {
        count: todos.length,
        todos,
        page:page,
        limit:limit,
        totalPage:totalPage,
      })
    );
  } catch (error) {
    next(error);
  }
};



export const getTodoById = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const todo = await todoService.getTodoById(req.params.id, userId);

    if (!todo) {
      throw new ApiError(404, "Todo not found");
    }

    res.status(200).json(
      new ApiResponse(true, "Todo fetched successfully", todo)
    );
  } catch (error) {
    next(error);
  }
};


// todo.controller.js
export const updateTodo = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const todo = await todoService.updateTodo(req.params.id, req.body, userId);
  
    if (!todo) {
      throw new ApiError(404, "Todo not found");
    }

    logger.info("Todo updated", {   // ✅ plain English, consistent
  type: "activity",
  userId: userId,
  todoId: todo._id,
    });
     getIO().to("12345").emit("todoUpdated"); 
    res.status(200).json(
      new ApiResponse(true, "Todo updated successfully", todo)
    );
  } catch (error) {
    if (error.message === "Complete all sub-todos first") {
      return res.status(400).json(
        new ApiResponse(false, "Complete all sub-todos first", null)
      );
    }
    next(error);
  }
};


export const deleteTodo = async (req, res, next) => {
  try {    const userId = req.user.id;
    const deleted = await todoService.deleteTodo(req.params.id, userId);
  
    if (!deleted) {
      throw new ApiError(404, "Todo not found");
    }
    
    logger.info("Todo deleted", {   // ✅ plain English, consistent
     type: "activity",
     userId: userId,
    todoId: req.params.id,
    });
      getIO().to("12345").emit("todoDeleted"); 
    res.status(200).json(
      new ApiResponse(true, "Todo deleted successfully")
    );
  } catch (error) {
    next(error); 
  }
};

export const deleteAllTodo = async (req, res, next) => {
  try {   
     const userId = req.user.id;
    const deleted = await todoService.deleteAllTodo(userId);

    if (!deleted) {
      throw new ApiError(404, "Todo not found");
    }

    logger.info("AllTodo deleted", {   // ✅ plain English, consistent
     type: "activity",
     userId: userId,
    });

    res.status(200).json(
      new ApiResponse(true, "Todo deleted successfully")
    );
  } catch (error) {
    next(error);
  }
};