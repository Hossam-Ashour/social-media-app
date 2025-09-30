import path from "node:path"
import connectDB from "./DB/connection.js"
import authController from "./modules/auth/auth.controller.js"
import { globalErrorHandling } from "./utils/response/error.response.js"
import userController from "./modules/user/user.controller.js"
import postController from "./modules/post/post.controller.js"
import cors from "cors"
import { userModel } from "./DB/model/user.model.js"
import ratelimit from 'express-rate-limit'
import helmet from "helmet"
import morgan from "morgan"
import chalk from "chalk"

const limiter = ratelimit({
    limit:5,
    windowMs:2*60*1000,
    message:{err:"game over"},
    statusCode:400,
    handler:(req,res,next)=>{
        return next(new Error ("too many request game over y m3lem",{cause:404}))
    },
    standardHeaders:"draft-8"
})

const bootstrap=(app,express)=>{
    console.log(path.resolve('uploads'));
//     console.log(process.env.ORIGIN.split(" "))
    
// var whitelist = process.env.ORIGIN.split(",") || []
// var corsOptions = {
//   origin: function (origin, callback) {
//     if (whitelist.indexOf(origin) !== -1) {
//       callback(null, true)
//     } else {
//       callback(new Error('Not allowed by CORS'))
//     }
//   }
// }
app.use(morgan("dev"))
 app.use(helmet())
 app.use("/auth",limiter)
app.use(cors())

// app.use(async(req,res,next)=>{
//     console.log(req.header("origin"))
//     console.log(req.method)
//     if(!whitelist.includes(req.header("origin"))){
//         return next(new Error("not Allowed by cors",{cause:403}))

//     }
//     if(!['Get'].includes( req.method)){
//         return next(new Error("not Allowed by cors",{cause:403}))
//     }
//     await res.header('Access-Control-Allow-Origin',req.header("origin"))
//     await res.header('Access-Control-Allow-Headers',"*")
//     await res.header('Access-Control-Allow-Private-Network',"true")
//     await res.header('Access-Control-Allow-Methods',"*")
//     console.log("Origin Work");
//     next();
// });

app.use(express.json())



async function test (){
    const newUser = await userModel.insertMany([
        {
            userName:"hoso",
            email:`${Date.now()}@gmail.com`,
            password:"jdjkfjk"
        },
        
        {
            userName:"hoso2",
            email:`${Date.now()}551515415451@gmail.com`,
            password:"jdjkfjk"
        }
    ])
  

  

}test()
app.use("/uploads" , express.static(path.resolve('./src/uploads')))

app.get("/",(req,res,next)=>{
    
    return res.status(200).json({message:"Welcome in social media app by NodeJs"})
})

app.use("/auth",authController)
app.use("/user",userController)
app.use("/post" ,postController)



app.use(globalErrorHandling)

//DB
connectDB()


}
export default bootstrap