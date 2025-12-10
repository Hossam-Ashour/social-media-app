import { GraphQLObjectType, GraphQLSchema, GraphQLString } from "graphql";
import { postList } from "./post/resolver/query.resolver.js"
import { likePost } from "./post/resolver/mutation.resolver.js";
import { profile } from "./user/resolver/query.resolver.user.js";


export const schema = new GraphQLSchema({
    query:new GraphQLObjectType({
        name:"mainquerySchema",
        description:"this query include all project graphql endPoints",
        fields:{
            postList,
            profile
         
        }
        
    }),
    mutation:new GraphQLObjectType({
        name:"mainmutationSchema",
        description:"this mutation include all project graphql endPoints",
        fields:{
            likePost
         
        }
        
    })
    
    

})