import path from "node:path"
import fs from "node:fs"
import multer from "multer";

export const fileValidationTypes={
    image:["image/jpg","image/jpeg","image/png","image/gif"],
    document:["application/json" , "application/pdf"]
}

export const uploadDiskFile=(customPath="general",fileValidation=[])=>{


    const basePath= `uploads/${customPath}`
    const fullPath= path.resolve(`./src/${basePath}`)
    console.log({basePath,fullPath});
    if(!fs.existsSync(fullPath)){
        fs.mkdirSync(fullPath,{recursive:true})

    }

    
    const storage= multer.diskStorage({
        destination:(req,file,cb)=>{
            cb(null,fullPath)

        },
        filename:(req,file,cb)=>{
            console.log({file});
            const uniqueSuffix= Date.now() + '-' + Math.round(Math.random() * 1E9)+file.originalname
            file.finalPath= basePath + "/" + uniqueSuffix +"-"+ file.originalname
            cb(null,uniqueSuffix +"-"+ file.originalname )

        }
    })

    function fileFilter(req,file,cb){
        if(fileValidation.includes(file.mimetype)){
            cb(null,true)
        }
        else{
            cb("in-valid format file ", false)

        }
        
    }



    return multer ({dest:"defaultUpload",fileFilter , storage})
}