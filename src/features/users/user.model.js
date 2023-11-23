import mongoose  from "mongoose";

const userSchema= new mongoose.Schema({
    name:{
        type:String,
        required:true,
        minlength:4,
        maxlength:255
    },
    email:{
        type:String,
        required:true,
        unique:true,
        minlength:8,
        maxlength:225
    },
    password:{
        type:String,
        required:true,
        minlength:6,
    },
    OTP:{
        type:String,
        default:""
    }
});

export const userModel=mongoose.model("User",userSchema);