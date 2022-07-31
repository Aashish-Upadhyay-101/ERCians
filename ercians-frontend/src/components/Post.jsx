import React, { useEffect, useRef } from "react";
import TimeAgo from "javascript-time-ago";
import "../styles/Post.css";
import Cookies from "universal-cookie";
import en from "javascript-time-ago/locale/en";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { fetchAllPosts } from "../store/postSlice";
import CommentModal from "./CommentModal";

// TimeAgo.addDefaultLocale(en);

// django time to js time in formatable way
const timeAgo = new TimeAgo("en-US");

//cookies
const cookies = new Cookies();

const Post = ({
  id,
  auther,
  image,
  description,
  auther_profile_picture,
  created_on,
  likes,
  comments,
}) => {
  const dispatch = useDispatch();
  const [like, setLike] = useState(false);
  const user = useSelector((state) => state.user.loggedInUser.data);
  const date = new Date(created_on);
  const created_time = timeAgo.format(date.getTime());

  const [commentModalClick, setCommentModalClick] = useState(false);

  // default like in the third post why this is happening?? I think it must be in dispatch function

  // if the user has already liked the post in the past then the 'like' state is set to true for those post
  // so that user can see the 'loved' icon already present in the post
  useEffect(() => {
    // check if the user is present in the likes list
    for (let i = 0; i < likes.length; i++) {
      if (likes[i].id === user.id) {
        setLike(true);
      }
    }
  }, [user]);

  // handling post like
  const handleLike = async () => {
    setLike(!like);

    try {
      // send like request on backend if successfully done then we fetch all the post again to update and re-render the components
      const response = await axios({
        method: "get",
        url: `http://127.0.0.1:8000/api/post/${id}/like/`,
        headers: {
          Authorization: `Token ${cookies.get("auth_token")}`,
        },
      });
      dispatch(fetchAllPosts());
    } catch (err) {
      console.log(err.message);
    }
  };

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
                onClick={() => handleLike()}
              ></ion-icon>
            ) : (
              <ion-icon
                id="post__reactions__icon"
                name="heart-outline"
                onClick={() => handleLike()}
              ></ion-icon>
            )}
            <div
              className="comment-bubble"
              onClick={() => setCommentModalClick(true)}
            >
              <ion-icon
                id="post__reactions__icon"
                name="chatbubble-outline"
              ></ion-icon>
              <span>{comments.length}</span>
            </div>
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
      {commentModalClick && (
        <CommentModal
          post_pk={id}
          comments={comments}
          auther={auther}
          auther_profile_picture={auther_profile_picture}
          image={image}
          description={description}
          setCommentModalClick={setCommentModalClick}
        />
      )}
    </div>
  );
};

export default Post;
