import React from "react";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import "../styles/CommentModal.css";

TimeAgo.addDefaultLocale(en);

const timeAgo = new TimeAgo("en-US");

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

  return (
    <div className="comment">
      <img
        className="modal-right-heading-image"
        src={`http://127.0.0.1:8000` + profile_picture}
      />

      <div className="comment-right">
        <div className="comment-right-top">
          <p className="modal-right-heading-name">{auther}</p>
          <p className="comment-text">{comment}</p>
        </div>
        <div className="comment-right-reactions">
          <span>{created_time}</span>
          <span>{likes} likes</span>
          <span>reply</span>
        </div>
      </div>
    </div>
  );
};

const CommentModal = ({
  setCommentModalClick,
  auther,
  auther_profile_picture,
  comments,
  image,
}) => {
  return (
    <div className="comment-modal" onClick={() => setCommentModalClick(false)}>
      <span className="Close">X</span>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        {/* <div className="comment-modal-image"></div> */}
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
          {/* post a comment here  */}
          <div className="post-comment">
            <input type="text" placeholder="write a comment..." autoFocus />
            <button>Post</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentModal;
