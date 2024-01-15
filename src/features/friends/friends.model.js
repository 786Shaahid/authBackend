import mongoose from 'mongoose';
const friendSchema= new mongoose.Schema({
            requester:{
            type: mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true
           }, 
           accepter:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User',
            required:true
           },
           status:{
            type:String,
            enum: ['pending', 'accepted'],
            default:"pending"
           }
},{timestamps:true});
  
export const friendModel= mongoose.model("Friend",friendSchema);