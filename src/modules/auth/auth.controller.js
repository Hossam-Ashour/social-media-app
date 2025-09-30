import {Router} from "express"
import { confirmEmail, SignUp } from "./services/registration.services.js"
import { validation } from "../../middleware/validation.middleware.js"
import * as validators from "./auth.validation.js"
import { forgetPassword, Login, loginWithGmail, refreshToken, resetPassword } from "./services/login.services.js"
const router=Router()
router.post("/signup",validation(validators.signup),SignUp)
router.patch("/confirm-Email",validation(validators.confirmEmail),confirmEmail)
router.post("/login",validation(validators.login),Login)
router.post("/loginWithGmail",loginWithGmail)

router.get("/refresh-token",refreshToken)
router.patch("/forget-password",validation(validators.forgetPassword),forgetPassword)
router.patch("/reset-password",validation(validators.resetPassword),resetPassword)










export default router