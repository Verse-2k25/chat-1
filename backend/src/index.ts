import express from 'express';
import dotenv from 'dotenv';
import { createUser } from './controllers/http/auth/signUp';
import { signInUser } from "./controllers/http/auth/signIn";
import { createRoom, getRooms, joinRoom, leaveRoom } from "./controllers/http/rooms/room";
import { authenticateRequestTokens } from './middleware/auth';
import cors from 'cors';
import { postMessage, getMessages } from './controllers/http/messages/message';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());



app.get('/', (req, res) => {
    res.send('Hello World');
});

//http Servers
app.post("/api/v1/signup", createUser);
app.post("/api/v1/signin", signInUser);
app.post("/api/v1/createroom", authenticateRequestTokens as any, createRoom);
app.get("/api/v1/getrooms", authenticateRequestTokens as any, getRooms);
app.post("/api/v1/chatroom/:roomId/join", authenticateRequestTokens as any, joinRoom);
app.post("/api/v1/chatroom/:roomId/leave", authenticateRequestTokens as any, leaveRoom);
app.post("/api/v1/chatroom/:roomId/message", authenticateRequestTokens as any, postMessage);
app.get("/api/v1/chatroom/:roomId/message", authenticateRequestTokens as any, getMessages);

//websocket Servers


app.listen(PORT, () => {
    console.log("Server is running on port " + PORT);
});