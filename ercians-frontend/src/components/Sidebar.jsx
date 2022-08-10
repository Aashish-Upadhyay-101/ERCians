import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { logout } from "../store/userSlice";
import ERCiansLogo from "../assets/images/ERCians-logo.png";
import "../styles/Sidebar.css";
import "../styles/fontawesome.css";
import axios from "axios";
import Cookies from "universal-cookie";
import { getCookie } from "../utils/cookieController";

const cookies = new Cookies();

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // logout request in backend
      const token = getCookie("auth_token");
      const response = await axios({
        method: "post",
        url: "http://127.0.0.1:8000/api/auth/logout/",
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      dispatch(logout()); // logout the user when logout is clicked
      navigate("/login");
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <aside className="aside">
      <Link to="/">
        <img className="logo" src={ERCiansLogo} alt="logo" />
      </Link>

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
            <Link to="/profile/update" className="side__navigation__nav__link">
              <ion-icon name="person"></ion-icon>Profile
            </Link>
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
          <li className="side__navigation__nav__items" onClick={handleLogout}>
            <Link to="/" className="side__navigation__nav__link">
              <ion-icon name="log-out-outline"></ion-icon>Logout
            </Link>
          </li>
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
