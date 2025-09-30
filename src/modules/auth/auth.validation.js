import Joi from "joi";
import { generalFields } from "../../middleware/validation.middleware.js";
export const signup= Joi.object().keys({
    userName:generalFields.userName.required(),
    email:generalFields.email.required(),
    password:generalFields.password.required(),
    confirmationPassword:generalFields.confirmationPassword.valid(Joi.ref("password")).required()

}).required()

export const confirmEmail = Joi.object().keys({
    email:generalFields.email.required(),
    code: Joi.number().required(),
}).required()

export const login= Joi.object().keys({
    email:generalFields.email.required(),
    password:generalFields.password.required(),

}).required()

export const forgetPassword= Joi.object().keys({
    email:generalFields.email.required(),

}).required()

export const resetPassword= Joi.object().keys({
    email:generalFields.email.required(),
    code: Joi.number().required(),
    password:generalFields.password.required(),
    confirmationPassword:generalFields.confirmationPassword.valid(Joi.ref("password")).required()

}).required()