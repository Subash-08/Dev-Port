import React, { useEffect, useRef, useState } from 'react';
import '../style/Message.css';
import { createSocketConnection } from '../config/socket';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import api from '../config/api';
import Loader from '../components/Loader';

let socket;

const Message = () => {
  const { userId } = useParams();
  const loggedInUser = useSelector((state) => state.user.profile._id);
  const loggedInName = useSelector((state) => state.user.profile.username);
  const [targetUser, setTargetUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [loading, setLoading] = useState(true);
  const chatBodyRef = useRef(null);

  // Fetch target user and chat
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(`/user/id/${userId}`, {
          withCredentials: true,
        });
        setTargetUser(res.data);
        await fetchChat(userId);
      } catch (error) {
        console.error('Failed to fetch target user or chat', error);
      }
    };

    if (userId) {
      fetchData();
    }
  }, [userId]);

  // Fetch chat history
  const fetchChat = async (targetId) => {
    try {
      setLoading(true);
      const res = await api.get(`/message/chat/${targetId}`);
      const chat = res.data;

      const formattedMessages = chat.messages.map((msg) => ({
        _id: msg._id,
        senderId: msg.senderId._id || msg.senderId,
        senderName: msg.senderId.username || 'Unknown',
        message: msg.text,
        timestamp: msg.createdAt,
        seenBy: msg.seenBy || [],
      }));

      setMessages(formattedMessages);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch chat', err);
      setLoading(false);
    }
  };

  // Setup socket connection
  useEffect(() => {
    if (!loggedInUser) return;

    socket = createSocketConnection();

    socket.emit('joinChat', { loggedInUser, userId });

    socket.on('receiveMessage', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off('receiveMessage');
      socket.disconnect();
    };
  }, [userId, loggedInUser]);

  // Send message
  const sendMessage = () => {
    if (!messageInput.trim() || !socket) return;

    const newMessage = {
      senderId: loggedInUser,
      senderName: loggedInName,
      receiverId: userId,
      message: messageInput,
    };

    socket.emit('sendMessage', newMessage);
    setMessageInput('');
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    chatBodyRef.current?.scrollTo(0, chatBodyRef.current.scrollHeight);
  }, [messages]);

  const formatTime = (timestamp) => {
    try {
      const date = new Date(timestamp);
      if (isNaN(date)) return '—';
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '—';
    }
  };

  const lastMessage = messages[messages.length - 1];

  return (
    <div className="chat-container">
      {/* Chat Header */}
      <div className="chat-header">
        <img
          src={targetUser?.avatar || '/default.jpg'}
          alt="User"
          className="user-avatar"
        />
        <div>
          <h2 className="username">{targetUser?.username || 'Loading...'}</h2>
          <p className="status">Online</p>
        </div>
      </div>

      {/* Chat Body */}
      <div className="chat-body" ref={chatBodyRef}>
        {loading ? (
          <Loader />
        ) : (
          messages.map((msg, idx) => {
            const isMine = msg.senderId === loggedInUser;
            const isLast = idx === messages.length - 1;
            const isSeen = isLast && msg.seenBy?.includes(loggedInUser) && !isMine;

            return (
              <div key={msg._id || idx} className={`message ${isMine ? 'me' : 'other'}`}>
                <div className="message-text">{msg.message}</div>
                <div className="message-footer">
                  <small className="timestamp">{formatTime(msg.timestamp)}</small>
                  {isSeen && <small className="seen-indicator">Seen</small>}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Chat Input */}
      <div className="chat-input">
        <input
          type="text"
          placeholder="Type a message..."
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Message;
