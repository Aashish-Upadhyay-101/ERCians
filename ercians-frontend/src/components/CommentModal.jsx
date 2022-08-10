import React, { useState } from "react";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import "../styles/CommentModal.css";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllPosts } from "../store/postSlice";
import { useEffect } from "react";
import Cookies from "universal-cookie";
import { getCookie } from "../utils/cookieController";

// to convert django timezone to local time and uses 'ago' format
TimeAgo.addDefaultLocale(en);
const timeAgo = new TimeAgo("en-US");

// cookies instance
const cookies = new Cookies();

// login using email and password (the username and password login is by default so now we want to replace that)
// username already taken error

// profile visit and profile picture update update
// follow and unfollow user
// displaying only the relivent post (i.e. only the post of the user that he/she has followed)

// if possible also try to add test case for automated testing

// notifications -> lets consider this one
// messaging system

// -> notification / messaging / video calling messanger app  names ERCiansTalk

// react toastify for error handle pop ups

/*
  this is where the actual comment is displayed
  this component takes the props from </CommentModal> component
*/
const Comment = ({
  post_pk,
  id,
  auther,
  profile_picture,
  comment,
  likes,
  created_on,
}) => {
  // converting django timezone to js date object
  const date = new Date(created_on);
  const created_time = timeAgo.format(date.getTime(), "mini");
  const user = useSelector((state) => state.user.loggedInUser.data);

  // react-redux
  const dispatch = useDispatch();

  // component state
  const [isCommentLiked, setIsCommentLiked] = useState(false); // to check if user liked the comment or not
  const [defaultCommentLike, setDefaultCommentLike] = useState(false);

  // handling side effects
  useEffect(() => {
    async function fetchComment() {
      try {
        const response = await axios({
          method: "get",
          url: `http://127.0.0.1:8000/api/comments/${id}/`,
        });

        const data = await response.data.data;
        // console.log(data.likes);

        for (let like of data.likes) {
          if (user.id === like.id) {
            setDefaultCommentLike(true);
          } else {
            setDefaultCommentLike(false);
          }
        }
      } catch (err) {
        console.log(err.message);
      }
    }
    fetchComment();
    dispatch(fetchAllPosts()); // fetching all the post after the state change to display updated state in component
  }, [isCommentLiked]);

  // handle like event when user like the comment
  const handleLike = async () => {
    try {
      /*
        getting the 'auth_token' cookies and use it inside the headers of the request
        Authorization: `Token ${auth_token}`
      */
      const token = getCookie("auth_token");
      const response = await axios({
        method: "post",
        url: `http://127.0.0.1:8000/api/comment/${id}/like/`,
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      setIsCommentLiked(!isCommentLiked); // updating comment like state
      setDefaultCommentLike(!defaultCommentLike);
    } catch (err) {
      console.log(err.message);
    }
  };

  // rendering the UI
  return (
    <div className="super-comment">
      {/* recently updated code this is */}
      <div className="comment">
        <img
          className="modal-right-heading-image"
          src={`http://127.0.0.1:8000` + profile_picture}
          alt="display"
        />
        <div className="comment-right-elements">
          <div className="comment-right">
            <div className="comment-right-top">
              <p className="modal-right-heading-name">{auther}</p>
              <p className="comment-text">{comment}</p>
            </div>
            <div className="comment-right-reactions">
              <span>{created_time}</span>
              <span
                className={defaultCommentLike ? "comment_liked" : ""}
                onClick={handleLike}
              >
                {likes} likes
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/*
 * CommentModal when clicked on comment icon this get prompted
 * Contains actual post on left and comments section on the right side
 * Contains <Comment /> as a child component where props get passed and displayed comment in list
 */
const CommentModal = ({
  setCommentModalClick,
  auther,
  auther_profile_picture,
  comments,
  image,
  description,
  post_pk,
  refreshComments,
}) => {
  const [comment, setComment] = useState(""); // comment input box state

  const dispatch = useDispatch();

  // fetching all the post when user posted the comment ( it also fetch all the comments )
  useEffect(() => {
    dispatch(fetchAllPosts());
    // console.log("hello");
  }, []);

  // handling comment form submission
  const commentSubmitHandler = async (e) => {
    e.preventDefault();
    // setIsCommentPosted(true);
    try {
      /*
        getting the 'auth_token' cookies and use it inside the headers of the request
        Authorization: `Token ${auth_token}`
      */
      const token = getCookie("auth_token");
      const response = await axios({
        method: "post",
        url: `http://127.0.0.1:8000/api/post/${post_pk}/comment/`,
        headers: {
          Authorization: `Token ${token}`,
        },
        data: {
          comment: comment, // comment state data send in post request
        },
      });
      setComment("");
    } catch (err) {
      console.log(err.message);
    }
    dispatch(fetchAllPosts());
  };

  // rendering the UI
  return (
    // Creating your own custom modal and stoped the bubbling of event in js using e.stopPropagation()
    <div className="comment-modal" onClick={() => setCommentModalClick(false)}>
      <span className="Close">X</span>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        {/* if no image then display text of the post else display the actual post */}
        {!image && (
          <div className="comment-modal-image">
            <p
              style={{
                width: "100%",
                height: "100%",
                fontSize: "2rem",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "purple",
                color: "#fff",
                fontWeight: "500",
              }}
            >
              {description}
            </p>
          </div>
        )}

        <div className="iamge-div">
          {image && (
            <img
              className="comment-modal-image"
              src={image}
              alt="post pics on the right side"
            />
          )}
        </div>
        <div className="modal-right">
          <div className="modal-right-heading">
            <img
              className="modal-right-heading-image"
              src={`http://127.0.0.1:8000` + auther_profile_picture}
              alt="profile pic"
            />
            <p className="modal-right-heading-name">{auther}</p>
          </div>

          {/* if there is comments on post then display else display placeholder saying no comments yet...  */}
          {comments.length > 0 ? (
            <div className="comment-modal-comments">
              {comments.map((comment, index) => {
                return !comment.isReplyComment ? (
                  <Comment
                    key={index}
                    id={comment.id}
                    post_pk={post_pk}
                    auther={comment.auther}
                    profile_picture={comment.profile_picture}
                    comment={comment.comment}
                    created_on={comment.created_on}
                    likes={comment.likes}
                    isReply={comment.isReplyComment}
                    all_comments={comments}
                    refreshComments={refreshComments}
                  />
                ) : null;
              })}
            </div>
          ) : (
            <div className="comment-modal-comments">
              <div className="comment">
                <p style={{ verticalAlign: "middle", fontSize: "2rem" }}>
                  No comments yet...
                </p>
              </div>
            </div>
          )}
          {/* post a comment here  */}
          <form className="post-comment" onSubmit={commentSubmitHandler}>
            <input
              className="post-comment-input"
              type="text"
              placeholder="write a comment..."
              autoFocus
              onChange={(e) => setComment(e.target.value)}
              value={comment}
            />
            <button className="post-comment-btn" type="submit">
              Post
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CommentModal;
