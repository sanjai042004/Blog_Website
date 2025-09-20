const Post = require("../models/post.model");

// Helpers
const handleError = (res, err, code = 500) => {
  console.error(err);
  return res.status(code).json({ success: false, message: err.message || "Server error" });
};

const findPost = async (postId, userId = null) => {
  const post = await Post.findById(postId);
  if (!post) throw new Error("Post not found");
  if (userId && post.author.toString() !== userId) throw new Error("Not authorized");
  return post;
};

const parseBlocks = (blocks, files) => {
  const parsed = typeof blocks === "string" ? JSON.parse(blocks) : blocks;
  let fileIndex = 0;

  return parsed.map((b) => {
    if (b.type === "image" && b.imageFile && files[fileIndex]) {
      b.media = `/uploads/${files[fileIndex].filename}`;
      fileIndex++;
    }
    delete b.preview;
    delete b.imageFile;
    return b;
  });
};

// Create Post
const createPost = async (req, res) => {
  try {
    const { title, blocks } = req.body;
    if (!title?.trim()) return res.status(400).json({ success: false, message: "Title is required" });

    const finalBlocks = parseBlocks(blocks, req.files || []);
    if (!finalBlocks.length) return res.status(400).json({ success: false, message: "At least one content block is required" });

    const post = await Post.create({
      title,
      blocks: finalBlocks,
      image: finalBlocks.find((b) => b.type === "image" && b.media)?.media,
      author: req.user.id,
    });

    res.status(201).json({ success: true, post: await post.populate("author", "name profileImage email") });
  } catch (err) {
    handleError(res, err);
  }
};

// Get Posts
const getPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate("author", "name profileImage email").sort({ createdAt: -1 });
    res.json({ success: true, posts });
  } catch (err) {
    handleError(res, err);
  }
};

// Get Post by ID
const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("author", "name profileImage email")
      .populate("comments.user", "name profileImage email");

    if (!post) return res.status(404).json({ success: false, message: "Post not found" });

    post.comments.sort((a, b) => b.createdAt - a.createdAt);
    res.json({ success: true, post });
  } catch (err) {
    handleError(res, err);
  }
};

// Update Post
const updatePost = async (req, res) => {
  try {
    const post = await findPost(req.params.id, req.user.id);
    const { title, blocks } = req.body;

    if (title) post.title = title;
    if (blocks) post.blocks = parseBlocks(blocks, req.files || []);

    await post.save();
    res.json({ success: true, post: await post.populate("author", "name profileImage email") });
  } catch (err) {
    handleError(res, err, err.message === "Not authorized" ? 403 : 500);
  }
};

// Delete Post
const deletePost = async (req, res) => {
  try {
    await findPost(req.params.id, req.user.id);
    await Post.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Post deleted" });
  } catch (err) {
    handleError(res, err, err.message === "Not authorized" ? 403 : 500);
  }
};

// Add Comment
const addComment = async (req, res) => {
  try {
    const { id: postId } = req.params;
    const { text } = req.body;
    if (!text?.trim()) return res.status(400).json({ success: false, message: "Comment cannot be empty" });

    const post = await findPost(postId);
    post.comments.push({ user: req.user.id, text });
    await post.save();

    const updatedPost = await Post.findById(postId).populate("comments.user", "name profileImage email");
    const comment = updatedPost.comments.at(-1);

    res.json({ success: true, comment });
  } catch (err) {
    handleError(res, err);
  }
};

// Claps Helper
const toggleClap = (array, userId) => {
  const index = array.findIndex((u) => u.toString() === userId);
  if (index > -1) {
    array.splice(index, 1);
    return "removed";
  } else {
    array.push(userId);
    return "added";
  }
};

// Clap Post
const clapPost = async (req, res) => {
  try {
    const post = await findPost(req.params.id);
    const action = toggleClap(post.claps, req.user.id);
    await post.save();

    res.json({ success: true, action, totalClaps: post.claps.length });
  } catch (err) {
    handleError(res, err);
  }
};

// Clap Comment
const clapComment = async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const userId = req.user.id;

    const post = await Post.findById(postId);
    const comment = post.comments.id(commentId);
    if (!comment) return res.status(404).json({ success: false, message: "Comment not found" });

    const action = toggleClap(comment.claps, userId);
    await post.save();

    res.json({ success: true, action, totalClaps: comment.claps.length });
  } catch (err) {
    handleError(res, err);
  }
};

// Export
module.exports = {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
  addComment,
  clapPost,
  clapComment,
};
