import dotenv from 'dotenv';
dotenv.config();
import express from "express";
import userRouter from "./src/features/users/user.route.js";
import { connectDB } from "./src/configures/mongose.config.js";
import { authJWT } from './src/middlewares/authJWT.middleware.js';
import session from 'express-session';
import passport from 'passport';
import cors from 'cors';


// authentication configs
import { googleAuth } from './src/configures/googleOauth.config.js';
import {facebookAuth} from "./src/configures/facebookOauth.config.js";
import friendRouter from './src/features/friends/friends.route.js';
googleAuth();
facebookAuth();
// create server
const app=express();
const port =8080;

app.use(express.json({extended:true}));
app.use(express.urlencoded({ extended: true }));



// CORS policy configure
// app.use(cors({
    //     origin:"http://192.168.43.177:3000",
    //     allowedHeaders:"*"
    // }))
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
    app.use('/api/friends',authJWT,friendRouter);
    
    // const corsConfig=
    //     {
        //         // origin:"https://incredible-twilight-3ebe40.netlify.app/",
        //         origin:"http://localhost:3000",
        //         allowedHeaders:"*",
        //         credentials:true,
        //         optionsSuccessStatus:200
        //     }
        
        
        // app.use(cors(corsConfig));
        
        //defalut respone and req
        app.get('/',(req,res)=>{
            return res.send(" Hii shahid ,how are you");
        });


        // connecting mongooose
        connectDB()
        .then((connectedDb) => {
          app.listen(port, () => {
            console.log(`app listening on port ${port}`);
            console.log(`connected to DB :: ${connectedDb.name}`);
          });
        })
        .catch((error) => console.log(`${error} did not connect`));
        