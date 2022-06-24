import {Schema, model} from "mongoose";

interface Conversation {
    userA: string;
    userB: string;
}

const ConversationSchema = new Schema<Conversation>({
    userA: {
        type: String,
        required: true,
        ref: "User"
    },
    userB: {
        type: String,
        required: true,
        ref: "User",
    },
}, {timestamps: true});

export default model<Conversation>("Conversation", ConversationSchema);