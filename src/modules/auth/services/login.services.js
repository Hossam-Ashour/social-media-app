import { providerTypes, roleTypes, userModel } from "../../../DB/model/user.model.js";
import { emailEvent } from "../../../utils/events/email.event.js";
import { compareHash, generateHash } from "../../../utils/hash.security.js";
import { asyncHandler } from "../../../utils/response/error.response.js";
import { successResponse } from "../../../utils/response/success.response.js";
import { decodeToken, generateToken, tokenTypes, verifyToken } from "../../../utils/security/token.security.js";
import {OAuth2Client} from'google-auth-library';
import * as dbServise from "../../../DB/db.service.js"


export const Login =asyncHandler(
async(req,res,next)=>{
    const{email,password}=req.body
    console.log({email,password});
    const user= await dbServise.findOne({
        model:userModel,
        filter:{email}
    })
    if (!user) {
        return next (new Error ("user not found" ,{cause:404}))
        
    }
    if(!user.confirmEmail){
        return next (new Error ("please verify your account first" ,{cause:400}))
    }
    if(user.provider!=providerTypes.system){
        return next (new Error ("in-valid provider" ,{cause:400}))
    }
    if(!compareHash({plainText:password,hashValue:user.password})){
        return next (new Error ("not found " ,{cause:404}))

    }

    const access_Token=generateToken({payload:{id:user._id},signature:user.role==roleTypes.admin? process.env.SYSTEM_ACCESS_TOKEN:process.env.USER_ACCESS_TOKEN})
    const refreshToken=generateToken({payload:{id:user._id},signature:user.role==roleTypes.admin?process.env.SYSTEM_REFRESH_TOKEN:process.env.USER_REFRESH_TOKEN,expiresIn:31536000})

    return successResponse({res,
        status:200,

        data:{token:{
               access_Token,
               refreshToken
    }
}
 }
)

    
})

export const loginWithGmail =asyncHandler(
async(req,res,next)=>{
    const{idToken}=req.body
    console.log({idToken});
    
const client = new OAuth2Client();
async function verify() {
  const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.CLIENT_ID, 
  });
  const payload = ticket.getPayload();
     return payload

 
}
const gmailData = await verify()
console.log(gmailData);

const{email_verified,email,name,picture}= gmailData

   if(!email_verified){
         return next(new Error("in-valid Account",{cause:404}))
      }
      let user= await dbServise.findOne({model:userModel , filter:{email}})
    if(user?.provider===providerTypes.system){
        return next(new Error("in-valid login provider",{cause:409}))

    }
   
    if(!user){
       user= await dbServise.create({
        model:userModel,
        data:{confirmEmail:email_verified,email,userName:name,image:picture,provider:providerTypes.google}
       })

    }
    const accessToken=generateToken({payload:{id:user._id},signature:user.role==roleTypes.admin? process.env.SYSTEM_ACCESS_TOKEN:process.env.USER_ACCESS_TOKEN})
    const refreshToken=generateToken({payload:{id:user._id},signature:user.role==roleTypes.admin?process.env.SYSTEM_REFRESH_TOKEN:process.env.USER_REFRESH_TOKEN,expiresIn:31536000})

    return successResponse({res,
        status:200,

         data:{
            token:{
           accessToken,
       refreshToken
    }
}
 }
)

    
})

export const refreshToken =asyncHandler(async(req,res,next)=>{
   const user = await decodeToken({authorization:req.headers.authorization, tokenType:tokenTypes.refresh})
   
    const accessToken=generateToken({payload:{id:user._id},signature:user.role==roleTypes.admin? process.env.SYSTEM_ACCESS_TOKEN:process.env.USER_ACCESS_TOKEN})
    const refreshToken=generateToken({payload:{id:user._id},signature:user.role==roleTypes.admin?process.env.SYSTEM_REFRESH_TOKEN:process.env.USER_REFRESH_TOKEN,expiresIn:31536000})

    return successResponse({res,
        status:200,

        data:{token:{
               accessToken,
               refreshToken
    }
}
 })
})

export const forgetPassword =asyncHandler(async(req,res,next)=>{
    const{email}=req.body

    const user=await dbServise.findOne({model:userModel , filter:{email , isDeleted:false}})

    if(!user){
        return next(new Error ("Account not found",{cause:404}))
    }
    emailEvent.emit("sendForgetPassword",{ id:user._id, email})
    
    return successResponse({ res,status:200,message:"OK"})
})

export const resetPassword =asyncHandler(async(req,res,next)=>{
    const{email,code,password}=req.body

    const user=await dbServise.findOne({model:userModel,filter:{email , isDeleted:false}})

    if(!user){
        return next(new Error ("Account not found",{cause:404}))
    }
    if(!compareHash({plainText:code,hashValue:user.forgetPasswordOTP})){
        return next(new Error("in-valid reset code"))
   }
    const hashPassword=generateHash({plainText:password})
    await dbServise.updateOne({ 
        model: userModel,

        filter:{email},

        data:{
        password:hashPassword,
         confirmEmail:true,
         changeCridentialsTime:Date.now(),
         $unset:{forgetPasswordOTP:0,emailOTP:0}}

    })

    return successResponse({ res,status:200,message:"OK"})
})