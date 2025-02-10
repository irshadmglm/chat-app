import cloudinary from "../lib/cloudinary.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";

export const getUsersForSidebar = async (req,res) => {
    try {
        const logedInUserid = req.user._id;
        const fiteredUser = await User.find({ _id: { $ne :logedInUserid } } ).select("-password");

        res.status(200).json(fiteredUser);

    } catch (error) {
        console.log("Error in message controller", error.message);
        res.status(500).json({message:"Internel server error"});
    }
}

export const getMessages = async (req,res) => {
    try {
        const {id:userTochatId} = req.params;
        const myId = req.user._id;

        const messages = Message.find({
            $or:[
                {senderId:myId, receverId:userTochatId},
                {senderId:userTochatId, receverId: myId}
            ]
        })

        res.status(200).json(messages);

    } catch (error) {
        console.log("Error in get users", error.message);
        res.status(500).json({message: "Interl server error"})
        
    }
}

export const sendMessage = async (req,res) => {
    try {
        const {text, image} = req.body;
        const {id: receverId} = req.params;
        const senderId = req.user._id;

        let imageUrl;

        if(image){
            //upload base64 image to cloudinary
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = new Message(
            {
                senderId,
                receverId,
                text,
                image: imageUrl
            }
        );

        await newMessage.save();

        // socket.io

        res.status(201).json(newMessage);
    } catch (error) {
        console.log("Error in send message", error.message);
        res.status(500).json({message: "Internal server error"});
    }
}