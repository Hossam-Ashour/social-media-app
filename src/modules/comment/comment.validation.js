import Joi from "joi";
import { generalFields } from "../../middleware/validation.middleware.js";

export const createComment = Joi.object().keys({
    postId:generalFields.id.required(),
    commentId:generalFields.id,
    content:Joi.string().min(2).max(20000).trim(),
    file:  Joi.array().items(generalFields.file).max(2)
}).or("content" , "file")


export const updateComment = Joi.object().keys({
    commentId:generalFields.id.required(),
    postId:generalFields.id.required(),
    content:Joi.string().min(2).max(20000).trim(),
    file:  Joi.array().items(generalFields.file).max(2)
}).or("content" , "file")

export const freezeComment = Joi.object().keys({
    commentId:generalFields.id.required(),
    postId:generalFields.id.required()
}).required()

export const unfreezeComment = Joi.object().keys({
    commentId:generalFields.id.required(),
    postId:generalFields.id.required()
}).required()