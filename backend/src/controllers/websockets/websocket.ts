import { WebSocket, WebSocketServer } from "ws";
import express from "express";
import http from "http";

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

interface User {
    id: string;
    username: string;
    room: string;
    ws: WebSocket;
    isTyping?: boolean;
}

interface MessageTypeServer {
    id: string;
    username: string;
    room: string;
    content?: string;  // Added for chat messages
    isTyping?: boolean;
}

interface MessageTypeClient {
    type: string;
    payload: {
        id: string;
        username: string;
        room: string;
        content?: string;  // Added for chat messages
        isTyping?: boolean;
    };
}

const users = new Map<string, User>();

wss.on("connection", (ws) => {
    console.log("New client connected");

    ws.on("message", (data) => {
        try {
            console.log("Received message:", data.toString());
            const message = JSON.parse(data.toString()) as MessageTypeClient;

            if (
                !message.payload ||
                !message.payload.id ||
                !message.payload.username ||
                !message.payload.room
            ) {
                throw new Error("Invalid message format");
            }

            const payload = {
                id: message.payload.id,
                username: message.payload.username,
                room: message.payload.room,
                content: message.payload.content,
                isTyping: message.payload.isTyping
            };

            switch (message.type) {
                case "USER_JOINED":
                    handleUserJoined(ws, payload);
                    break;
                case "USER_LEFT":
                    handleUserLeft(payload, ws);
                    break;
                case "CHAT_MESSAGE":
                    if (!payload.content) {
                        throw new Error("Chat message must have content");
                    }
                    handleChatMessage(payload, ws);
                    break;
                case "TYPING_STATUS":
                    handleTypingStatus(payload);
                    break;
            }
        } catch (err) {
            console.error("Error:", err);
            ws.send(JSON.stringify({
                type: "ERROR",
                payload: { message: "Invalid message format" }
            }));
        }
    });

    ws.on("close", () => {
        console.log("Client disconnected");
        const user = [...users.values()].find((u) => u.ws === ws);
        if (user) {
            handleUserLeft({ id: user.id, username: user.username, room: user.room }, ws);
        }
    });
});

function handleUserJoined(ws: WebSocket, message: MessageTypeServer) {
    const { id, username, room } = message;
    users.set(id, { id, username, room, ws });
    
    console.log(`User ${username} joined room ${room}. Current users:`, Array.from(users.keys()));
    
    

    broadCast({
        type: "USER_JOINED",
        payload: { id, username, room },
    }, room);
}

function handleUserLeft(message: MessageTypeServer, ws: WebSocket) {
    const { id, username, room } = message;
    
    if (users.has(id)) {
        console.log(`User ${username} leaving room ${room}. Current users before removal:`, Array.from(users.keys()));
        
        broadCast({
            type: "USER_LEFT",
            payload: { id, username, room },
        }, room);
        
        users.delete(id);
        
        console.log(`Users after removal:`, Array.from(users.keys()));
        
    }
}

function handleChatMessage(message: MessageTypeServer, ws: WebSocket) {
    const { id, username, room, content } = message;
    
    // Verify user exists and is in the correct room
    const user = users.get(id);
    if (!user || user.room !== room) {
        ws.send(JSON.stringify({
            type: "ERROR",
            payload: { message: "User not found in room" }
        }));
        return;
    }

    console.log(`Chat message from ${username} in room ${room}: ${content}`);

    // Send confirmation to sender
    // ws.send(JSON.stringify({
    //     type: "MESSAGE_SENT",
    //     payload: {
    //         message: content,
    //         timestamp: new Date().toISOString()
    //     }
    // }));

    // Broadcast message to room
    broadCast({
        type: "CHAT_MESSAGE",
        payload: {
            id,
            username,
            room,
            content
        }
    }, room);
}

function handleTypingStatus(payload: MessageTypeServer) {
    const {id,username,room,isTyping}=payload;
    if(!id || !username || !room || isTyping===undefined){
        throw new Error("Invalid typing status and message format");
    }
    const user=users.get(id);
    if(!user || user.room!==room){
        return;
    }
    user.isTyping=isTyping;
    broadCast({
        type:"TYPING_STATUS",
        payload:{
            id,
            username,
            room,
            isTyping
        }
    },room);
}

function broadCast(data: { type: string; payload: MessageTypeServer }, room: string) {
    const message = JSON.stringify(data);
    console.log(`Broadcasting to room ${room}. Message:`, message);
    
    users.forEach((user, userId) => {
        if (user.room === room && user.ws.readyState === WebSocket.OPEN) {
            console.log(`Sending to user ${user.username}`);
            user.ws.send(message);
        } else if (user.ws.readyState !== WebSocket.OPEN) {
            console.log(`Removing disconnected user ${userId}`);
            users.delete(userId);
        }
    });
}

server.listen(3001, () => console.log("WebSocket server running on port 3000"));