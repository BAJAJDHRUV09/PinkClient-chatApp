import {v2 as cloudinary} from "cloudinary";
// v2 is version 2
import {config} from "dotenv";

//config loads value from env variables
config();

// this connects my server to cloudinary and can be used again
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

export default cloudinary;