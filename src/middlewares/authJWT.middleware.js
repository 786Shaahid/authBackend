import  jwt  from "jsonwebtoken";

export const authJWT=async(req,res,next)=>{
      console.log(req.body);
      try{
            // 1. retrieve accesstoken from header
            const BearerToken= req.headers['authorization'];
            // console.log(BearerToken);
             const accessToken=BearerToken.replace('Bearer ',"");
      // console.log(accessToken);

             // 2. varify the token / decode the token
             const decodeToken=await jwt.verify(accessToken,process.env.ACCESS_SECRETE_TOKEN_KEY) ;
             //  console.log("decode",decodeToken.id); 

             // 3. modify the request 
             req.userId=decodeToken.id
           next();      
      }catch(err){
            console.log(err);
      }
      
}
