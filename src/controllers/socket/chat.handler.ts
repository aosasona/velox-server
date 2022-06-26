import {default as Messages} from "../../models/message.model";
import {default as Conversation} from "../../models/conversation.model";
import CustomError from "../../utils/handlers/error.handler";


///// Get all messages /////
const getCurrentChat = async (chatId: string): Promise<any[]> => {

    if (!chatId) {
        throw new CustomError("No chat ID provided", 400);
    }

    const messages = await Messages.find({chatId: chatId}).populate("receiver", "username").populate("sender", "username").select(["-_id"]).sort({createdAt: "asc"});

    return messages || [];
}

///// SEND A NEW MESSAGE /////
const sendMessage = async (socketId: string, data: any): Promise<any> => {

    try {

        // Check if conversation exists
        const conversation = await Conversation.findOne({
            $or: [{userA: data.sender, userB: data.receiver}, {userB: data.sender, userA: data.receiver}]
        })

        let chatId: string = socketId;

        if (!conversation) {
            // Create a new conversation
            const newConversation = new Conversation({
                userA: data.sender,
                userB: data.receiver
            })
            await newConversation.save();   // Save the new conversation
            chatId = newConversation?._id?.toString();
        }

        if (!data.receiver || !data.sender || !chatId || !data.message) {
            throw new CustomError("Message not sent!", 400);
        }

        const message = await Messages.create({
            receiver: data.receiver,
            sender: data.sender,
            chatId: chatId,
            message: data.message
        });

        return {message, chatId};
    } catch (err: any) {
        throw new CustomError("Message not sent!", 500);
    }
}

export {getCurrentChat, sendMessage};