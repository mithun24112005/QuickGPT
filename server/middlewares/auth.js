import jwt from "jsonwebtoken"
import User from "../models/user.js"

export const protect=async (req,res,next) => {
    try {
        let token = req.headers.authorization || req.headers.Authorization;
        if (!token) {
            return res.status(401).json({ success:false, message: "Not authorized, token missing" });
        }
        if (token.startsWith("Bearer ")) token = token.split(" ")[1];

        const decoded = jwt.verify(token,process.env.JWT_SECRET)
        const userId=decoded.id
        const user= await User.findById(userId)
        if(!user){
            return res.status(401).json({success:false,message:"Not authorized, user not found"})
        }
        req.user=user
        next()
    } catch (error) {
        res.status(401).json({success:false,message:"Not authorized, token failed"})
    }
}