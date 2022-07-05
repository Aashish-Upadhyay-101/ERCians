import React from "react";
import "../styles/Post.css";

const Post = () => {
  return (
    <div className="post">
      <div className="post__header">
        <div className="post__header__left">
          <img
            className="post__profile__picture"
            src="https://i.pravatar.cc/100"
            alt="profile picture"
          />

          <div className="post__header__right__name__time">
            <p className="post__header__right__name">John Doe</p>
            <p className="post__header__right__time">2 hours ago</p>
          </div>
        </div>
        <div className="post__header__right">
          <ion-icon name="reorder-two"></ion-icon>
        </div>
      </div>
      <p className="post__description">This the description of the post</p>
      <img
        className="post__image"
        src="https://i.pravatar.cc/500"
        alt="post image"
      />
      <div className="post__reactions">
        <div className="post__reactions__left">
          <ion-icon id="post__reactions__icon" name="heart-outline"></ion-icon>
          <ion-icon
            id="post__reactions__icon"
            name="chatbubble-outline"
          ></ion-icon>
          <ion-icon
            id="post__reactions__icon"
            name="paper-plane-outline"
          ></ion-icon>
        </div>
        <div className="post__reactions__right">
          <ion-icon
            id="post__reactions__icon"
            name="bookmark-outline"
          ></ion-icon>
        </div>
      </div>

      {/* display comments section here  */}
    </div>
  );
};

export default Post;
