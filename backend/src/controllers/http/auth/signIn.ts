import { Response } from "express";
import { UserLoginType } from "../../../d";
import User from "../../../models/http/auth/auth";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { connect } from "../../../helpers/dbConfig";
export async function signInUser(req: UserLoginType, res: Response) {
    try {
        await connect();
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).send({ message: "Please provide all the fields" });
        }
        console.log("email:", email, "\t\t password:\t\t", password);
        const user = await User.findOne({
            email
        });
        if (!user) {
            res.status(400).send({ message: "User does not exist" });
        }
        console.log(user);

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.status(400).send({ message: "Invalid credentials" });
        }
        console.log(isMatch);

        const tokenSecret = process.env.JWT_SECRET! as string || "";
        const token = await jwt.sign({
            id: user._id,
            email: user.email,
            username: user.username
        }, tokenSecret);
        if (!token) {
            res.status(500).send({ message: "Error generating token" });
        }
        res.status(200).send({
            message: "User signed in successfully",
            token: token,
            userId: user.email
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Internal server error"
        })
    }
}