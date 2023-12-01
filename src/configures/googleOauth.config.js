import passport from "passport";
import { userModel } from "../features/users/user.model.js";
import googelAuth from "passport-google-oauth2";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import e from "express";
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
      async (request, accessToken, refreshToken, profile, done) => {
        //  console.log("accessToken",accessToken);
        const email = profile.emails[0].value;
        console.log("email" ,email);
        return done(null,profile)
        
      }
    )
  );

  passport.serializeUser((user, cb) => {
    process.nextTick(() => {
      console.log(user);
      cb(null, user);
    });
  });
  passport.deserializeUser((user, cb) => {
    process.nextTick(() => {
      return cb(null, user);
    });
  });
};
