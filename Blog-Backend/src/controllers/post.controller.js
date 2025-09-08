const Post = require("../models/post.model");
const { getIO } = require("../socket/socket");

// Helper Functions
const handleError = (res, err, code = 500) => {
  console.error(err);
  return res.status(code).json({ success: false, message: err.message || "Server error" });
};

const findPostById = async (postId, userId = null) => {
  const post = await Post.findById(postId);
  if (!post) throw new Error("Post not found");
  if (userId && post.author.toString() !== userId) throw new Error("Not authorized");
  return post;
};

const parseBlocksWithFiles = (blocks, files) => {
  const parsedBlocks = typeof blocks === "string" ? JSON.parse(blocks) : blocks;
  let fileIndex = 0;

  return parsedBlocks.map((block) => {
    if (block.type === "image" && files[fileIndex]) {
      block.media = `/uploads/${files[fileIndex].filename}`;
      fileIndex++;
    }
    delete block.preview;
    delete block.imageFile;
    return block;
  });
};

// CRUD Posts
const createPost = async (req, res) => {
  try {
    const { title, blocks } = req.body;
    const userId = req.user?.id;

    if (!title?.trim()) {
      return res.status(400).json({ success: false, message: "Title is required" });
    }

    const files = req.files || [];
    const finalBlocks = parseBlocksWithFiles(blocks, files);

    if (!Array.isArray(finalBlocks) || finalBlocks.length === 0) {
      return res.status(400).json({ success: false, message: "At least one content block is required" });
    }

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
    handleError(res, err);
  }
};

const getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", "name profileImage email")
      .sort({ createdAt: -1 });

    res.json({ success: true, posts });
  } catch (err) {
    handleError(res, err);
  }
};

const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("author", "name profileImage email")
      .populate({ path: "comments.user", select: "name profileImage email" });

    if (!post) return res.status(404).json({ success: false, message: "Post not found" });

    const sortedComments = [...post.comments].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    res.json({ success: true, post: { ...post.toObject(), comments: sortedComments } });
  } catch (err) {
    handleError(res, err);
  }
};

const updatePost = async (req, res) => {
  try {
    const post = await findPostById(req.params.id, req.user.id);

    const { title, blocks } = req.body;
    if (title) post.title = title;

    if (blocks) {
      const files = req.files || [];
      post.blocks = parseBlocksWithFiles(blocks, files);
    }

    await post.save();
    const updatedPost = await post.populate("author", "name profileImage email");
    res.json({ success: true, post: updatedPost });
  } catch (err) {
    handleError(res, err, err.message === "Not authorized" ? 403 : 500);
  }
};

const deletePost = async (req, res) => {
  try {
    await findPostById(req.params.id, req.user.id);
    await Post.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Post deleted" });
  } catch (err) {
    handleError(res, err, err.message === "Not authorized" ? 403 : 500);
  }
};

// Comments
const addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;

    if (!text?.trim()) {
      return res.status(400).json({ success: false, message: "Comment cannot be empty" });
    }

    const post = await findPostById(id);
    const newComment = { user: req.user.id, text };
    post.comments.push(newComment);
    await post.save();

    const populatedPost = await Post.findById(id).populate("comments.user", "name profileImage email");
    const populatedComment = populatedPost.comments[populatedPost.comments.length - 1];

    const io = getIO();
    io.emit("newComment", populatedComment);

    res.json({ success: true, comment: populatedComment });
  } catch (err) {
    handleError(res, err);
  }
};

// Claps
const clapPost = async (req, res) => {
  try {
    const { id } = req.params; // postId
    const userId = req.user.id;

    const post = await findPostById(id);

    // Toggle clap
    const existingIndex = post.claps.findIndex((u) => u.toString() === userId);

    let action;
    if (existingIndex > -1) {
      post.claps.splice(existingIndex, 1);
      action = "removed";
    } else {
      post.claps.push(userId);
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
    handleError(res, err);
  }
};

const clapComment = async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const userId = req.user.id;

    const post = await Post.findById(postId);
    const comment = post.comments.id(commentId);
    if (!comment) return res.status(404).json({ success: false, message: "Comment not found" });

    const hasClapped = comment.claps.some((u) => u.toString() === userId);
    let action;

    if (hasClapped) {
      // remove clap
      await Post.updateOne(
        { _id: postId, "comments._id": commentId },
        { $pull: { "comments.$.claps": userId } }
      );
      action = "removed";
    } else {
      // add clap
      await Post.updateOne(
        { _id: postId, "comments._id": commentId },
        { $addToSet: { "comments.$.claps": userId } }
      );
      action = "added";
    }

    // fetch updated comment
    const updatedPost = await Post.findById(postId).populate("comments.user", "name profileImage email");
    const updatedComment = updatedPost.comments.id(commentId);

    res.json({
      success: true,
      action,
      totalClaps: updatedComment.claps.length,
    });
  } catch (err) {
    handleError(res, err);
  }
};


// Export
module.exports = {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  addComment,
  clapPost,
  clapComment,
};
