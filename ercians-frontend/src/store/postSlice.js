import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { STATUS } from "./userSlice";

// initial state of the post
const initialState = {
  status: STATUS.IDLE,
  posts: [], // post's array (i.e -> array of objects)
};

// this is the thunk that fetch all the post from the backend
const fetchAllPosts = createAsyncThunk("posts/fetchall", async () => {
  const response = await axios.get("http://127.0.0.1:8000/api/posts/");
  const data = await response.data;
  return data;
});

// creating post slice
const postSlice = createSlice({
  name: "posts", // slice name
  initialState: initialState, // setting initial state
  extraReducers: (posts) => {
    // extra reducers for createAsyncThunk
    posts // builder name

      // promise when pending state
      .addCase(fetchAllPosts.pending, (state, action) => {
        state.status = STATUS.PENDING; // set the status to pending
      })

      // promise when fulfilled (i.e -> got resolved)
      .addCase(fetchAllPosts.fulfilled, (state, action) => {
        state.status = STATUS.IDLE; // set status to idle

        // set the posts array inside the initialState to the array of oject returned by fetchAllPost thunk
        // createAsyncThunk returns the data from the api call and we can access those returned data from action.payload
        state.posts = action.payload;
      })

      // promise when rejected
      .addCase(fetchAllPosts.rejected, (state, action) => {
        state.status = STATUS.FAILED; // set status to failed
      });
  },
});

export { fetchAllPosts }; // exporting the thunk to dispatch()
export default postSlice.reducer; // exporting postSlice reducer to configure the global store
