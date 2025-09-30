import { Router } from "express";
import { authentication, authorization } from "../../middleware/auth.middleware.js";
import { endPoint } from "./post.authorization.endPoint.js";
import { uploadCloudFile } from "../../utils/multer/cloud.multer.js";
import { createPost, freezePost, getAllPosts, likePost, restorePost, updatePost } from "./services/post.services.js";
import * as validators from "./post.validation.js"
import { validation } from "../../middleware/validation.middleware.js";
import { fileValidationTypes } from "../../utils/multer/local.multer.js";
import commentController from "../comment/comment.controller.js"

const router =Router()

router.use("/:postId/comment",commentController)

router.get("/",getAllPosts)


router.post("/", authentication(),
authorization(endPoint.createPost),
uploadCloudFile(fileValidationTypes.image).array("image", 2),
validation(validators.createPost),
createPost)

router.patch("/:postId", authentication(),
authorization(endPoint.createPost),
uploadCloudFile(fileValidationTypes.image).array("image", 2),
validation(validators.updatePost),
updatePost
)

router.delete("/:postId", authentication(),
authorization(endPoint.freezePost),
validation(validators.freezePost),
freezePost
)

router.patch("/:postId/restore", authentication(),
authorization(endPoint.freezePost),
validation(validators.restorePost),
restorePost
)

router.patch("/:postId/like", authentication(),
authorization(endPoint.likePost),
validation(validators.likePost),
likePost
)

// router.patch("/:postId/unlike", authentication(),
// authorization(endPoint.likePost),
// validation(validators.unlikePost),
// unlikePost
// )


export default router