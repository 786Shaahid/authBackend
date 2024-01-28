import dotenv from 'dotenv';
dotenv.config();
import passport from "passport";
import { userModel } from "../features/users/user.model.js";
import googelAuth from "passport-google-oauth2";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
const GoogleStrategy = googelAuth.Strategy;

export const googleAuth = () => {
  // console.log(process.env.CALLBACK_URL)
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: process.env.CALLBACK_URL,
      },
      async (request, accessToken,refreshToken, profile, done) => {
        //  console.log("accessToken",accessToken);
        const email = profile.emails[0].value;
        const user= await userModel.findOne({email});
        refreshToken=refreshToken.id_token;
        // console.log(profile._json.name);
        if(!user){
            // create user if not exit

         user= await userModel.create({
          name:profile._json.name,
          email,
          password:Math.random()*10,
          refreshToken
         }) ;
        }else{
          user.refreshToken = refreshToken;
            await user.save();
        }

        // console.log(user);
        // create token 
         accessToken= jwt.sign({id:user._id},process.env.ACCESS_SECRETE_TOKEN_KEY,
          {
            algorithm: "HS256",
          });
          const userData = {
            _id: user._id,
            name: user.name,
          };
        // console.log("email" ,refreshToken.id_token);
        return done(null,{
           userData,
          accessToken,
          refreshToken
        })
        
      }
    )
  );

  passport.serializeUser((user, cb) => {
    console.log("user" ,user);
    process.nextTick(() => {
      cb(null, user);
    });
  });
  passport.deserializeUser((user, cb) => {
    process.nextTick(() => {
      // console.log(user);
      return cb(null, user);
    });
  });
};
