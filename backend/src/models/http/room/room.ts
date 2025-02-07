import mongoose from "mongoose";


const roomSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    message:{
        type:String,
        required:true
    },
    roomId:{
        type:String,
        required:true
    },
    description:{
        type:String,
        default:""
    },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // List of user IDs
},{
    timestamps: true, // Auto timestamps (createdAt, updatedAt)
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual field to compute number of members
roomSchema.virtual("memberCount").get(function () {
    return this.members.length;
});

const room=mongoose.models.Room || mongoose.model("Room", roomSchema);

export default room;