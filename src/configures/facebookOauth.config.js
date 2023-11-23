import passport from "passport";
import faceBook from  "passport-facebook";
const facebookStrategy=faceBook.Strategy;

export const facebookAuth=()=>{
    // console.log("facebookid",process.env.FACEBOOK_APPID);
    passport.use(new facebookStrategy({
        clientID:process.env.FACEBOOK_APPID,
        clientSecret:process.env.FACEBOOK_APP_SECRET,
        callbackURL:process.env.FACEBOOK_CALLBACKURL
    },(accessToken,refreshToken,profile,done)=>{
        console.log(profile);
          return done(null,profile)
    }   
    
    ));

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
}

