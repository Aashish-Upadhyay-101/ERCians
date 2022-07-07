import React from "react";
import ERCiansLogo from "../assets/images/ERCians-logo.png";
import "../styles/Sidebar.css";
import "../styles/fontawesome.css";

const Sidebar = () => {
  return (
    <aside className="aside">
      <img className="logo" src={ERCiansLogo} alt="logo" />

      <div className="side__navigation">
        <h4 className="side__navigation__header">Menu</h4>
        <ul className="side__navigation__nav__list">
          <li className="side__navigation__nav__items">
            <a
              href="#"
              className="side__navigation__nav__link side__navigation__active"
            >
              <ion-icon name="home"></ion-icon>Home
            </a>
          </li>
          <li className="side__navigation__nav__items">
            <a href="#" className="side__navigation__nav__link">
              <ion-icon name="chatbubble-ellipses"></ion-icon>Messages
            </a>
          </li>
          <li className="side__navigation__nav__items">
            <a href="#" className="side__navigation__nav__link">
              <ion-icon name="person"></ion-icon>Profile
            </a>
          </li>
          <li className="side__navigation__nav__items">
            <a href="#" className="side__navigation__nav__link">
              <ion-icon name="bookmark"></ion-icon>Saved Post
            </a>
          </li>
          <li className="side__navigation__nav__items">
            <a href="#" className="side__navigation__nav__link">
              <ion-icon name="cog"></ion-icon>Settings
            </a>
          </li>
          <li className="side__navigation__nav__items">
            <a href="#" className="side__navigation__nav__link">
              <ion-icon name="log-out-outline"></ion-icon>Logout
            </a>
          </li>
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
