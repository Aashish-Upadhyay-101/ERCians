import React, { useState } from "react";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import "../styles/CommentModal.css";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllPosts } from "../store/postSlice";
import { useEffect } from "react";
import Cookies from "universal-cookie";

// to convert django timezone to local time and uses 'ago' format
TimeAgo.addDefaultLocale(en);
const timeAgo = new TimeAgo("en-US");

// cookies instance
const cookies = new Cookies();

// merging replyCommentBox and Comment componenet together to fix this bug
// login using email and password (the username and password login is by default so now we want to replace that)
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
  all_comments,
  refreshComments,
}) => {
  // converting django timezone to js date object
  const date = new Date(created_on);
  const created_time = timeAgo.format(date.getTime(), "mini");

  const user = useSelector((state) => state.user.loggedInUser.data);
  // react-redux
  const dispatch = useDispatch();

  // component state
  const [isCommentLiked, setIsCommentLiked] = useState(false); // to check if user liked the comment or not
  const [isReplyComment, setIsReplyComment] = useState(false); // to check if a comment is sub-comment or not
  const [subComments, setSubComments] = useState([]);
  const [isSubCommentLiked, setIsSubCommentLiked] = useState(false);
  const [defaultCommentLike, setDefaultCommentLike] = useState(false);
  const [commentReply, setCommentReply] = useState("");
  const [isReplySubmit, setIsReplySubmit] = useState(false);

  // handling side effects
  useEffect(() => {
    console.log(isReplySubmit);
    const replyComment = all_comments.filter(
      (comment, index) => comment.parentComment === id
    );

    setSubComments(replyComment);

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
    refreshComments();
    dispatch(fetchAllPosts()); // fetching all the post after the state change to display updated state in component
  }, [isCommentLiked, isReplySubmit, id]);

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
      setDefaultCommentLike(!defaultCommentLike);
    } catch (err) {
      console.log(err.message);
    }
  };

  const handleSubCommentLike = async (subCommentId) => {
    try {
      /* 
        getting the 'auth_token' cookies and use it inside the headers of the request
        Authorization: `Token ${auth_token}`
      */
      const token = cookies.get("auth_token");
      const response = await axios({
        method: "post",
        url: `http://127.0.0.1:8000/api/comment/${subCommentId}/like/`,
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      setIsSubCommentLiked(!isSubCommentLiked);
    } catch (err) {
      console.log(err.message);
    }
  };

  // updated code this is
  const handleReplyComment = async (e) => {
    e.preventDefault();

    try {
      const token = cookies.get("auth_token"); // getting token and setting in headers
      const response = await axios({
        method: "post",
        url: `http://127.0.0.1:8000/api/post/${post_pk}/comment/${id}/reply-comment/`,
        headers: {
          Authorization: `Token ${token}`,
        },
        data: {
          comment: commentReply,
        },
      });
      setIsReplySubmit(!isReplySubmit);
      setCommentReply("");
    } catch (err) {
      console.log(err.message);
    }
    dispatch(fetchAllPosts());
    refreshComments();
  };

  // rendering the UI
  return (
    <div className="super-comment">
      {/* recently updated code this is */}
      <div className="comment">
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
              <span
                className={defaultCommentLike ? "comment_liked" : ""}
                onClick={handleLike}
              >
                {likes} likes
              </span>
              {/* <span onClick={() => setIsReplyComment(!isReplyComment)}>
                reply
              </span> */}
            </div>
          </div>
        </div>
      </div>
      {/* display subcomment here  */}
      {subComments.map((subComment, index) => {
        return (
          <SubComment
            key={index}
            post_pk={post_pk}
            id={subComment.id}
            auther={subComment.auther}
            profile_picture={subComment.profile_picture}
            comment={subComment.comment}
            likes={subComment.likes}
            created_on={subComment.created_on}
            handleSubCommentLike={handleSubCommentLike}
          />
        );
      })}

      {isReplyComment && (
        <div className="reply-comment">
          <form className="reply-post-comment" onSubmit={handleReplyComment}>
            <input
              className="reply-comment-input"
              type="text"
              placeholder="write a reply..."
              autoFocus
              value={commentReply}
              onChange={(e) => setCommentReply(e.target.value)}
            />
            <button className="reply-post-comment-btn" type="submit">
              Post
            </button>
          </form>
        </div>
      )}
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
  const [isCommentPosted, setIsCommentPosted] = useState(false); // to re-render the component (used in useEffect() function)

  const dispatch = useDispatch();

  // fetching all the post when user posted the comment ( it also fetch all the comments )
  useEffect(() => {
    dispatch(fetchAllPosts());
    // console.log("hello");
  }, []);

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

// this box get prompt when someone click on reply comment
// const ReplyCommentBox = ({ post_pk, comment_pk, handleReply }) => {
//   const dispatch = useDispatch();
//   const [comment, setComment] = useState("");
//   const [isReplySubmit, setIsReplySubmit] = useState(false);

//   const handleReplyComment = async (e) => {
// e.preventDefault();

// try {
//   const token = cookies.get("auth_token"); // getting token and setting in headers
//   const response = await axios({
//     method: "post",
//     url: `http://127.0.0.1:8000/api/post/${post_pk}/comment/${comment_pk}/reply-comment/`,
//     headers: {
//       Authorization: `Token ${token}`,
//     },
//     data: {
//       comment: comment,
//     },
//   });
//   setComment("");
//   setIsReplySubmit(true);
//   handleReply(); // updated
// } catch (err) {
//   console.log(err.message);
// }
// dispatch(fetchAllPosts());
//   };

// return (
//   <div className="reply-comment">
//     <form className="reply-post-comment" onSubmit={handleReplyComment}>
//       <input
//         className="reply-comment-input"
//         type="text"
//         placeholder="write a reply..."
//         autoFocus
//         value={comment}
//         onChange={(e) => setComment(e.target.value)}
//       />
//       <button className="reply-post-comment-btn" type="submit">
//         Post
//       </button>
//     </form>
//   </div>
// );
// };

export default CommentModal;

const SubComment = ({
  post_pk,
  id,
  auther,
  profile_picture,
  comment,
  likes,
  created_on,
  handleSubCommentLike,
}) => {
  // converting django timezone to js date object
  const date = new Date(created_on);
  const created_time = timeAgo.format(date.getTime(), "mini");

  // react-redux
  const dispatch = useDispatch();

  // component state
  const [isLike, setIsLike] = useState(false);
  // const [isCommentLiked, setIsCommentLiked] = useState(false); // to check if user liked the comment or not
  // const [isReplyComment, setIsReplyComment] = useState(false); // to check if a comment is sub-comment or not

  // handling side effects
  // useEffect(() => {
  //   dispatch(fetchAllPosts()); // fetching all the post after the state change to display updated state in component
  //   console.log("this is re-rendering");
  // }, [isLike]);

  // handle like event when user like the comment
  const handleLike = async (subCommentId) => {
    await handleSubCommentLike(subCommentId);
  };

  // rendering the UI
  return (
    <div className="super-comment">
      {/* recently updated code this is */}
      <div className="margin-left comment">
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
              {/* <span onClick={() => handleLike(id)}>{likes} likes</span> */}
            </div>
          </div>
        </div>
      </div>

      {/* {isReplyComment && <ReplyCommentBox comment_pk={id} post_pk={post_pk} />} */}
    </div>
  );
};
