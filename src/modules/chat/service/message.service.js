import { authenticationSocket } from "../../../middleware/auth.socket.middleware.js"
import * as dbService from "../../../DB/db.service.js"
import { chatModel } from "../../../DB/model/chat.model.js"
import { socketConnection } from "../../../DB/model/user.model.js"


export const sendMessage=(socket)=>{
   return socket.on("sendMessage" , async(messageData)=>{
    const {data} = await authenticationSocket({socket})
      console.log({data});
    
    
        if(!data.valid){
            return socket.emit("socketErrorResponse",data)
        }
        const userId=data.user._id.toString()
        const{destId,message}= messageData

        const chat= await dbService.findOneAndUpdate({
            model:chatModel,
            filter:{
                 $or:[
               { 
                mainUser:userId,
               subParticipant:destId
            },
            {
                 mainUser:destId,
               subParticipant:userId

            }
            ]
            },
            data:{
                $push:{messages:{message,senderId:userId}}
            }
        })
        if(!chat){
            const chat= await dbService.create({
            model:chatModel,
            
            data:{
                mainUser:userId,
                subParticipant:destId, 
               messages:[{message,senderId:userId}]
            }
        })

        }

        socket.emit("successMessage",{message})

        socket.to(socketConnection.get(destId)).emit("receiveMessage",{message})
        
        return "Done"

    

    })
}