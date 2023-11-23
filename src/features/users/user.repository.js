import { userModel } from "./user.model.js"
import bcrypt from "bcrypt";
export default class UserRepository{
      
      async userSingUp(user){
        const {name,email,password}=user;
        try{
          // hashing password
          const salt= 12;
          const hashPassword=await bcrypt.hash(password,salt);
          const userDetails= await userModel({
            name:name,
            email:email,
            password:hashPassword
          });
          return  userDetails;
        }catch(err){
          console.log(err);
        }
      }

      async userSignIn(userData){
        const {email,password}=userData;
        try{
          const user= await userModel.findOne({email});
          const camparePassword= await bcrypt.compare(password,user.password);
          if(user && camparePassword ){
            return user;
          }
        }catch(err){
          console.log(err);
        }
      }

    async addPassword(email,otp){
       try{
        const user=  await userModel.findOneAndUpdate(
          {email:email},
          {$set:{OTP:otp}}
          );
          if(user){
            return user;
          }else{
            console.log("user invalid");
          }
       }catch(err){
        console.log(err);
       }
    }
 async findUserWithOtp(otp){
  try{
    const user=  await  userModel.findOne({OTP:otp});
    // console.log(user);
     return user;
  }catch(err){
    console.log(err);
  }
 }      
}