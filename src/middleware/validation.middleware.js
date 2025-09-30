import Joi from "joi"
import { Types } from "mongoose"
import { genderTypes } from "../DB/model/user.model.js"
const checkObjectId=(value,helper)=>{
    return Types.ObjectId.isValid(value)?true:helper.message("in-valid ObjectId")

}
const fileObject={
     
                fieldname: Joi.string(),
                originalname: Joi.string(),
                encoding: Joi.string(),
                mimetype:Joi.string(),
                destination: Joi.string(),
                filename: Joi.string(),
                path: Joi.string(),
                size: Joi.number()
            
}


export const generalFields={
        userName:Joi.string().min(2).max(30).trim(),
        email:Joi.string().email({tlds:{ allow: ["com","net"]},minDomainSegments:2,maxDomainSegments:3}),
        password:Joi.string().pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)),
        confirmationPassword:Joi.string(),
        id:Joi.string().custom(checkObjectId),
        DOB:Joi.date().less("now"),
        phone:Joi.string().pattern(new RegExp( /^(002|\+2)?01[0125][0-9]{8}$/)),
        gender:Joi.string().valid(...Object.values(genderTypes)),
        code:Joi.string(),
        fileObject,
        file:Joi.object(fileObject)
}
export const validation=(schema)=>{
    return(req,res,next)=>{
        const inputData={...req.body,...req.params,...req.query}
        if(req.file || req.files?.length){
            inputData.file= req.file || req.files
        }
        console.log({inputData});
        
        const validationResult=schema.validate(inputData,{ abortEarly:false })
        if(validationResult.error){
            return res.status(400).json({message:"validation error",details:validationResult.error.details})
        }
        return next()
    }
}