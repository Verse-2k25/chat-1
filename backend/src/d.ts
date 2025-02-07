import { Request } from "express"

interface CreateUserType extends Request{
    body:{
        email:string,
        password:string,
        name:string
    }
}

interface UserLoginType extends Request{
    body:{
        email:string,
        password:string
    }
}

interface CreateRoomType extends Request{
    body:{
        name:string,
        description?:string,
    }
}

interface AuthRequest extends Request {
    user?:any
}

interface joinRoomType extends Request{
    body:{
        roomId:string
    }
    user?:{
        id:string,
        email:string
    }
}

interface messageType extends Request{
    body:{
        text:string
    }
    user?:{
        id:string,
        email:string
    }
}

export {CreateUserType,UserLoginType,CreateRoomType,AuthRequest,joinRoomType,messageType};