import passport from "passport";
// import environmentConfig from "./environment.config.js";
import {Strategy as facebookStrategy } from  "passport-facebook";
import { userModel } from "../features/users/user.model.js";
import bcrypt from 'bcrypt';
import UserController from "../features/users/user.controller.js";
const userController= new UserController();

export const facebookAuth=()=>{
    // console.log("facebookid-",process.env.FACEBOOK_CALLBACKURL);
    passport.use(new facebookStrategy({
        clientID:process.env.FACEBOOK_APPID,
        clientSecret:process.env.FACEBOOK_APP_SECRET,
        callbackURL:process.env.FACEBOOK_CALLBACKURL
    },
    async (accessToken,refreshToken,profile,done)=>{
     try {
      //  console.log("hii answer fkjhsdkfhasd");
        //  console.log('profile facebook',profile);
          const email= profile.emails[0];
          const name=profile.displayName;
          const user= await userModel.findOne({email});
          const password= await bcrypt.hash((Math.random()*12).toString(),12) ;
          const refreshToken= await userController.generateRefreshToken(user._id);
       
          if(!user){
            //      create user, if not exit
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
           return done(null,user._id);
     } catch (error) {
           return done(error,null)

     }
    }
    ));

    // passport.serializeUser((user, cb) => {
    //   console.log('serialize-facebook',user);
    //     process.nextTick(() => {
    //       cb(null, user);
    //     });
    //   });
    //   passport.deserializeUser((user, cb) => {
    //     process.nextTick(() => {
    //       return cb(null, user);
    //     });
    //   });
}

