const mongoose =require("mongoose")

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    blocks: [
      {
        content: String,
        image: String, 
        youtubeEmbed: String, 
        unsplashResults:String
      },
    ],
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

module.exports=Post
