import React from "react";
import "../styles/Signup.css";
import Logo from "../assets/images/ERCians-logo.png";

const Signup = () => {
  return (
    <section className="section-signup">
      <div className="signup">
        <img className="logo" src={Logo} alt="Logo" />
        <h2 className="signup__header">Signup</h2>
        <form>
          <div className="signup__form__div">
            <label>Username</label>
            <input type="text" placeholder="JohnDoe" />
          </div>
          <div className="signup__form__div">
            <label>Email</label>
            <input type="email" placeholder="JohnDoe@example.com" />
          </div>
          <div className="signup__form__div">
            <label>Password</label>
            <input type="password" placeholder="min 8 digits" />
          </div>
          <div className="signup__form__div">
            <label>Comfirm password</label>
            <input type="password" placeholder="re enter password" />
          </div>
          <button type="submit" className="btn btn-primary">
            Signup
          </button>
          <p className="signup__message">
            <p>Already have an account?</p>
            <a href="#" className="forget__password">
              Login
            </a>
          </p>
        </form>
      </div>
    </section>
  );
};

export default Signup;
