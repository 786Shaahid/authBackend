import dotenv from 'dotenv';
dotenv.config();
import mongoose from "mongoose";
const url=process.env.DB_URL;
export const connectDB = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const connection = await mongoose.connect(url);
      if (connection) {
        return resolve(connection.connections[0]);
      } else {
        throw "failed to find db connection";
      }
    } catch (err) {
      return reject(err);
    }
  });
};