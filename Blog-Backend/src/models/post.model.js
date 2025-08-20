const mongoose = require("mongoose");

const blockSchema = new mongoose.Schema(
  {
    content: { type: String, default: "" },
    image: { type: String, default: null },
    preview: { type: String, default: null },
    youtubeEmbed: { type: String, default: null },
    unsplashQuery: { type: String, default: "" },
    unsplashResults: { type: [String], default: [] },
  },
  { _id: false } 
);

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    blocks: [blockSchema],
    // author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

module.exports = Post;