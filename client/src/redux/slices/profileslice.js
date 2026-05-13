import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getCurrentUser, uploadProfilePhoto, update } from "../../services/user.sevices";

export const fetchUser = createAsyncThunk(
  "user/fetchUser",
  async () => {
    const response = await getCurrentUser();
    return response.data.data || response.data;
  }
);

export const updateUserProfile = createAsyncThunk(
  "user/updateUserProfile",
  async ({ name, email, photo, userId }) => {
    let response = await update({ email, name });
    let user = response.data.data || response.data;

    if (photo && userId) {
      const uploadResponse = await uploadProfilePhoto(userId, photo);
      user = uploadResponse.data.data || uploadResponse.data;
    }

    return user;
  }
);

const userSlice = createSlice({
  name: "Profile",
  initialState: {
    data: null,
    loading: false,
    error: null,
    updating: false,
  },
  reducers: {
    setUser: (state, action) => {
      state.data = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message || "Failed to load user";
      })
      .addCase(updateUserProfile.pending, (state) => {
        state.updating = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.updating = false;
        state.data = action.payload;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.updating = false;
        state.error = action.error?.message || "Failed to update user";
      });
  },
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;
