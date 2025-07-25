import React from "react";
import "./Message.css";

export default function Message({ role, content }) {
  return (
    <div className={`message-row ${role}`}>
      <div className={`message-bubble ${role}`}>
        {content}
      </div>
    </div>
  );
}
