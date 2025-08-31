const Post = require("../models/post.model");

// Create Post
const createPost = async (req, res) => {
  try {
    const { title, blocks } = req.body;
    const userId = req.user?.id;

    if (!title?.trim()) {
      return res.status(400).json({ success: false, message: "Title is required" });
    }

    const parsedBlocks = typeof blocks === "string" ? JSON.parse(blocks) : blocks;
    if (!Array.isArray(parsedBlocks) || parsedBlocks.length === 0) {
      return res.status(400).json({ success: false, message: "At least one content block is required" });
    }

    const files = req.files || [];
    let fileIndex = 0;

    // Process blocks- uploaded files to blocks
    const finalBlocks = parsedBlocks.map((block) => {
      if (block.type === "image") {
        // Local uploaded image
        if (files[fileIndex]) {
          block.media = `/uploads/${files[fileIndex].filename}`;
          fileIndex++;
        }
      }
      return block;
    });

    // Determine main image
    const mainImageBlock = finalBlocks.find((b) => b.type === "image" && b.media);

    // Create post
    const post = await Post.create({
      title,
      blocks: finalBlocks,
      image: mainImageBlock ? mainImageBlock.media : undefined,
      author: userId,
    });

    res.status(201).json({ success: true, post });
  } catch (err) {
    console.error("Create Post Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get all posts
const getPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate("author", "name avatar profileImage email") 
      .sort({ createdAt: -1 });

    res.json({ success: true, posts });
  } catch (err) {
    console.error("Get Posts Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get single post by ID
const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("author", "name avatar profileImage email")
      .populate("comments.user", "name avatar profileImage");

    if (!post)
      return res.status(404).json({ success: false, message: "Post not found" });

    res.json({ success: true, post });
  } catch (err) {
    console.error("Get Post Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Update post
const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);

    if (!post) return res.status(404).json({ success: false, message: "Post not found" });
    if (req.user.id !== post.author.toString())
      return res.status(403).json({ success: false, message: "Not authorized" });

    const { title, blocks } = req.body;
    if (title) post.title = title;

    if (blocks) {
      const files = req.files || [];
      let fileIndex = 0;

      const updatedBlocks = blocks.map((block) => {
        // Handle uploaded image files
        if (block.type === "image" && files[fileIndex]) {
          block.media = `/uploads/${files[fileIndex].filename}`;
          fileIndex++;
        }
        delete block.preview;
        delete block.imageFile;
        return block;
      });

      post.blocks = updatedBlocks;
    }

    await post.save();
    const updatedPost = await post.populate("author", "name avatar profileImage email");
    res.json({ success: true, post: updatedPost });
  } catch (err) {
    console.error("Update Post Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Delete post
const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);

    if (!post)
      return res.status(404).json({ success: false, message: "Post not found" });

    if (req.user.id !== post.author.toString())
      return res.status(403).json({ success: false, message: "Not authorized" });

    await post.remove();
    res.json({ success: true, message: "Post deleted" });
  } catch (err) {
    console.error("Delete Post Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Add comment
const addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;
    if (!text?.trim())
      return res.status(400).json({ success: false, message: "Comment cannot be empty" });

    const post = await Post.findById(id);
    if (!post)
      return res.status(404).json({ success: false, message: "Post not found" });

    post.comments.push({ user: req.user.id, text });
    await post.save();

    const populatedPost = await post
      .populate("comments.user", "name avatar profileImage")
      .execPopulate();

    res.json({ success: true, post: populatedPost });
  } catch (err) {
    console.error("Add Comment Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Clap Post
const clapPost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post)
      return res.status(404).json({ success: false, message: "Post not found" });

    post.claps = (post.claps || 0) + 1;
    await post.save();

    res.json({ success: true, claps: post.claps });
  } catch (err) {
    console.error("Clap Post Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  addComment,
  clapPost,
};
