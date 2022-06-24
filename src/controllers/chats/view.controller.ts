import type {Request, Response} from "express";
import {default as asyncHandler} from "express-async-handler";
import CustomResponse from "../../utils/handlers/response.handler";
import {CustomRequest} from "../../types";
import {default as Conversation} from "../../models/conversation.model";
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
    } catch (err: any) {
        return new CustomResponse(res).error(err.message, {}, err.status || 500);
    }
})

export {getAll, getCurrent};