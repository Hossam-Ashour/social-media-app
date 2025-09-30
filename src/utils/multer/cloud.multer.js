
import multer from "multer";

export const uploadCloudFile=(fileValidation=[])=>{

    
    const storage= multer.diskStorage({})

    function fileFilter(req,file,cb){
         console.log({file});
         
        if(fileValidation.includes(file.mimetype)){
            cb(null,true)
        }
        else{
            cb("in-valid format file ", false)

        }
        
    }



    return multer ({dest:"dest",fileFilter , storage})
}