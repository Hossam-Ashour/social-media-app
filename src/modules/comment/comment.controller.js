import { Router } from "express";
import { createComment, freezeComment, unfreezeComment, updateComment } from "./services/comment.services.js";
import { authentication, authorization } from "../../middleware/auth.middleware.js";
import { uploadCloudFile } from "../../utils/multer/cloud.multer.js";
import { validation } from "../../middleware/validation.middleware.js";
import { endPoint } from "./comment.authorization.endPoint.js";
import { fileValidationTypes } from "../../utils/multer/local.multer.js";
import * as validators from "./comment.validation.js"

const router = Router({mergeParams:true,caseSensitive:true})

router.post("/:commentId?",authentication(),authorization(endPoint.createcomment),uploadCloudFile(fileValidationTypes.image).array("attachments",2),validation(validators.createComment), createComment )
router.patch("/:commentId",authentication(),authorization(endPoint.createcomment),uploadCloudFile(fileValidationTypes.image).array("attachments",2),validation(validators.updateComment), updateComment )
router.delete("/:commentId",authentication(),authorization(endPoint.freezecomment),validation(validators.freezeComment), freezeComment )
router.patch("/:commentId/restore",authentication(),authorization(endPoint.unfreezeComment),validation(validators.freezeComment), unfreezeComment )


export default router