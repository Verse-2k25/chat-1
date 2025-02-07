import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { io } from "socket.io-client";
import './App.css';

const API_BASE = 'http://localhost:8080/api/v1' ?? "";
const socket = io("http://localhost:3000");

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [rooms, setRooms] = useState([]);
  const [messages, setMessages] = useState([]);
  const [roomId, setRoomId] = useState('');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (roomId) {
      fetchMessages();
    }
  }, [roomId]);

  useEffect(() => {
    socket.on("RECEIVE_MESSAGE", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => socket.off("RECEIVE_MESSAGE");
  }, []);

  const fetchMessages = () => {
    socket.emit("FETCH_MESSAGES", { roomId });
  
    socket.on("MESSAGES", (data) => {
      setMessages(data.messages || []);
    });
  };
  

  const sendMessage = () => {
    if (message.trim()) {
      const chatMessage = { username: "currentUser", message };
      socket.emit("SEND_MESSAGE", chatMessage);
      setMessage("");
    }
  };

  const handleSignup = async () => {
    try {
      const res = await axios.post(`${API_BASE}/signup`, { email, password, name: 'User' });
      alert(res.data.message);
    } catch (error) {
      alert('Signup failed: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleLogin = async () => {
    try {
      const res = await axios.post(`${API_BASE}/signin`, { email, password });
      setToken(res.data.token);
      localStorage.setItem('token', res.data.token);
    } catch (error) {
      alert('Login failed: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="app-container">
      <h1 className="text-2xl font-bold">Chat App</h1>
      {!token ? (
        <div>
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-field" />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="input-field ml-2" />
          <button onClick={handleSignup} className="btn-signup">Signup</button>
          <button onClick={handleLogin} className="btn-login">Login</button>
        </div>
      ) : (
        <div>
          <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} className="input-field ml-2" />
          <button onClick={sendMessage} className="btn-send-message">Send Message</button>
          <div className="message-container">
            {messages.length > 0 ? (
              messages.map((msg, index) => (
                <div key={index} className={`message ${msg.sender === 'currentUser' ? 'sent' : 'received'}`}>
                  <p><strong>{msg.username}:</strong> {msg.message}</p>
                </div>
              ))
            ) : (
              <p>No messages yet</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
