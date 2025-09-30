import { Router } from "express";
import { authentication, authorization } from "../../middleware/auth.middleware.js";
import { validation } from "../../middleware/validation.middleware.js";
import * as validators from "./user.validation.js"
import { changePrivilges, coverImage, dashboard, identity, replaceEmail, shareProfile, updateBasicProfile, updateEmail, updateImage, updatePassword, userProfile } from "./services/user.services.js";
import { fileValidationTypes, uploadDiskFile } from "../../utils/multer/local.multer.js";
import { uploadCloudFile } from "../../utils/multer/cloud.multer.js";
import { endPoint } from "./user.authorization.js";
const router = Router()

router.get ("/profile" ,authentication() ,userProfile)
router.get ("/profile/:profileId",validation(validators.shareProfile) ,authentication() ,shareProfile)
router.patch ("/profile",validation(validators.updateBasicProfile) ,authentication() ,updateBasicProfile)
router.patch ("/profile/password",validation(validators.updatePassword) ,authentication() ,updatePassword)
router.patch ("/profile/email",validation(validators.updateEmail) ,authentication() ,updateEmail)
router.patch ("/profile/replace-email",validation(validators.replaceEmail) ,authentication() ,replaceEmail)

// router.patch ("/profile/image" ,authentication() , uploadDiskFile("user/profile",fileValidationTypes.image).single("image") ,updateImage)

router.patch ("/profile/image" ,authentication() , uploadCloudFile(fileValidationTypes.image).single("image") ,updateImage)

// router.patch ("/profile/image/cover" ,authentication() , uploadDiskFile("user/profile/cover",fileValidationTypes.image).array("image",6 ) ,coverImage)

router.patch ("/profile/image/cover" ,authentication() , uploadCloudFile(fileValidationTypes.image).array("image" , 3) ,coverImage)

router.patch ("/profile/identity" ,authentication() , uploadDiskFile("user/profile/identity",
    [...fileValidationTypes.image,fileValidationTypes.document[1]]
).fields([
    {name:"image",maxCount:1},
    {name:"document",maxCount:1}
]) ,identity)


router.get ("/profile/admin/dashboard" ,authentication() , authorization(endPoint.admin) ,dashboard)

router.patch ("/profile/admin/role" ,authentication() , authorization(endPoint.admin) ,changePrivilges)




export default router