// import dotenv from 'dotenv';
// dotenv.config();
import env from "./src/utility/environment.utility.js";
import express from "express";
import userRouter from "./src/features/users/user.route.js";
import { connectDB } from "./src/configures/mongose.config.js";
import { authJWT } from './src/middlewares/authJWT.middleware.js';
import session from 'express-session';
import passport from 'passport';
import cors from 'cors';
import { Server } from 'socket.io';
import http from 'http'

// authentication configs
import { googleAuth } from './src/configures/googleOauth.config.js';
import {facebookAuth} from "./src/configures/facebookOauth.config.js";
import friendRouter from './src/features/friends/friends.route.js';
import { chatConnection } from './src/configures/socket.config.js';
googleAuth();
facebookAuth();
// create server
const app=express();
const port =process.env.PORT || 8080;

// Create an HTTP server and integrate with Socket.io
const  server= http.createServer(app);
export  const io= new Server(server,{
  cors:{
     origin:true,
     methods: ["GET", "POST"],
     transports: ['websocket', 'polling'],
     credentials: true
  },
  // pingTimeout: 60000,
  allowEIO3: true
});

chatConnection(io, server);

app.use(express.json({extended:true}));
app.use(express.urlencoded({ extended: true }));
app.set('trust proxy', 1);



    app.use(session({
        secret:"SECRETE",
        resave:false,
        saveUninitialized:true,
        cookie:{
          maxAge:60*60,
        }
      }));
      // setup the passport middleware
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
        