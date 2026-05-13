import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as subTodoService from "../../services/subTodo.services";

export const fetchSubTodos = createAsyncThunk(
  "subTodos/fetchSubTodos",
  async (todoId) => {
    const response = await subTodoService.getSubTodos(todoId);
    return response.data.data || response.data;
  }
);

const initialState = {
  data: [],
  loading: false,
  error: null,
};

const SubTodoslice = createSlice({
  name: "subTodos",
  initialState,
  reducers: {
    setsubTodos: (state, action) => {
      state.data = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubTodos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubTodos.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchSubTodos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message || "Failed to load subtodos";
      });
  },
});

export const { setsubTodos } = SubTodoslice.actions;
export default SubTodoslice.reducer;