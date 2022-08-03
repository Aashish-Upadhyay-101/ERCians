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

  const navigate = useNavigate(); // react-router-dom to navigate user inside the app

  // submit register form handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    // const auth_token = localStorage.getItem("auth_token");

    // making request in the backend to register new user
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/auth/register/",
        {
          username: username.current.value,
          email: email.current.value,
          password: password.current.value,
        }
      );

      navigate("/login"); // naviate to login screen after registration
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <section className="section-signup">
      <div className="signup">
        <Link to="/">
          <img className="logo" src={Logo} alt="Logo" />
        </Link>
        <h2 className="signup__header">Signup</h2>
        <form onSubmit={handleSubmit}>
          <div className="signup__form__div">
            <label for="username">Username</label>
            <input
              id="username"
              ref={username}
              type="text"
              placeholder="JohnDoe"
            />
          </div>
          <div className="signup__form__div">
            <label for="email">Email</label>
            <input
              id="email"
              ref={email}
              type="email"
              placeholder="JohnDoe@example.com"
            />
          </div>
          <div className="signup__form__div">
            <label for="password">Password</label>
            <input
              id="password"
              ref={password}
              type="password"
              placeholder="min 8 digits"
            />
          </div>
          <div className="signup__form__div">
            <label for="confirmpassword">Comfirm password</label>
            <input
              id="confirmpassword"
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
