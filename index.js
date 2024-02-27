import env from "./src/configures/environment.config.js";
import express from "express";
import userRouter from "./src/features/users/user.route.js";
import { connectDB } from "./src/configures/mongose.config.js";
import { authJWT } from './src/middlewares/authJWT.middleware.js';
import session from 'express-session';
import passport from 'passport';
import cors from 'cors';
import { Server } from 'socket.io';
import http from 'http'
import helmet from "helmet";
/**  AUTHENTICATION CONFIGS */
import { googleAuth } from './src/configures/googleOauth.config.js';
import {facebookAuth} from "./src/configures/facebookOauth.config.js";
import friendRouter from './src/features/friends/friends.route.js';
import { chatConnection } from './src/configures/socket.config.js';
googleAuth();
facebookAuth();
// create server
const app=express();
const port =process.env.PORT || 8080;

/**   CREATE AN HTTP SERVER AND INTEGRATE WITH SOCKET.IO*/ 
const  server= http.createServer(app);
export  const io= new Server(server,{
  cors:{
     origin:true,
     methods: ["GET", "POST"],
     transports: ['websocket', 'polling'],
     credentials: true
  },
  allowEIO3: true
});

chatConnection(io, server);

  /** CONFIGURATION  */
  app.use(cors({origin: true, credentials: true}));
app.use(express.json({extended:true}));
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));


// app.set('trust proxy', 1);
app.use(session({
    secret:"SECRETE",
    resave:false,
    saveUninitialized:true,
    cookie:{
      maxAge:60*60,
    }
  }));



      /**  SETUP THE PASSPORT MIDDLEWARE*/ 
      app.use(passport.initialize());
      app.use(passport.session());
      
    /**ROUTERS */
    app.use("/api/users",userRouter);
    app.use('/api/friends',authJWT,friendRouter);
    
        //defalut respone and req for testing
        app.get('/',(req,res)=>{
            return res.send(" Hii shahid ,how are you");
        });


        /** CONNECTION DB AND LISTENING*/ 
        connectDB()
        .then((connectedDb) => {
          app.listen(port, () => {
            console.log(`app listening on port ${port}`);
            console.log(`connected to DB :: ${connectedDb.name}`);
          });
        })
        .catch((error) => console.log(`${error} did not connect`));
        