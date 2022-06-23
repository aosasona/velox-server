import {default as jwt} from "jsonwebtoken";
import config from "../config";

export const generateToken = (id: string) => {
    return jwt?.sign({id}, config.jwtSecret, {expiresIn: "7d"});
};

export const verifyToken = async (token: string) => {
    return jwt.verify(token, config.jwtSecret);
};