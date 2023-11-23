import passport from "passport";
import { userModel } from "../features/users/user.model.js";
import googelAuth from "passport-google-oauth2";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
const GoogleStrategy = googelAuth.Strategy;

export const googleAuth = () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: process.env.CALLBACK_URL,
      },
      async (request, accessToken, refreshToken, profile, done) => {
        //  console.log("accessToken",accessToken);
        //  return done(null,profile.email)
        const email = profile.emails[0].value;
        try {
          //1.  if find user exits in database
          const userExits = await userModel.findOne({ email });
          if (userExits) {
            return done(null, userExits);
          }
          //2. generate jwt token
          const token = jwt.sign(
            {
              email,
            },
            process.env.SECRETE_KEY,
            {
              expiresIn: "1h",
              algorithm: "HS256",
            }
          );
          console.log(token);
          const num=String(Math.floor(Math.random()+1)*10000);
          const hashPassword= await bcrypt.hash(num,12);
          // 3.  if new user ,then save to database
          const newUser = new userModel({
            name: profile.displayName,
            email: profile.email,
            password:hashPassword
          });
          await newUser.save();
          return done(null, newUser);
        } catch (err) {
          return done(err, false);
        }
      }
    )
  );

  passport.serializeUser((user, cb) => {
    process.nextTick(() => {
      cb(null, user);
    });
  });
  passport.deserializeUser((user, cb) => {
    process.nextTick(() => {
      return cb(null, use);
    });
  });
};
