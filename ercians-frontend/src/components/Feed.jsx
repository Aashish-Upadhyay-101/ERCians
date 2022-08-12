import axios from "axios";
import React, { useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { fetchAllPosts } from "../store/postSlice";
import "../styles/Feed.css";
import "../styles/fontawesome.css";
import Post from "./Post";
import PostModal from "./PostModal";

// main feed page where all the posts are displayed
const Feed = () => {
  const posts = useSelector((state) => state.posts.posts); // getting all the post from redux store
  const dispatch = useDispatch();
  const [modalClick, setModalClick] = useState(false); // post modal
  const [refresh, setRefresh] = useState(false);
  const [, updateState] = useState();
  const forceUpdate = useCallback(() => updateState({}), []);

  // getting currently logged in user data stored in redux store
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

  // fetch all the post when user posts new post
  // responsible for updating and re-rendering the feed componenet everytime user posts new post
  useEffect(() => {
    dispatch(fetchAllPosts());
  }, [modalClick, refresh]);

  const refreshComments = () => {
    setRefresh(!refresh);
    forceUpdate();
    // dispatch(fetchAllPosts());
    console.log("from feed");
  };

  return (
    // only display the upload section if the user is logged in
    <div className="feed">
      {JSON.stringify(user) === "{}" ? (
        ""
      ) : (
        <>
          <div className="user__search">
            <ion-icon name="search-outline"></ion-icon>
            <input type="text" placeholder="search ERCians" />
          </div>
          <div className="upload__post" onClick={() => setModalClick(true)}>
            <div className="upload__post__top">
              <Link to={`/profile/${user.id}/${user.name}`}>
                <img
                  src={`http://127.0.0.1:8000${user.profile_picture}`}
                  alt="profile imagess"
                />
              </Link>
              <input type="text" placeholder="whats on you mind?" disabled />
            </div>

            <div className="upload__post__bottom">
              <span>
                <ion-icon id="video-icon" name="videocam-outline"></ion-icon>
                Live video
              </span>
              <span>
                <ion-icon
                  id="photo-video-icon"
                  name="images-outline"
                ></ion-icon>
                Photo/video
              </span>
              <span>
                <ion-icon id="feeling-icon" name="happy-outline"></ion-icon>
                Feeling/activity
              </span>
            </div>
          </div>
        </>
      )}
      {/* to pop up the post modal  */}
      {modalClick && <PostModal setModalClick={setModalClick} />}

      {/* rendering the </Post> component and passing the necessary props  */}
      {posts.map((post, index) => (
        <Post
          key={index}
          id={post.id}
          auther={post.auther.username}
          auther_id={post.auther.id}
          auther_profile_picture={post.auther.profile_picture}
          description={post.description}
          image={post.image}
          created_on={post.created_on}
          likes={post.likes}
          comments={post.comments}
          refreshComments={refreshComments}
        />
      ))}
    </div>
  );
};

export default Feed;
