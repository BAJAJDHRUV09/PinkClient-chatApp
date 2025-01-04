import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

//this middleware helps to ensure if the user is authenticated or not 
export const protectRoute = async (req,res,next) => {
    try{
        const token = req.cookies.jwt_token;
        if(!token){
            return res.status(401).json({message:"Unauthourized : No token provided"});
        }   

        //first verification of token 
        const tokenVerification = jwt.verify(token,process.env.JWT_SECRET);

        if(!tokenVerification){
            return res.status(401).json({message:"Unauthourized user."});
        }

        
        //if the token is verified then we check their data in my database.
        const user = await User.findById(tokenVerification.id).select("-password");

        if(!user){
            return res.status(401).json({message:"User not found."});
        }

        req.user = user;

        next();

    }
    catch(error){
        res.status(500).json({message:"Internal server error."});
        console.log("error in protectRoute middleware",error.message);
    }
};
