const mongoose = require("mongoose");

// Reply schema 
const replySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true, trim: true },
    claps: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

// Comment schema
const commentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true, trim: true },
    claps: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    replies: [replySchema],
  },
  { timestamps: true }
);

// Block schema for post 
const blockSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["subtitle", "text", "image", "youtube"],
      default: "text",
    },
    content: { type: String, trim: true },
    media: { type: String },
    youtubeEmbed: { type: String },
  },
  { _id: false }
);

// Post schema
const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    subtitle: { type: String, trim: true },
    blocks: [blockSchema],
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    claps: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    comments: [commentSchema], 
    image: { type: String },
    readingTime: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
