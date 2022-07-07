import React from "react";
import "../styles/Navbar.css";

const Navbar = () => {
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
        <li className="navbar-item">
          <a href="" className="navbar-link">
            <p>
              <ion-icon name="bowling-ball-outline"></ion-icon>Login
            </p>
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
