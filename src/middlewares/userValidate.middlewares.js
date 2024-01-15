import { ExpressValidator, body, validationResult } from "express-validator";
import {userModel} from '../features/users/user.model.js'
import { ErrorHandle } from "../utility/error.utility.js";
import e from "express";

export const validateUser = async (req, res, next) => {
   //  const errors=[];
   // 1. setup the rules for validation
  const rules = [
    body("name")
    .notEmpty()
    .withMessage("User name must  required !")
      .isString()
      .withMessage("Username must be string !")
      .isLength({ min: 3 })
      .withMessage("User name must be at least 3 charector long  !"),
    body("email")
      .notEmpty()
      .withMessage("Email must be required !")
      .isEmail()
      .withMessage("Enter valid email !")
      .custom(async value=>{
            const user= await userModel.findOne({email:value});
            if(user){ 
               throw new Error("Email already exists !");
            }
            return true;
      }),
    body("password")
       .trim()
      .isString()
      .isLength({ min: 6, max: 20 })
      .withMessage("Password length must be at least 6 charector long"),
  ];
    // 2.  run all rules 
   await Promise.all(rules.map(async rule=>await rule.run(req)));

  // 3. catch error from request after running the rule
    const errors  =    validationResult(req).array(); 
      // console.log(errors);
    if(errors.length>0){
      return res.status(400).json(new ErrorHandle(false,errors[0].msg)) 
    }
    next();
};

