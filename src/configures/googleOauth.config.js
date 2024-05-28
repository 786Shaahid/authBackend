import environmentConfig from "./environment.config.js";
import passport from "passport";
import { userModel } from "../features/users/user.model.js";
import {Strategy as GoogleStrategy} from "passport-google-oauth2";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import env from '../../environment.js';
import UserController from '../features/users/user.controller.js';
const userController= new UserController();


export const googleAuth = () => {
  console.log(env)
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: env.callback_url,
        scope: ["email", "profile"]
        // profileField:[]
            },
      async (req,accessTokens,refreshTokens, profile, done) => {
        // console.log("accessToken",profile.emails[0]);
        // console.log(profile);
        try {
          const email = profile.emails[0].value;
          const name= profile.displayName;
          const user= await userModel.findOne({email});
          // const salt= bcrypt.genSalt(12);
          const password= await bcrypt.hash((Math.random()*12).toString(),12)
          // const accessToken= await userController.generateAccessToken(user._id);
          const refreshToken=await  userController.generateRefreshToken(user._id);
          // console.log('token',refreshToken);
          if(!user){
          //      create user if not exit
           user= await userModel.create({
            name,
            email,
            password,
            refreshToken
           }) ;
          }else{
            user.refreshToken = refreshToken;
            await user.save();
          }
          // console.log(req);
            // const userData = {
            //   _id: user._id,
            //   name: user.name,
            // };
        //   // console.log("email" ,refreshToken.id_token);
        //   // return done(null,profile.emails[0].value)
          return done(null,user._id);
        } catch (error) {
          return done(error,null)
        }
        
      }
    )
  );

  passport.serializeUser((id, cb) => {
    console.log("serializeUser" ,id);
    process.nextTick(() => {
      cb(null, id);
    });
  });
  
  passport.deserializeUser((id, cb) => {
    // console.log("deserializeUser" ,user);
    process.nextTick(() => {
      return cb(null, id);
    });
  });
};
