import { asyncHandler } from "../../../utils/response/error.response.js"
import { successResponse } from "../../../utils/response/success.response.js"
import * as dbService from "../../../DB/db.service.js"
import { roleTypes, userModel } from "../../../DB/model/user.model.js"
import { compareHash, generateHash } from "../../../utils/hash.security.js"
import { emailEvent } from "../../../utils/events/email.event.js"
import cloudinary from "../../../utils/multer/cloudinary.js"
import { postModel } from "../../../DB/model/post.model.js"




export const userProfile = asyncHandler
(async(req,res,next)=>{
const user =await dbService.findOne({
    model:userModel,
    filter:{_id:req.user._id},
    populate:[
      {path:"friends", select:"userName image"},
      {path:"viewrs.userId", select:"userName email "}
    ]

})
return successResponse({res, data:{user}})
})
  
export const shareProfile = asyncHandler
(async(req,res,next)=>{
    const {profileId}=req.params
    const user = await dbService.findOne({
        model:userModel,
        filter:{_id:profileId,isDeleted:false},
        select:"userName email DOB phone image "
    })
    if(!user){
        return next(new Error ("in-valid account Id  ",{cause:404}))
    }
    if( profileId !==req.user._id.toString()){
        await dbService.updateOne({
        model:userModel,
        filter:{_id:profileId},
        data:{
            $push:{viewrs:{userId:req.user._id, time:Date.now()}}
        }
    })

    }
     return successResponse({res, data:{user}})


})

export const updateBasicProfile = asyncHandler
(async(req,res,next)=>{
    const user =  await dbService.findByIdAndUpdate({
                       model:userModel,
                       id:req.user._id,
                       data:req.body,
                       options:{new:true}
        
    })
           return successResponse({res, data:{user}})
}
)

export const updatePassword = asyncHandler
(async(req,res,next)=>{

  const{oldPassword,password}=req.body
  if(!compareHash({plainText:oldPassword , hashValue:req.user.password})){
    return next(new Error("in-vali oldPassword",{cause:400}))

  }

  const user = await dbService.findByIdAndUpdate({
                       model:userModel,
                       id:req.user._id,
                       data:{
                        password:generateHash({plainText:password}),
                        changeCridentialsTime:Date.now()
                       },
                       options:{new:true}
        
    })
           return successResponse({res, data:{}})
}
)

export const updateEmail = asyncHandler
(async(req,res,next)=>{

  const{email}=req.body
  if(await dbService.findOne({model:userModel , filter:{email}})){
    return next(new Error ("Email exists " ,{cause:409}))
  }

  await dbService.updateOne({
    model:userModel,
    filter:{_id:req.user._id},
    data:{
        tempEmail:email
    }
  })
      emailEvent.emit("updateEmail",{ id:req.user._id , email}) // send code to the new account 
      emailEvent.emit("sendConfirmEmail",{ id:req.user._id , email:req.user.email}) // send code old account 

    return successResponse({res, data:{}})

  
})
          

export const replaceEmail= asyncHandler
(async(req,res,next)=>{

  const{oldEmailCode,code}=req.body

  if(await dbService.findOne({model:userModel ,  filter:{email:req.user.tempEmail}})){
    return next(new Error("Email Exist ",{cause:409}))
  }

  if(!compareHash({plainText:oldEmailCode , hashValue:req.user.emailOTP})){
    return next(new Error("you must provide verifcation from your old email ", {cause:400}))
  }

  if(!compareHash({plainText:code , hashValue:req.user.updateEmailOTP})){
    return next(new Error("you must provide verifcation from your new email ", {cause:400}))
  }

  await dbService.updateOne({
    model:userModel,
    filter:{_id:req.user._id},
    data:{
        email:req.user.tempEmail,
        changeCridentialsTime:Date.now(),
        $unset:{
            tempEmail:0,
            emailOTP:0,
            updateEmailOTP:0,
}

    }
  })

  
    return successResponse({res, data:{}})

  
})
          

export const updateImage= asyncHandler
(async(req,res,next)=>{
     const {public_id, secure_url} = await cloudinary.uploader.upload(req.file.path , {folder:`user/${req.user._id}`})
  const user = await dbService.findByIdAndUpdate({
    model:userModel,
    id:req.user._id,
    data:{
      image:{public_id, secure_url}

    },
    options:{
      new :true
    }
  })
  // if(user.image?.public_id){
  //   await cloudinary.uploader.destroy(user.image.public_id)
  // }

  
    return successResponse({res, data:{file: req.file , user}})

  
})
          


export const addFriend= asyncHandler
(async(req,res,next)=>{

  const{friendId}=req.params

  const friend = await dbService.findOneAndUpdate({
    model:userModel,
    filter:{
           _id:friendId,
           isDeleted:{$exists:false}
    },
    data:{
      $addToSet:{friends:req.user._id}
    },
    options:{
      new :true
    }
  })
  
  if(!friend){
    return next (new Error ("not found friend "),{cause:404})
  }

  const user = await dbService.findByIdAndUpdate({
    model:userModel,
   id:req.user._id,
    data:{
      $addToSet:{friends:friendId}
    },
    options:{
      new :true
    }
  })
 
  
    return successResponse({res, data:{}})

  
})
          


export const coverImage= asyncHandler
(async(req,res,next)=>{

  // console.log(req.files);
  const images=[]
  for (const file of req.files) {
    const {public_id, secure_url} = await cloudinary.uploader.upload(file.path , {folder:`user/${req.user._id}/cover`})
          images.push({public_id, secure_url})
  }
  
  const user = await dbService.findByIdAndUpdate({
    model:userModel,
    id:req.user._id,
    data:{
      // coverImage:req.files.map(file=>file.finalPath)
      coverImage:images

    },
    options:{
      new :true
    }
  })

  
    return successResponse({res, data:{file: req.files ,user}})

  
})


export const identity= asyncHandler
(async(req,res,next)=>{

  console.log(req.files);
  
  // const user = await dbService.findByIdAndUpdate({
  //   model:userModel,
  //   id:req.user._id,
  //   data:{
  //     coverImage:req.files.map(file=>file.finalPath)

  //   },
  //   options:{
  //     new :true
  //   }
  // })

  
    return successResponse({res, data:{file: req.files}})

  
})

export const dashboard = asyncHandler(async(req,res,next)=>{

   const result = await Promise.allSettled([
     dbService.findOne({
    model:userModel,
    filter:{}
   }),

   dbService.findOne({
    model:postModel,
    filter:{}
   })

   ])

   return successResponse({res, data:{result}})


})
 
//////// grant////////////
export const changePrivilges= asyncHandler(async(req,res,next)=>{
     const {userId , role}=req.body;
     console.log({userId,role});
     const owner = req.user.role===roleTypes.superAdmin ? {}:{
        role:{$nin:[roleTypes.admin , roleTypes.superAdmin ]}
     }
     
     const user = await dbService.findOneAndUpdate({
      model:userModel,
      filter:{
        _id:userId,
        isDeleted:{$exists:false},
        ...owner
      },
      data:{
        role,
        modifiedBy:req.user._id 
      },
      options:
      {new:true}
     })

  



   return successResponse({res, data:{user}})


})





