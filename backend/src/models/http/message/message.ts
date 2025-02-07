import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
    {
        roomId: {
            type: String,
            required: true,
        },
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        text: {
            type: String,
            default:""
        },
    },
    { timestamps: true } // Automatically adds createdAt and updatedAt
);

const Message = mongoose.models.Message || mongoose.model("Message", messageSchema);

export default Message;
