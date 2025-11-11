const cloudinary  = require("cloudinary")
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer")
require("dotenv").config();


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key:process.env.CLOUDINARY_KEY,
    api_secret:process.env.CLOUDINARY_SECRET,
});

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "blog_uploads",
        allowed_formats:["jpg", "jpeg", "png", "webp"]
    }
})

const upload = multer({storage});

module.exports = upload;