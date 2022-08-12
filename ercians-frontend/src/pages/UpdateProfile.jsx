import axios from "axios";
import React from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import "../styles/UpdateProfile.css";
import { getCookie } from "../utils/cookieController";

// connect this page with the backend api call is need to be done
// if necessary API endpoint should also be made
const UpdateProfile = () => {
  const user = useSelector((state) => state.user.loggedInUser.data);

  const [userProfileInfo, setUserProfileInfo] = useState({
    name: "",
    location: "",
    bio: "",
  });

  const [userPasswordInfo, setUserPasswordInfo] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });

  const [userProfilePicture, setUserProfilePicture] = useState(null);

  const handleUpdateUserProfileInfo = async (e) => {
    e.preventDefault();
    const data = {
      name: userProfileInfo.name,
      location: userProfileInfo.location,
      bio: userProfileInfo.bio,
    };

    console.log(data);

    try {
      const response = await axios({
        method: "patch",
        url: `http://127.0.0.1:8000/api/profile/${user.id}/update/`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${getCookie("auth_cookie")}`,
        },
        data,
      });
      const data = await response.data;
      console.log(data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleUserPasswordChange = async (e) => {
    e.preventDefault();
    const formdata = {
      old_password: userPasswordInfo.old_password,
      new_password: userPasswordInfo.new_password,
      confirm_password: userPasswordInfo.confirm_password,
    };
    // let formdata = {};
    // formdata["old_password"] = userPasswordInfo.old_password;
    // formdata["new_password"] = userPasswordInfo.new_password;
    // formdata["confirm_password"] = userPasswordInfo.confirm_password;

    console.log(formdata);
    try {
      const response = await axios({
        method: "post",
        url: `http://127.0.0.1:8000/api/profile/${user.id}/update/password/`,
        data: formdata,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${getCookie("auth_token")}`,
        },
      });
      const data = await response.data;
      console.log(data);
    } catch (err) {
      console.log(err.response.data);
    }
  };

  // sending the image to the backend api for profile picture update
  const handleUserProfilePictureUpdate = (e) => {
    e.preventDefault();
    setUserProfilePicture(e.target.files[0]);
  };

  return (
    <div className="update-profile">
      <div className="profile-picture__update">
        <div>
          <p className="profile-picture__update__heading">Profile Picture</p>
          <img src={"http://127.0.0.1:8000" + user.profile_picture} />
          <div className="upload-photo">
            <label htmlFor="upload">
              <div className="btn-small btn-primary">Upload new</div>
            </label>
            <input
              id="upload"
              type="file"
              accept="image/png, image/jpeg"
              onChange={(e) => handleUserProfilePictureUpdate(e)}
            />
          </div>
        </div>
      </div>

      <div className="profile-info__update">
        <form onSubmit={handleUpdateUserProfileInfo}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              className="input-field"
              placeholder={user.name}
              defaultValue={user.name}
              onChange={(e) =>
                setUserProfileInfo({
                  ...userProfileInfo,
                  name: e.target.value,
                })
              }
            />
          </div>
          <div className="form-group">
            <label htmlFor="location">Location</label>
            <input
              type="text"
              id="location"
              className="input-field"
              placeholder={
                user.location ? user.location : "Enter your location"
              }
              defaultValue={user.location}
              onChange={(e) =>
                setUserProfileInfo({
                  ...userProfileInfo,
                  location: e.target.value,
                })
              }
            />
          </div>
          <div className="form-group">
            <label htmlFor="bio">Bio</label>
            <textarea
              id="bio"
              placeholder={user.bio ? user.bio : "Enter your bio..."}
              defaultValue={user.bio}
              onChange={(e) =>
                setUserProfileInfo({
                  ...userProfileInfo,
                  bio: e.target.value,
                })
              }
            ></textarea>
          </div>
          <div className="form-group">
            <button type="submit" className="update-btn btn btn-primary">
              Update
            </button>
          </div>
        </form>
      </div>
      <div className="profile__password__change">
        <h1 className="change__password__heading">Change password</h1>
        <form onSubmit={handleUserPasswordChange}>
          <div className="form-gorup">
            <label htmlFor="old-password">old password</label>
            <input
              type="password"
              id="old-password"
              className="input-field"
              onChange={(e) =>
                setUserPasswordInfo({
                  ...userPasswordInfo,
                  old_password: e.target.value,
                })
              }
              placeholder="old password"
              value={userPasswordInfo.old_password}
            />
          </div>
          <div className="form-gorup">
            <label htmlFor="new-password">new password</label>
            <input
              type="password"
              id="new-password"
              className="input-field"
              onChange={(e) =>
                setUserPasswordInfo({
                  ...userPasswordInfo,
                  new_password: e.target.value,
                })
              }
              placeholder="new password"
              value={userPasswordInfo.new_password}
            />
          </div>
          <div className="form-gorup">
            <label htmlFor="re-new-password">re-new password</label>
            <input
              type="password"
              id="re-new-password"
              className="input-field"
              onChange={(e) =>
                setUserPasswordInfo({
                  ...userPasswordInfo,
                  confirm_password: e.target.value,
                })
              }
              placeholder="re-new password"
              value={userPasswordInfo.confirm_password}
            />
          </div>
          <button type="submit" className="mt btn btn-primary">
            Update password
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateProfile;
