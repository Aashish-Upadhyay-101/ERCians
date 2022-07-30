import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import { userLogin, getUser, login } from "../store/userSlice";
import "../styles/Login.css";
import Logo from "../assets/images/ERCians-logo.png";
import Error from "../components/Error";
import { STATUS } from "../store/userSlice";
import axios from "axios";

const cookies = new Cookies();

const Login = () => {
  const userStatus = useSelector((state) => state.user.status);
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const userLogin = async (email, password) => {
    try {
      const loginResponse = await axios({
        method: "post",
        url: "http://127.0.0.1:8000/api/auth/login/",
        data: {
          email: email,
          password: password,
        },
      });

      const token = await loginResponse.data.token;
      return token;
    } catch (err) {
      console.log(err.message);
    }
  };

  const getUser = async (token) => {
    if (!token) {
      throw "Incorrect email or password";
    } else {
      cookies.set("auth_token", token); // setting the auth token in the cookie
      try {
        const userResponse = await axios.get(
          "http://127.0.0.1:8000/api/profile/getme/",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Token ${token}`,
            },
          }
        );

        const user = await userResponse.data;
        return user;
      } catch (err) {
        console.log(err.message);
      }
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("clicked");
    try {
      const token = await userLogin(email, password);
      const user = await getUser(token);
      dispatch(login({ token, user }));
      navigate("/");
    } catch (err) {
      setError(err);
    }

    console.log(error);
  };

  return (
    <section className="section-login">
      {error && <Error message={error} />}
      <h1></h1>
      <div className="login">
        <Link to="/">
          <img className="logo" src={Logo} alt="Logo" />
        </Link>
        <h2 className="login__header">Login</h2>
        <form onSubmit={handleLogin}>
          <div className="login__form__div">
            <label>Email</label>
            <input
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="JohnDoe@example.com"
              value={email}
              required
            />
          </div>
          <div className="login__form__div">
            <label>Password</label>
            <input
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="min 8 digits"
              value={password}
              required
            />
          </div>
          <a href="#" className="forget__password">
            Forget password?
          </a>
          <button type="submit" className="btn btn-primary">
            Login
          </button>
          <div className="login__message">
            <p>Don't have an account?</p>
            <Link to="/signup" className="forget__password">
              Create here
            </Link>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Login;
