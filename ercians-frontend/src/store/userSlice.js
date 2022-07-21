import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "universal-cookie";

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

const getUser = async (token) => {
  const response = await axios.get("http://127.0.0.1:8000/api/profile/getme/", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  });
  return response.data;
};

const userLogin = createAsyncThunk(
  "user/login",
  async ({ email, password }) => {
    const response = await axios({
      method: "post",
      url: "http://127.0.0.1:8000/api/auth/login/",
      data: {
        email: email,
        password: password,
      },
    });
    const token = response.data.token;

    const user = await getUser(token);
    return {
      user,
      token,
    };
  }
);

const setDefaultLoginUser = createAsyncThunk(
  "user/getDefaultLoggedInUser",
  async (auth_token) => {
    const token = cookies.get("auth_token");
    const user = await getUser(auth_token);
    return {
      user,
      token,
    };
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    logout(state, action) {
      cookies.remove("auth_token", { path: "/" });
      return initialState;
    },
  },
  extraReducers: (user) => {
    user
      .addCase(userLogin.pending, (state, action) => {
        state.status = STATUS.PENDING;
      })

      .addCase(userLogin.fulfilled, (state, action) => {
        state.status = STATUS.IDLE;
        state.token = action.payload.token;
        state.loggedInUser = action.payload.user;
        cookies.set("auth_token", state.token, { path: "/" });
      })

      .addCase(userLogin.rejected, (state, action) => {
        state.status = STATUS.FAILED;
      })

      .addCase(setDefaultLoginUser.pending, (state, action) => {
        state.status = STATUS.PENDING;
      })

      .addCase(setDefaultLoginUser.fulfilled, (state, action) => {
        state.status = STATUS.IDLE;
        state.token = action.payload.token;
        state.loggedInUser = action.payload.user;
        cookies.set("auth_token", state.token, { path: "/" });
      })

      .addCase(setDefaultLoginUser.rejected, (state, action) => {
        state.status = STATUS.FAILED;
      });
  },
});

export const { logout } = userSlice.actions;
export { userLogin, setDefaultLoginUser };
export default userSlice.reducer;
