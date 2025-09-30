import { roleTypes } from "../../DB/model/user.model.js";

export const endPoint={
    createPost:[roleTypes.user],
    likePost:[roleTypes.user],
    freezePost:[roleTypes.user,roleTypes.admin]
}