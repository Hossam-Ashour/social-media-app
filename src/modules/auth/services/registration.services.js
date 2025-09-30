import { userModel } from "../../../DB/model/user.model.js";
import { emailEvent } from "../../../utils/events/email.event.js";
import { compareHash, generateHash } from "../../../utils/hash.security.js";
import { asyncHandler } from "../../../utils/response/error.response.js"
import { successResponse } from "../../../utils/response/success.response.js";
import * as dbService from "../../../DB/db.service.js"

export const SignUp =asyncHandler(
async(req,res,next)=>{
    const{userName,email,password}=req.body
    console.log({userName,email,password});
    const checkUser= await dbService.findOne({model:userModel , filter: {email}})
    if (checkUser) {
        return next (new Error ("email exists " ,{cause:409}))
        
    }
    const hashPassword=generateHash({plainText:password})

    const user =await dbService.create({
        model:userModel,
        data:{userName,email,password:hashPassword}
    })

    emailEvent.emit("sendConfirmEmail",{id:user._id, email})

    return successResponse({res,status:201,data:{user:user._id}})

})

export const confirmEmail =asyncHandler(
async(req,res,next)=>{
    const{email,code}=req.body
   
    const user= await dbService.findOne({model:userModel , filter: {email}})
    if(!user){
        return next(new Error("Email not exists",{cause:404}))
    }
    if(user.confirmEmail){
         return next(new Error("Already confirmed ",{cause:409}))
    }
    if(!compareHash({plainText:`${code}`,hashValue:user.emailOTP})){
         return next(new Error("in-valid otp ",{cause:400}))
    }
    await dbService.updateOne({
        model:userModel,
        filter:{email},
        data:{confirmEmail:true,$unset:{emailOTP:0}}
    })    
    
    return successResponse({res,status:201,data:{}})

})