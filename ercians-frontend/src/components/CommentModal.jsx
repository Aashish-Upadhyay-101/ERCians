import React, { useState } from "react";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import "../styles/CommentModal.css";
import axios from "axios";
import { useDispatch } from "react-redux";
import { fetchAllPosts } from "../store/postSlice";
import { useEffect } from "react";
import Cookies from "universal-cookie";

TimeAgo.addDefaultLocale(en);

const timeAgo = new TimeAgo("en-US");
const cookies = new Cookies();

// comment ma  reply,
// post ma photo haru halna milni system
// profile visit and profile picture update update

const Comment = ({
  id,
  auther,
  profile_picture,
  comment,
  likes,
  created_on,
}) => {
  const date = new Date(created_on);
  const created_time = timeAgo.format(date.getTime(), "mini");
  const dispatch = useDispatch();
  const [isCommentLiked, setIsCommentLiked] = useState(false);
  const [isReplyComment, setIsReplyComment] = useState(false);

  useEffect(() => {
    dispatch(fetchAllPosts());
  }, [comment, isCommentLiked]);

  const handleLike = async () => {
    try {
      const token = cookies.get("auth_token");
      const response = await axios({
        method: "post",
        url: `http://127.0.0.1:8000/api/comment/${id}/like/`,
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      setIsCommentLiked(!isCommentLiked);
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <div className="super-comment">
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
              <span onClick={handleLike}>{likes} likes</span>
              <span onClick={() => setIsReplyComment(!isReplyComment)}>
                reply
              </span>
            </div>
          </div>
        </div>
      </div>
      {isReplyComment && <ReplyCommentBox />}
    </div>
  );
};

const CommentModal = ({
  setCommentModalClick,
  auther,
  auther_profile_picture,
  comments,
  image,
  description,
  post_pk,
}) => {
  const [comment, setComment] = useState("");
  const [isCommentPosted, setIsCommentPosted] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAllPosts());
  }, [isCommentPosted]);

  const commentSubmitHandler = async (e) => {
    e.preventDefault();
    setIsCommentPosted(true);
    try {
      const token = cookies.get("auth_token");
      const response = await axios({
        method: "post",
        url: `http://127.0.0.1:8000/api/post/${post_pk}/comment/`,
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
    <div className="comment-modal" onClick={() => setCommentModalClick(false)}>
      <span className="Close">X</span>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
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

          {comments.length > 0 ? (
            <div className="comment-modal-comments">
              {comments.map((comment, index) => {
                return (
                  <Comment
                    key={index}
                    id={comment.id}
                    auther={comment.auther}
                    profile_picture={comment.profile_picture}
                    comment={comment.comment}
                    created_on={comment.created_on}
                    likes={comment.likes}
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

const ReplyCommentBox = () => {
  return (
    <div className="reply-comment">
      <form className="reply-post-comment">
        <input
          className="reply-comment-input"
          type="text"
          placeholder="write a comment..."
          autoFocus
        />
        <button className="reply-post-comment-btn" type="submit">
          Post
        </button>
      </form>
    </div>
  );
};

export default CommentModal;
