import { sendMailForOTP } from "../../configures/nodemailer.config.js";
import UserRepository from "./user.repository.js";
import jsonwebtoken from "jsonwebtoken";

export default class UserController {
  constructor() {
    this.userRepository = new UserRepository();
  }

  async signUp(req, res) {
    try {
      const user = await this.userRepository.userSingUp(req.body);
      return res.status(201).send(user);
    } catch (err) {
      console.log(err.message);
      return res.status(400).send(err.message);
    }
  }

  async signIn(req, res) {
    try {
      const user = await this.userRepository.userSignIn(req.body);

      if (!user) {
        return res.status(400).send("Invalid credential !");
      } else {
        const token = await jsonwebtoken.sign(
          { email: user.email, _id: new ObjectID(user.id) },
          process.env.SECRETE_KEY,
          {
            expiresIn: "1h",
            algorithm: "HS256",
          }
        );
        return res.status(200).send(token);
      }
    } catch (err) {
      console.log(err);
      return res.status(400).send(err.message);
    }
  }
    async logout(req,res){
          
    }

  async sendMailOpt(req, res) {
    try {
      const randamPassword = this.getRandomPassword();
      const addPassToDb = await this.userRepository.addPassword(
        req.body.email,
        randamPassword
      );
      // send mail to registerd email id
      if (addPassToDb) {
        await sendMailForOTP(addPassToDb.email, randamPassword);
        return res.status(200).send("Email is sent to your register email ID")
      } else {
        return res.status(400).send("user is not registered,Please singup first !");
      }
    } catch (err) {
      console.log(err);
      return res.status(400).send(err);
    }
  }

  async loginWithOtp(req, res) {
    try {
      const otp = req.body.otp;
      const user = await this.userRepository.findUserWithOtp(otp);
      // console.log("user", user);
      if (!user) {
        return res.status(404).send("Invalid OTP");
      } else {
        const jwt = await jsonwebtoken.sign(
          { id: user._id, email: user.email },
          process.env.SECRETE_KEY,
          {
            expiresIn: "1h",
            algorithm: "HS256",
          }
        );
        return res.status(400).send(jwt);
      }
    } catch (err) {
      console.log(err);
      return res.status(400).send(err);
    }
  }

  getRandomPassword() {
    return Math.round((Math.random() + 1) * 100000);
  }
}
