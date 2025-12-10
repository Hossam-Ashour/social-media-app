import mongoose, { Schema,Types,model } from "mongoose";
import { type } from "os";
import { generateHash } from "../../utils/hash.security.js";
import { sendEmail } from "../../utils/email/send.email.js";
import { postModel } from "./post.model.js";
export const genderTypes={
    male:"male",
    female:"female"
}
export const roleTypes={
    user:"user",
    admin:"admin",
    superAdmin:"superAdmin"

}
export const providerTypes={
    system:"system",
    google:"google"
}
const userSchema=new Schema({
     firstName:{
        type:String,
        // required:true,
        minlength:2,
        maxlength:30
    },
    lastName:{
        type:String,
        // required:true,
        minlength:2,
        maxlength:30
    },
    userName:{
        type:String,
        required:true,
        minlength:2,
        maxlength:30
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    
    tempEmail:String,
    emailOTP:String,
    updateEmailOTP:String,
    
    password:{
        type:String,
        
    },
    forgetPasswordOTP:String,
    role:{
        type:String,
        enum:Object.values(roleTypes),
        default:roleTypes.user

    },
     provider:{
        type:String,
        enum:Object.values(providerTypes),
        default:providerTypes.system

    },

    gender:{
        type:String,
        enum:Object.values(genderTypes),
        default:genderTypes.male

    },
    
    // image:String,
    image:{public_id : String , secure_url : String},

    coverImage:[{public_id : String , secure_url : String}],

    phone:String,

    DOB:Date,

    confirmEmail:{
        type:Boolean,
        default:false
    },
     isDeleted:{
        type:Boolean,
       
    },

    changeCridentialsTime:Date,
    viewrs:[{userId:{type:Types.ObjectId , ref:"User"},time:Date}],
    friends:[{type:Types.ObjectId , ref:"User"}],

    
    modifiedBy:{type:Types.ObjectId , ref:"User"}

},{timestamps:true,
    toObject:{virtuals:true},
    toJSON:{virtuals:true}
})


// userSchema.pre("insertMany" ,{document:false, query:true}, function(next, doc){
//     console.log("========= pre insertMany hook");
    
//     console.log(this);
  
//     console.log(doc);
    
    

//      next()
    
// })

// userSchema.post("insertMany" ,{document:false, query:true}, function(doc, next){
//     console.log("========= post insertMany hook");
    
//     console.log(this);
  
    
//      console.log(doc);
//      next()
    
// })
// userSchema.post("deleteOne" ,{document:true, query:false} ,async function(doc,next){
//     console.log("========= post deleteOne hook");
//     await postModel.deleteMany({userId:this._id})
//     console.log({this:this});
//     next()
// })


// userSchema.pre("save", function(){
//     console.log("========= pre save hook============ ");
//     // console.log({doc});
//     // this.password=generateHash({plainText:this.password});

//     // this.firstName=this.userName.split(" ")[0],
//     // this.lastName=this.userName.split(" ")[1]
    

// })

// userSchema.pre("validate", function(){
//     console.log("========= pre validate hook============ ");
//     // console.log({doc});
//     // this.password=generateHash({plainText:this.password});

//     // this.firstName=this.userName.split(" ")[0],
//     // this.lastName=this.userName.split(" ")[1]
    

// })

// userSchema.post("validate", function(){
//     console.log("========= post validate hook============ ");
//     // console.log({doc});
//     // this.password=generateHash({plainText:this.password});

//     // this.firstName=this.userName.split(" ")[0],
//     // this.lastName=this.userName.split(" ")[1]
    

// })


// userSchema.pre("save", function(){
//     console.log("========= pre2 save hook============ ");
//     // console.log({this:this});
//     // this.password=generateHash({plainText:this.password});

//     // this.firstName=this.userName.split(" ")[0],
//     // this.lastName=this.userName.split(" ")[1]
    
    
// })

// userSchema.post("save", async function(){
//     console.log("========= post save hook============ ");
//     console.log({this:this});

//     this.firstName=this.userName.split(" ")[0],
//     this.lastName=this.userName.split(" ")[1]

//     await sendEmail({to:this.email , html:"<h2> hossam </h2>"})
    
    
// })
// userSchema.virtual("userName").set(function(value){
//     console.log({value});
//     this.firstName=value.split(" ")[0],
//     this.lastName=value.split(" ")[1]
    
// })
// userSchema.get(function(){
//     this.firstName + " " + this.lastName
// })

export const userModel=mongoose.models.User|| model("User",userSchema)
export const socketConnection= new Map()

