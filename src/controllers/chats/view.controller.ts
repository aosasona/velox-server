import type {Request, Response} from "express";
import {default as asyncHandler} from "express-async-handler";
import CustomResponse from "../../utils/handlers/response.handler";
import {CustomRequest} from "../../types";
import {default as Conversation} from "../../models/conversation.model";
import {default as User} from "../../models/user.model";
import CustomError from "../../utils/handlers/error.handler";

///// Get All Of A Current User's Chats /////
const getAll = asyncHandler(async (req: Request, res: Response): Promise<any> => {
    try {
        const customReq: CustomRequest = req as CustomRequest;
        const currentUser = customReq.user.id

        const chats = await Conversation.find({
            $or: [{userA: currentUser}, {userB: currentUser}]
        }).populate("userA", "username").populate("userB", "username")

        if (!chats) {
            throw new CustomError("No chats found", 404);
        }

        return new CustomResponse(res).success("Fetched all chats", chats, 200);

    } catch (err: any) {
        return new CustomResponse(res).error(err.message, {}, err.status || 500);

    }
})

///// Get Current Chats /////
const getCurrent = asyncHandler(async (req: Request, res: Response): Promise<any> => {
    try {
        const customReq: CustomRequest = req as CustomRequest;
        const currentUser = customReq.user.id
        const rawUsername = req.params.username

        if (!rawUsername) {
            throw new CustomError("No username provided", 400);
        }

        const user = await User.findOne({username: rawUsername.toLowerCase()}).select(["-password", "-updatedAt", "-__v"]);

        // If the user doesn't exist, throw an error
        if (!user) {
            throw new CustomError("User not found", 404);
        }

        // If the user is the same as the current user, throw an error
        if (user._id.toString() === currentUser) {
            throw new CustomError("You can't chat with yourself 😂", 400);
        }

        const userId = user._id.toString()

        // Find the conversation between the two users
        const chat = await Conversation.findOne({
            $or: [{userA: currentUser, userB: userId}, {userB: currentUser, userA: userId}]
        })

        // if (!chat) {
        //     // Create a new chat record
        //     const newChat = await Conversation.create({
        //         userA: currentUser,
        //         userB: userId
        //     })
        //
        //     // Return the new chat
        //     return new CustomResponse(res).success("Created a new chat", {user: user, chat: newChat}, 201);
        // }

        // Return the chat
        return new CustomResponse(res).success("Fetched current chat", {user, messages: chat || {}}, 200);

    } catch (err: any) {
        return new CustomResponse(res).error(err.message, {}, err.status || 500);
    }
})

export {getAll, getCurrent};