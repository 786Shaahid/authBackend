
import express from "express";
import { FriendController } from "./friends.controller.js";

const friendRouter= express.Router();
const friendController= new FriendController();

friendRouter.post('/addfriend',(req,res)=>{
    friendController.addFriend(req,res);
  });
friendRouter.post('/acceptfriend',(req,res)=>{
    friendController.acceptFriend(req,res);
  });
friendRouter.post('/removefriend',(req,res)=>{
    friendController.removeFriend(req,res);
  });
friendRouter.get('/getAllFriendRequest',(req,res)=>{
    friendController.getAllFriendRequest(req,res);
  });
friendRouter.post('/friendlist',(req,res)=>{
    friendController.friendList(req,res);
  });
friendRouter.post('/sendMessage',(req,res)=>{
    friendController.sendMessageToServer(req,res);
  });
friendRouter.post('/isFriend',(req,res)=>{
    friendController.sendRequest(req,res);
  });
  export default friendRouter;