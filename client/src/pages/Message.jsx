import React from 'react';

const Message = () => {
  return (
    <div className="h-screen flex flex-col">
      {/* Chat Header */}
      <div className="bg-green-600 text-white px-4 py-3 flex items-center shadow">
        <img
          src="https://i.pravatar.cc/40"
          alt="User"
          className="rounded-full w-10 h-10 mr-3"
        />
        <div>
          <h2 className="font-semibold">John Doe</h2>
          <p className="text-sm text-green-100">Online</p>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-100 space-y-3">
        {/* Incoming Message */}
        <div className="max-w-[70%] bg-white text-gray-800 px-4 py-2 rounded-lg shadow">
          Hello! How are you?
        </div>

        {/* Outgoing Message */}
        <div className="max-w-[70%] bg-green-500 text-white px-4 py-2 rounded-lg ml-auto">
          I’m good, thanks. You?
        </div>

        {/* Incoming Message */}
        <div className="max-w-[70%] bg-white text-gray-800 px-4 py-2 rounded-lg shadow">
          Great! What are you working on?
        </div>
      </div>

      {/* Message Input */}
      <div className="flex items-center border-t px-4 py-2 bg-white">
        <input
          type="text"
          placeholder="Type a message..."
          className="flex-1 border rounded-full px-4 py-2 focus:outline-none"
        />
        <button className="ml-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full">
          Send
        </button>
      </div>
    </div>
  );
};

export default Message;
