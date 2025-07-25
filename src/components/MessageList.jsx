import React from "react";
import Message from "./Message";
import "./MessageList.css";

export default function MessageList({ messages, endRef }) {
  return (
    <div className="message-list">
      {messages.map((msg, idx) => (
        <Message key={idx} role={msg.role} content={msg.content} />
      ))}
      <div ref={endRef}></div>
    </div>
  );
}
