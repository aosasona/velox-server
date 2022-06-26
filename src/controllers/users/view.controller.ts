import type {Request, Response} from "express";
import {default as asyncHandler} from "express-async-handler";
import {default as User} from "../../models/user.model";
import CustomError from "../../utils/handlers/error.handler";
import CustomResponse from "../../utils/handlers/response.handler";
import {CustomRequest} from "../../types";
import filter from "../../utils/filter.util";
import mongoose from "mongoose";

// Get current user
const getCurrentUser = asyncHandler(async (req: Request, res: Response): Promise<any> => {
    try {
        const customReq: CustomRequest = req as CustomRequest;
        const currentUser = new mongoose.Types.ObjectId(customReq.user.id)
        const user = await User.findById(currentUser).select(["-password", "-__v", "-createdAt", "-updatedAt"]).lean();
        if (!user) {
            throw new CustomError("User not found", 404);
        }
        let {_id, username} = user;
        return new CustomResponse(res).success("User found", {id: _id, username}, 200);
    } catch (err: any) {
        return new CustomResponse(res).error(err.message, {}, err.status || 500);
    }
})

// View all users
const viewAll = asyncHandler(async (req: Request, res: Response): Promise<any> => {
    try {
        // _id : { $ne: req._id }
        const customReq: CustomRequest = req as CustomRequest;
        const currentUser = customReq.user.id
        let users = await User.find({}).select(["-password", "-updatedAt", "-__v"]);

        users = users.filter(user => user?._id?.toString() !== currentUser);

        if (!users) {
            throw new CustomError("No users found", 404);
        }

        return new CustomResponse(res).success("Fetched all users", users, 200);
    } catch (err: any) {
        console.log(err);
        return new CustomResponse(res).error(err.message, {}, err.status || 500);
    }
})

// View one user
const viewOne = asyncHandler(async (req: Request, res: Response): Promise<any> => {
    try {
        let data = filter.obj(req.params, "username");
        let {username} = data;

        const user = await User.findOne({username: username.toLowerCase()}).select(["-password", "-updatedAt", "-__id", "-__v"]);

        if (!user) {
            throw new CustomError("User not found", 404);
        }

        return new CustomResponse(res).success(`Successfully fetched data for ${user?.username}`, user, 200);

    } catch (err: any) {
        return new CustomResponse(res).error(err.message || "Something went wrong", {}, err.status || 500);
    }
})

export {getCurrentUser, viewAll, viewOne};