import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "universal-cookie";
import { useNavigate } from "react-router-dom";

// status (immutable object) -> enum alternative
export const STATUS = Object.freeze({
  IDLE: "idle",
  PENDING: "pending",
  SUCCESS: "success",
  FAILED: "failed",
});

// initial state for user
const initialState = {
  status: STATUS.IDLE,
  loggedInUser: {
    // user
    data: {},
  },
  token: "", // login token
};

const cookies = new Cookies(); // cookies

// user slice
const userSlice = createSlice({
  name: "user", // slice name
  initialState: initialState, // setting initial state

  // reducer function
  reducers: {
    // logout reducer function -> delete the 'auth_token' cookie from the browser and set the state to initialState (default state when user not logged in)
    logout(state, action) {
      cookies.remove("auth_token", { path: "/" });
      return initialState;
    },

    // put user's status, token, and info to the initialState
    login(state, action) {
      state.status = STATUS.IDLE;
      state.token = action.payload.token;
      state.loggedInUser = action.payload.user;
    },
  },
});

export const { logout, login } = userSlice.actions; // actions to be dispatched from other part of website
// export { userLogin, setDefaultLoginUser };
export default userSlice.reducer; // default user reducer to configure the store
