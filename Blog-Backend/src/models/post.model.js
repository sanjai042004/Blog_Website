const mongoose = require("mongoose");
const commentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    text: String,
  },
  { timestamps: true } 
);

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    subtitle: { type: String, trim: true },
    blocks: [
      {
        type: {
          type: String,
          enum: ["text", "image", "youtube"],
          default: "text",
        },
        content: String,
        media: String,
        youtubeEmbed: String,
      },
    ],
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    claps: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        count: { type: Number, default: 1 },
      },
    ],
    comments: [commentSchema], 
    image: String,
  },
  { timestamps: true }
);

const PostModel = mongoose.model("Post", postSchema);

module.exports = PostModel;
