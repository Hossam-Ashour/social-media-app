import { roleTypes } from "../../DB/model/user.model.js";

export const endPoint={
    createcomment:[roleTypes.user],
    likecomment:[roleTypes.user],
    freezecomment:[roleTypes.user,roleTypes.admin],
    unfreezeComment:[roleTypes.user ,roleTypes.admin]
}