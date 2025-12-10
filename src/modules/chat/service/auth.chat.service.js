import { socketConnection } from "../../../DB/model/user.model.js";
import { authenticationSocket } from "../../../middleware/auth.socket.middleware.js";


  export const regiserSocket=async(socket)=>{

    const {data} = await authenticationSocket({socket})

    if(!data.valid){
        return socket.emit("socketErrorResponse",data)
    }

    socketConnection.set(data.user._id.toString(),socket.id)
    console.log(socketConnection);
    

    return "Done"
}

    export const logOutSocket= async(socket)=>{

    socket.on("disconnect", async()=>{

    console.log("Disconnected");
    
    const {data} = await authenticationSocket({socket})

    if(!data.valid){
        return socket.emit("socketErrorResponse",data)
    }

    socketConnection.delete(data.user._id.toString(),socket.id)
    console.log(socketConnection);
    

    return "Done"
 })
}