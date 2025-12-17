const Post = require("../models/post.model");
require("../models/user.model");

// Helpers
const handleError = (res, err, code = 500) =>
  res.status(code).json({ success: false, message: err.message || "Server error" });

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
      b.media = files[fileIndex].path; 
      b.public_id = files[fileIndex].filename || null;
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

    await post.populate("author", "name profileImage email");
    res.status(201).json({ success: true, message: "Post created", post });
  } catch (err) {
    handleError(res, err);
  }
};

// Get All Posts
const getPosts = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const posts = await Post.find()
      .populate("author", "name profileImage email")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({ success: true, posts });
  } catch (err) {
    handleError(res, err);
  }
};

const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("author", "name profileImage email")
      .populate("comments.user", "name profileImage email")
      .populate("comments.replies.user", "name profileImage email");

    if (!post) return res.status(404).json({ success: false, message: "Post not found" });

    post.comments.sort((a, b) => b.createdAt - a.createdAt);
    res.json({ success: true, post });
  } catch (err) {
    handleError(res, err);
  }
};

const updatePost = async (req, res) => {
  try {
    const post = await findPost(req.params.id, req.user.id);
    const { title, blocks } = req.body;

    if (title) post.title = title;
    if (blocks) post.blocks = parseBlocks(blocks, req.files || []);

    await post.save();
    await post.populate("author", "name profileImage email");

    res.json({ success: true, message: "Post updated", post });
  } catch (err) {
    handleError(res, err, err.message === "Not authorized" ? 403 : 500);
  }
};

const deletePost = async (req, res) => {
  try {
    await findPost(req.params.id, req.user.id);
    await Post.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Post deleted" });
  } catch (err) {
    handleError(res, err, err.message === "Not authorized" ? 403 : 500);
  }
};

const addComment = async (req, res) => {
  try {
    const { id: postId } = req.params;
    const { text, parentId } = req.body;

    if (!text?.trim()) return res.status(400).json({ success: false, message: "Comment cannot be empty" });

    const post = await findPost(postId);

    if (parentId) {
      const parentComment = post.comments.id(parentId);
      if (!parentComment) return res.status(404).json({ success: false, message: "Parent comment not found" });
      parentComment.replies.push({ user: req.user.id, text });
    } else {
      post.comments.push({ user: req.user.id, text });
    }

    await post.save();
    await post.populate("comments.user", "name profileImage email").populate("comments.replies.user", "name profileImage email");

    const comment = parentId ? post.comments.id(parentId).replies.at(-1) : post.comments.at(-1);
    res.json({ success: true, message: "Comment added", comment });
  } catch (err) {
    handleError(res, err);
  }
};

const deleteComment = async (req, res) => {
  try {
    const { postId, commentId, replyId } = req.params;
    const post = await findPost(postId);

    const comment = post.comments.id(commentId);
    if (!comment) return res.status(404).json({ success: false, message: "Comment not found" });

    if (replyId) {
      const reply = comment.replies.id(replyId);
      if (!reply) return res.status(404).json({ success: false, message: "Reply not found" });
      if (reply.user.toString() !== req.user.id) return res.status(403).json({ success: false, message: "Not authorized" });
      reply.remove();
    } else {
      if (comment.user.toString() !== req.user.id) return res.status(403).json({ success: false, message: "Not authorized" });
      comment.remove();
    }

    await post.save();
    res.json({ success: true, message: "Deleted successfully" });
  } catch (err) {
    handleError(res, err);
  }
};

// Claps
const toggleClap = (array, userId) => {
  const index = array.findIndex((u) => u.toString() === userId);
  if (index > -1) array.splice(index, 1);
  else array.push(userId);
  return index > -1 ? "removed" : "added";
};

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

const clapComment = async (req, res) => {
  try {
    const { postId, commentId, replyId } = req.params;
    const post = await Post.findById(postId);
    const comment = post.comments.id(commentId);
    if (!comment) return res.status(404).json({ success: false, message: "Comment not found" });

    let action;
    if (replyId) {
      const reply = comment.replies.id(replyId);
      if (!reply) return res.status(404).json({ success: false, message: "Reply not found" });
      action = toggleClap(reply.claps, req.user.id);
    } else {
      action = toggleClap(comment.claps, req.user.id);
    }

    await post.save();
    res.json({ success: true, action });
  } catch (err) {
    handleError(res, err);
  }
};

module.exports = {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
  addComment,
  deleteComment,
  clapPost,
  clapComment,
};
