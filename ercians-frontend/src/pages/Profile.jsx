import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Cookies from "universal-cookie";
import axios from "axios";
import "../styles/Profile.css";
import { getCookie } from "../utils/cookieController";
import { useSelector } from "react-redux";

// follow and unfollow user system glitched fixing work
const Profile = () => {
  const { id } = useParams();
  const token = getCookie("auth_token");
  const user = useSelector((state) => state.user.loggedInUser.data);

  // hooks
  // fetch user profile and display user's credentials here

  // update backend code, addlikeAPIView same for add and remove followers from user\s's team"

  const [userProfile, setUserProfile] = useState({});
  const [follow, setFollow] = useState(false);
  const [unfollow, setUnFollow] = useState(false);
  const [isUserFollowed, setIsUserFollowed] = useState(false);
  const [friends, setFriends] = useState({ followers: [], followings: [] });

  const handleFollow = async () => {
    try {
      // api backend call
      const response = await axios({
        url: `http://127.0.0.1:8000/api/profile/${id}/follow/`,
        method: "POST",
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      setFollow(true);
      setUnFollow(false);
      setIsUserFollowed(!isUserFollowed);
    } catch (err) {
      console.log(err.response.data.message);
    }
  };

  const handleUnFollow = async () => {
    try {
      // api backend call
      const response = await axios({
        url: `http://127.0.0.1:8000/api/profile/${id}/unfollow/`,
        method: "POST",
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      setUnFollow(true);
      setFollow(false);
      setIsUserFollowed(!isUserFollowed);
    } catch (err) {
      console.log(err.response.data.message);
    }
  };

  async function fetchUser() {
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

    // this works yesss (default unfollow/follow state on page load)
    for (let follower in data.followers) {
      if (follower.id == user.id) {
        setIsUserFollowed(true);
      }
    }
  }

  useEffect(() => {
    fetchUser();
  }, [follow, unfollow, isUserFollowed]);

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
      {id != user.id && (
        <div className="profile__footer">
          {isUserFollowed ? (
            <button
              className="btn-small btn-primary-outline"
              onClick={handleUnFollow}
            >
              Unfollow
            </button>
          ) : (
            <button
              className="btn-small btn-primary-outline"
              onClick={handleFollow}
            >
              Follow
            </button>
          )}
          {/* <Link to="/message">
            <button className="btn-small btn-primary">message</button>
          </Link> */}
        </div>
      )}

      <h2 className="profile__pins">
        <ion-icon name="pin-outline"></ion-icon> Pins
      </h2>
    </div>
  );
};

export default Profile;
