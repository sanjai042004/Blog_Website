const Post = require("../models/post.model");
const { getIO } = require("../socket/socket");
// CREATE POST
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

    const finalBlocks = parsedBlocks.map((block) => {
      if (block.type === "image" && files[fileIndex]) {
        block.media = `/uploads/${files[fileIndex].filename}`;
        fileIndex++;
      }
      return block;
    });

    const mainImageBlock = finalBlocks.find((b) => b.type === "image" && b.media);

    const post = await Post.create({
      title,
      blocks: finalBlocks,
      image: mainImageBlock ? mainImageBlock.media : undefined,
      author: userId,
    });

    const populatedPost = await post.populate("author", "name profileImage email");
    res.status(201).json({ success: true, post: populatedPost });
  } catch (err) {
    console.error("Create Post Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET ALL POSTS
const getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", "name profileImage email")
      .sort({ createdAt: -1 });

    res.json({ success: true, posts });
  } catch (err) {
    console.error("Get Posts Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET SINGLE POST
const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("author", "name profileImage email")
      .populate({
        path: "comments.user",
        select: "name profileImage email",
      });

    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    const sortedComments = [...post.comments].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    res.json({
      success: true,
      post: { ...post.toObject(), comments: sortedComments },
    });
  } catch (err) {
    console.error("Get Post Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


// UPDATE POST
const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);

    if (!post) return res.status(404).json({ success: false, message: "Post not found" });
    if (req.user.id !== post.author.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    const { title, blocks } = req.body;
    if (title) post.title = title;

    if (blocks) {
      const parsedBlocks = typeof blocks === "string" ? JSON.parse(blocks) : blocks;
      const files = req.files || [];
      let fileIndex = 0;

      const updatedBlocks = parsedBlocks.map((block) => {
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
    const updatedPost = await post.populate("author", "name profileImage email");
    res.json({ success: true, post: updatedPost });
  } catch (err) {
    console.error("Update Post Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// DELETE POST
const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);

    if (!post) return res.status(404).json({ success: false, message: "Post not found" });
    if (req.user.id !== post.author.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    await Post.findByIdAndDelete(id);
    res.json({ success: true, message: "Post deleted" });
  } catch (err) {
    console.error("Delete Post Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ADD COMMENT
const addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;

    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ success: false, message: "Post not found" });

    const newComment = { user: req.user.id, text, date: new Date() };
    post.comments.push(newComment);
    await post.save();

   
    const populatedPost = await Post.findById(id)
      .populate("comments.user", "name profileImage email");
    const populatedComment = populatedPost.comments[populatedPost.comments.length - 1];

  
    const io = getIO();
    io.emit("newComment", populatedComment);

    res.json({ success: true, comment: populatedComment });
  } catch (err) {
    console.error("Add Comment Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


// CLAP POST
const clapPost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ success: false, message: "Post not found" });

    const existingClapIndex = post.claps.findIndex(c => c.user.toString() === userId);
    let action;

    if (existingClapIndex > -1) {
      post.claps.splice(existingClapIndex, 1);
      action = "removed";
    } else {
      post.claps.push({ user: userId, count: 1 });
      action = "added";
    }

    await post.save();

    
    const io = getIO();
    io.to(post._id.toString()).emit("clapUpdate", {
      postId: post._id,
      totalClaps: post.claps.length,
      action,
      user: userId,
    });

    res.json({
      success: true,
      action,
      totalClaps: post.claps.length,
    });
  } catch (err) {
    console.error("Clap Post Error:", err);
    res.status(500).json({ success: false, message: err.message || "Server error" });
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
