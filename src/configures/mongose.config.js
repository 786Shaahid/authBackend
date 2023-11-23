import dotenv from 'dotenv';
dotenv.config();
import mongoose from "mongoose";
const url=process.env.DB_URL;
export const mongooseConnection=async ()=>{
  try{
       mongoose.connect(url);
    // to make sure connection with database
    const db =await mongoose.connection;
     db.on("error", (err)=>{console.log("Connection error!")});
     db.once("open",()=>{
      console.log("Connected to database successfull !");
     });
  }catch(err){
    console.log(err);
  }

}
