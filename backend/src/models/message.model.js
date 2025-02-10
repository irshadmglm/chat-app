import mongoose from "mongoose";
import User from "./user.model.js";

const messageScema = new mongoose.Schema(
    {
        senderId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true    
        },
        receverId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true    
        },
        text:{
            type: String
        },
        image:{
            type: String
        }
    },
    {timestamps: true}
)

const Message = mongoose.model("Message", messageScema);

export default Message;