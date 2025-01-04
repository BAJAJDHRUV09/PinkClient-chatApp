import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export const mailSender = async (email,title,body) => {
    try{
        let transporter = nodemailer.createTransport({
            service : "Gmail",
            host : "smtp.gmail.com",
            port: 465,                 
            secure: true,  
            auth : {
                user : process.env.User_nodemailer,
                pass : process.env.Pass_nodemailer,
            }       
        });
        console.log(email,title,body);
        let info = await transporter.sendMail({
            from: `"PinkClient" <${process.env.MAIL_user}>`,
            to: email,
            subject: title,
            html: body,
          });
          console.log("Email info: ", info);
          return info;
    }catch(error){
        console.log(error.message);
    }
};