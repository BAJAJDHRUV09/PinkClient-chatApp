import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils.js";
import cloudinary from "../lib/cloudinary.js"
import otpGenerator from "otp-generator";
import jwt  from "jsonwebtoken";
import {mailSender} from "../lib/mailSender.js";

export const signup = async (req,res) => {
    const {fullName,email,password} = req.body;
    try{

        //not allowing signingup if the user is already registered.
        const checkIfUserIsPresent = await User.findOne({email});
        if(checkIfUserIsPresent){
            return res.status(401).json({message:"user is already registered.Try logging in."})
        }
        
        //generating otp
        let otp = otpGenerator.generate(4, { 
          upperCaseAlphabets: false, 
          specialChars: false, 
          lowerCaseAlphabets: false, 
          digits: true 
      });

        //let's hash the password & add salt(which is a kind of random data that enhances protection)
        const saltRounds=10;
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(password,salt);
        
        const tokenOtpVerification = jwt.sign(
            { fullName, email, password: hashedPassword, otp },
            process.env.JWT_SECRET,
            { expiresIn: '5m' } // Token expires in 5 minutes
          );
          
        // we'll store the generated otp in jwt_token and we'll verify that
        // like otp verification will be done by that
        try {
            const mailResponse = await mailSender(
              email,
              "Verification Email",
              `<h1>Here is your OTP for SigningUp on PinkClient</h1>
               <p>${otp}</p>`
            );
            console.log("Email sent successfully: ", mailResponse);
          } catch (error) {
            console.log("Error occurred while sending email: ", error);
            throw error;
        }
       
        res.status(200).json({ message: 'OTP sent to your email.', tokenOtpVerification });

    }catch(error){
        console.log(error);
        return res.status(500).json({ message:"Internal server error." });
    }
}

export const otpverification = async (req,res)=>{
    const {tokenOtpVerification,otp} =req.body;

    try{

        const decoded = jwt.verify(tokenOtpVerification, process.env.JWT_SECRET);
        if (decoded.otp !== otp) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        console.log(decoded);

        const newUser = new User({
            fullName: decoded.fullName,
            email: decoded.email,
            password: decoded.password, // Already hashed
          });

        //generating token for them and cookie 
        if(newUser){
            generateToken(newUser._id,res);
            await newUser.save();
            //status code -> 201 -> something has been created 
            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email : newUser.email,
                profilePic : newUser.profilePic
            })
        }else{
            res.status(404).json({message:"Invalid user data. Please enter your credentials properly."})
        }

    }catch(error){
        console.log("error in signup controller :",error.message)
        res.status(500).json({
            message:"Sorry, Internal Sever Error",
            error: error.message
        })
        //this status code -> 500 : Internal errors
    }
};

export const login = async (req,res)=>{
    const {email,password} = req.body;
    try{
        const user = await User.findOne({email})

        //first i will check if the email exists
        if(!user){
            return res.status(404).json({message:"Invalid credentials"});
        }

        //then i'll check if the password is correct or not
        const isUserPassCorrect = await bcrypt.compare(password,user.password);

        if(!isUserPassCorrect){
            return res.status(404).json({message:"Invalid credentials"});
        }

        generateToken(user._id,res);

        res.status(200).json({
            _id : user._id,
            fullName: user.fullName,
            email : user.email,
            profilePic: user.profilePic,
        });
    }
    catch(error){
        console.log("Error in login controller :" , error.message);
        res.status(500).json({message: "Internal Server error"});
    }
};

export const logout =  (req, res) => {
    try{
    res.cookie("jwt_token", "", { 
        maxAge: 0,             
        httpOnly: true,        
        sameSite: "Strict",     
        secure: process.env.NODE_ENV !== "development" 
    });


    res.status(200).json({ message: "Logged out successfully" });
    }
    catch(error){
        res.status(500).json({message:"Internal server error"});
    }
};

//in updating the profile we hve to pass the image as base64 string.. so any image can be converted to base string with help of this website https://www.base64-image.de
export const updateProfile = async (req,res)=>{
    try{
        const {profilePic} = req.body;
        const userId = req.user._id;
        
        if(!profilePic){
            return res.status(400).json({message: "Profile pic is reqiured."})
        }

        //so i have to upload the user's image to cloudinary but cloudinary is not a database it's just a bucket where i keep my things so i can keeop my things there and in mongodb i can update where i need to with that url of bucket

        //so upload the image in cloudinary and i try to grab the url
        const uploadResponse = await cloudinary.uploader.upload(profilePic);

        //find by id give what we i need to update.. setting new -> true ensures the response getting after we update so that i can show user what is updated and to ensure its correct
        const updatedUser = await User.findByIdAndUpdate(userId,{profilePic:uploadResponse.secure_url},{new:true})

        return res.status(200).json(updatedUser);

    }catch(error){
        res.status(500).json({message:"Internal server error."});
        console.log("error in updating profile:",error.message);
    }
};

export const checkAuth = (req,res) => {
    try{
        res.status(200).json(req.user);
    }catch(error){
        console.log("Error in checkAuth controller: ", error.message);
        res.status(500).json({message:"Internal Sever error."});
    }
}; 