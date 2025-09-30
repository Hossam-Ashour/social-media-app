import { nanoid,customAlphabet } from "nanoid";
import{EventEmitter} from "node:events"
import { sendEmail, subjectTypes } from "../email/send.email.js";
import { verificationEmail } from "../email/template/verification.email.js";
import { userModel } from "../../DB/model/user.model.js";
import { generateHash } from "../hash.security.js";
import * as dbService from "../../DB/db.service.js"

 export const emailEvent=new EventEmitter({})

const sendCode= async({data , subject= subjectTypes.confirmEmail }={})=>{
    const {id,email}=data;
    const otp = customAlphabet("0123456789",4)();
    const html = verificationEmail({code:otp})
    const hash=generateHash({plainText:otp})

    let dataUpdate={}
    switch (subject) {
        case subjectTypes.confirmEmail:
            dataUpdate={emailOTP:hash}
              
            break;
        case subjectTypes.forgetPassword:
            dataUpdate={forgetPasswordOTP:hash}
              
            break;
        case subjectTypes.updateEmail:
            dataUpdate={updateEmailOTP:hash}
              
            break;
    
        default:
            break;
    }
    await dbService.updateOne({
        model:userModel,
        filter:{_id:id},
        data:dataUpdate
    })
    await sendEmail({to:email , subject , html})
    console.log("Email Sent");

}

  emailEvent.on("sendConfirmEmail", async (data)=>{
    await sendCode({data , subject:subjectTypes.confirmEmail})
  })


  emailEvent.on("updateEmail", async (data)=>{
    await sendCode({data , subject:subjectTypes.updateEmail})
  })
    

  emailEvent.on("sendForgetPassword", async (data)=>{
    await sendCode({data , subject:subjectTypes.forgetPassword})
  })

