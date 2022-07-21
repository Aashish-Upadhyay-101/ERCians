import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import "../styles/Navbar.css";

const Navbar = () => {
  const user_token = useSelector((state) => state.user.token);

  return (
    <nav className="navbar">
      <div></div>
      <ul className="navbar-list">
        <li className="navbar-item">
          <a href="" className="navbar-link">
            <ion-icon name="notifications-outline"></ion-icon>
          </a>
        </li>
        <li className="navbar-item">
          <a href="" className="navbar-link">
            <ion-icon name="chatbubbles-outline"></ion-icon>
          </a>
        </li>
        {user_token === "" ? (
          <li className="navbar-item">
            <Link to="/login" className="navbar-link">
              <p>
                <ion-icon name="bowling-ball-outline"></ion-icon>Login
              </p>
            </Link>
          </li>
        ) : (
          ""
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
