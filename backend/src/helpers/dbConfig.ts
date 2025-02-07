import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
export async function connect()
{
    const mongoUri=process.env.MONGO_URI! || "";
    console.log(mongoUri);
    
    try{
        await mongoose.connect(mongoUri);
        const connection =await mongoose.connection;
        await connection.on('connected',()=>{
            console.log('MongoDb connected successfully');
            
        })
        await connection.on('error',(err)=>{
            console.log("Mongo connection error"+err);
            process.exit();
            
        })
    }catch(error)
    {
        console.log("Something goes wrong");
        
        console.log(error);
        
    }
}