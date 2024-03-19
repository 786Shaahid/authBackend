import { sendMailForOTP } from "../../configures/nodemailer.config.js";
import { ApiResponse } from "../../utility/apiResponse.utility.js";
import { ErrorHandle } from "../../utility/error.utility.js";
import BASE_URL_FRONTEND from "../../utility/fronendBaseUrl.utility.js";
import UserRepository from "./user.repository.js";
import jsonwebtoken from "jsonwebtoken";

export default class UserController {
  constructor() {
    this.userRepository = new UserRepository();
  }

  /** 1.DEFINE  CONTROLLER FOR USER SINGUP  */
  async signUp(req, res) {
    // console.log(req.body);
    try {
      const user = await this.userRepository.userSingUp(req.body);
      // console.log(user);
      return res
        .status(201)
        .json(new ApiResponse(true, "Registered Successfully !", ""));
    } catch (err) {
      console.log(err.message);
      return res
        .status(err?.status || 500)
        .json(new ErrorHandle(false, "Registration Failed !", err.message));
    }
  }

  /** 2.DEFINE  CONTROLLER FOR USER SINGIN  */
  async signIn(req, res) {
    try {
      // 1.find user from database
      const user = await this.userRepository.userSignIn(req.body);
      // console.log(user);
      if (!user) {
        
        return res
          .status(400)
          .json(new ErrorHandle(false, "Invalid user Credential !", {}));
      } else {
        // 2. create token, if user exist
        const accessToken = await this.generateAccessToken(user._id);
        const refreshToken = await this.generateRefreshToken(user._id);
        // 3. set the refreshToken to user
        user.refreshToken = refreshToken;
        await user.save();
        // 4. data to be   send to client side about user
        const userData = {
          _id: user._id,
          name: user.name,
        };
        return res.status(200).json(
          new ApiResponse(true, "Login successfully !", {
            userData,
            accessToken,
          })
        );
      }
    } catch (err) {
      console.log(err.message);
      return res
        .status(err?.status || 500)
        .json(new ErrorHandle(false, "Internal Server Error", err?.message ?? err.err ?? "something went wrong"));
    }
  }

  /** 3.DEFINE  CONTROLLER FOR USER LOGOUOT */
  async logout(req, res) {
        try {
      const userId= req.userId;
      // console.log('sessionId',req.sessionID);
      // req.logout((err)=>{
      //   if(err) {throw err};
      //      return  res.redirect(`${BASE_URL_FRONTEND}/signin`) 
      // });
      const logoutUser= await this.userRepository.logout(userId);
      if(logoutUser ){
        req.logout((err)=>{
            if(err) {throw err};
          })
          // res.redirect(`${BASE_URL_FRONTEND}/signin`) 
           res.clearCookie('connect.sid')
                  return res.status(200).json(
          new ApiResponse(true, "User Logout successfully ! ", '')
          );
        } else {
        return res
        .status(404)
        .json(new ErrorHandle(false, "Something Went Wronge !", {}));
      }

        } catch (err) {
          console.log(err);
          return res
        .status(err?.status || 500)
        .json(new ErrorHandle(false, "Internal Server Error", err?.message ?? err.err ?? "something went wrong"));
        }
  }

  /** 4.DEFINE  CONTROLLER FOR SENDING MAIL  */
  async sendMailOpt(req, res) {
    try {
      // console.log("sendMail-91",req.body);
      const randamPassword = this.getRandomPassword();
      const addOtpToDb = await this.userRepository.addOTP(
        req.body.email,
        randamPassword
      );
      // console.log('findUser-98',addOtpToDb)
      // send mail to registerd email id
      if (addOtpToDb) {
        const sendMail = await sendMailForOTP(addOtpToDb.email, randamPassword);
        return res.status(200).json(
          new ApiResponse(true, "Email is sent to your register email ID", "")
        );
      } else {
        return res
          .status(400)
          .json(new ErrorHandle(false,"","Please Enter Valid Email !"));

      }
    } catch (err) {
      // console.log(err);
      return res
        .status(err?.status || 500)
        .json(
          new ErrorHandle(
            false,
            "Internal Server Error !",
            err?.message ?? err.err ?? "something went wrong"
          )
        );
    }
  }

  /** 5.DEFINE  CONTROLLER FOR LOGIN USING EMAIL  */
  async loginWithOtp(req, res) {
    try {
      const otp = req.body.otp;
      const user = await this.userRepository.findUserWithOtp(otp);
      // console.log("user-loginwithotp", user);
      if (!user) {
        return res.status(404).json(new ErrorHandle(false,'','Invalid OTP ! '));
      } else {
         // 2. create token, if user exist
         const accessToken = await this.generateAccessToken(user._id);
         const refreshToken = await this.generateRefreshToken(user._id);
         // 3. set the refreshToken to user
         user.refreshToken = refreshToken;
         await user.save();
         // 4. data to be   send to client side about user
         const userData = {
           _id: user._id,
           name: user.name,
         };
         return res.status(200).json(
           new ApiResponse(true, "Login successfully !", {
             userData,
             accessToken,
             refreshToken,
           })
         );
      }
    } catch (err) {
      console.log(err);
      return res
        .status(err?.status || 500)
        .json(
          new ErrorHandle(
            false,
            "Internal Server Error !",
            err?.message ?? err.err ?? "something went wrong"
          )
        );
    }
  }
  /** 6.DEFINE  CONTROLLER FOR GETTING ALL USER  */
  async getAllUser(req, res) {
    try {
      let id = req.body.id;
      const users = await this.userRepository.getAll(id);
      return res.status(200).json(new ApiResponse(true, "", users));
    } catch (err) {
      console.log(err);
      return res
        .status(err?.status || 500)
        .json(
          new ErrorHandle(
            false,
            "Internal Server Error !",
            err?.message ?? err.err ?? "something went wrong"
          )
        );
    }

  }

  /** 7.DEFINE  CONTROLLER FOR GENERATE RANDOM PASSWORD */
  getRandomPassword() {
    return Math.round((Math.random() + 1) * 100000);
  }
  /** 8.DEFINE  CONTROLLER FOR GENERATE ACCESS TOKEN  */
  async generateAccessToken(id) {
    const token = await jsonwebtoken.sign(
      { id },
      process.env.ACCESS_SECRETE_TOKEN_KEY,
      {
        algorithm: "HS256",
      }
    );
    return token;
  }

  /** 9.DEFINE  CONTROLLER FOR GENERATE REFRESH TOKEN  */
  async generateRefreshToken(id) {
    const token = await jsonwebtoken.sign(
      { id },
      process.env.REFRESH_SECRETE_TOKEN_KEY,
      {
        algorithm: "HS256",
      }
    );
    return token;
  }
 
  /** 10 . DEFINE CONTROLLER FOR SOCIAT LOGIN SUCCESSFULLY */
  async socialLogin(req,res){
    // console.log('request hai bhai',req.id);
     try {
        // Take user id from session
        const id=req.user;
        console.log('id socaial login ',id);
        const user= await this.userRepository.userData(id);
        // console.log(user);
        if(!user){
          return res.status(404).json(new ErrorHandle(false,"Not Found",''));
        }else{
          const accessToken = await this.generateAccessToken(user._id);
          const userData = {
            _id: user._id,
            name: user.name,
          };
          return res.status(200).json(
            new ApiResponse(true, "Login successfully !", {
              userData,
              accessToken
            })
          );
        }
     } catch (error) {
      console.log(error);
      return res
        .status(err?.status || 500)
        .json(new ErrorHandle(false, "Internal Server Error", err?.message ?? err.err ?? "something went wrong"));
 
     }
  }
}
