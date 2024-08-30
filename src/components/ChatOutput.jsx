// src/components/ChatOutput.jsx
import React from "react";

const ChatOutput = ({ messages, clickRun, bwait }) => {
  return (
    <div className="h-full w-1/3 overflow-y-auto p-4 bg-gray-800 rounded-lg text-white flex flex-col">
      <button
        className="bg-green-700 hover:bg-green-800 active:bg-green-900 focus:outline-none focus:ring focus:ring-green-300 font-bold p-2 mb-8 rounded-sm disabled:opacity-75 disabled:hover:bg-green-800"
        disabled={bwait}
        onClick={clickRun}
      >
        RUN IT PLS
      </button>
      <div className="space-y-4 grow">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-2 rounded-lg ${msg.type === "user" ? "bg-gray-600 text-white self-end" : "bg-gray-600 text-gray-300 self-start"}`}
          >
            {msg}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatOutput;
