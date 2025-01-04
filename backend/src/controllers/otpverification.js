import otpGenerator from "otp-generator";
import User from "../models/user.model.js";
import { jwt } from "jsonwebtoken";
import bcrypt from "bcryptjs";
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
        let otp = otpGenerator.generate(8);

        //let's hash the password
        const saltRounds=10;
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(password,salt);
        
        const tokenOtpVerification = jwt.sign(
            { fullName, email, password: hashedPassword, otp },
            process.env.JWT_SECRET,
            { expiresIn: '5m' } // Token expires in 5 minutes
          );
      
          // Check if the session already has a token
          if (req.session.tokenOtpVerification) {
            // Decode the existing token from the session
            const decodedToken = jwt.verify(req.session.tokenOtpVerification, process.env.JWT_SECRET);
      
            // If the email or details have changed, generate a new token
            if (decodedToken.email !== email || decodedToken.fullName !== fullName || decodedToken.password !== hashedPassword) {
              req.session.tokenOtpVerification = tokenOtpVerification; // Update session with new token
            } else {
              return res.status(200).json({ message: "OTP has already been sent. Please check your email." });
            }
          } else {
            // If no token exists, create a new session token
            req.session.tokenOtpVerification = tokenOtpVerification;
          }

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