import { Response,Request } from "express";
import { connect } from "../../../helpers/dbConfig";
import { CreateRoomType, joinRoomType } from "../../../d";
import Room from "../../../models/http/room/room";

export async function createRoom(req: CreateRoomType, res: Response) {
    try{
        await connect();
        const {name,description}=req.body;
        if(!name){
            res.status(400).send({message:"Please provide type of Room Name"});
        }
        console.log(name,description);
        const roomId=generateRoomId();
        if(!roomId){
            res.status(400).send({message:"Room Id not generated"});
        }
        const room=new Room({
            message:"Room created successfully",
            roomId:roomId,
            name:name,
            description:description
        });
        await room.save();
        res.status(201).send({
            message:"Room created successfully",
            roomId:roomId,
            name:name,
            description:description
        });
    }catch(err){
        console.error(err);
        res.status(500).send({
            message: "Internal server error"
        });
    }
}

export async function getRooms(req: Request, res: Response) {
    try{
        await connect();
        const rooms=await Room.find();
        if(!rooms){
            res.status(400).send({message:"No rooms found"});
        }
        res.status(200).send({
            message:"Rooms found",
            rooms:rooms
        });
    }catch(err){
        console.error(err);
        res.status(500).send({
            message: "Internal server error"
        });
    }
}

export async function joinRoom(req:joinRoomType,res:Response){
    try{
        await connect();
        const {roomId}=req.params;
        const userId=req.user?.id;
        console.log("UserId: ",userId);
        if(!userId){
            res.status(401).send({
                message:"Unauthorized Request User not found"
            });
        }
        if(!roomId){
            res.status(401).send({
                message:"Unauthorized Request"
            });
        }
        console.log(roomId);
        const chatRoom=await Room.findOne({roomId});
        if(!chatRoom){
            res.status(404).send({
                message:"Chat Room not found"
            });
        }
        console.log(chatRoom);

        const updatedRoom=await Room.findOneAndUpdate(
            {roomId},
            {
                $push:{
                    members:userId
                }
            },
            {new:true}
        );

        if(!updatedRoom){
            res.status(500).send({
                message:"Update not successful"
            });
        }
        console.log(updatedRoom);
        
        
        res.status(201).send({
            message:"Joined successfully",
            roomId:roomId,
            chatRoom:updatedRoom
        })
    }catch(err){
        console.error("Error joining chat room");
        res.status(500).send({
            message:"Internal Server Error"
        })
    }
}

export async function leaveRoom(req:joinRoomType,res:Response){
    try{
        await connect();
        const {roomId}=req.params;
        const userId=req.user?.id;
        console.log("UserId: ",userId);
        if(!userId){
            res.status(401).send({
                message:"Unauthorized Request User not found"
            });
        }
        if(!roomId){
            res.status(401).send({
                message:"Unauthorized Request"
            });
        }
        console.log(roomId);
        const chatRoom=await Room.findOne({roomId});
        if(!chatRoom){
            res.status(404).send({
                message:"Chat Room not found"
            });
        }
        console.log(chatRoom);
        const updatedRoom=await Room.findOneAndUpdate(
            {roomId},
            {
                $pull:{
                    members:userId
                }
            },
            {new:true}
        );
        if(!updatedRoom){
            res.status(500).send({
                message:"Update not successful"
            });
        }
        console.log(updatedRoom);
        res.status(201).send({
            message:"Left successfully",
            roomId:roomId,
            chatRoom:updatedRoom
        })
    }catch(err){
        console.error("Error leaving chat room");
        res.status(500).send({
            message:"Internal Server Error"
        })
    }

}




function generateRoomId(): string {
    const generateSegment = () => {
        return Array.from({ length: 3 }, () =>
            String.fromCharCode(97 + Math.floor(Math.random() * 26)) // Picks a random letter from 'a' to 'z'
        ).join('');
    };

    return `${generateSegment()}-${generateSegment()}-${generateSegment()}`;
}