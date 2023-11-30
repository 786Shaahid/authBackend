import dotenv from 'dotenv';
dotenv.config();
import express from "express";
import userRouter from "./src/features/users/user.route.js";
import { mongooseConnection } from "./src/configures/mongose.config.js";
import { authJWT } from './src/middlewares/authJWT.middleware.js';
import session from 'express-session';
import passport from 'passport';
import cors from 'cors';


// authentication configs
import { googleAuth } from './src/configures/googleOauth.config.js';
import {facebookAuth} from "./src/configures/facebookOauth.config.js";
facebookAuth();
googleAuth();
// create server
const app=express();
const port =8080;
// connecting mongooose
mongooseConnection();

// CORS policy configure
// app.use(cors({
//     origin:"http://192.168.43.177:3000",
//     allowedHeaders:"*"
// }))

app.use(express.json({extended:true}));
// session middleware
app.use(session({
    secret:"SECRETE",
    resave:false,
    saveUninitialized:true,
    cookie:{
        maxAge:60*60,
    }
}));
// setup the passport
app.use(passport.initialize());
app.use(passport.session());

// import user routers
app.use("/api/users",userRouter);

const corsConfig=
    {
        // origin:"https://incredible-twilight-3ebe40.netlify.app/",
        origin:"http://localhost:3000",
        allowedHeaders:"*",
        credentials:true,
        optionsSuccessStatus:200
    }

app.use(cors());


//defalut respone and req
app.get('/',(req,res)=>{
    return res.send(" Hii shahid ,how are you");
});

 
app.listen(port,(err)=>{
    if(err){
        console.log("Server is not connecting on port :",port);
    }
    console.log(`Sever is successfully connected on port: ${port}`);
})