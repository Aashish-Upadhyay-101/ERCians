import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "universal-cookie";
import { useNavigate } from "react-router-dom";

export const STATUS = Object.freeze({
  IDLE: "idle",
  PENDING: "pending",
  SUCCESS: "success",
  FAILED: "failed",
});

const initialState = {
  status: STATUS.IDLE,
  loggedInUser: {
    data: {},
  },
  token: "",
};

const cookies = new Cookies();

const userSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    logout(state, action) {
      cookies.remove("auth_token", { path: "/" });
      return initialState;
    },

    login(state, action) {
      state.status = STATUS.IDLE;
      state.token = action.payload.token;
      state.loggedInUser = action.payload.user;
    },
  },
});

export const { logout, login } = userSlice.actions;
// export { userLogin, setDefaultLoginUser };
export default userSlice.reducer;
