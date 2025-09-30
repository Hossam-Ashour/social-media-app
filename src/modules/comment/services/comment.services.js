import { asyncHandler } from "../../../utils/response/error.response.js";
import { successResponse } from "../../../utils/response/success.response.js";
import * as dbService from "../../../DB/db.service.js"
import { postModel } from "../../../DB/model/post.model.js";
import { commentModel } from "../../../DB/model/comment.model.js";
import cloudinary from "../../../utils/multer/cloudinary.js";
import { roleTypes } from "../../../DB/model/user.model.js";

export const createComment = asyncHandler(async(req,res,next)=>{
    const {postId,commentId}=req.params
    if(commentId){
        const checkComment = await dbService.findOne({
            model:commentModel,
            filter:{_id:commentId, postId, isDeleted:{$exists:false}}
        })
        if(!checkComment){
        return next (new Error("comment not found and not reply",{cause:404}))
    } 

      req.body.commentId = commentId
    }
    
    console.log({postId});

    const post =await dbService.findOne({
        model:postModel,
        filter:{_id:postId , isDeleted:{$exists:false}}
   })
   if(!post){
    return next (new Error("post not found",{cause:404}))
   }
    if(req.files?.length){
   
           const attachments=[]
           for (const file of req.files) {
                 const {public_id,secure_url}= await cloudinary.uploader.upload(file.path,{folder:"comment"})
                     attachments.push({public_id,secure_url})
               
           }
           req.body.attachments =attachments
          
   }
       
      const comment= await dbService.create({
           model:commentModel,
           data:{
               ...req.body,
               
               postId,
               userId:req.user._id,
             
               
           }
       })
       
    

    return successResponse({res, status:201,data:{comment}})
    })

export const updateComment = asyncHandler(async(req,res,next)=>{
    const {postId,commentId}=req.params

    const comment= await dbService.findOne({
        model:commentModel,
        filter:{
            _id:commentId,
            postId,
            isDeleted:{$exists:false}

        },
        populate:[
            {
                path:"postId"

        }
    ]

    })

    if(!comment || comment.postId.isDeleted){
        return next (new Error ("in-valid comment",{cause:404}))
    }

    if(req.files?.length){
   
           const attachments=[]
           for (const file of req.files) {
                 const {public_id,secure_url}= await cloudinary.uploader.upload(file.path,{folder:"comment"})
                     attachments.push({public_id,secure_url})
               
           }
           req.body.attachments =attachments
          
   }
       
      const savedComment= await dbService.findOneAndUpdate({
           model:commentModel,

           filter:{
            _id:commentId,
            postId,
            isDeleted:{$exists:false}

           },
           data:{
                  ...req.body
           
            },
            options:{new:true }
       })
    

    
    

    return successResponse({res, status:200,data:{savedComment}})
    })


    export const freezeComment = asyncHandler(async(req,res,next)=>{
    const {postId,commentId}=req.params

    const comment= await dbService.findOne({
        model:commentModel,
        filter:{
            _id:commentId,
            postId,
            isDeleted:{$exists:false}

        },
        populate:[
            {
                path:"postId"

        }
    ]

    })

    if(
        !comment 
        ||

        (  req.user.role!=roleTypes.admin
           &&
           req.user._id.toString()!=commentId
           &&
           req.user._id.toString()!=comment.postId.userId.toString())
    ){
        return next (new Error ("in-valid comment or not deleted",{cause:404}))
    }

      const savedComment= await dbService.findOneAndUpdate({
           model:commentModel,

           filter:{
            _id:commentId,
            postId,
            isDeleted:{$exists:false}

           },
           data:{
                  isDeleted:Date.now(),
                  deletedBY:req.user._id
               },
            options:{new:true }
       })
    

    
    

    return successResponse({res, status:200,data:{savedComment}})
    })


export const unfreezeComment = asyncHandler(async(req,res,next)=>{
    const {postId,commentId}=req.params 

    const savedComment= await dbService.findOneAndUpdate({
           model:commentModel,

           filter:{
            _id:commentId,
            postId,
            isDeleted:{$exists:true},
            deletedBY:req.user._id


           },
           data:{
                $unset:{
                    isDeleted:0,
                    deletedBY:0
                },

           },
            options:{new:true }
      })
    

    
    

    return successResponse({res, status:200,data:{comment:savedComment}})
    })

