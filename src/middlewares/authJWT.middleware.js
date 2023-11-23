import  jwt  from "jsonwebtoken";

export const authJWT=async(req,res,next)=>{
      try{
            const token= req.headers['authorization'];
            //    console.log("token",token);
            req.token=token;
             const decodeToken=await jwt.verify(token,process.env.SECRETE_KEY) ;
             console.log("decode",decodeToken); 
              // jwt.varify()
           next();
      }catch(err){
            console.log(err);
      }
}
