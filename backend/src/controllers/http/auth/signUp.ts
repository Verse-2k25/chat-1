import { Response } from "express";
import { CreateUserType } from "../../../d";
import bcrypt from 'bcrypt';
import { connect } from "../../../helpers/dbConfig";
import User from "../../../models/http/auth/auth";

export async function createUser(req: CreateUserType, res: Response) {
    try {
        await connect();
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            res.status(400).send({ message: "Please provide all the fields" });
        }
        console.log(name, email, password);
        const user = await User.findOne(
            {
                $or: [{ email }, { name }, { email }]
            }
        );
        if (user) {
            res.status(400).send({ message: "User already exists" });
        }
        const saltedRounds: number = 10;
        const hashedPassword = await bcrypt.hash(password, saltedRounds);
        console.log(hashedPassword);
        const newUser = new User({
            name,
            email,
            password: hashedPassword
        });
        await newUser.save();
        res.status(201).send({ message: "User created successfully", user: newUser });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal server error"
        })
    }
}