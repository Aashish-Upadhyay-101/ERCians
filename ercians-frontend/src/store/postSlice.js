import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { STATUS } from "./userSlice";

const initialState = {
  status: STATUS.IDLE,
  posts: [],
};

const fetchAllPosts = createAsyncThunk("posts/fetchall", async () => {
  const response = await axios.get("http://127.0.0.1:8000/api/posts/");
  const data = await response.data;
  console.log(data);
  return data;
});

const postSlice = createSlice({
  name: "posts",
  initialState: initialState,
  extraReducers: (posts) => {
    posts
      .addCase(fetchAllPosts.pending, (state, action) => {
        state.status = STATUS.PENDING;
      })
      .addCase(fetchAllPosts.fulfilled, (state, action) => {
        state.status = STATUS.IDLE;
        state.posts = action.payload;
      })
      .addCase(fetchAllPosts.rejected, (state, action) => {
        state.status = STATUS.FAILED;
      });
  },
});

export { fetchAllPosts };
export default postSlice.reducer;
