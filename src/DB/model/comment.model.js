import mongoose, { Schema,Types,model } from "mongoose";

const commentSchema=new Schema({
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

    userId:{type:Types.ObjectId , ref:"User", required:true},

    commentId:{type:Types.ObjectId , ref:"Comment"},

    postId:{type:Types.ObjectId , ref:"Post", required:true},

    deletedBY:{type:Types.ObjectId , ref:"User"},

    isDeleted:Date,



},{timestamps:true,toJSON:{virtuals:true},toObject:{virtuals:true}})

commentSchema.virtual("reply",{
    localField:"_id",
    foreignField:"commentId",
    ref:"Comment",
    

})

export const commentModel=mongoose.models.Comment|| model("Comment",commentSchema)
