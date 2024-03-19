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
import BASE_URL_FRONTEND from "./src/utility/fronendBaseUrl.utility.js";
googleAuth();
facebookAuth();
// create server
const app=express();
const port =process.env.PORT || 8080;

/**   CREATE AN HTTP SERVER AND INTEGRATE WITH SOCKET.IO*/ 
const  server= http.createServer(app);
export  const io= new Server(server,{
  cors:{
    origin: BASE_URL_FRONTEND,
     methods: ["GET", "POST"],
     transports: ['websocket', 'polling'],
  },
});

chatConnection(io);

  /** CONFIGURATION  */
  app.use(express.json({extended:true}));
  app.use(express.urlencoded({ extended: true }));
  app.use(helmet());
  app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
  
  
  app.use(cors({ origin: true, credentials: true }));

  // app.set('trust proxy', 1); for proxy

  
  app.use(session({
    secret:process.env.SESSION_SECRET_KEY,
    resave:false,
    saveUninitialized:true,
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
          server.listen(port, () => {
            console.log(`app listening on port ${port}`);
            console.log(`connected to DB :: ${connectedDb.name}`);
          });
        })
        .catch((error) => console.log(`${error} did not connect`));
        