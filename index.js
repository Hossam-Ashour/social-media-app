import path from "node:path"
import * as dotenv from "dotenv"
dotenv.config({path:path.resolve("./src/config/.env.dev")})
import express from "express"
import bootstrap from "./src/app.controller.js"
import chalk from "chalk"
import { runIo } from "./src/modules/chat/chat.socket.controller.js"
const app=express()
const port =process.env.PORT || 4000
bootstrap(app , express)
const httpServer=app.listen(port,()=>{
    console.log(chalk.bgGreen(`successfuly... Server Running on the port ${port} `))
})

runIo(httpServer)