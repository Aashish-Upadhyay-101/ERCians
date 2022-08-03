import React from "react";
import { Link } from "react-router-dom";
import "../styles/Profile.css";

const Profile = () => {
  return (
    <div className="profile-section">
      <div className="profile">
        <div className="profile__left">
          <img
            className="profile__left__profile__picture"
            src="https://source.unsplash.com/random"
            alt="profile picture"
          />
        </div>
        <div className="profile__right">
          <p className="profile__right__name">Aashish Upadhyay</p>
          <div className="profile__right__userinfo">
            <p>
              <strong>23</strong> followers
            </p>
            <p>
              <strong>27</strong> following
            </p>
            <span className="badge">friends &#10004;</span>
          </div>
          <p className="profile__right__user__bio">Software Engineer @IBm</p>
        </div>
      </div>
      <div className="profile__footer">
        <button className="btn-small btn-primary-outline">Follow</button>
        <Link to="/message">
          <button className="btn-small btn-primary">message</button>
        </Link>
      </div>

      <h2 className="profile__pins">
        <ion-icon name="pin-outline"></ion-icon> Pins
      </h2>
    </div>
  );
};

export default Profile;
