import {Schema, model} from "mongoose";

interface Message {
    receiver: string;
    sender: string;
    chatId: string;
    message: string;
}

const MessageSchema = new Schema<Message>({
    receiver: {
        type: String,
        required: true,
    },
    sender: {
        type: String,
        required: true,
    },
    chatId: {
        type: String,
        required: true,

    }

}, {timestamps: true});

export default model<Message>("Message", MessageSchema);