import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Cookies from "universal-cookie";
import { userLogin, getUser } from "../store/userSlice";
import "../styles/Login.css";
import Logo from "../assets/images/ERCians-logo.png";

const Login = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    dispatch(userLogin({ email, password }));
    navigate("/");
  };

  return (
    <section className="section-login">
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
