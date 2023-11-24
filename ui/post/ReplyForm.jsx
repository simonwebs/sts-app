import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';

const ReplyForm = ({ commentId }) => {
  const [content, setContent] = useState('');
  const [feedbackMsg, setFeedbackMsg] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (content.trim()) {
      Meteor.call('comments.reply', commentId, content, (error) => {
        if (error) {
          console.error('Error adding reply:', error);
          setFeedbackMsg('Failed to add reply');
        } else {
          setContent('');
          setFeedbackMsg('Reply added successfully');
        }
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Add your reply..."
      />
      <button type="submit">Reply</button>
      { feedbackMsg && <p>{feedbackMsg}</p> }
    </form>
  );
};

export default ReplyForm;
