import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs"

export const signup = async (req,res) => {
    const {fullName, email, password} = req.body;
    try {
        if(!fullName || !email || !password){
           return res.status(400).json({message:"all field are required"});
        }
        if(password.length < 6){
           return res.status(400).json({message:"password must be atleast 6 charecter"});
        }
        const user = await User.findOne({email})
        if(user) return res.status(400).json({message: "Email already exist"});

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullName,
            email,
            password: hashedPassword
        })

        if(newUser){
            generateToken(newUser._id,res);

            await newUser.save();

            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic
            })
        }else{
            return res.status(400).json({message:"invalid password"})
        }

    } catch (error) {
        console.log("error in signup controller", error.message);
        res.status(500).json({message: "internel server error"})
        
    }
}

export const login = async (req,res) => {
    const {fullName, email, password} = req.body;
    try {
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({message: "invalid credential"});
        }
        const ispassword = await bcrypt.compare(password, user.password);

        if(!ispassword){
            return res.status(400).json({message: "invalid Password"});
        }

        generateToken(user._id, res);

        res.status(200).json({
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic
        })

    } catch (error) {
        console.log("error in login controller", error.message);
        return res.status(400).json({message: "internel server error"});

        
    }
}

export const logout = (req,res) => {
   try {
    res.cookie("jwt", "", {macAge:0});
    res.status(200).json({message:"logout seccessfully"});
   } catch (error) {
    console.log("error in login controller", error.message);
    return res.status(400).json({message: "internel server error"});
   }
}

export const uploadeprofile = async (req,res) => {
    try {
        const {profilePic} = req.body;
    const userId = req.user._id;

    const uploadResponse = cloudinary.uploader.upload(profilePic);
    const updateUser = await User.findByIdAndUpdate(
        userId,
        {profilePic: uploadResponse.secure_url},
        {new: true}
    );

    res.status(200).json(updateUser);
    } catch (error) {
        console.log("error in update profile", error.message);
        return res.status(400).json({message: "internel server error"});
    }
}

export const checkAuth = (req,res) => {
    try {       
        res.status(200).json(req.user)
       
    } catch (error) {
        console.log("error in check auth controller", error.message);
        return res.status(400).json({message: "here internel server error"});
    }
}