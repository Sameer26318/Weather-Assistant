import React, { useState } from "react";
import "./InputBox.css";

export default function InputBox({ onSend, disabled }) {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    onSend(input);
    setInput("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="input-box">
      <input
        type="text"
        placeholder="Ask about weather..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyPress}
        disabled={disabled}
      />
      <button onClick={handleSend} disabled={disabled}>
        ➤
      </button>
    </div>
  );
}
