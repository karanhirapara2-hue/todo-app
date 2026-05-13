import { configureStore } from '@reduxjs/toolkit';
import Todoslice from '../slices/Todoslice';
import Authslice from '../slices/Authslice';
import ProfileSlice from '../slices/profileslice';
export const store = configureStore({
  reducer: {
    Todos: Todoslice,
    Auth: Authslice,
    Profile: ProfileSlice
  },
});