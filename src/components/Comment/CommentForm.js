import React, { useState } from "react";
import "./CommentForm.css";

const CommentForm = ({ handleSubmit, submitLabel }) => {
  const [text, setText] = useState("");
  const [rating, setRating] = useState(0);
  const isTextareaDisable = text.length === 0;

  const resetForm = () => {
    setText("");
    setRating(0);
  };
  const onSubmit = (event) => {
    event.preventDefault();
    handleSubmit(text, rating);
    resetForm();
  };
  const handleRatingChange = (newRating) => {
    setRating(newRating);
  };
  return (
    <div className="comment-form">
      <form action="" onSubmit={onSubmit}>
        <textarea
          className="comment-form-textarea"
          value={text}
          onChange={(e) => setText(e.target.value)}
        ></textarea>
        <div className="star-rating">
          {[1, 2, 3, 4, 5].map((star) => (
            <img
              key={star}
              src={`${process.env.PUBLIC_URL}/assets/star_icon.png`}
              style={{
                width: "20px",
                cursor: "pointer",
                opacity: rating >= star ? 1 : 0.5,
              }}
              onClick={() => handleRatingChange(star)}
              alt="star"
            />
          ))}
        </div>
        <button className="comment-form-button" disabled={isTextareaDisable}>
          {submitLabel}
        </button>
      </form>
    </div>
  );
};

export default CommentForm;
