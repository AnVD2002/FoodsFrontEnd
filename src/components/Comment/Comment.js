import React from "react";
import "./Comment.css";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";

const Comment = ({
  comment,
  replies,
  deleteComment,
  replyComment,
  getReplies,
}) => {
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [userID, setUserID] = useState(null);
  const getUserIDFromToken = () => {
    const token = Cookies.get("accessToken");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        return decodedToken.sub;
      } catch (error) {
        console.error("Error decoding token:", error);
        return null;
      }
    } else {
      console.error("No token found");
      return null;
    }
  };
  const handleReplyChange = (e) => {
    setReplyText(e.target.value);
  };

  const submitReply = () => {
    replyComment(replyText, comment.commentID);
    setReplyText("");
    setShowReplyInput(false);
  };

  const userName = getUserIDFromToken();

  useEffect(() => {
    const getUserID = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/v1/account/getUserID`,
          {
            params: { username: userName },
          }
        );
        setUserID(response.data.body);
        console.log(response.data.body);
      } catch (error) {
        console.error("Error fetching user ID:", error);
      }
    };

    getUserID();
  }, [userName]);

  const userNumberID = Number(userID);
  const canReply = Boolean(userID);
  const canEdit = userNumberID === comment.userID;
  const canDelete = userNumberID === comment.userID;

  return (
    <div className="comment">
      <div className="comment-image-container">
        <img src={`${process.env.PUBLIC_URL}/assets/user.png`} alt="" />
      </div>
      <div className="comment-right-part">
        <div className="comment-content">
          <div className="comment-author">{comment.userName}</div>
          <div>{comment.createAt}</div>
        </div>
        <div className="comment-text">{comment.content}</div>
        <div className="comment-actions">
          {canReply ? (
            <div
              className="comment-action"
              onClick={() => setShowReplyInput(!showReplyInput)}
            >
              Reply
            </div>
          ) : (
            <div></div>
          )}
          {canEdit ? <div className="comment-action">Edit</div> : <div></div>}
          {canDelete && (
            <div
              className="comment-action"
              onClick={() => deleteComment(comment.commentID)}
            >
              Delete
            </div>
          )}
        </div>
        {showReplyInput && (
          <div className="reply-input-section">
            <input
              type="text"
              value={replyText}
              onChange={handleReplyChange}
              placeholder="Write a reply..."
              className="reply-input"
            />
            <button onClick={submitReply} className="reply-button">
              Submit
            </button>
          </div>
        )}

        {replies.length > 0 ? (
          <div className="replies">
            {replies.map((reply) => (
              <Comment
                comment={reply}
                key={reply.commentID}
                replies={getReplies(reply.commentID)}
                deleteComment={deleteComment}
                replyComment={replyComment}
                getReplies={getReplies}
              ></Comment>
            ))}
          </div>
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
};

export default Comment;
