import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../config/api';
import '../style/Message.css';

const Chat = ({ loggedInUserId }) => {
  const [chats, setChats] = useState([]);
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
console.log(chats);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [chatRes, friendRes] = await Promise.all([
          api.get('/messages/chats'),
          api.get('/user/friends/list')
        ]);

        setChats(chatRes.data.chats || []);
        // console.log(chatRes);
        
        setFriends(friendRes.data.friends || []);
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [loggedInUserId]);

  const extractOtherUser = (participants = []) =>
    participants.find((p) => p._id !== loggedInUserId);

  const chattedFriendIds = chats.map((chat) =>
    extractOtherUser(chat.participants)?._id
  );

  const remainingFriends = friends.filter(
    (friend) => !chattedFriendIds.includes(friend._id)
  );

  const handleChatNavigate = (userId) => {
    navigate(`/message/chat/${userId}`);
  };

  return (
    <div className="chat-list-container">
      <h2>Messages</h2>

      {loading ? (
        <p className="loading">Loading chats and friends...</p>
      ) : (
        <>
          {/* Active Chats */}
          <div className="chat-section">
            <h3>Active Chats</h3>
            {chats.length === 0 ? (
              <p>No previous chats found.</p>
            ) : (
              <ul className="chat-list">
                {chats.map((chat) => {
                  const other = chat;
                  console.log(other);
                  
                  if (!other) return null;

                  return (
                    <li key={other.friend._id} onClick={() => handleChatNavigate(other.friend._id)}>
                      <img
                        src={other.friend.avatar || '/uploads/profile.jpg'}
                        alt={other.friend.username}
                      />
                      <div>
                        <strong>{other.friend.username}</strong>
                        <p>{chat.lastMessage?.text || 'No messages yet'}</p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* Start New Chat */}
          <div className="friend-section">
            <h3>Start New Chat</h3>
            {remainingFriends.length === 0 ? (
              <p>No other friends available to start a chat.</p>
            ) : (
              <ul className="chat-list">
                {remainingFriends.map((friend) => (
                  <li key={friend._id} onClick={() => handleChatNavigate(friend._id)}>
                    <img
                      src={friend.avatar || '/uploads/profile.jpg'}
                      alt={friend.username}
                    />
                    <div>
                      <strong>{friend.username}</strong>
                      <p>Click to start a new conversation</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Chat;
