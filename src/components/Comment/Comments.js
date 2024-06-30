import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import Comment from "./Comment";
import axios from "axios";
import CommentForm from "./CommentForm";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import "./Comments.css";

const Comments = ({ foodID }) => {
  const [comments, setComments] = useState([]);

  const numFoodID = Number(foodID);
  const getUserNameFromToken = () => {
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
  const name = getUserNameFromToken();

  useEffect(() => {
    const fetchAllCommentByFoodID = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/v1/food/commentResponseByFoodID?foodID=${numFoodID}`
        );
        setComments(response.data);
        console.log(response.data);
      } catch (error) {
        console.log("errror:", error);
      }
    };

    if (numFoodID) {
      fetchAllCommentByFoodID();
    }
  }, [numFoodID]);

  const getReplies = (commentID) => {
    const replies = comments.filter(
      (comment) => comment.parentID === commentID
    );
    replies.sort(
      (a, b) => new Date(a.createAt).getTime() - new Date(b.createAt).getTime()
    );
    return replies;
  };

  const rootComments = comments.filter((comment) => comment.parentID === 0);
  const addComment = async (text, rating) => {
    try {
      const data = {
        userName: name,
        foodID: numFoodID,
        content: text,
        rating: rating,
      };
      const response = await axios.post(
        "http://localhost:8080/api/v1/food/comment",
        data
      );
      setComments([response.data.body, ...comments]);
    } catch (error) {
      console.error("Failed to add comment:", error);
    }
  };

  const deleteComment = async (commentID) => {
    try {
      const response = await axios.delete(
        `http://localhost:8080/api/v1/food/deleteComment?commentID=${commentID}`
      );
      if (response.status === 200) {
        const updateComments = comments.filter(
          (comment) => comment.commentID !== commentID
        );
        setComments(updateComments);
      } else {
        console.error("Failed to delete comment: ", response.status);
      }
    } catch (error) {
      console.error("Error deleting comment: ", error);
    }
  };

  const replyComment = async (text, parentID) => {
    try {
      const data = {
        userName: name,
        foodID: numFoodID,
        content: text,
        parentID: parentID,
      };
      const response = await axios.post(
        "http://localhost:8080/api/v1/food/repComment",
        data
      );
      setComments([response.data.body, ...comments]);
    } catch (error) {}
  };

  return (
    <div className="comments">
      <h3 className="comments-title"> Comments</h3>
      <div className="comments-form-title">Write comment</div>
      <CommentForm submitLabel="write" handleSubmit={addComment}></CommentForm>
      <div className="comment-container">
        {rootComments.map((rootComment) => (
          <Comment
            key={rootComment.commentID}
            comment={rootComment}
            replies={getReplies(rootComment.commentID)}
            deleteComment={deleteComment}
            replyComment={replyComment}
            getReplies={getReplies}
          ></Comment>
        ))}
      </div>
    </div>
  );
};

export default Comments;
