import { postModel } from "../../../DB/model/post.model.js";
import { asyncHandler } from "../../../utils/response/error.response.js";
import * as dbService from "../../../DB/db.service.js"
import { model } from "mongoose";
import cloudinary from "../../../utils/multer/cloudinary.js";
import { successResponse } from "../../../utils/response/success.response.js";
import { roleTypes, socketConnection, userModel } from "../../../DB/model/user.model.js";
import { commentModel } from "../../../DB/model/comment.model.js";
import { populate } from "dotenv";
import { paginate } from "../../../utils/pagination.js";
import { getIo } from "../../chat/chat.socket.controller.js";
const populateList=[
    {path:"userId" , select:"userName image"},
    {path:"comments",match:{commentId:{$exists:false}} ,populate:[{path:"reply"}] },
    {path:"likes" , select:"userName image"},
    {path:"share" , select:"userName image"},
    {path:"tags" , select:"userName image"}

]
export const getAllPosts= asyncHandler(async(req,res,next)=>{
    const {page,size}=req.query

const data= await paginate({
     model: postModel,
        filter:{
            isDeleted:{$exists:false}
        },
        page,
        size:size,
        populate:populateList

})
       
return successResponse({res , status:201,data})
})



export const createPost= asyncHandler(async(req,res,next)=>{
    if(req.files){

        const attachments=[]
        for (const file of req.files) {
              const {public_id,secure_url}= await cloudinary.uploader.upload(file.path,{folder:"post"})
                  attachments.push({public_id,secure_url})
            
        }
        req.body.attachments =attachments
       
}
    
   const post= await dbService.create({
        model:postModel,
        data:{
            ...req.body,
            userId:req.user._id,
          
            
        }
    })
    return successResponse({res , status:201,data:{file:req.files,post}})
})


export const updatePost = asyncHandler(async(req,res,next)=>{
    if(req.files.length){

        const attachments=[]
        for (const file of req.files) {
              const {public_id,secure_url}= await cloudinary.uploader.upload(file.path,{folder:"post"})
                  attachments.push({public_id,secure_url})
            
        }
        req.body.attachments =attachments
       
}
    
   const post= await dbService.findOneAndUpdate({
        model:postModel,
        filter:{
            _id:req.params.postId,
            isDeleted:{$exists:false},
            userId:req.user._id,
         },
        data:{
            ...req.body,
        },
        options:{new:true}
    })
    return post? successResponse({res , status:200,data:{post}}):next(new Error("not found post ",{cause:404}))
})

export const freezePost= asyncHandler(async(req,res,next)=>{
   const owner = req.user.role===roleTypes.admin?{}:{userId:req.user._id}
   const post= await dbService.findOneAndUpdate({
        model:postModel,
        filter:{
            _id:req.params.postId,
            isDeleted:{$exists:false},
            ...owner
         },
        data:{
           isDeleted:Date.now(),
           deletedBY:req.user._id
        },
        options:{new:true}
    })
    return post? successResponse({res , status:200,data:{post}}):next(new Error("in-valid post ID ",{cause:404}))
})

export const restorePost= asyncHandler(async(req,res,next)=>{

   const post= await dbService.findOneAndUpdate({
        model:postModel,
        filter:{
            _id:req.params.postId,
            isDeleted:{$exists:true},
            deletedBY:req.user._id
            
         },
        data:{
            $unset:{
            isDeleted:Date.now(),
            deletedBY:req.user._id
        }
           
        },
        options:{new:true}
    })
    return post? successResponse({res , status:200,data:{post}}):next(new Error("in-valid post ID ",{cause:404}))
})

export const likePost= asyncHandler(async(req,res,next)=>{

    const {action}= req.query
    const data = action?.toLowerCase()=== "unlike"?{$pull:{likes:req.user._id}}:{ $addToSet:{likes:req.user._id}}
    console.log({action,data});
    
   const post= await dbService.findOneAndUpdate({
        model:postModel,
        filter:{
            _id:req.params.postId,
            isDeleted:{$exists:false},
            
         },
        data,
        options:{new:true}
    })

    getIo().to(socketConnection.get(post.userId.toString())).emit("likePost" , {postId:req.params.postId , likedBy:req.user._id , action})
    return post? successResponse({res , status:200,data:{post}}):next(new Error("in-valid post ID ",{cause:404}))
})

// export const unlikePost= asyncHandler(async(req,res,next)=>{

//    const post= await dbService.findOneAndUpdate({
//         model:postModel,
//         filter:{
//             _id:req.params.postId,
//             isDeleted:{$exists:false},
            
//          },
//         data:{
//            $pull:{likes:req.user._id}
           
//         },
//         options:{new:true}
//     })
//     return post? successResponse({res , status:200,data:{post}}):next(new Error("in-valid post ID ",{cause:404}))
// })