const mongoose = require("mongoose");

// Post Schema
const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    subtitle: {
      type: String,
      trim: true,
    },
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
    claps: {
      type: Number,
      default: 0,
    },
    comments: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        text: String,
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    image: String,
  },
  { timestamps: true }
);
const PostModel=mongoose.model("post",postSchema)

module.exports = PostModel
