import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Cookies from "universal-cookie";
import axios from "axios";
import "../styles/Profile.css";
import { getCookie } from "../utils/cookieController";

const Profile = () => {
  const { id, username } = useParams();
  const token = getCookie("auth_token");

  // hooks
  // fetch user profile and display user's credentials here
  const [userProfile, setUserProfile] = useState({});
  const [friends, setFriends] = useState({ followers: [], followings: [] });

  useEffect(() => {
    console.log(id, username);
    async function fetchUserProfile() {
      const response = await axios({
        method: "get",
        url: `http://127.0.0.1:8000/api/profile/${id}/`,
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      const data = await response.data;
      setUserProfile(data);
      setFriends({ followers: data.followers, followings: data.followings });
    }
    fetchUserProfile();
  }, []);

  return (
    <div className="profile-section">
      <div className="profile">
        <div className="profile__left">
          <img
            className="profile__left__profile__picture"
            src={userProfile.profile_picture}
            alt="profile picture"
          />
        </div>
        <div className="profile__right">
          <p className="profile__right__name">{userProfile.name}</p>
          <div className="profile__right__userinfo">
            <p>
              <strong>{friends.followers.length}</strong> followers
            </p>
            <p>
              <strong>{friends.followings.length}</strong> following
            </p>
            <span className="badge">friends &#10004;</span>
          </div>
          <p className="profile__right__user__bio">{userProfile.bio}</p>
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
