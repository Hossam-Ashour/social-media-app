import mongoose, { Schema,Types,model } from "mongoose";

const postSchema=new Schema({
    content:{
        type:String,
        required:function(){
             return this?.attachments?.length? false:true
        },
        minlength:2,
        maxlength:30
    },
    
    attachments:[{public_id : String , secure_url : String}],

    likes:[{type:Types.ObjectId , ref:"User"}],

    tags:[{type:Types.ObjectId , ref:"User"}],

    share:[{type:Types.ObjectId , ref:"User"}],

    userId:{type:Types.ObjectId , ref:"User", required:true},

    // comments:[{type:Types.ObjectId , ref:"Comment"}],

    deletedBY:{type:Types.ObjectId , ref:"User"},

    isDeleted:Date,



},{timestamps:true,toObject:{virtuals:true},toJSON:{virtuals:true}})

postSchema.virtual("comments",{
    localField:"_id",
    foreignField:"postId",
    ref:"Comment",
    justOne:true
})

export const postModel=mongoose.models.Post|| model("Post",postSchema)
