import path from "node:path"
import * as dotenv from "dotenv"
dotenv.config({path:path.resolve("./src/config/.env.dev")})
import cloudinary from 'cloudinary';

    cloudinary.config({ 
        cloud_name: process.env.CLOUD_NAME,
        secure:true, 
        api_key: process.env.API_KEY, 
        api_secret: process.env.API_SECRET
    });

  export default cloudinary
    
   
