const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    text: { type: String, required: true, trim: true },
    claps: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // ✅ Only ObjectIds
  },
  { timestamps: true,optimisticConcurrency: false  }
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
    claps: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // ✅ Simplified
    comments: [commentSchema],
    image: String,
  },
  { timestamps: true }
);

const PostModel = mongoose.model("Post", postSchema);

module.exports = PostModel;
