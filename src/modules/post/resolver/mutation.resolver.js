import { GraphQLEnumType, GraphQLID, GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql"
import * as dbService from "../../../DB/db.service.js"
import { postModel } from "../../../DB/model/post.model.js"
import { likePostResponse, postListResponse, postType } from "../types/post.types.js"
import { populate } from "dotenv"
import { authentication , authorization} from "../../../middleware/auth.graphql.middleware.js"
import { roleTypes } from "../../../DB/model/user.model.js"
import { token } from "morgan"
import { validationGraphQl } from "../../../middleware/validation.middleware.js"
import { likePostGraph } from "../post.validation.js"




export const likePost={
    type:likePostResponse,
    args:{
        postId:{type:new GraphQLNonNull (GraphQLID)},
        token:{type: new GraphQLNonNull( GraphQLString)},
        action:{type:new GraphQLNonNull (new GraphQLEnumType({
            name:"actionType",
            values:{
                like:{value:"like"},
                unlike:{value:"unlike"}
            }

        }))}
    },
    resolve:async(parent,args)=>{
        
            const {postId, token , action}= args
            //authentication
            await validationGraphQl({schema:likePostGraph , args})
            const user= await authentication({authorization:token})
            await authorization({role:user.role,accessRoles:[roleTypes.user]})
            console.log({user});
            
            const data = action?.toLowerCase()=== "unlike"?{$pull:{likes:user._id}}:{ $addToSet:{likes:user._id}}
            console.log({action,data});
            
           const post= await dbService.findOneAndUpdate({
                model:postModel,
                filter:{
                    _id:postId,
                    isDeleted:{$exists:false},
                    
                 },
                data,
                options:{new:true}
            })
            return{statusCode:200,message:"Done", data:{post}}

    }

}