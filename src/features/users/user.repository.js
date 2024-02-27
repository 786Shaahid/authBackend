import mongoose from "mongoose";
import { userModel } from "./user.model.js";
import bcrypt from "bcrypt";

export default class UserRepository {

  /** 1.DEFINE  REPOSITORY FOR USER SINGUP */
  async userSingUp(user) {
    const { name, email, password } = user;
    try {
      //1. hashing password
      const salt = await bcrypt.genSalt(12);
      const hashPassword = await bcrypt.hash(password, salt);

      // 2.  create  new user
      const userDetails = await userModel({
        name: name,
        email: email,
        password: hashPassword,
      });
      // 3. save the user
      return await userDetails.save();
    } catch (err) {
      console.log(err);
    }
  }

  /** 2.DEFINE  REPOSITORY FOR USER SINGIN */
  async userSignIn(userData) {
    // 1. take form data
    const { email, password } = userData;
    try {
      // 2. find user using the email
      const user = await userModel.findOne({ email }).select("-OTP  -refreshToken");
      // console.log(user);
      // 3. compare password with hash password
      const camparePassword = await bcrypt.compare(password, user.password);
      if (user && camparePassword) {
        return user;
      }
    } catch (err) {
      console.log(err);
    }
  }

/** 3.DEFINE  REPOSITORY FOR ADD OTP */
  async addOTP(email, otp) {
    try {

      const user = await userModel.findOneAndUpdate(
        { email: email },
        { $set: { OTP: otp } }
      );
      if (user) {
        return user;
      } else {
        console.log("user invalid");
      }
    } catch (err) {
      console.log(err);
    }
  }
/** 4.DEFINE  REPOSITORY FOR FIND USER BY OTP */
  async findUserWithOtp(otp) {
    try {
      const user = await userModel.findOne({ OTP: otp });
      // console.log(user);
      return user;
    } catch (err) {
      console.log(err);
    }
  }
  /** 5.DEFINE  REPOSITORY FOR GET ALL USER */
  async getAll(id) {
    try {
      const userObjectID = new mongoose.Types.ObjectId(id);
      const users = await userModel.aggregate([
        {
          $match: {
            _id: { $ne: userObjectID },
          },
        },
        {
          $lookup: {
            from: 'friends',
            let: { userId: '$_id' },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $or: [
                      {
                        $and: [
                          { $eq: ['$requester', '$$userId'] },
                          { $eq: ['$accepter', userObjectID] },
                        ],
                      },
                      {
                        $and: [
                          { $eq: ['$accepter', '$$userId'] },
                          { $eq: ['$requester', userObjectID] },
                        ],
                      },
                    ],
                  },
                },
              },
            ],
            as: 'friendship',
          },
        }, {
          $unwind: {
            path: '$friendship',
            preserveNullAndEmptyArrays: true,
          }
        }, 
        {
          $project: {
            "name": 1,
            "email": 1,
            "friendship._id": 1,
             "friendship.status":1 
          }
        }
      ]);
      console.log("users",users);
      return users;
    } catch (error) {
      console.log(error);
    }
  }
  /** 6.DEFINE  REPOSITORY FOR LOGOUT*/
  async logout(id){
    try {
      const user= await userModel.findByIdAndUpdate(id, {
        $set:{
          refreshToken:"" ,
          OTP:""
        }},
        {new :true}
        );
      if(user){
        return user
      }else{
        return ''
      }

    } catch (error) {
      console.log(error);
    }
  }
}