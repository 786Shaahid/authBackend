import express from "express";
import UserController from "./user.controller.js";
import { authJWT } from "../../middlewares/authJWT.middleware.js";
import { googleAuth } from "../../configures/googleOauth.config.js";
import passport from "passport";
const userRouter = express.Router();
const userController = new UserController();


userRouter.post("/signup", (req, res) => {
  userController.signUp(req, res);
});
userRouter.post("/signin", (req, res) => {
  userController.signIn(req, res);
});
userRouter.post("/sendmail", (req, res) => {
  userController.sendMailOpt(req, res);
});
userRouter.post("/singinotp", (req, res) => {
  userController.loginWithOtp(req, res);
});

userRouter.delete("/logout", authJWT, (req, res) => {
  userController.logout(req, res);
});

// google authentication
userRouter.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);
userRouter.get(
  "/auth/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    res.send("google authentication complete go for log in");
  }
);

// facebook authentication 
userRouter.get('/auth/facebook',passport.authenticate("facebook",{
  scope: ['public_profile', 'email']
}
))
 userRouter.get("/auth/facebook/callback",passport.authenticate("facebook",{session:false}),(req,res)=>{
    res.send("loged in with facebook successfully")
 })
userRouter.get("/getdata",(req,res)=>{
  const data={
    "name":"shahid",
    "passport":"raza",
    "phone":"9090090"

  }
  return res.status(200).send(data);
})
 
export default userRouter;
