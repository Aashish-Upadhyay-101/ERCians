import React, { useRef } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Signup.css";
import Logo from "../assets/images/ERCians-logo.png";

const Signup = () => {
  const username = useRef();
  const email = useRef();
  const password = useRef();
  const confirmPassword = useRef();

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const auth_token = localStorage.getItem("auth_token");
    const response = await axios.post(
      "http://127.0.0.1:8000/api/auth/register/",
      {
        username: username.current.value,
        email: email.current.value,
        password: password.current.value,
      }
    );

    navigate("/login");
  };

  return (
    <section className="section-signup">
      <div className="signup">
        ;nmb m
        <Link to="/">
          <img className="logo" src={Logo} alt="Logo" />
        </Link>
        <h2 className="signup__header">Signup</h2>
        <form onSubmit={handleSubmit}>
          <div className="signup__form__div">
            <label>Username</label>
            <input ref={username} type="text" placeholder="JohnDoe" />
          </div>
          <div className="signup__form__div">
            <label>Email</label>
            <input ref={email} type="email" placeholder="JohnDoe@example.com" />
          </div>
          <div className="signup__form__div">
            <label>Password</label>
            <input ref={password} type="password" placeholder="min 8 digits" />
          </div>
          <div className="signup__form__div">
            <label>Comfirm password</label>
            <input
              ref={confirmPassword}
              type="password"
              placeholder="re enter password"
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Signup
          </button>
          <p className="signup__message">
            <p>Already have an account?</p>
            <Link to="/login" className="forget__password">
              Login
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
};

export default Signup;
