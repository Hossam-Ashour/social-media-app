import { asyncHandler } from "../utils/response/error.response.js"
import { decodeToken, tokenTypes, verifyToken } from "../utils/security/token.security.js"
import {  userModel } from "../DB/model/user.model.js"
import * as dbServise from "../DB/db.service.js"




export const authenticationSocket=async({socket={} ,tokenType=tokenTypes.access}={})=>{
   
    const [bearer,token]=socket.handshake?.auth?.authorization?.split(" ")||[]
                if(!bearer||!token){
                    return {data: {message:"authorization is required or in-valid formate",status:400}}
            
                }
                let accessSignature=""
                let refreshSignature=""
                switch (bearer) {
                    case "system":
                     accessSignature= process.env.SYSTEM_ACCESS_TOKEN
                     refreshSignature= process.env.SYSTEM_REFRESH_TOKEN
                        break;
                    case "Bearer":
                        accessSignature= process.env.USER_ACCESS_TOKEN
                        refreshSignature= process.env.USER_REFRESH_TOKEN 
                    default:
                        break;
                }
            
                const decoded=verifyToken({token,signature: tokenType == tokenTypes.access? accessSignature: refreshSignature})
                if(!decoded?.id){

                 return {data:{message:"In-valid token payload",status:400}}
                }
            
                const user =await dbServise .findOne({
                    model:userModel,
                    filter:{_id:decoded.id , isDeleted:{$exists:false}}
                })
            
                if(!user){

                return {data:{message:"Account not found",status:404}}
                 }


                if(user. changeCridentialsTime?.getTime() >= decoded.iat *1000){

                return {data:{message:"in-valid Credentials",status:401}}
            }

           
    
    return {data:{user,valid:true}}
   
}

export const authorization=async({accessRoles=[],role}={})=>{
   
       if(!accessRoles.includes(role)){
        throw new Error ("Not Autorized account ")
       
       }
        return true
    }
