import React from "react";
import TimeAgo from "javascript-time-ago";
import "../styles/Post.css";

import en from "javascript-time-ago/locale/en";
import { useState } from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";

TimeAgo.addDefaultLocale(en);

const timeAgo = new TimeAgo("en-US");

const Post = ({
  auther,
  image,
  description,
  auther_profile_picture,
  created_on,
  likes,
}) => {
  const [like, setLike] = useState(false);
  const user = useSelector((state) => state.user.loggedInUser.data);
  const date = new Date(created_on);
  const created_time = timeAgo.format(date.getTime());

  // const handlePostLoad = () => {
  //   console.log(user.id);
  //   for (let i = 0; i < likes.length; i++) {
  //     if (likes[i].id == user.id) {
  //       setLike(true);
  //     }
  //   }
  // };

  // useEffect(() => {
  //   handlePostLoad();
  // }, []);

  return (
    <div className="post">
      <div className="post__header">
        <div className="post__header__left">
          <img
            className="post__profile__picture"
            src={`http://127.0.0.1:8000` + auther_profile_picture}
            alt="profile picture"
          />

          <div className="post__header__right__name__time">
            <p className="post__header__right__name">{auther}</p>
            <p className="post__header__right__time">{created_time}</p>
          </div>
        </div>
        <div className="post__header__right">
          <ion-icon name="reorder-two"></ion-icon>
        </div>
      </div>
      <p className="post__description">{description}</p>
      {image && <img className="post__image" src={image} alt="post image" />}
      <div className="post__reactions">
        <div>
          <div className="post__reactions__left">
            {like ? (
              <ion-icon
                id="liked"
                name="heart"
                onClick={() => setLike(!like)}
              ></ion-icon>
            ) : (
              <ion-icon
                id="post__reactions__icon"
                name="heart-outline"
                onClick={() => setLike(!like)}
              ></ion-icon>
            )}

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
        <p className="reaction__message">Loved by {likes.length} others</p>
      </div>

      {/* display comments section here  */}
    </div>
  );
};

export default Post;
