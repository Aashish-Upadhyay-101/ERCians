import React from "react";
import "../styles/Feed.css";
import "../styles/fontawesome.css";
import Post from "./Post";

const Feed = () => {
  return (
    <div className="feed">
      <div className="upload__post">
        <div className="upload__post__top">
          <img src="https://i.pravatar.cc/100" alt="profile image" />
          <input type="text" placeholder="whats on you mind?" />
        </div>

        <div className="upload__post__bottom">
          <span>
            <ion-icon id="video-icon" name="videocam-outline"></ion-icon>
            Live video
          </span>
          <span>
            <ion-icon id="photo-video-icon" name="images-outline"></ion-icon>
            Photo/video
          </span>
          <span>
            <ion-icon id="feeling-icon" name="happy-outline"></ion-icon>
            Feeling/activity
          </span>
        </div>
      </div>

      <Post />
      <Post />
      <Post />
      <Post />
      <Post />
    </div>
  );
};

export default Feed;
