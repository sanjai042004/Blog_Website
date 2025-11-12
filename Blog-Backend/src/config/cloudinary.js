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
    allowed_formats: ["jpg", "jpeg", "png", "webp", "gif", "mp4"],
    resource_type: "auto"
  },
});


const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, 
});


module.exports = upload;