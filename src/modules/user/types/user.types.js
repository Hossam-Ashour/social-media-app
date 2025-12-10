import { graphql, GraphQLBoolean, GraphQLEnumType, GraphQLID, GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLString } from "graphql";
import { genderTypes, providerTypes, roleTypes } from "../../../DB/model/user.model.js";



export const imageType = new GraphQLObjectType({
                        name:"attachmentsType",
                        fields:{
                            secure_url:{type:GraphQLString},
                            public_id :{type:GraphQLString}
                        }
                    })


export const userType=new GraphQLObjectType({
    name:"usertype",
    fields:{
        _id:{type:GraphQLID},
        firstName:{type:GraphQLString},
        lastName:{type:GraphQLString},
        userName:{type:GraphQLString},
        email:{type:GraphQLString},
        password:{type:GraphQLString},
        emailOTP:{type:GraphQLString},
        tempEmail:{type:GraphQLString},
        updateEmailOTP:{type:GraphQLString},
        forgetPasswordOTP:{type:GraphQLString},
        phone:{type:GraphQLString},
        DOB:{type:GraphQLString},
        confirmEmail:{type:GraphQLBoolean},
        isDeleted:{type:GraphQLBoolean},
        changeCridentialsTime:{type:GraphQLString},
        gender:{type:new GraphQLEnumType({
            name:"genderOptions",
            values:{
                male:{value:genderTypes.male},
                female:{value:genderTypes.female}
            }

        })},
        role:{type:new GraphQLEnumType({
            name:"roleOptions",
            values:{
               admin:{value:roleTypes.admin},
                superAdmin:{value:roleTypes.superAdmin},
                user:{value:roleTypes.user},
            }

        })},

        provider:{type:new GraphQLEnumType({
            name:"providerOptions",
            values:{
               system:{value:providerTypes.system},
                google:{value:providerTypes.google},
              
            }

        })},

        image:{type:imageType},
        coverImage:{type:new GraphQLList(imageType)},
        
         
    }
})

export const userList =new GraphQLList(userType)


export const userProfileResponse=new GraphQLObjectType({
    name :"profile",
    fields:
    {
        statusCode:{type:GraphQLInt},
        message:{type:GraphQLString},
        data:{type:userType}
    }
})