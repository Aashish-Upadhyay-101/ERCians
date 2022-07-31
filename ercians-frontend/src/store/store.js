import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import postReducer from "./postSlice";

// create and configure new store
const store = configureStore({
  reducer: {
    user: userReducer, // user reducer
    posts: postReducer, // posts reducer
  },
});

export default store;
