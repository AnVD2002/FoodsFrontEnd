import React, { useState } from "react";
import "./CommentForm.css";

const CommentForm = ({ handleSubmit, submitLabel }) => {
  const [text, setText] = useState("");
  const isTextareaDisable = text.length === 0;
  const onSubmit = (event) => {
    event.preventDefault();
    handleSubmit(text);
  };
  return (
    <div className="comment-form">
      <form action="" onSubmit={onSubmit}>
        <textarea
          className="comment-form-textarea"
          value={text}
          onChange={(e) => setText(e.target.value)}
        ></textarea>
        <button className="comment-form-button" disabled={isTextareaDisable}>
          {submitLabel}
        </button>
      </form>
    </div>
  );
};

export default CommentForm;
