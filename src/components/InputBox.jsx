import React, { useState } from "react";
import { FiSend } from "react-icons/fi";
import "./InputBox.css";

export default function InputBox({ onSend, disabled }) {
  const [text, setText] = useState("");

  const handleSend = () => {
    if (text.trim()) {
      onSend(text);
      setText("");
    }
  };

  return (
    <div className="input-wrapper">
      <input
        className="input-field"
        type="text"
        value={text}
        disabled={disabled}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
        placeholder="Ask about weather..."
      />
      <button className="send-btn" onClick={handleSend} disabled={disabled}>
        <FiSend size={18} />
      </button>
    </div>
  );
}
