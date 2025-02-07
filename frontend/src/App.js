import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000"); // Connect to WebSocket server

const App = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState("Guest");

  useEffect(() => {
    socket.on("RECEIVE_MESSAGE", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => socket.off("RECEIVE_MESSAGE");
  }, []);

  const sendMessage = () => {
    if (message.trim() !== "") {
      const data = { username, message };
      socket.emit("SEND_MESSAGE", data);
      setMessage("");
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Chat App</h1>
      <input
        type="text"
        placeholder="Enter username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <br /><br />
      <input
        type="text"
        placeholder="Type a message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={sendMessage}>Send</button>
      <div>
        <h2>Messages</h2>
        {messages.map((msg, index) => (
          <p key={index}><strong>{msg.username}:</strong> {msg.message}</p>
        ))}
      </div>
    </div>
  );
};

export default App;