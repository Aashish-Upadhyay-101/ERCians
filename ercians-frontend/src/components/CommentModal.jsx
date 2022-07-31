import React, { useState } from "react";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import "../styles/CommentModal.css";
import axios from "axios";
import { useDispatch } from "react-redux";
import { fetchAllPosts } from "../store/postSlice";
import { useEffect } from "react";
import Cookies from "universal-cookie";

// to convert django timezone to local time and uses 'ago' format
TimeAgo.addDefaultLocale(en);
const timeAgo = new TimeAgo("en-US");

// cookies instance
const cookies = new Cookies();

// comment ma  reply, ( sub comment fetch garera modal ma display garna baki xa tyo voli garxu aba teso vae )
// reply gareko comment lai fetch garera respective comments of tala display garaunu pani parxa
// post ma photo haru halna milni system
// profile visit and profile picture update update
// follow and unfollow user
// displaying only the relivent post (i.e. only the post of the user that he/she has followed)
// shares and hashtags
// notifications
// messaging system
// video call system

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
  isReply,
}) => {
  // converting django timezone to js date object
  const date = new Date(created_on);
  const created_time = timeAgo.format(date.getTime(), "mini");

  // react-redux
  const dispatch = useDispatch();

  // component state
  const [isCommentLiked, setIsCommentLiked] = useState(false); // to check if user liked the comment or not
  const [isReplyComment, setIsReplyComment] = useState(false); // to check if a comment is sub-comment or not

  // handling side effects
  useEffect(() => {
    dispatch(fetchAllPosts()); // fetching all the post after the state change to display updated state in component

    // fetch all the sub comment of comment and display here
    // async function fetchALlSubComments() {
    //   const response = await axios({
    //     method: "get",
    //     url: `http://127.0.0.1:8000/api/post/${post_pk}/comment/${comment_pk}/all-sub-comments/`,
    //   });
    // }
  }, [comment, isCommentLiked]);

  // handle like event when user like the comment
  const handleLike = async () => {
    try {
      /* 
        getting the 'auth_token' cookies and use it inside the headers of the request
        Authorization: `Token ${auth_token}`
      */
      const token = cookies.get("auth_token");
      const response = await axios({
        method: "post",
        url: `http://127.0.0.1:8000/api/comment/${id}/like/`,
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      setIsCommentLiked(!isCommentLiked); // updating comment like state
    } catch (err) {
      console.log(err.message);
    }
  };

  // rendering the UI
  return (
    <div className="super-comment">
      {/* recently updated code this is */}
      <div className={isReply ? "comment margin-left" : "comment"}>
        <img
          className="modal-right-heading-image"
          src={`http://127.0.0.1:8000` + profile_picture}
        />
        <div className="comment-right-elements">
          <div className="comment-right">
            <div className="comment-right-top">
              <p className="modal-right-heading-name">{auther}</p>
              <p className="comment-text">{comment}</p>
            </div>
            <div className="comment-right-reactions">
              <span>{created_time}</span>
              <span onClick={handleLike}>{likes} likes</span>
              <span onClick={() => setIsReplyComment(!isReplyComment)}>
                reply
              </span>
            </div>
          </div>
        </div>
      </div>
      {isReplyComment && <ReplyCommentBox comment_pk={id} post_pk={post_pk} />}
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
}) => {
  const [comment, setComment] = useState(""); // comment input box state
  const [isCommentPosted, setIsCommentPosted] = useState(false); // to re-render the component (used in useEffect() function)

  const dispatch = useDispatch();

  // fetching all the post when user posted the comment ( it also fetch all the comments )
  useEffect(() => {
    dispatch(fetchAllPosts());
  }, [isCommentPosted]);

  // handling comment form submission
  const commentSubmitHandler = async (e) => {
    e.preventDefault();
    setIsCommentPosted(true);
    try {
      /* 
        getting the 'auth_token' cookies and use it inside the headers of the request
        Authorization: `Token ${auth_token}`
      */
      const token = cookies.get("auth_token");
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
          <img className="comment-modal-image" src={image} />
        </div>
        <div className="modal-right">
          <div className="modal-right-heading">
            <img
              className="modal-right-heading-image"
              src={`http://127.0.0.1:8000` + auther_profile_picture}
            />
            <p className="modal-right-heading-name">{auther}</p>
          </div>

          {/* if there is comments on post then display else display placeholder saying no comments yet...  */}
          {comments.length > 0 ? (
            <div className="comment-modal-comments">
              {comments.map((comment, index) => {
                return (
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
                  />
                );
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

// this box get prompt when someone click on reply comment
const ReplyCommentBox = ({ post_pk, comment_pk }) => {
  const [comment, setComment] = useState("");

  const handleReplyComment = async (e) => {
    e.preventDefault();

    try {
      const token = cookies.get("auth_token"); // getting token and setting in headers
      const response = await axios({
        method: "post",
        url: `http://127.0.0.1:8000/api/post/${post_pk}/comment/${comment_pk}/reply-comment/`,
        headers: {
          Authorization: `Token ${token}`,
        },
        data: {
          comment: comment,
        },
      });
      setComment("");
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <div className="reply-comment">
      <form className="reply-post-comment" onSubmit={handleReplyComment}>
        <input
          className="reply-comment-input"
          type="text"
          placeholder="write a comment..."
          autoFocus
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <button className="reply-post-comment-btn" type="submit">
          Post
        </button>
      </form>
    </div>
  );
};

export default CommentModal;
