import dotenv from "dotenv";
import { urlencoded } from "express";
dotenv.config();
import nodemailer from "nodemailer";

export const sendMailForOTP=async (email,otp)=>{
    // 1. create transporter 
    // console.log(process.env.GMAIL_ACCOUNT,process.env.GMAIL_PASSWORD);
     const transport= nodemailer.createTransport({
        service:"gmail",
        port:465,
        secure:true,
        auth:{
            user:process.env.GMAIL_ACCOUNT,
            pass:process.env.GMAIL_PASSWORD
        }
     });
    // 2.define  mail options
    // const mailOpt={
    //     from:process.env.GMAIL_ACCOUNT,
    //     to:
    // }
     // 2. send mail
     try{
         await transport.sendMail({
                from:process.env.GMAIL_ACCOUNT,
                to:email,
                subject:"OTP for login",
                text:`hii, Your OTP is ${otp} for login.`
         })
     }catch(err){
        console.log("err",err);
     }


}