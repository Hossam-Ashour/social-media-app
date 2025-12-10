import { GraphQLEnumType, GraphQLID, GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql"
import * as dbService from "../../../DB/db.service.js"
import { postModel } from "../../../DB/model/post.model.js"
import { likePostResponse, postListResponse, postType } from "../types/post.types.js"
import { populate } from "dotenv"
import { type } from "node:os"


export const postList ={
    type:postListResponse,
    resolve:async(parent,args)=>{

        const posts =await dbService.findAll({model:postModel})
        return {statusCode:200,message:"Done",data:posts}
    }
}

