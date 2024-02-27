import { ApiResponse } from "../../utility/apiResponse.utility.js";
import { ErrorHandle } from "../../utility/error.utility.js";
import { FriendRepository } from "./friends.repository.js";

export class FriendController{
    constructor(){
        this.friendRepository= new FriendRepository();
    }
    
    
   /** 1. DEFINE  CONTROLLER FOR ADDING FRIEND  */
    async addFriend(req,res){
        const {userId,friendId}=  req.body;
              try{
                const added= await this.friendRepository.addFriend(userId,friendId);
                // console.log('added',added);
                if(added.message){
                  return res.status(400).json(new ErrorHandle(false,added.message,{}));
                }
                return res.status(201).json(new ApiResponse(true,'send friend request successfully ',''));
              }catch(err){
                console.log("err",err);
                return res
                .status(err?.status || 500)
                .json(
                  new ErrorHandle(
                    false,
                    "Internal Server Error !",
                    err?.message ?? err.err ?? "something went wrong"
                  )
                );              }
        }
/** 2.  DEFINE  CONTROLLER FOR REMOVE FRIEND  */
   async removeFriend(req,res){
    try {
      const id=req.body.id;
      const removeFriend= await this.friendRepository.removeFriend(id);
      // console.log(removeFriend);  
      if(!removeFriend){
       return res.status(400).json(new ErrorHandle(false,"Friend Does Not Exit",{}));
      }
      return res.status(200).json(new ApiResponse(true,"Removed friend",removeFriend._id));
     } catch (error) {
      return res
      .status(err?.status || 500)
      .json(
        new ErrorHandle(
          false,
          "Internal Server Error !",
          err?.message ?? err.err ?? "something went wrong"
        )
      );     }
   }

/** 3. DEFINE  CONTROLLER FOR USER SINGIN  */ 
  async acceptFriend(req,res){
         try {
          const id=req.body.id;
          const acceptFriend= await this.friendRepository.acceptfriend(id);
          // console.log(acceptFriend);
          if(!acceptFriend){
           return res.status(400).json(new ErrorHandle(false,"NO Friend In The Accept Friend List",{}));
          }
          return res.status(200).json(new ApiResponse(true,"Sending the your response",acceptFriend._id));
         } catch (error) {
          return res
          .status(err?.status || 500)
          .json(
            new ErrorHandle(
              false,
              "Internal Server Error !",
              err?.message ?? err.err ?? "something went wrong"
            )
          );         }
   
        }
/** 4. DEFINE  CONTROLLER FOR GET ALL FRIEND REQUEST  */ 
   async getAllFriendRequest(req,res){
     try {
          const userId=req.userId;
          // console.log('id hai bhai',userId);
          const friendRequest= await this.friendRepository.getAllFriendRequest(userId);
          // console.log(friendRequest );
         if (!friendRequest){
              return res.status(400).json(new ErrorHandle(false,'No Friend Request Found',{}))
          }
          return res.status(200).json(new ApiResponse(true,'Getting  List of All Friend Request',friendRequest))
          
        } catch (error) {
          return res
        .status(err?.status || 500)
        .json(
          new ErrorHandle(
            false,
            "Internal Server Error !",
            err?.message ?? err.err ?? "something went wrong"
          )
        );
        }
        // console.log("getall friends",userId);
   }
    
/** 5. DEFINE  CONTROLLER FOR FRIEND LIST WHO ACCEPT FRIEND'S REQUEST */ 
    async friendList(req,res){
      try {
        const userId=req.userId;
       
        const friendList= await this.friendRepository.findFriends(userId);
        // console.log(friendList );
       if (!friendList){
            return res.status(400).json(new ErrorHandle(false,'No friend in the list',{}))
        }
        return res.status(200).json(new ApiResponse(true,'',friendList))
        
      } catch (error) {
        return res
        .status(err?.status || 500)
        .json(
          new ErrorHandle(
            false,
            "Internal Server Error !",
            err?.message ?? err.err ?? "something went wrong"
          )
        )
      }
     }
}