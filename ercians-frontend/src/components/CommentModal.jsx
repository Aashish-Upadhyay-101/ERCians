import React from "react";
import "../styles/CommentModal.css";

const CommentModal = ({ setCommentModalClick }) => {
  return (
    <div className="comment-modal" onClick={() => setCommentModalClick(false)}>
      <span className="Close">X</span>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <img
          className="comment-modal-image"
          src="https://source.unsplash.com/random/800x800/?img=1"
        />
        <div className="modal-right">
          <div className="modal-right-heading">
            <img
              className="modal-right-heading-image"
              src="https://source.unsplash.com/random/800x800/?img=3"
            />
            <p className="modal-right-heading-name">Aashish Upadhyay</p>
          </div>

          <div className="comment-modal-comments">
            <div className="comment">
              <img
                className="modal-right-heading-image"
                src="https://source.unsplash.com/random/800x800/?img=2"
              />

              <div className="comment-right">
                <div className="comment-right-top">
                  <p className="modal-right-heading-name">Aashish Upadhyay</p>
                  <p className="comment-text">
                    Actual comments goes here hahahah and this is awwesome
                    comment
                  </p>
                </div>
                <div className="comment-right-reactions">
                  <span>1h</span>
                  <span>like</span>
                  <span>reply</span>
                </div>
              </div>
            </div>
            <div className="comment">
              <img
                className="modal-right-heading-image"
                src="https://source.unsplash.com/random/800x800/?img=2"
              />

              <div className="comment-right">
                <div className="comment-right-top">
                  <p className="modal-right-heading-name">Aashish Upadhyay</p>
                  <p className="comment-text">
                    Actual comments goes here hahahah and this is awwesome
                    comment
                  </p>
                </div>
                <div className="comment-right-reactions">
                  <span>1h</span>
                  <span>like</span>
                  <span>reply</span>
                </div>
              </div>
            </div>
            <div className="comment">
              <img
                className="modal-right-heading-image"
                src="https://source.unsplash.com/random/800x800/?img=2"
              />

              <div className="comment-right">
                <div className="comment-right-top">
                  <p className="modal-right-heading-name">Aashish Upadhyay</p>
                  <p className="comment-text">
                    Actual comments goes here hahahah and this is awwesome
                    comment
                  </p>
                </div>
                <div className="comment-right-reactions">
                  <span>1h</span>
                  <span>like</span>
                  <span>reply</span>
                </div>
              </div>
            </div>
            <div className="comment">
              <img
                className="modal-right-heading-image"
                src="https://source.unsplash.com/random/800x800/?img=2"
              />

              <div className="comment-right">
                <div className="comment-right-top">
                  <p className="modal-right-heading-name">Aashish Upadhyay</p>
                  <p className="comment-text">
                    Actual comments goes here hahahah and this is awwesome
                    comment
                  </p>
                </div>
                <div className="comment-right-reactions">
                  <span>1h</span>
                  <span>like</span>
                  <span>reply</span>
                </div>
              </div>
            </div>
            <div className="comment">
              <img
                className="modal-right-heading-image"
                src="https://source.unsplash.com/random/800x800/?img=2"
              />

              <div className="comment-right">
                <div className="comment-right-top">
                  <p className="modal-right-heading-name">Aashish Upadhyay</p>
                  <p className="comment-text">
                    Actual comments goes here hahahah and this is awwesome
                    comment
                  </p>
                </div>
                <div className="comment-right-reactions">
                  <span>1h</span>
                  <span>like</span>
                  <span>reply</span>
                </div>
              </div>
            </div>
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
