import type { Request, Response } from "express";
import { default as bcrypt } from "bcryptjs";
import { default as asyncHandler } from "express-async-handler";
import validator from "validator";
import CustomResponse from "../../utils/handlers/response.handler";
import CustomError from "../../utils/handlers/error.handler";
import { default as User } from "../../models/user.model";
import { generateToken } from "../../helpers/token.helper";

const index = asyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    try {
      let { username, password, confirmPassword } = req.body;

      // Check if any of the fields are empty
      if (!(username && password && confirmPassword)) {
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

      // Check if username has been taken
      const user = await User.findOne({ username: username.toLowerCase() });

      if (user) {
        throw new CustomError("Username has been taken", 400);
      }

      // Check if passwords match
      if (password !== confirmPassword) {
        throw new CustomError("Passwords do not match", 400);
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const newUser = await User.create({
        username: username.toLowerCase(),
        password: hashedPassword,
      });

      if (!newUser) {
        throw new CustomError("Something went wrong!", 500);
      }

      return new CustomResponse(res).success("Welcome aboard!", {
        username: newUser.username,
        id: newUser._id.toString(),
        token: generateToken(newUser._id.toString()),
      });
    } catch (err: any) {
      //   console.log(err);
      return new CustomResponse(res).error(
        err.message || "Something went wrong",
        {},
        500
      );
    }
  }
);

export default index;
