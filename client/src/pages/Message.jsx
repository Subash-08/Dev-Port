import React from 'react';
import '../style/Message.css';

const Message = () => {
  return (
    <div className="chat-container">
      {/* Chat Header */}
      <div className="chat-header">
        <img src="https://i.pravatar.cc/40" alt="User" className="user-avatar" />
        <div>
          <h2 className="username">John Doe</h2>
          <p className="status">Online</p>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="chat-body">
        <div className="message other">Hello! How are you?</div>
        <div className="message me">I’m good, thanks. You?</div>
        <div className="message other">Great! What are you working on?</div>
      </div>

      {/* Input Box */}
      <div className="chat-input">
        <input type="text" placeholder="Type a message..." />
        <button>Send</button>
      </div>
    </div>
  );
};

export default Message;
