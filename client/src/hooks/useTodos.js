import { useEffect, useState } from "react";
import * as todoService from "../services/todo.service";
import toast from 'react-hot-toast';

export const useTodos = () => {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    todoService.getTodos().then((res) => {
      setTodos(res.data.data.todos);
    }).catch((error) => {
      toast.error("Failed to fetch todos ❌");
    });
  }, []);

  return { todos, setTodos };
};