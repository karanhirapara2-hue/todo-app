import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  todos: [],
};

const Todoslice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    setTodos: (state, action) => {
      state.todos = action.payload;
    },
  },
});

export const { setTodos } = Todoslice.actions;
export default Todoslice.reducer;