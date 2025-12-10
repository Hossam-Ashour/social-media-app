import { asyncHandler } from "../utils/response/error.response.js"
import { decodeToken, tokenTypes, verifyToken } from "../utils/security/token.security.js"
import { userModel } from "../DB/model/user.model.js"
import * as dbServise from "../DB/db.service.js"




export const authentication=async({authorization ,tokenType=tokenTypes.access}={})=>{
   
    const [bearer,token]=authorization?.split(" ")||[]
                if(!bearer||!token){
                    throw new Error("authorization is required or in-valid formate")
            
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
                    throw  new Error("In-valid token payload")

                    }
            
                const user =await dbServise .findOne({
                    model:userModel,
                    filter:{_id:decoded.id , isDeleted:false}
                })
            
                if(!user){
                    throw new Error("Account not found")
                }
                if(user. changeCridentialsTime?.getTime() >= decoded.iat *1000){
                    throw new Error("in-valid Credentials")
                }
    
                return user
   
}

export const authorization=async({accessRoles=[],role}={})=>{
   
       if(!accessRoles.includes(role)){
        throw new Error ("Not Autorized account ")
       
       }
        return true
    }
