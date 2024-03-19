import express from "express";
import UserController from "./user.controller.js";
import { authJWT } from "../../middlewares/authJWT.middleware.js";
import passport from "passport";
import { validateUser } from "../../middlewares/userValidate.middlewares.js";
import BASE_URL_FRONTEND from "../../utility/fronendBaseUrl.utility.js";
const userRouter = express.Router();
const userController = new UserController();

userRouter.post("/signup",validateUser, (req, res) => {
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

userRouter.get("/logout", authJWT, (req, res) => {
  userController.logout(req, res);
});

// google authentication
userRouter.get(
  "/auth/google",
  passport.authenticate("google", { scope: ['email', 'profile'] }
 ));
userRouter.get(
  "/auth/google/callback",
  passport.authenticate("google",
  {  
    successRedirect: `${BASE_URL_FRONTEND}`,
    failureRedirect: `${BASE_URL_FRONTEND}/signin` 
  
}
  ),
  );

// facebook authentication 
userRouter.get('/auth/facebook',passport.authenticate("facebook",
{
  scope: ['public_profile', 'email']
}
));
 userRouter.get("/auth/facebook/callback",passport.authenticate("facebook",
 {
  successRedirect: `${BASE_URL_FRONTEND}`,
  failureRedirect: `${BASE_URL_FRONTEND}/signin` 
}
));  

 userRouter.post("/getall",(req,res)=>{
  userController.getAllUser(req,res);
});
userRouter.get('/login/success',(req,res)=>{
  userController.socialLogin(req,res);
});
 
export default userRouter;
