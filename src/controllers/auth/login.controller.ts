import type {Request, Response} from "express";
import {default as bcrypt} from "bcryptjs";
import {default as asyncHandler} from "express-async-handler";
import validator from "validator";
import CustomResponse from "../../utils/handlers/response.handler";
import CustomError from "../../utils/handlers/error.handler";
import {default as User} from "../../models/user.model";
import {generateToken} from "../../helpers/token.helper";
import filter from "../../utils/filter.util";

interface IBody {
    username: string;
    password: string;
}

const login = asyncHandler(async (req: Request, res: Response): Promise<any> => {
    try {
        const body: IBody = filter.obj(req.body, "username", "password")
        let {username, password} = body

        // Check if any of the fields are empty
        if (!(username && password)) {
            throw new CustomError("Please fill in all fields", 400);
        }

        // If the password or username is not an ASCII string
        if (!validator.isAscii(username) || !validator.isAscii(password)) {
            throw new CustomError(
                "Usernames and passwords cannot contain emojis and special characters",
                400
            );
        }

        // Remove special characters from username
        username = username.replace(/[^a-zA-Z0-9 ]/g, "");

        // Find the user
        const user = await User.findOne({username: username.toLowerCase()})
        if (!user) {
            throw new CustomError("User not found", 404)
        }

        // Check if password is correct
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            throw new CustomError("Password is incorrect", 400)
        }

        // Return token
        return new CustomResponse(res).success("Welcome back!", {
            username: user?.username,
            id: user?._id.toString(),
            token: generateToken(user?._id.toString())
        })
    } catch (err: any) {
        //   console.log(err);
        return new CustomResponse(res).error(
            err.message || "Something went wrong",
            {},
            err.status || 500
        );
    }

})

export default login