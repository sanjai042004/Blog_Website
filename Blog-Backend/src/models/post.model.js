const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true, trim: true },
    claps: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

const blockSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ["text", "image", "youtube"], default: "text" },
    content: { type: String, trim: true }, 
    media: { type: String },               
    youtubeEmbed: { type: String },        
  },
  { _id: false }
);

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
