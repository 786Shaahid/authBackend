import express from "express";
import UserController from "./user.controller.js";
import { authJWT } from "../../middlewares/authJWT.middleware.js";
import { googleAuth } from "../../configures/googleOauth.config.js";
import passport from "passport";
import { validateUser } from "../../middlewares/userValidate.middlewares.js";
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
  passport.authenticate("google", { scope: ["email", "profile"] }),
  (req,res)=>{
    console.log("google authentication",req," ",res);
  }
);
userRouter.get(
  "/auth/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    console.log(" request -",req);
    console.log(" response -",res);
    // res.send("google authentication complete");
  }
);

// facebook authentication 
userRouter.get('/auth/facebook',passport.authenticate("facebook",{
  scope: ['public_profile', 'email']
}


))
 userRouter.get("/auth/facebook/callback",passport.authenticate("facebook",{session:true}),(req,res)=>{
  // console.log("req",req);
  res.json({message:"login successfully bro"})
});  
// userRouter.get("/getdata",(req,res)=>{
//   const data={
//     "name":"shahid",
//     "passport":"raza",
//     "phone":"9090090"
//   }
//   return res.status(200).send(data);
// });

userRouter.post("/getall",(req,res)=>{
  userController.getAllUser(req,res);
});
// userRouter.post('/addfriend',(req,res)=>{
//   userController.addFriend(req,res);
// })
 
export default userRouter;
