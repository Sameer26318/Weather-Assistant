import React, { useState, useRef, useEffect } from "react";
import MessageList from "./MessageList";
import InputBox from "./InputBox";
import "./ChatWindow.css";

export default function ChatWindow() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // --- Final Cleaner for API Response ---
  const cleanAssistantResponse = (raw) => {
  return raw
    // Remove debugging prefixes (f:, a:, e:, d:)
    .replace(/\b(f:|a:|e:|d:)\b/gi, "")
    // Remove isContinued:false and curly braces
    .replace(/isContinued:false/gi, "")
    .replace(/\{[^}]*\}/g, "")
    // Remove token indexes like 9:" and extra quotes
    .replace(/\d+:"/g, "")
    .replace(/"/g, "")
    // Fix spacing
    .replace(/\s*\.\s*/g, ". ")
    .replace(/\s*,\s*/g, ", ")
    .replace(/\s*°\s*C/g, "°C")
    .replace(/\s*%\s*/g, "% ")
    .replace(/\s+/g, " ")
    .trim();
};


  const sendMessage = async (text) => {
    if (!text.trim()) return;

    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setLoading(true);

    try {
      const response = await fetch(
        "https://millions-screeching-vultur.mastra.cloud/api/agents/weatherAgent/stream",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-mastra-dev-playground": "true",
          },
          body: JSON.stringify({
            messages: [{ role: "user", content: text }],
            runId: "weatherAgent",
            maxRetries: 2,
            maxSteps: 5,
            temperature: 0.5,
            topP: 1,
            runtimeContext: {},
            threadId: "123456",
            resourceId: "weatherAgent",
          }),
        }
      );

      if (!response.body) throw new Error("ReadableStream not supported");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullMessage = "";

      setMessages((prev) => [...prev, { role: "agent", content: "" }]);

      let done = false;
      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        if (value) {
          const chunk = decoder.decode(value, { stream: true });

          // Clean the incoming text
          let cleaned = cleanAssistantResponse(chunk);

          // Keep only human-readable weather summary if present
          const match = cleaned.match(/The current weather[^]*$/i);
          if (match) cleaned = match[0];

          if (cleaned) fullMessage += cleaned + " ";

          setMessages((prev) => {
            const updated = [...prev];
            updated[updated.length - 1] = {
              role: "agent",
              content: fullMessage.trim(),
            };
            return updated;
          });
        }
      }
    } catch (error) {
      console.error("Streaming error:", error);
      setMessages((prev) => [
        ...prev,
        { role: "agent", content: "Error fetching weather data." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-card">
        <MessageList messages={messages} endRef={messagesEndRef} />
        <InputBox onSend={sendMessage} disabled={loading} />
      </div>
    </div>
  );
}
