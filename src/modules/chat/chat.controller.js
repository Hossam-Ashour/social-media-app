import { Router } from "express"
import{authentication} from "../../middleware/auth.middleware.js"
import { findOneChat } from "./service/chat.service.js"
const router = Router()

router.get ("/:destId" , authentication(),findOneChat )




export default router