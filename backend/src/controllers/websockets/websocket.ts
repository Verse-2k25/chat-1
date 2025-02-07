import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
app.use(cors()); // Allow CORS for frontend communication

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", // Adjust based on frontend URL
        methods: ["GET", "POST"]
    }
});

io.on("connection", (socket) => {
    console.log(`🔗 New client connected: ${socket.id}`);

    socket.on("SEND_MESSAGE", (data) => {
        console.log(`📩 Message from ${data.username}: ${data.message}`);

        // Broadcast message to all users
        io.emit("RECEIVE_MESSAGE", data);
    });

    socket.on("disconnect", () => {
        console.log(`❌ Client disconnected: ${socket.id}`);
    });
    
});



server.listen(3000, () => {
    console.log("🚀 Server running on http://localhost:3000");
});
