import jwt from "jsonwebtoken"
import * as dbServise from "../../DB/db.service.js"
import { userModel } from "../../DB/model/user.model.js";
export const tokenTypes={
    access:"access",
    refresh:"refresh"
}

export const decodeToken=async({authorization="",tokenType=tokenTypes.access }={})=>{
           
            const [bearer,token]=authorization?.split(" ")||[]
            if(!bearer||!token){
                return next(new Error ("authorization is required or in-valid formate",{cause:400}))
        
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
                 return next(new Error ("In-valid token payload",{cause:401}))
                }
        
            const user =await dbServise.findOne({
                model:userModel,
                filter:{_id:decoded.id , isDeleted:{$exists:false}}
            })
        
            if(!user){
                return next(new Error ("Account not found",{cause:401}))
            }
            if(user. changeCridentialsTime?.getTime() >= decoded.iat *1000){
                return next (new Error ("in-valid Credentials",{cause:400}))
            }

            return user


}

export const generateToken=({payload={},signature=process.env.USER_ACCESS_TOKEN,expiresIn=parseInt(process.env.expiresIn)}={})=>{
    const token =jwt.sign(payload,signature,{expiresIn})
    return token
}
    
export const verifyToken=({token="",signature=process.env.USER_ACCESS_TOKEN,}={})=>{
    const decoded =jwt.verify(token,signature)
    return decoded
}
    



