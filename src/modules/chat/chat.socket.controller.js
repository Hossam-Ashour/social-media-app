import { Server } from "socket.io"
import { logOutSocket, regiserSocket } from "./service/auth.chat.service.js"
import { sendMessage } from "./service/message.service.js"

let io =undefined
export const runIo=(httpServer)=>{

   io = new Server(httpServer,{cors:"*"})

  return io.on("connection" ,async(socket)=>{
    console.log(socket.handshake.auth),
   await regiserSocket(socket)
   await sendMessage(socket)
   await logOutSocket(socket)

   })
}

export const getIo=()=>{
  return io
}