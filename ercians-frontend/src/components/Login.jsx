import React from "react";
import "../styles/Login.css";
import Logo from "../assets/images/ERCians-logo.png";

const Login = () => {
  return (
    <section className="section-login">
      <div className="login">
        <img className="logo" src={Logo} alt="Logo" />
        <h2 className="login__header">Login</h2>
        <form>
          <div className="login__form__div">
            <label>Email</label>
            <input type="email" placeholder="JohnDoe@example.com" />
          </div>
          <div className="login__form__div">
            <label>Password</label>
            <input type="password" placeholder="min 8 digits" />
          </div>
          <a href="#" className="forget__password">
            Forget password?
          </a>
          <button type="submit" className="btn btn-primary">
            Login
          </button>
          <p className="login__message">
            <p>Don't have an account?</p>
            <a href="#" className="forget__password">
              Create here
            </a>
          </p>
        </form>
      </div>
    </section>
  );
};

export default Login;
