import type {Request, Response, NextFunction} from "express";
import {default as asyncHandler} from "express-async-handler";
import CustomResponse from "../utils/handlers/response.handler";
import {CustomRequest} from "../types";
import {verifyToken} from "../helpers/token.helper";
import CustomError from "../utils/handlers/error.handler";


const authMiddleware = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        let token;

        // Get the header
        const header: string | string[] | undefined = req.headers.authorization || req.headers.Authorization;

        if (!header) {
            throw new CustomError("Unauthorized!", 401);
        }

        // Check if the header is an array
        if (typeof header === "string") {
            if (header.startsWith("Bearer ")) {
                token = header.split(" ")[1];
            }
        } else {
            if (header.length > 1) {
                token = header[0].split(" ")[1];
            }
        }

        // Verify the token
        if (!token) {
            throw new CustomError("Unauthorized!", 401);
        }

        const decoded = await verifyToken(token);

        // If token could not be verified
        if (!decoded) {
            throw new CustomError("Unauthorized!", 401);
        }

        // Set the user to the request object
        const customReq: CustomRequest = req as CustomRequest;
        customReq.user = decoded;

        next()

    } catch (err: any) {
        return new CustomResponse(res).error(err.message, {}, err.status || 500);
    }
})

export default authMiddleware;