import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchAllPosts } from "../store/postSlice";
import "../styles/Feed.css";
import "../styles/fontawesome.css";
import Post from "./Post";
import PostModal from "./PostModal";

const Feed = () => {
  const posts = useSelector((state) => state.posts.posts);
  const dispatch = useDispatch();
  const [modalClick, setModalClick] = useState(false);
  const user = useSelector((state) => {
    if (
      state &&
      state.user &&
      state.user.loggedInUser &&
      state.user.loggedInUser.data
    ) {
      return state.user.loggedInUser.data;
    }
  });

  // might use this for comment fetch as well
  useEffect(() => {
    dispatch(fetchAllPosts());
  }, [modalClick]);

  return (
    <div className="feed">
      {JSON.stringify(user) === "{}" ? (
        ""
      ) : (
        <div className="upload__post" onClick={() => setModalClick(true)}>
          <div className="upload__post__top">
            <img
              src={`http://127.0.0.1:8000${user.profile_picture}`}
              alt="profile imagess"
            />
            <input type="text" placeholder="whats on you mind?" disabled />
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
      )}
      {modalClick && <PostModal setModalClick={setModalClick} />}

      {posts.map((post, index) => (
        <Post
          key={index}
          id={post.id}
          auther={post.auther.username}
          auther_profile_picture={post.auther.profile_picture}
          description={post.description}
          image={post.image}
          created_on={post.created_on}
          likes={post.likes}
          comments={post.comments}
        />
      ))}
    </div>
  );
};

export default Feed;
