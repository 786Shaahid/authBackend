import { userModel } from "../users/user.model.js";
import { friendModel } from "./friends.model.js";
// import mongoose from "mongoose";
import mongoose, { ObjectId } from "mongoose";
export class FriendRepository {
  /** 1. DEFINE  REPOSITORY FOR CREATE FRIEND */
  async addFriend(requester, accepter) {
    try {
      //1. find if friend is created
      const ifUserExits = await friendModel.findOne({ requester, accepter });
      // 2.if friend already exits with their id then update
      if (ifUserExits) {
        return { msg: "Alreay Requested !" };
      } else {
        // 3.  if user does not exits with that id then create new friend
        const userfriend = await friendModel.create({
          accepter,
          requester
        });
        const added = await userfriend.save();
        return added;
      }
    } catch (err) {
      console.log(err);
      return err;
    }
  }

  /** 2.DEFINE  REPOSITORY FOR GET ALL FRIEND REQUEST */
  async getAllFriendRequest(userId) {
    try {
      const userObjectId = new mongoose.Types.ObjectId(userId);
      const friends = await friendModel.aggregate([
        {
          $match: {
            $and: [
                  { accepter: userObjectId },
                  { status: "pending" }
            ]
          }
        }, {
          $addFields: {
            friends: {
              $cond: {
                if: {
                  $eq: ["$requester", userObjectId]
                },
                then: "$accepter",
                else: "$requester"
              }
            }

          }
        }, {
          $lookup: {
            from: "users",
            localField: 'friends',
            foreignField: '_id',
            as: 'friendDetails'
          }
        }, {
          $unwind: {
            path: '$friendDetails',
            preserveNullAndEmptyArrays: true
          }
        }, {
          $project: {
            'friendDetails._id': 1,
            'friendDetails.name': 1,
            "friendDetails.email": 1,
            'status': 1
          }
        }
      ])
      console.log("friends",friends);
      return friends;
    } catch (error) {
      console.log("error", error);
    }
  }

  /** 3.DEFINE  REPOSITORY FOR ACCEPT FRIEND REQUEST*/
  async acceptfriend(id) {
    try {
      const response = await friendModel.findByIdAndUpdate(
        { _id: id },
        {
          $set: {
            status: "accepted",
          },
        },
        {
          new: true,
        }
      );
      // console.log("response for the accept" , response);
      return response;
    } catch (error) {
      console.log(error);
    }
  }

  /** 4.DEFINE  REPOSITORY FOR REMOVE FRIEND */
  async removeFriend(id) {
    try {
      const response = await friendModel.findByIdAndDelete({ _id: id });
      return response;
    } catch (error) {
      console.log(error);
    }
  }

  /** 5.DEFINE  REPOSITORY FOR FIND MATUAL FRIEND(STATUS-ACCEPT) */
  async findFriends(userId) {
    let userObjectId = new mongoose.Types.ObjectId(userId);
    try {
      const response = await friendModel.aggregate([
        {
          $match: {
            $and: [
              {
                $or: [
                  { requester: userObjectId },
                  { accepter: userObjectId }
                ]
              },
              { status: "accepted" }
            ]
          }
        }, 
        {
          $addFields: {
            friends: {
              $cond: {
                if: {
                  $eq: ["$requester", userObjectId]
                },
                then: "$accepter",
                else: "$requester"
              }
            }

          }
        },
        {
          $lookup: {
            from: "users",
            localField: "friends",
            foreignField: '_id',
            as: 'acceptedFriendList'
          }
        },
        {
          $unwind: {
            path: '$acceptedFriendList',
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $project: {
            'acceptedFriendList._id': 1,
            'acceptedFriendList.name': 1,
            'acceptedFriendList.email': 1,
            'status': 1
          }
        }
      ]);
      //  console.log(response);
      return response;
    } catch (error) {
      console.log(error);
    }
  }
}
