import { Request, Response } from 'express';
import { messageType } from '../../../d';
import { connect } from '../../../helpers/dbConfig';
import Room from "../../../models/http/room/room"
import Message from '../../../models/http/message/message';
export async function postMessage(req: messageType, res: Response) {
    try {
        await connect();
        const { roomId } = req.params;
        const { text } = req.body;

        if (!roomId) {
            res.status(400).json({ message: "Room ID is required" });
        }
        if (!text) {
            res.status(400).json({ message: "Message text is required" });
        }

        console.log("RoomId", roomId, "\t", "text", text);


        // Check if the room exists
        const chatRoom = await Room.findOne({ roomId });
        if (!chatRoom) {
            res.status(404).json({ message: "Chat Room not found" });
        }

        const newMessage = new Message({
            roomId,
            sender: req.user?.id,
            text
        });

        await newMessage.save();

        res.status(201).json({ message: "Message sent successfully", messageData: newMessage });
    } catch (err) {
        console.error(err);
        res.status(500).send({
            message: "Internal Server Error"
        })
    }
}

export async function getMessages(req: Request, res: Response) {
    try {
        await connect();
        const { roomId } = req.params;
        if (!roomId) {
            res.status(400).send({
                message: "Room-Id not found"
            });
        }
        // Check if the room exists
        const chatRoom = await Room.findOne({ roomId });
        if (!chatRoom) {
            res.status(404).json({ message: "Chat Room not found" });
        }
        const messages = await Message.find({ roomId }).populate("sender", "name email");
        if (!messages) {
            res.status(400).send({
                message: "Messages not found"
            });
        }
        res.status(201).send({
            message: "Message retreived successfully",
            messages
        });
    } catch (err) {
        console.error(err);
        res.status(500).send({
            message: "Internal Server Error"
        });
    }
}