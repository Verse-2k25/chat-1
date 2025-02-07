import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_BASE = 'http://localhost:8080/api/v1'; // Adjust if needed

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [rooms, setRooms] = useState([]); // Ensure rooms is an array
  const [messages, setMessages] = useState([]); // Ensure messages is an array
  const [roomId, setRoomId] = useState('');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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

  const fetchRooms = async () => {
    try {
        console.log("Fetching rooms..."); // Add logging to track API call
        const res = await axios.get(`${API_BASE}/getrooms`, { headers: { Authorization: `Bearer ${token}` } });
        console.log("Rooms fetched:", res.data); // Add logging to see the fetched data
        setRooms(res.data.rooms || []); // Assuming rooms are in res.data.rooms
      } catch (error) {
        console.error("Error fetching rooms:", error); // Log the error
        alert('Failed to fetch rooms: ' + (error.response?.data?.message || error.message));
      }
  };

  const createRoom = async () => {
    try {
      const res = await axios.post(`${API_BASE}/createroom`, { name: 'New Room' }, { headers: { Authorization: `Bearer ${token}` } });
      alert(res.data.message);
      fetchRooms(); // Fetch the updated list of rooms after creation
    } catch (error) {
      alert('Failed to create room: ' + (error.response?.data?.message || error.message));
    }
  };

  const joinRoom = async () => {
    try {
      await axios.post(`${API_BASE}/chatroom/${roomId}/join`, {}, { headers: { Authorization: `Bearer ${token}` } });
      alert('Joined Room');
      fetchMessages(); // Fetch messages when user joins the room
    } catch (error) {
      alert('Failed to join room: ' + (error.response?.data?.message || error.message));
    }
  };

  const leaveRoom = async () => {
    try {
      await axios.post(`${API_BASE}/chatroom/${roomId}/leave`, {}, { headers: { Authorization: `Bearer ${token}` } });
      alert('Left Room');
      setMessages([]); // Clear messages when leaving the room
    } catch (error) {
      alert('Failed to leave room: ' + (error.response?.data?.message || error.message));
    }
  };

  const sendMessage = async () => {
    try {
      await axios.post(`${API_BASE}/chatroom/${roomId}/message`, { text: message }, { headers: { Authorization: `Bearer ${token}` } });
      setMessage(''); // Clear message input after sending
      fetchMessages(); // Fetch the latest messages
      setMessages((prevMessages) => {
        if (Array.isArray(prevMessages)) {
          return [
            ...prevMessages,
            { text: message, sender: 'currentUser' }
          ];
        }
        return [{ text: message, sender: 'currentUser' }]; // Handle if prevMessages is not an array
      });
    } catch (error) {
      alert('Failed to send message: ' + (error.response?.data?.message || error.message));
    }
  };

  const fetchMessages = async () => {
    try {
      const res = await axios.get(`${API_BASE}/chatroom/${roomId}/message`, { headers: { Authorization: `Bearer ${token}` } });
      setMessages(res.data || []); // Fallback to empty array if response is undefined
    } catch (error) {
      alert('Failed to fetch messages: ' + (error.response?.data?.message || error.message));
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
          <button onClick={fetchRooms} className="btn-get-rooms">Get Rooms</button>
          <button onClick={createRoom} className="btn-create-room">Create Room</button>

          <div>
            <h2>Rooms:</h2>
            {rooms.length > 0 ? (
              rooms.map((room) => (
                <div key={room.roomId} className="room-item">
                  {room.name} <button onClick={() => setRoomId(room.roomId)} className="btn-select-room">Select</button>
                </div>
              ))
            ) : (
              <p>No rooms available</p>
            )}
          </div>

          {roomId && (
            <div>
              <button onClick={joinRoom} className="btn-join-room">Join Room</button>
              <button onClick={leaveRoom} className="btn-leave-room">Leave Room</button>
              <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} className="input-field ml-2" />
              <button onClick={sendMessage} className="btn-send-message">Send Message</button>
              <button onClick={fetchMessages} className="btn-get-messages">Get Messages</button>
              <div className="message-container">
  {messages.length > 0 ? (
    messages.map((msg, index) => (
      <div 
        key={index} 
        className={`message ${msg.sender === 'currentUser' ? 'sent' : 'received'}`}
      >
        <p>{msg.text}</p>
      </div>
    ))
  ) : (
    <p>No messages yet</p>
  )}
</div>

            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default App;
